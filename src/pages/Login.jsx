import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { logoIcon } from '../sections/all/allpics';

function Login() {
  const { signInWithGoogle, currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showRedirectOption, setShowRedirectOption] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (currentUser && isAdmin) {
      navigate('/cms/dashboard');
    }
  }, [currentUser, isAdmin, navigate]);

  const handleGoogleSignIn = async (useRedirect = false) => {
    setIsLoading(true);
    setErrorMessage('');
    
    const result = await signInWithGoogle(useRedirect);
    
    if (result === true) {
      navigate('/cms/dashboard');
    } else if (result === 'popup-closed') {
      setShowRedirectOption(true);
      setErrorMessage('The sign-in popup was closed before completing. You can try the redirect method below.');
    } else if (result === 'popup-blocked') {
      setShowRedirectOption(true);
      setErrorMessage('Popup was blocked. You can try the redirect method below.');
    } else if (result === 'redirect') {
      // Redirect initiated - page will reload
      setErrorMessage('Redirecting to Google sign-in...');
      return;
    } else if (result === false) {
      setErrorMessage('Sign-in failed. Please try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex justify-center items-center px-4 min-h-screen bg-gradient-to-br from-orange-100 to-orange-200">
      <div className="space-y-8 w-full max-w-md">
        <div className="text-center">
          <img
            className="mx-auto w-auto h-20"
            src={logoIcon}
            alt="BCS logoIcon"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            BCS CMS Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in with your authorized Google account
          </p>
        </div>
        
        <div className="p-8 bg-white rounded-lg shadow-lg">
          <div className="space-y-6">
            <div className="text-center">
              <p className="mb-6 text-sm text-gray-500">
                Only authorized administrators can access this CMS.
              </p>
              
              {errorMessage && (
                <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {errorMessage}
                </div>
              )}
              
              <button
                onClick={() => handleGoogleSignIn(false)}
                disabled={isLoading}
                className="flex relative justify-center px-4 py-3 w-full text-sm font-medium text-white bg-red-600 rounded-md border border-transparent transition-colors duration-200 group hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="mr-3 -ml-1 w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg className="mr-2 w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in with Google
                  </div>
                )}
              </button>
              
              {showRedirectOption && (
                <div className="mt-4">
                  <p className="mb-2 text-xs text-gray-500">
                    If the popup doesn't work, try the redirect method:
                  </p>
                  <button
                    onClick={() => handleGoogleSignIn(true)}
                    disabled={isLoading}
                    className="flex relative justify-center px-4 py-2 w-full text-sm font-medium text-red-600 bg-white rounded-md border border-red-600 transition-colors duration-200 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center">
                      <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Sign in via Redirect
                    </div>
                  </button>
                </div>
              )}
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-400">
                Restricted access for authorized administrators only.
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm font-medium text-orange-600 hover:text-orange-500"
          >
            ← Back to Website
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;