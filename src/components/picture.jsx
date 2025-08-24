import AOS from 'aos';
import 'aos/dist/aos.css';
import React, { useEffect } from 'react'

export default function Picture (props) {
  useEffect(() => {
    AOS.init();
  }, []);
  const alt = props.alt
  const rawPath = props.path || ''
  const path = (rawPath.startsWith('http') || rawPath.includes('/')) ? rawPath : `gallery/${rawPath}`
  return (
    <div className="px-4 mb-8 md:w-1/4 font-Sora" data-aos="fade-up">
      <div className="relative group">
        <img className="w-full h-full transition duration-300 ease-in-out delay-150 shadow-lg rounded-xl hover:shadow-xl hover:-translate-y-0 hover:scale-110" src={path} alt={alt} />
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl'>
          <div className="absolute bottom-4 left-4 right-4 text-white text-sm md:text-base font-medium leading-tight">
            {alt}
          </div>
        </div>
      </div>
    </div>
  )}
