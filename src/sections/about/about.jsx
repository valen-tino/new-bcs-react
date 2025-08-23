import AOS from 'aos';
import 'aos/dist/aos.css';

import React, { useEffect } from 'react'
import { Vinsen } from '../all/allpics'
import { useCMS } from '../../contexts/CMSContext';

function About(props){
  const { about: aboutData, uiText } = useCMS();
  
  // Helper function to get CMS content with language support
  const getCMSContent = (field, fallback, language = 'English') => {
    const aboutCMS = aboutData?.[field];
    if (aboutCMS) {
      // Check if content is bilingual object
      if (typeof aboutCMS === 'object' && aboutCMS[language]) {
        return aboutCMS[language];
      }
      // Fallback to string content (for backward compatibility)
      if (typeof aboutCMS === 'string') {
        return aboutCMS;
      }
    }
    return fallback;
  };
  
  const lang = {
    heading: uiText?.about ? 
      (props.language === "Indonesia" ? uiText.about.Indonesia?.heading : uiText.about.English?.heading) : 
      getCMSContent('heading', props.language === "Indonesia" ? "Tentang Kami" : "About Us", props.language === "Indonesia" ? 'Indonesian' : 'English'),
    desc: getCMSContent('description', "Loading...", props.language === "Indonesia" ? 'Indonesian' : 'English')
  };
  
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <>
        <section id='about'>
        <div className='relative flex flex-col justify-between w-full max-h-fit font-Sora rounded-3xl' id='hero'>
            <div className='grid bg-orange-200 md:grid-cols-2'>
                
                <div className='flex flex-col justify-center w-full md:items-end' data-aos="fade-down">
                <img src={Vinsen} className='w-full h-full rounded-3xl md:rounded-tr-3xl md:rounded-b-3xl' alt='Vinsensius Jehaut'/>
                </div>
                
                <div className='flex flex-col justify-center w-full px-5 pt-16 pb-6 text-gray-800 md:pt-20 md:pl-10 md:items-start'>
                    <h1 className='z-10 py-2 text-5xl leading-tight text-bold' data-aos="fade-down"><i className="fa-solid fa-circle-info"></i> {lang.heading}</h1><br/>
                    <div data-aos="fade-down" className='text-justify' dangerouslySetInnerHTML={{ __html: lang.desc }}></div>
                </div>

                
            </div>
        </div>
        </section>
    </>
  )
}

export default About

