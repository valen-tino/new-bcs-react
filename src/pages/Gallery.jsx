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
          <div className="flex relative w-full rounded-3xl font-Sora text-center mb-12 flex-col">
            <div className="flex justify-center items-center px-5 pt-16 pb-2 w-full md:pt-20 md:pl-10 md:items-start">
              <h1 className="z-10 items-start text-5xl leading-tight text-center text-bold">
                {lang.heading}
              </h1>
            </div>
            <Link 
                to="/" 
                className="inline-block px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
              >
                Back to Home
              </Link>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : gallery.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
              <div className="text-center py-20">
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