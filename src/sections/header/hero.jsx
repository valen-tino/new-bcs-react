import AOS from 'aos';
import 'aos/dist/aos.css';

import React from 'react'
import { heroImage } from '../all/allpics'
import Longwabutton from '../../components/longwabutton';

import { content } from './content';

function Hero(props){
AOS.init();

const lang = props.language === "Indonesia" ? (content.Indonesia) : (content.English);

  return (
    <>
      <section id='hero'>
        <div className='max-w-screen-xl px-0 mx-0 md:px-4 md:mx-auto sm:px-6 lg:px-8 font-Sora'>
          <div className="flex flex-col items-center p-6 text-left bg-orange-200 rounded-lg shadow-lg sm:flex-row">
              <div className='items-start px-0 md:px-5'>
                <strong className="py-3 text-2xl" data-aos="fade-up">
                {lang.heading}
                </strong>
                <p className='py-3 text-5xl' data-aos="fade-up">
                {lang.subheading}
                </p>
                <div className='flex md:flex-row py-3 flex-col gap-2 md:gap-1' data-aos="fade-up">
                    <Longwabutton desc={lang.wa}/>
                    <button className='px-8 py-3'><a href='#services'>{lang.lm}</a></button>
                </div>
              </div>
              <div className='items-end'>
              <img src={heroImage} className='w-full h-full rounded-2xl' alt='deco-only' data-aos="fade-up"/>
              </div>
          </div>
        </div>
      </section>
    </>

  )
}

export default Hero
