import AOS from 'aos'
import 'aos/dist/aos.css'

import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import GalleryPicture from '../../components/GalleryPicture'
import { useCMS } from '../../contexts/CMSContext'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

function Gallery(props){
  const { gallery, uiText } = useCMS();
  
  const lang = uiText?.gallery ? 
    (props.language === "Indonesia" ? uiText.gallery.Indonesia : uiText.gallery.English) : 
    (props.language === "Indonesia" ? {
      heading: "Galeri"
    } : {
      heading: "Gallery"
    });
  
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
        <div className="flex flex-col items-center px-6 pb-6 mx-auto md:pl-10">
          <Carousel 
            showArrows={true} 
            infiniteLoop={true} 
            showIndicators={false} 
            showThumbs={false} 
            showStatus={false} 
            autoPlay={true} 
            interval={3500}
            className="mb-8 max-w-4xl w-full"
          >
            {gallery.slice(0, 5).map((item, key) => {
              const src = item.src || item.path || '';
              return (
                <div key={key}>
                  <GalleryPicture 
                    path={src} 
                    alt={item.alt} 
                    title={item.title}
                    className="h-64 md:h-96"
                  />
                </div>
              )
            })}
          </Carousel>
          <Link 
            to="/gallery" 
            className="px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
          >
            See More
          </Link>
        </div>
        </div>

      </section>
    </>
  )
}

export default Gallery
