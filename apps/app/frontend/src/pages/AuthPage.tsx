import { Navigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

function AuthPage() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  // Redirect already-authenticated users away from the auth page.
  if (user) {
    return <Navigate to="/" replace />;
  }

  const isSpanish = i18n.language === 'es';

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--surface)' }}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img
            src="/ResuEase-logo.svg"
            alt="ResuEase Logo"
            className="w-12 h-12 mx-auto"
          />
          <h2 className="mt-6 text-2xl font-semibold tracking-tight" style={{ color: 'var(--ink)' }}>
            {t('auth.title')}
          </h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--ink-3)' }}>
            {t('auth.subtitle')}
          </p>
        </div>

        <div className="bg-white py-8 px-6 rounded-lg" style={{ border: '1px solid var(--border)' }}>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2563eb',
                    brandAccent: '#1d4ed8',
                  },
                },
              },
            }}
            localization={isSpanish ? {
              variables: {
                sign_in: {
                  email_label: 'Correo electrónico',
                  password_label: 'Contraseña',
                  button_label: 'Iniciar sesión',
                  social_provider_text: 'Continuar con {{provider}}',
                  link_text: '¿Ya tienes una cuenta? Inicia sesión',
                },
                sign_up: {
                  email_label: 'Correo electrónico',
                  password_label: 'Contraseña',
                  button_label: 'Registrarse',
                  social_provider_text: 'Continuar con {{provider}}',
                  link_text: '¿No tienes una cuenta? Regístrate',
                },
                forgotten_password: {
                  link_text: '¿Olvidaste tu contraseña?',
                  button_label: 'Enviar instrucciones',
                  email_label: 'Correo electrónico',
                },
              },
            } : undefined}
            providers={['google', 'github']}
            redirectTo={`${window.location.origin}/`}
          />
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
