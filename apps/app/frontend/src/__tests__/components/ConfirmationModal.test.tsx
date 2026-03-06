import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import Modal from '../../components/ui/Modal';

function renderWithLocale(locale: string, props: Partial<Parameters<typeof Modal.Confirmation>[0]> = {}) {
  i18n.changeLanguage(locale);
  const noop = vi.fn();
  return render(
    <I18nextProvider i18n={i18n}>
      <Modal.Confirmation isOpen onClose={noop} onConfirm={noop} {...props} />
    </I18nextProvider>
  );
}

describe('Modal.Confirmation — i18n', () => {
  afterEach(() => {
    cleanup();
    i18n.changeLanguage('en');
  });

  it('shows English default title in en locale', () => {
    renderWithLocale('en');
    expect(screen.getByText('Are you sure you want to delete this section?')).toBeInTheDocument();
  });

  it('shows English default message in en locale', () => {
    renderWithLocale('en');
    expect(screen.getByText("You can't undo this action.")).toBeInTheDocument();
  });

  it('shows English "Delete Section" confirm button in en locale', () => {
    renderWithLocale('en');
    expect(screen.getByRole('button', { name: 'Delete Section' })).toBeInTheDocument();
  });

  it('shows English "Cancel" button in en locale', () => {
    renderWithLocale('en');
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('shows Spanish default title in es locale', () => {
    renderWithLocale('es');
    expect(screen.getByText('¿Estás seguro de que quieres eliminar esta sección?')).toBeInTheDocument();
  });

  it('shows Spanish default message in es locale', () => {
    renderWithLocale('es');
    expect(screen.getByText('No puedes deshacer esta acción.')).toBeInTheDocument();
  });

  it('shows Spanish "Eliminar sección" confirm button in es locale', () => {
    renderWithLocale('es');
    expect(screen.getByRole('button', { name: 'Eliminar sección' })).toBeInTheDocument();
  });

  it('shows Spanish "Cancelar" button in es locale', () => {
    renderWithLocale('es');
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
  });

  it('uses provided title override instead of default', () => {
    renderWithLocale('en', { title: 'Custom Title' });
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });
});
