import React, { useState, useEffect } from 'react';
import { useCMS } from '../../contexts/CMSContext';
import { toast } from 'react-toastify';
import { db } from '../../config/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';

function TestimonialLinkManager() {
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState([]);
  const [generatedLink, setGeneratedLink] = useState('');

  useEffect(() => {
    loadActiveLinks();
    // Clean up expired links on component mount
    cleanupExpiredLinks();
  }, []);

  const loadActiveLinks = async () => {
    try {
      const linksQuery = query(
        collection(db, 'testimonialLinks'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(linksQuery);
      const activeLinks = [];
      
      snapshot.forEach((doc) => {
        try {
          const data = doc.data();
          // Safely convert Firestore timestamp to Date object
          if (!data.expiresAt) {
            console.warn('Missing expiresAt field for link:', doc.id);
            return; // Skip this document
          }
          
          const expiryDate = data.expiresAt.toDate();
          if (expiryDate > new Date()) {
            activeLinks.push({
              id: doc.id,
              ...data,
              expiresAt: expiryDate
            });
          }
        } catch (dateError) {
          console.error('Error processing link document:', doc.id, dateError);
          // Skip this document if there's an error
        }
      });
      
      setLinks(activeLinks);
    } catch (error) {
      console.error('Error loading testimonial links:', error);
    }
  };

  const cleanupExpiredLinks = async () => {
    try {
      const linksQuery = query(collection(db, 'testimonialLinks'));
      const snapshot = await getDocs(linksQuery);
      
      const deletePromises = [];
      snapshot.forEach((docSnapshot) => {
        try {
          const data = docSnapshot.data();
          
          // Skip documents with missing expiresAt field
          if (!data.expiresAt) {
            console.warn('Missing expiresAt field for link:', docSnapshot.id);
            // Consider deleting invalid links without expiry date
            deletePromises.push(deleteDoc(doc(db, 'testimonialLinks', docSnapshot.id)));
            return;
          }
          
          const expiryDate = data.expiresAt.toDate();
          if (expiryDate <= new Date()) {
            deletePromises.push(deleteDoc(doc(db, 'testimonialLinks', docSnapshot.id)));
          }
        } catch (dateError) {
          console.error('Error processing link document for cleanup:', docSnapshot.id, dateError);
          // Delete documents with invalid date format
          deletePromises.push(deleteDoc(doc(db, 'testimonialLinks', docSnapshot.id)));
        }
      });
      
      if (deletePromises.length > 0) {
        await Promise.all(deletePromises);
        console.log(`Cleaned up ${deletePromises.length} expired or invalid links`);
      }
    } catch (error) {
      console.error('Error cleaning up expired links:', error);
    }
  };

  const generateTestimonialLink = async () => {
    setLoading(true);
    try {
      // Generate a unique token
      const token = generateUniqueToken();
      
      // Set expiry date to 3 days from now
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 3);
      
      // Save to Firestore
      const linkDoc = await addDoc(collection(db, 'testimonialLinks'), {
        token,
        createdAt: new Date(),
        expiresAt: expiryDate,
        used: false
      });
      
      // Generate the full URL
      const baseUrl = window.location.origin;
      const fullLink = `${baseUrl}/testimonial/${token}`;
      
      // Ensure we're using the correct route path format
      // The route in App.jsx is defined as "/testimonial/:token"
      setGeneratedLink(fullLink);
      toast.success('Testimonial link generated successfully!');
      
      // Reload active links
      await loadActiveLinks();
    } catch (error) {
      console.error('Error generating testimonial link:', error);
      toast.error('Failed to generate testimonial link');
    } finally {
      setLoading(false);
    }
  };

  const generateUniqueToken = () => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15) + 
           Date.now().toString(36);
  };

  const copyToClipboard = (link) => {
    navigator.clipboard.writeText(link).then(() => {
      toast.success('Link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const deleteLink = async (linkId) => {
    if (window.confirm('Are you sure you want to delete this testimonial link?')) {
      try {
        await deleteDoc(doc(db, 'testimonialLinks', linkId));
        toast.success('Testimonial link deleted successfully');
        await loadActiveLinks();
      } catch (error) {
        console.error('Error deleting testimonial link:', error);
        toast.error('Failed to delete testimonial link');
      }
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getRemainingTime = (expiryDate) => {
    const now = new Date();
    const diff = expiryDate - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''} remaining`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else {
      return `${minutes}m remaining`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Testimonial Link Manager</h2>
          <p className="mt-1 text-sm text-gray-600">
            Generate temporary links for clients to submit testimonials. Links expire after 3 days.
          </p>
        </div>
        <button
          onClick={generateTestimonialLink}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md border border-transparent hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
        >
          <svg className="mr-2 -ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          {loading ? 'Generating...' : 'Generate Testimonial Link'}
        </button>
      </div>

      {/* Generated Link Display */}
      {generatedLink && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-green-800">New Testimonial Link Generated</h3>
              <p className="mt-1 text-sm text-green-600 break-all">{generatedLink}</p>
            </div>
            <button
              onClick={() => copyToClipboard(generatedLink)}
              className="px-3 py-1 ml-4 text-xs font-medium text-green-700 bg-green-100 rounded hover:bg-green-200"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      {/* Active Links List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Active Testimonial Links</h3>
          
          {links.length === 0 ? (
            <p className="py-8 text-center text-gray-500">No active testimonial links</p>
          ) : (
            <div className="space-y-3">
              {links.map((link) => (
                <div key={link.id} className="flex justify-between items-center p-4 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {window.location.origin}/testimonial/{link.token}
                        </p>
                        <div className="flex items-center mt-1 space-x-4">
                          <p className="text-xs text-gray-500">
                            Created: {formatDate(new Date(link.createdAt.seconds * 1000))}
                          </p>
                          <p className="text-xs text-gray-500">
                            Expires: {formatDate(link.expiresAt)}
                          </p>
                          <p className="text-xs font-medium text-orange-600">
                            {getRemainingTime(link.expiresAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyToClipboard(`${window.location.origin}/testimonial/${link.token}`)}
                      className="text-sm font-medium text-orange-600 hover:text-orange-900"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => deleteLink(link.id)}
                      className="text-sm font-medium text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TestimonialLinkManager;