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
                showIndicators={false} 
                showThumbs={false} 
                showStatus={false} 
                autoPlay={true} 
                interval={3500}
                className="mb-8"
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
                className="px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
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
