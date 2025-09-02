import React from 'react'
import { censorEmail } from '../utils/emailCensor';

export default function SimpleTestimonialCard({ 
  clientName, 
  email, 
  desc, 
  rating = 5, 
  date, 
  location,
  avatar,
  service 
}) {
  const renderStars = (rating) => {
    return (
      <div className="flex items-center" itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
        <meta itemProp="ratingValue" content={rating} />
        <meta itemProp="bestRating" content="5" />
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            viewBox="0 0 20 20"
            itemProp="star"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }

  const showEmail = censorEmail(email);

  return (
    <div 
      className="p-6 bg-white rounded-2xl border border-gray-100 shadow-lg transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1"
      itemScope
      itemType="https://schema.org/Review"
    >
      <div className="flex items-start mb-4 space-x-4">
        {avatar && (
          <div className="flex-shrink-0">
            <img 
              src={avatar} 
              alt={clientName}
              className="object-cover w-12 h-12 rounded-full border-2 border-orange-100"
            />
          </div>
        )}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h4 className="text-base font-semibold text-gray-900" itemProp="name">
                {clientName}
              </h4>
              {location && (
                <p className="text-sm font-medium text-gray-500">
                  {location}
                </p>
              )}
            </div>
            {renderStars(rating)}
          </div>
        </div>
      </div>

      <div className="mb-3" itemProp="reviewBody">
        <p className="text-base italic font-light leading-relaxed text-gray-700">
          "{desc}"
        </p>
      </div>



      {showEmail && (
        <>
        <meta itemProp="email" content={email} />
        <span className="px-2 py-1 text-xs font-medium text-orange-700 bg-orange-50 rounded-full">
              {showEmail}
            </span>
        </>
        
      )}
    </div>
  )
}