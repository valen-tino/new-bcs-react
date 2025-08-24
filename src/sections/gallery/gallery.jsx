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
          {/* Mobile Carousel */}
          <div className="block md:hidden w-full max-w-sm mb-4" style={{minHeight: '320px'}}>
            <Carousel 
              showArrows={true} 
              infiniteLoop={true} 
              showIndicators={true} 
              showThumbs={false} 
              showStatus={false} 
              autoPlay={true} 
              interval={4000}
              className="mb-8 gallery-carousel"
              id="gallery-carousel"
              role="region"
              aria-label="Gallery images carousel"
              aria-roledescription="carousel"
              onClickItem={(index) => {
                // Handle focus management on item click
                const indicators = document.querySelectorAll('[aria-label*="Go to slide"]');
                if (indicators[index]) {
                  indicators[index].focus();
                }
              }}
              renderArrowPrev={(onClickHandler, hasPrev) =>
                hasPrev && (
                  <button
                    type="button"
                    onClick={onClickHandler}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onClickHandler();
                      }
                    }}
                    aria-label="Previous slide"
                    aria-controls="gallery-carousel"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-orange-600/80 hover:bg-orange-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-600 min-h-[48px] min-w-[48px] touch-manipulation"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="sr-only">Previous slide</span>
                  </button>
                )
              }
              renderArrowNext={(onClickHandler, hasNext) =>
                hasNext && (
                  <button
                    type="button"
                    onClick={onClickHandler}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onClickHandler();
                      }
                    }}
                    aria-label="Next slide"
                    aria-controls="gallery-carousel"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-orange-600/80 hover:bg-orange-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-600 min-h-[48px] min-w-[48px] touch-manipulation"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="sr-only">Next slide</span>
                  </button>
                )
              }
              renderIndicator={(onClickHandler, isSelected, index) => (
                <button
                  type="button"
                  className={`inline-block mx-1 cursor-pointer transition-all duration-200 ${
                    isSelected ? 'w-8 bg-orange-600' : 'w-2 bg-orange-300 hover:bg-orange-400'
                  } h-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-600 min-h-[24px] min-w-[24px] p-1 touch-manipulation`}
                  onClick={onClickHandler}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onClickHandler();
                    }
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-pressed={isSelected}
                  key={index}
                />
              )}
            >
              {gallery.slice(0, 5).map((item, key) => {
                const src = item.src || item.path || '';
                return (
                  <div key={key} className="rounded-xl overflow-hidden" style={{minHeight: '256px'}}>
                    <GalleryPicture 
                      path={src} 
                      alt={item.alt} 
                      title={item.title}
                      className="h-64 object-cover"
                    />
                  </div>
                )
              })}
            </Carousel>
          </div>

          {/* Tablet & Desktop Grid */}
          <div className="hidden md:block w-full max-w-6xl">
            <div className={`grid gap-6 mb-8 ${
              gallery.length === 1 ? 'grid-cols-1 justify-items-center' :
              gallery.length === 2 ? 'grid-cols-2' :
              gallery.length === 3 ? 'grid-cols-3' :
              'grid-cols-2 lg:grid-cols-4'
            }`}>
              {gallery.slice(0, 4).map((item, key) => {
                const src = item.src || item.path || '';
                return (
                  <div 
                    key={key} 
                    className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                    data-aos="fade-up"
                    data-aos-delay={key * 100}
                  >
                    <div className="aspect-square overflow-hidden">
                      <GalleryPicture 
                        path={src} 
                        alt={item.alt} 
                        title={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                      {item.title && (
                        <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                      )}
                      {item.alt && (
                        <p className="text-xs text-gray-200">{item.alt}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <br/><Link 
            to="/gallery" 
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
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
