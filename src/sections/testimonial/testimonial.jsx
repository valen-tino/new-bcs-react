import React, { useMemo } from 'react'
import { Link } from 'react-router-dom';

import SimpleTestimonialCard from '../../components/SimpleTestimonialCard'
import { Pattern } from '../all/allpics'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import '../testimonial/testimonial.module.css';
import { useCMS } from '../../contexts/CMSContext';

function Testimonial(props){
  // Use CMS data instead of querying Firestore directly
  const { testimonials: cmsTestimonials, loading, uiText } = useCMS();

  // Prepare only published testimonials sorted by publishedAt desc, limited to 5 for homepage
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
      .sort((a, b) => getDateVal(b.publishedAt) - getDateVal(a.publishedAt))
      .slice(0, 5) // Limit to 5 testimonials on homepage
      .map(t => ({
        clientName: t.name,
        email: t.email || '',
        desc: t.description || t.content || '',
        rating: t.rating || 5
      }));
  }, [cmsTestimonials]);

  const lang = uiText?.testimonial ? 
    (props.language === "Indonesia" ? uiText.testimonial.Indonesia : uiText.testimonial.English) : 
    (props.language === "Indonesia" ? {
      heading: "Testimoni / Kesaksian",
      seeall: "Lihat Semua Testimoni",
      noTestimonials: "Belum ada testimoni tersedia."
    } : {
      heading: "Guest Testimonies",
      seeall: "See More Testimonials",
      noTestimonials: "No testimonials available yet."
    });
  
  return (
    <section id="testi">
      <div className='pb-20 bg-orange-100'>
        <div className='flex relative justify-between w-full rounded-3xl font-Sora'>
          <div className='flex justify-center items-center px-5 pt-16 pb-10 w-full md:pt-20 md:pl-10 md:items-start'>
            <img className='absolute z-0 invisible md:-bottom-[350px] md:right-0 md:visible' src={Pattern} alt="deco-only" data-aos="fade-down"/>
            <h1 className='z-10 items-start text-5xl leading-tight text-center text-bold'>
              <i className="fa-solid fa-comment"></i> {lang.heading}
            </h1><br/>
          </div>
        </div>
        
        <div className='flex flex-col items-center' data-aos="fade-up">  
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : testimonials.length > 0 ? (
            <>
              <Carousel 
                showArrows={true} 
                infiniteLoop={true} 
                showIndicators={true} 
                showThumbs={false} 
                showStatus={false} 
                autoPlay={true} 
                interval={5000}
                className="mb-8 testimonial-carousel max-w-4xl w-full"
                renderArrowPrev={(onClickHandler, hasPrev) =>
                  hasPrev && (
                    <button
                      type="button"
                      onClick={onClickHandler}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-orange-600 rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )
                }
                renderArrowNext={(onClickHandler, hasNext) =>
                  hasNext && (
                    <button
                      type="button"
                      onClick={onClickHandler}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-orange-600 rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )
                }
                renderIndicator={(onClickHandler, isSelected, index) => (
                  <li
                    className={`inline-block mx-2 cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? 'w-10 bg-orange-600 shadow-lg' 
                        : 'w-3 bg-orange-300 hover:bg-orange-400 hover:w-6'
                    } h-3 rounded-full`}
                    onClick={onClickHandler}
                    key={index}
                  />
                )}
              >
                {testimonials.map((item, key) => (
                  <SimpleTestimonialCard 
                    key={key} 
                    clientName={item.clientName} 
                    email={item.email} 
                    desc={item.desc}
                    rating={item.rating}
                  />
                ))}
              </Carousel>
              <Link 
                to="/testimonials" 
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {lang.seeall}
              </Link>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-600">{lang.noTestimonials}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Testimonial
