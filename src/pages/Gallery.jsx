import React from 'react';
import { Link } from 'react-router-dom';
import { useCMS } from './../contexts/CMSContext';
import Navbar from './../sections/nav/nav';
import Footer from './../sections/footer/contactus';
import ContactUsModalForm from './../components/contactus_modal_form';
import { useLanguage } from './../contexts/LanguageContext';
import { useState } from 'react';
import GalleryPicture from './../components/GalleryPicture';
import SEOComponent from './../components/SEOComponent';

function Gallery() {
  const { gallery, loading, uiText } = useCMS();
  const { language, changeLanguage } = useLanguage();
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  const openContactForm = () => {
    setIsContactFormOpen(true);
  };

  const closeContactForm = () => {
    setIsContactFormOpen(false);
  };

  const lang = uiText?.galleryPage ? 
    (language === "Indonesia" ? uiText.galleryPage.Indonesia : uiText.galleryPage.English) : 
    (language === "Indonesia" 
      ? { heading: "Galeri", noImages: "Belum ada gambar tersedia.", backToHome: "Kembali ke Beranda" }
      : { heading: "Gallery", noImages: "No images available yet.", backToHome: "Back to Home" }
    );

  return (
    <div className="App">
      <SEOComponent 
        title={language === "Indonesia" ? 
          "Galeri BCS Visa - Momen Pernikahan & Layanan Kami" : 
          "BCS Visa Gallery - Wedding Moments & Our Services"
        }
        description={language === "Indonesia" ?
          "Lihat galeri foto pernikahan dan layanan BCS Visa. Dokumentasi upacara pernikahan di Bali dan berbagai layanan visa kami." :
          "View our gallery of wedding ceremonies and visa services. Documentation of Bali wedding ceremonies and our various visa services."
        }
        keywords="bcs gallery, bali wedding photos, visa services gallery, wedding ceremony bali"
        ogImage={gallery.length > 0 ? gallery[0].src : undefined}
      />
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
                {lang.backToHome}
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