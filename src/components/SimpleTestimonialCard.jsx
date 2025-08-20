import React from 'react'

export default function SimpleTestimonialCard({ clientName, email, desc, rating = 5 }) {
  const renderStars = (rating) => {
    return (
      <div className="flex items-center mb-3" itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
        <meta itemProp="ratingValue" content={rating} />
        <meta itemProp="bestRating" content="5" />
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            itemProp="star"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
      itemScope
      itemType="https://schema.org/Review"
    >
      <div className="mb-4" itemProp="reviewBody">
        <p className="text-gray-700 text-sm leading-relaxed font-light">
          "{desc}"
        </p>
      </div>
      
      {renderStars(rating)}
      
      <div className="border-t border-gray-100 pt-4" itemProp="author" itemScope itemType="https://schema.org/Person">
        <h4 className="font-medium text-gray-900 text-sm" itemProp="name">
          {clientName}
        </h4>
        {email && (
          <p className="text-gray-500 text-xs mt-1" itemProp="email">
            {email}
          </p>
        )}
      </div>
    </div>
  )
}