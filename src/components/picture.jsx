import AOS from 'aos';
import 'aos/dist/aos.css';
import React from 'react'

export default function Picture (props) {
  AOS.init();
  const alt = props.alt
  const path = "gallery/" + props.path
  return (
    <div className="px-4 mb-8 md:w-1/4 font-Sora" data-aos="fade-up">
      <img className="w-full h-full transition duration-300 ease-in-out delay-150 shadow-lg rounded-xl hover:shadow-xl hover:-translate-y-0 hover:scale-110" src={path} alt={alt} />
      <div className='flex flex-row'>
        <div className="absolute w-50 py-2.5 bottom-0 inset-x-0 text-white text-md md:pl-8 pl-6 md:pb-5 pb-3 text-left leading-4">{alt}</div>
      </div>
    </div>
  )}
