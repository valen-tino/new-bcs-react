import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

function AdminManager() {
  const { user, admins, addAdmin, removeAdmin, primaryAdmins } = useAuth();
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    
    if (!newAdminEmail.trim()) {
      setEmailError('Email is required');
      return;
    }
    
    if (!validateEmail(newAdminEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    if (admins.includes(newAdminEmail.toLowerCase())) {
      setEmailError('This email is already an admin');
      return;
    }
    
    setLoading(true);
    setEmailError('');
    
    try {
      await addAdmin(newAdminEmail.toLowerCase());
      setNewAdminEmail('');
      toast.success('Admin added successfully');
    } catch (error) {
      toast.error('Failed to add admin');
      setEmailError('Failed to add admin. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAdmin = async (email) => {
    if (primaryAdmins.includes(email)) {
      toast.error('Cannot remove primary admin');
      return;
    }
    
    if (email === user?.email) {
      toast.error('Cannot remove yourself');
      return;
    }
    
    if (window.confirm(`Are you sure you want to remove ${email} as an admin?`)) {
      setLoading(true);
      try {
        await removeAdmin(email);
        toast.success('Admin removed successfully');
      } catch (error) {
        toast.error('Failed to remove admin');
      } finally {
        setLoading(false);
      }
    }
  };

  const isPrimaryAdmin = (email) => {
    return primaryAdmins.includes(email);
  };

  const canRemoveAdmin = (email) => {
    return !isPrimaryAdmin(email) && email !== user?.email;
  };

  const getAdminRole = (email) => {
    if (isPrimaryAdmin(email)) {
      return 'Primary Admin';
    }
    return 'Admin';
  };

  const getAdminBadgeColor = (email) => {
    if (isPrimaryAdmin(email)) {
      return 'bg-purple-100 text-purple-800';
    }
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Admin Management</h2>
        <p className="mt-1 text-sm text-gray-600">
          Manage admin users who can access the CMS. Primary admins cannot be removed.
        </p>
      </div>

      {/* Add New Admin */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Add New Admin</h3>
          
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  id="email"
                  value={newAdminEmail}
                  onChange={(e) => {
                    setNewAdminEmail(e.target.value);
                    setEmailError('');
                  }}
                  className={`shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    emailError ? 'border-red-300' : ''}`}
                  placeholder="Enter email address"
                  disabled={loading}
                />
                {emailError && (
                  <p className="mt-2 text-sm text-red-600">{emailError}</p>
                )}
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading || !newAdminEmail.trim()}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md border border-transparent shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="mr-3 -ml-1 w-4 h-4 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 -ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Admin
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Current Admins */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Current Admins ({admins.length})
          </h3>
          
          {admins.length === 0 ? (
            <div className="py-8 text-center">
              <svg className="mx-auto w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No admins found</h3>
              <p className="mt-1 text-sm text-gray-500">Add the first admin to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {admins.map((email) => (
                <div
                  key={email}
                  className="flex justify-between items-center p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="flex justify-center items-center w-10 h-10 bg-gray-300 rounded-full">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900">{email}</p>
                        {email === user?.email && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            You
                          </span>
                        )}
                      </div>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          getAdminBadgeColor(email)
                        }`}>
                          {getAdminRole(email)}
                        </span>
                        {isPrimaryAdmin(email) && (
                          <span className="text-xs text-gray-500">
                            Cannot be removed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {canRemoveAdmin(email) ? (
                      <button
                        onClick={() => handleRemoveAdmin(email)}
                        disabled={loading}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="-ml-0.5 mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-100 rounded">
                        Protected
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Admin Guidelines */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Admin Guidelines</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="space-y-1 list-disc list-inside">
                <li>Primary admins ({primaryAdmins.join(', ')}) cannot be removed from the system</li>
                <li>You cannot remove yourself from the admin list</li>
                <li>New admins must sign in with Google using their added email address</li>
                <li>Admins have full access to edit all website content and manage other admins</li>
                <li>Only add trusted individuals as admins</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminManager;