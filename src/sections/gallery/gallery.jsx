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

  // Get latest 4 images for display
  const latestImages = gallery.slice(0, 4);

  return (
    <>
      <section id='gallery'>
        <div className='bg-orange-200'>
          <div className='relative flex justify-between w-full font-Sora rounded-3xl'>
            <div className='flex justify-center w-full px-5 pt-16 pb-10 md:pt-20 md:pl-10 md:items-start'>
              <h1 className='z-10 py-2 text-5xl leading-tight text-center text-bold' data-aos="fade-up">
                <i className="fa-solid fa-images"></i> {lang.heading}
              </h1>
            </div>
          </div>
          
          <div className="flex flex-col items-center px-6 pb-6 mx-auto md:pl-10">
            {/* Desktop: Grid layout */}
            <div className="hidden md:grid md:grid-cols-4 md:gap-4 mb-8 max-w-6xl w-full">
              {latestImages.map((item, key) => {
                const src = item.src || item.path || '';
                return (
                  <div 
                    key={key} 
                    className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    data-aos="fade-up"
                    data-aos-delay={key * 100}
                  >
                    <GalleryPicture 
                      path={src} 
                      alt={item.alt} 
                      title={item.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="font-semibold text-sm">{item.title}</h3>
                        <p className="text-xs opacity-90">{item.alt}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Mobile: Carousel layout */}
            <div className="md:hidden w-full max-w-md mb-8">
              <Carousel 
                showArrows={true} 
                infiniteLoop={true} 
                showIndicators={true} 
                showThumbs={false} 
                showStatus={false} 
                autoPlay={true} 
                interval={4000}
                className="w-full"
              >
                {latestImages.map((item, key) => {
                  const src = item.src || item.path || '';
                  return (
                    <div key={key} className="relative">
                      <GalleryPicture 
                        path={src} 
                        alt={item.alt} 
                        title={item.title}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
                        <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                        <p className="text-white/90 text-xs">{item.alt}</p>
                      </div>
                    </div>
                  )
                })}
              </Carousel>
            </div>

            <Link 
              to="/gallery" 
              className="px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors shadow-md hover:shadow-lg"
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
