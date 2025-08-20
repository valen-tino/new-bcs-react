import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SimpleTestimonialCard from '../components/SimpleTestimonialCard';
import { useCMS } from '../contexts/CMSContext';
import { useLanguage } from '../contexts/LanguageContext';
import Navbar from '../sections/nav/nav';
import Footer from '../sections/footer/contactus';
import ContactUsModalForm from '../components/contactus_modal_form';

function Testimonials() {
  const { testimonials: cmsTestimonials, loading } = useCMS();
  const { language, changeLanguage } = useLanguage();
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  const openContactForm = () => {
    setIsContactFormOpen(true);
  };

  const closeContactForm = () => {
    setIsContactFormOpen(false);
  };

  // Prepare only published testimonials sorted by publishedAt desc
  const testimonials = useMemo(() => {
    const getDateVal = (d) => {
      if (!d) return 0;
      if (d instanceof Date) return d.getTime();
      if (typeof d === 'object' && d.seconds) return d.seconds * 1000;
      const t = new Date(d).getTime();
      return isNaN(t) ? 0 : t;
    };

    return (cmsTestimonials || [])
      .filter(t => t.status === 'published')
      .sort((a, b) => getDateVal(b.publishedAt) - getDateVal(a.publishedAt));
  }, [cmsTestimonials]);

  // Calculate aggregate rating for Google schema
  const aggregateRating = useMemo(() => {
    if (!testimonials.length) return { ratingValue: 0, reviewCount: 0 };
    const totalRating = testimonials.reduce((sum, t) => sum + (t.rating || 5), 0);
    return {
      ratingValue: Math.round((totalRating / testimonials.length) * 10) / 10,
      reviewCount: testimonials.length
    };
  }, [testimonials]);

  return (
    <div className="App">
      <Navbar 
        language={language} 
        handleSetLanguage={changeLanguage} 
        contactForm={openContactForm}
      />
      
      <section className="bg-orange-100" itemScope itemType="https://schema.org/Organization">
        <meta itemProp="name" content="BCS Visa & Services" />
        <div itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
          <meta itemProp="ratingValue" content={aggregateRating.ratingValue} />
          <meta itemProp="reviewCount" content={aggregateRating.reviewCount} />
          <meta itemProp="bestRating" content="5" />
        </div>
        
        <div className="pb-20">
          <div className="flex relative justify-between w-full rounded-3xl font-Sora">
            <div className="flex justify-center items-center px-5 pt-16 pb-2 w-full md:pt-20 md:pl-10 md:items-start">
              <h1 className="z-10 items-start text-5xl leading-tight text-center text-bold">
                Guest Testimonies
              </h1>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              {aggregateRating.reviewCount > 0 && (
                <div className="flex items-center justify-center mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${star <= Math.round(aggregateRating.ratingValue) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    {aggregateRating.ratingValue} ({aggregateRating.reviewCount} reviews)
                  </span>
                </div>
              )}
              <p className="text-lg text-gray-600 mb-6">
                Read what our valued clients have to say about their experiences with our services.
              </p>
              <Link 
                to="/" 
                className="inline-block px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
              >
                Back to Home
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : testimonials.length > 0 ? (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="break-inside-avoid mb-8">
                    <SimpleTestimonialCard
                      clientName={testimonial.name}
                      email={testimonial.email || ''}
                      desc={testimonial.description || testimonial.content || ''}
                      rating={testimonial.rating || 5}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg">No testimonials available yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer 
        language={language} 
        contactForm={openContactForm}
      />
      {isContactFormOpen && <ContactUsModalForm hide={closeContactForm} />}
    </div>
  );
}

export default Testimonials;