import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { CMSProvider } from './contexts/CMSContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { UITextProvider } from './contexts/UITextContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './sections/nav/nav';
import Header from './sections/header/hero';
import Services from './sections/services/services';
import About from './sections/about/about';
import Team from './sections/team/team';
import Gallery from './sections/gallery/gallery';
import Testimonial from './sections/testimonial/testimonial';
import Footer from './sections/footer/contactus';
import ContactUsModalForm from './components/contactus_modal_form';
import NotificationModal from './components/NotifModal';
import SEOComponent from './components/SEOComponent';
import Login from './pages/Login';
import Dashboard from './pages/cms/Dashboard';
import NotificationEditor from './pages/cms/NotificationEditor';
import UITextEditor from './pages/cms/UITextEditor';
import TestimonialForm from './pages/TestimonialForm';
import Testimonials from './pages/Testimonials';
import GalleryPage from './pages/Gallery';
import { useState } from 'react';
import './App.css';

function HomeContent() {
  const { language, changeLanguage } = useLanguage();
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  const openContactForm = () => {
    setIsContactFormOpen(true);
  };

  const closeContactForm = () => {
    setIsContactFormOpen(false);
  };

  return (
    <>
      <SEOComponent />
      <Navbar 
        language={language} 
        handleSetLanguage={changeLanguage} 
        contactForm={openContactForm}
      />
      <Header language={language} />
      <Services 
        language={language} 
        contactForm={openContactForm}
      />
      <About language={language} />
      <Team language={language} />
      <Gallery language={language} />
      <Testimonial language={language} />
      <Footer 
        language={language} 
        contactForm={openContactForm}
      />
      {isContactFormOpen && <ContactUsModalForm hide={closeContactForm} />}
      <NotificationModal />
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <NotificationProvider>
          <UITextProvider>
            <CMSProvider>
              <Router>
                <div className="App">
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/cms/*" element={<Dashboard />} />
                    <Route path="/cms/notifications" element={<NotificationEditor />} />
                    <Route path="/cms/uitext" element={<UITextEditor />} />
                    <Route path="/testimonial/:token" element={<TestimonialForm />} />
                    <Route path="/testimonials" element={<Testimonials />} />
                    <Route path="/gallery" element={<GalleryPage />} />
                    <Route path="/" element={<HomeContent />} />
                  </Routes>
                  <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                  />
                </div>
              </Router>
            </CMSProvider>
          </UITextProvider>
        </NotificationProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

function storeLanguageInLocalStorage(language) {
  localStorage.setItem("language", language);
}

export default App
