import AOS from 'aos'
import 'aos/dist/aos.css'

import React, { useEffect } from 'react'
import Picture from '../../components/picture'
import { useCMS } from '../../contexts/CMSContext'

import { content } from './content'

function Gallery(props){
  
  const lang = props.language === "Indonesia" ? (content.Indonesia) : (content.English);
  const { gallery } = useCMS();
  
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <>
      <section id='gallery'>
        <div className='bg-orange-200'>
        <div className='relative flex justify-between w-full font-Sora rounded-3xl '>
            <div className='flex justify-center w-full px-5 pt-16 pb-10 md:pt-20 md:pl-10 md:items-start'>
                <h1 className='z-10 py-2 text-5xl leading-tight text-center text-bold' data-aos="fade-up"><i className="fa-solid fa-images"></i> {lang.heading}</h1><br/>
            </div>
        </div>
        <div className="flex flex-wrap px-6 pb-6 mx-auto md:pl-10">
              {gallery.map((item,key) => {
                const src = item.src || item.path || '';
                return (
                  <Picture key={key} path={src} alt={item.alt}/>
                )
              })}
        </div>
        </div>

      </section>
    </>
  )
}

export default Gallery
