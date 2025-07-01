import React from 'react'

import Testicard from '../../components/testicard'
import { Testimony } from '../all/alldata'
import { Pattern } from '../all/allpics'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import '../testimonial/testimonial.module.css';

function Testimonial(props){

  let content = {
    English: {
      heading:"Guest Testimonies",
    },  
    Indonesia:{
      heading:"Testimoni / Kesaksian",
    }
  };
  
  const lang = props.language === "Indonesia" ? (content.Indonesia) : (content.English);
  
    return (
      <section id="testi">
              <div className='pb-20 bg-orange-100'>
          <div className='flex relative justify-between w-full rounded-3xl font-Sora'>
              <div className='flex justify-center items-center px-5 pt-16 pb-10 w-full md:pt-20 md:pl-10 md:items-start'>
              <img className='absolute z-0 invisible md:-bottom-[350px] md:right-0 md:visible' src={Pattern} alt="deco-only" data-aos="fade-down"/>
                  <h1 className='z-10 items-start text-5xl leading-tight text-center text-bold'><i className="fa-solid fa-comment"></i> {lang.heading}</h1><br/>
              </div>
          </div>
          <div className='flex justify-center items-center' data-aos="fade-up">  
            <Carousel showArrows={true} infiniteLoop={true} showIndicators={false} showThumbs={false} showStatus={false} autoPlay={true} interval={3500}>
            {Testimony.Testi.map((item,key) => {
                return (
                  <Testicard key={key} clientName={item.clientName} email={item.email} desc={item.desc}/>
                )
              })}
            </Carousel>
          </div>
      </div>
      </section>
    )
}

export default Testimonial
