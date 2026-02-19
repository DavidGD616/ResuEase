import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

function AuthPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already authenticated
  if (user) {
    navigate('/', { replace: true });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img
            src="/ResuEase-logo.svg"
            alt="ResuEase Logo"
            className="w-12 h-12 mx-auto"
          />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome to ResuEase
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to build your professional resume
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
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
            providers={['google', 'github']}
            redirectTo={`${window.location.origin}/`}
          />
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
