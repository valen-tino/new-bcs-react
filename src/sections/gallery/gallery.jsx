import AOS from 'aos'
import 'aos/dist/aos.css'

import React from 'react'
import Picture from '../../components/picture'
import { Images } from '../all/alldata'

import { content } from './content'

function Team(props){
  
  const lang = props.language === "Indonesia" ? (content.Indonesia) : (content.English);
  
AOS.init();
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
              {Images.Images.map((item,key) => {
                return (
                  <Picture key={key} path={item.path} alt={item.alt}/>
                )
              })}
        </div>
        </div>

      </section>
    </>
  )
}

export default Team
