import React from 'react';
import { Link } from 'react-router-dom';
import { useCMS } from './../contexts/CMSContext';
import Navbar from './../sections/nav/nav';
import Footer from './../sections/footer/contactus';
import ContactUsModalForm from './../components/contactus_modal_form';
import { useLanguage } from './../contexts/LanguageContext';
import { useState } from 'react';
import GalleryPicture from './../components/GalleryPicture';

function Gallery() {
  const { gallery, loading } = useCMS();
  const { language, changeLanguage } = useLanguage();
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  const openContactForm = () => {
    setIsContactFormOpen(true);
  };

  const closeContactForm = () => {
    setIsContactFormOpen(false);
  };

  const lang = language === "Indonesia" 
    ? { heading: "Galeri", noImages: "Belum ada gambar tersedia." }
    : { heading: "Gallery", noImages: "No images available yet." };

  return (
    <div className="App">
      <Navbar 
        language={language} 
        handleSetLanguage={changeLanguage} 
        contactForm={openContactForm}
      />
      
      <section className="bg-orange-100">
        <div className="pb-20">
          <div className="flex relative flex-col mb-12 w-full text-center rounded-3xl font-Sora">
            <div className="flex-col justify-center items-center px-5 pt-16 pb-2 w-full md:pt-20 md:pl-10 md:items-start">
              <h1 className="z-10 items-start text-5xl leading-tight text-center text-bold">
                {lang.heading}
              </h1>
              <Link 
                to="/" 
                className="inline-block px-6 py-3 mt-5 font-medium text-white bg-orange-600 rounded-lg transition-colors hover:bg-orange-700"
              >
                Back to Home
              </Link>
            </div>
            
          </div>
          
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-orange-500 animate-spin"></div>
              </div>
            ) : gallery.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {gallery.map((item, index) => {
                  const src = item.src || item.path || '';
                  return (
                    <GalleryPicture
                      key={index}
                      path={src}
                      alt={item.alt || `Gallery image ${index + 1}`}
                      title={item.title}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-gray-600">{lang.noImages}</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
      {isContactFormOpen && <ContactUsModalForm hide={closeContactForm} />}
    </div>
  );
}

export default Gallery;