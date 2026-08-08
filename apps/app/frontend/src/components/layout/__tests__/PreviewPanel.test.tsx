import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';

interface MockDocumentPreviewProps {
  currentPage: number;
  onPageCountChange: (count: number) => void;
  previewBlob: Blob | null;
}

const { documentPreviewMock } = vi.hoisted(() => ({
  documentPreviewMock: vi.fn<(props: MockDocumentPreviewProps) => void>(),
}));

vi.mock('../DocumentPreview', () => ({
  default: (props: MockDocumentPreviewProps) => {
    documentPreviewMock(props);

    return (
      <div
        data-testid="document-preview"
        data-page={props.currentPage}
        data-preview={props.previewBlob ? 'available' : 'empty'}
      />
    );
  },
}));

import PreviewPanel from '../PreviewPanel';

class ResizeObserverMock {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

function renderPreview(previewBlob: Blob | null = null, saveStatus: 'saving' | 'saved' | 'error' = 'saved') {
  return render(
    <I18nextProvider i18n={i18n}>
      <PreviewPanel previewBlob={previewBlob} saveStatus={saveStatus} />
    </I18nextProvider>,
  );
}

function mostRecentPreviewProps(): MockDocumentPreviewProps {
  const calls = documentPreviewMock.mock.calls;
  const props = calls[calls.length - 1]?.[0];
  if (!props) throw new Error('DocumentPreview was not rendered');
  return props;
}

function pageButtons(container: HTMLElement): HTMLButtonElement[] {
  return Array.from(container.querySelectorAll('button')) as HTMLButtonElement[];
}

describe('PreviewPanel pagination', () => {
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    i18n.changeLanguage('en');
  });

  afterEach(() => {
    cleanup();
    documentPreviewMock.mockClear();
    vi.unstubAllGlobals();
  });

  it('hides pagination until the loaded PDF reports more than one page', () => {
    renderPreview();

    expect(mostRecentPreviewProps().currentPage).toBe(1);
    expect(screen.queryByText('1 / 1')).not.toBeInTheDocument();
    expect(pageButtons(document.body)).toHaveLength(0);
  });

  it('shows the loaded page count and moves only within the PDF bounds', () => {
    const { container } = renderPreview();

    act(() => mostRecentPreviewProps().onPageCountChange(3));
    expect(screen.getByText('1 / 3')).toBeInTheDocument();

    let buttons = pageButtons(container);
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toBeDisabled();
    expect(buttons[1]).not.toBeDisabled();

    fireEvent.click(buttons[1]);
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
    expect(mostRecentPreviewProps().currentPage).toBe(2);

    fireEvent.click(pageButtons(container)[1]);
    expect(screen.getByText('3 / 3')).toBeInTheDocument();
    expect(pageButtons(container)[1]).toBeDisabled();

    fireEvent.click(pageButtons(container)[0]);
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
    expect(mostRecentPreviewProps().currentPage).toBe(2);
  });

  it('clamps the selected page when a replacement PDF has fewer pages', () => {
    const { container } = renderPreview();

    act(() => mostRecentPreviewProps().onPageCountChange(4));
    for (let page = 2; page <= 4; page += 1) {
      fireEvent.click(pageButtons(container)[1]);
      expect(screen.getByText(`${page} / 4`)).toBeInTheDocument();
    }

    act(() => mostRecentPreviewProps().onPageCountChange(2));

    expect(screen.getByText('2 / 2')).toBeInTheDocument();
    expect(mostRecentPreviewProps().currentPage).toBe(2);
    expect(pageButtons(container)[1]).toBeDisabled();
  });

  it('keeps forwarding the caller-held successful Blob while the surrounding UI updates', () => {
    const successfulBlob = new Blob(['%PDF-1.7'], { type: 'application/pdf' });
    const { rerender } = renderPreview(successfulBlob, 'saved');

    expect(mostRecentPreviewProps().previewBlob).toBe(successfulBlob);
    expect(screen.getByTestId('document-preview')).toHaveAttribute('data-preview', 'available');

    rerender(
      <I18nextProvider i18n={i18n}>
        <PreviewPanel previewBlob={successfulBlob} saveStatus="saving" />
      </I18nextProvider>,
    );

    expect(mostRecentPreviewProps().previewBlob).toBe(successfulBlob);
    expect(screen.getByTestId('document-preview')).toHaveAttribute('data-preview', 'available');
  });
});
