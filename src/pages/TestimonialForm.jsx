import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { logoIcon } from '../sections/all/allpics';

function TestimonialForm() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [linkValid, setLinkValid] = useState(false);
  const [linkData, setLinkData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    title: '',
    content: '',
    location: '',
    serviceUsed: ''
  });

  useEffect(() => {
    validateLink();
  }, [token]);

  const validateLink = async () => {
    try {
      const linksQuery = query(
        collection(db, 'testimonialLinks'),
        where('token', '==', token)
      );
      const snapshot = await getDocs(linksQuery);
      
      if (snapshot.empty) {
        setLinkValid(false);
        setLoading(false);
        return;
      }
      
      const linkDoc = snapshot.docs[0];
      const data = linkDoc.data();
      
      // Safely convert Firestore timestamp to Date object
      let expiryDate;
      try {
        expiryDate = data.expiresAt ? data.expiresAt.toDate() : new Date(0); // Default to epoch if missing
      } catch (dateError) {
        console.error('Error converting expiresAt to date:', dateError);
        // If date conversion fails, consider the link invalid
        setLinkValid(false);
        setLoading(false);
        return;
      }
      
      if (expiryDate <= new Date() || data.used) {
        // Link expired or already used, delete it
        await deleteDoc(doc(db, 'testimonialLinks', linkDoc.id));
        setLinkValid(false);
        setLoading(false);
        return;
      }
      
      setLinkData({ id: linkDoc.id, ...data, expiresAt: expiryDate });
      setLinkValid(true);
      setLoading(false);
    } catch (error) {
      console.error('Error validating link:', error);
      setLinkValid(false);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.content.trim()) {
      toast.error('Name and testimonial content are required');
      return;
    }
    
    setSubmitting(true);
    try {
      // Add testimonial to the testimonials collection
      await addDoc(collection(db, 'testimonials'), {
        ...formData,
        createdAt: new Date(),
        status: 'pending', // New status field: pending, published, archived
        submittedViaLink: true,
        linkToken: token
      });
      
      // Mark the link as used
      await updateDoc(doc(db, 'testimonialLinks', linkData.id), {
        used: true,
        usedAt: new Date()
      });
      
      toast.success('Thank you! Your testimonial has been submitted successfully.');
      
      // Redirect to a thank you page or home
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast.error('Failed to submit testimonial. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 font-Sora">
        <div className="w-12 h-12 rounded-full border-b-2 border-orange-500 animate-spin"></div>
      </div>
    );
  }

  if (!linkValid) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 font-Sora">
        <div className="p-6 w-full max-w-md text-center bg-white rounded-lg shadow-md">
          <div className="mb-4">
            <img src={logoIcon} alt="BCS Logo" className="mx-auto h-12" />
          </div>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Link Expired</h2>
          <p className="mb-6 text-gray-600">
            This testimonial link has expired or is no longer valid. Please contact us if you need a new link.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 w-full text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 min-h-screen bg-gray-50 font-Sora">
      <div className="px-4 mx-auto max-w-2xl sm:px-6 lg:px-8">
        <div className="overflow-hidden bg-white rounded-lg shadow-md">
          {/* Header */}
          <div className="px-6 py-4 bg-orange-600">
            <div className="flex items-center">
              <img src={logoIcon} alt="BCS Logo" className="mr-3 h-8" />
              <div>
                <h1 className="text-xl font-bold text-white">Share Your Experience</h1>
                <p className="text-sm text-orange-100">We'd love to hear about your experience with our services</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block px-3 py-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block px-3 py-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="block px-3 py-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="City, Country"
                />
              </div>

              <div>
                <label htmlFor="serviceUsed" className="block text-sm font-medium text-gray-700">
                  Service Used
                </label>
                <select
                  id="serviceUsed"
                  name="serviceUsed"
                  value={formData.serviceUsed}
                  onChange={handleInputChange}
                  className="block px-3 py-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select a service</option>
                  <option value="Wedding Ceremony Organizer">Wedding Ceremony Organizer</option>
                  <option value="Translation Documents">Translation Documents</option>
                  <option value="Travel Insurance">Travel Insurance</option>
                  <option value="Visa Services">Visa Services</option>
                  <option value="Other Services">Other Services</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                Rating
              </label>
              <div className="flex items-center mt-1 space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    className={`text-2xl ${
                      star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                    } hover:text-yellow-400 focus:outline-none`}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">({formData.rating} star{formData.rating !== 1 ? 's' : ''})</span>
              </div>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Testimonial Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="block px-3 py-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                placeholder="Brief title for your testimonial"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Your Testimonial *
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={6}
                value={formData.content}
                onChange={handleInputChange}
                className="block px-3 py-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                placeholder="Please share your experience with our services..."
              />
            </div>

            <div className="flex justify-between items-center pt-4">
              <p className="text-sm text-gray-500">
                Your testimonial will be reviewed before being published.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Testimonial'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TestimonialForm;