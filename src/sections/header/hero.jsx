import AOS from 'aos';
import 'aos/dist/aos.css';

import React, { useEffect } from 'react'
import { heroImage } from '../all/allpics'
import Longwabutton from '../../components/longwabutton';
import { useCMS } from '../../contexts/CMSContext';

function Hero(props){
  const { uiText } = useCMS();
  
  useEffect(() => {
    AOS.init();
  }, []);

  const lang = uiText?.hero ? 
    (props.language === "Indonesia" ? uiText.hero.Indonesia : uiText.hero.English) : 
    (props.language === "Indonesia" ? 
      { heading: "Cari Visa Keluar Negeri?", subheading: "Dapatkan konsultasi visa dengan kami sekarang!", wa: "Hubungi hari ini!", lm: "Layanan Kami" } : 
      { heading: "Make a Visa Abroad?", subheading: "Get consultation with us now!", wa: "Contact Us Today!", lm: "Learn More" }
    );

  return (
    <>
      <section id='hero'>
        <div className='max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8 font-Sora'>
          <div className="flex flex-col items-center p-4 sm:p-6 text-left bg-orange-200 rounded-lg shadow-lg sm:flex-row gap-4 sm:gap-6 min-h-0 overflow-hidden">
              <div className='flex-1 min-w-0 px-2 sm:px-4 md:px-5'>
                <strong className="block py-2 sm:py-3 text-xl sm:text-2xl leading-tight" data-aos="fade-up">
                {lang.heading}
                </strong>
                <p className='block py-2 sm:py-3 text-3xl sm:text-4xl md:text-5xl leading-tight' data-aos="fade-up">
                {lang.subheading}
                </p>
                <div className='flex flex-col sm:flex-row py-2 sm:py-3 gap-2 sm:gap-3' data-aos="fade-up">
                    <Longwabutton desc={lang.wa}/>
                    <button className='px-6 sm:px-8 py-3 min-w-0 flex-shrink-0'><a href='#services'>{lang.lm}</a></button>
                </div>
              </div>
              <div className='flex-shrink-0 w-full sm:w-auto max-w-xs sm:max-w-sm md:max-w-md'>
              <img 
                src={heroImage} 
                className='w-full h-auto rounded-2xl' 
                alt='BCS Visa consultation services in Bali' 
                data-aos="fade-up"
                fetchpriority="high"
                width="400"
                height="300"
                style={{ aspectRatio: '4/3' }}
              />
              </div>
          </div>
        </div>
      </section>
    </>

  )
}

export default Hero

