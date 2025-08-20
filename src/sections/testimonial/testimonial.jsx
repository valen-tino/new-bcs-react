import React, { useMemo } from 'react'

import Testicard from '../../components/testicard'
import { Pattern } from '../all/allpics'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import '../testimonial/testimonial.module.css';
import { useCMS } from '../../contexts/CMSContext';

function Testimonial(props){
  // Use CMS data instead of querying Firestore directly
  const { testimonials: cmsTestimonials, loading, uiText } = useCMS();

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
      .sort((a, b) => getDateVal(b.publishedAt) - getDateVal(a.publishedAt))
      .map(t => ({
        clientName: t.name,
        email: t.email || '',
        desc: t.description || t.content || ''
      }));
  }, [cmsTestimonials]);

  const lang = uiText?.testimonial ? 
    (props.language === "Indonesia" ? uiText.testimonial.Indonesia : uiText.testimonial.English) : 
    (props.language === "Indonesia" ? {
      heading: "Testimoni / Kesaksian",
      noTestimonials: "Belum ada testimoni tersedia."
    } : {
      heading: "Guest Testimonies",
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
        
        <div className='flex justify-center items-center' data-aos="fade-up">  
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : testimonials.length > 0 ? (
            <Carousel 
              showArrows={true} 
              infiniteLoop={true} 
              showIndicators={false} 
              showThumbs={false} 
              showStatus={false} 
              autoPlay={true} 
              interval={3500}
            >
              {testimonials.map((item, key) => (
                <Testicard 
                  key={key} 
                  clientName={item.clientName} 
                  email={item.email} 
                  desc={item.desc}
                />
              ))}
            </Carousel>
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
