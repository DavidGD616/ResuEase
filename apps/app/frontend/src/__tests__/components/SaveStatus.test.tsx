import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import SaveStatus from '../../components/ui/SaveStatus';

function renderWithLocale(locale: string, status: 'saving' | 'saved' | 'error' | undefined) {
  i18n.changeLanguage(locale);
  return render(
    <I18nextProvider i18n={i18n}>
      <SaveStatus status={status} />
    </I18nextProvider>
  );
}

describe('SaveStatus — i18n', () => {
  afterEach(() => {
    cleanup();
    i18n.changeLanguage('en');
  });

  it('shows English "Saving..." in en locale', () => {
    renderWithLocale('en', 'saving');
    expect(screen.getByText('Saving...')).toBeInTheDocument();
  });

  it('shows English "Saved" in en locale', () => {
    renderWithLocale('en', 'saved');
    expect(screen.getByText('Saved')).toBeInTheDocument();
  });

  it('shows English "Error saving" in en locale', () => {
    renderWithLocale('en', 'error');
    expect(screen.getByText('Error saving')).toBeInTheDocument();
  });

  it('shows Spanish "Guardando..." in es locale', () => {
    renderWithLocale('es', 'saving');
    expect(screen.getByText('Guardando...')).toBeInTheDocument();
  });

  it('shows Spanish "Guardado" in es locale', () => {
    renderWithLocale('es', 'saved');
    expect(screen.getByText('Guardado')).toBeInTheDocument();
  });

  it('shows Spanish "Error al guardar" in es locale', () => {
    renderWithLocale('es', 'error');
    expect(screen.getByText('Error al guardar')).toBeInTheDocument();
  });

  it('renders nothing when status is undefined', () => {
    const { container } = renderWithLocale('en', undefined);
    expect(container.firstChild).toBeNull();
  });
});
