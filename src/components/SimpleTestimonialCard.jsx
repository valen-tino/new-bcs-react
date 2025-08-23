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
      className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-lg border border-orange-200 p-6 hover:shadow-xl hover:from-orange-100 hover:to-orange-150 transition-all duration-300 transform hover:-translate-y-1"
      itemScope
      itemType="https://schema.org/Review"
    >
      <div className="mb-4" itemProp="reviewBody">
        <div className="relative">
          <svg className="absolute top-0 left-0 w-6 h-6 text-orange-300 -translate-x-2 -translate-y-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
          </svg>
          <p className="text-gray-700 text-sm leading-relaxed font-light pl-4 italic">
            "{desc}"
          </p>
        </div>
      </div>
      
      {renderStars(rating)}
      
      <div className="border-t border-orange-200 pt-4 bg-white/30 -mx-6 -mb-6 px-6 pb-6 rounded-b-2xl" itemProp="author" itemScope itemType="https://schema.org/Person">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {clientName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm" itemProp="name">
              {clientName}
            </h4>
            {email && (
              <p className="text-orange-600 text-xs mt-1 font-medium" itemProp="email">
                {email}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}