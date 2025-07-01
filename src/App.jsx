import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { CMSProvider } from './contexts/CMSContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './sections/nav/nav';
import Header from './sections/header/hero';
import Services from './sections/services/services';
import About from './sections/about/about';
import Gallery from './sections/gallery/gallery';
import Testimonial from './sections/testimonial/testimonial';
import Footer from './sections/footer/contactus';
import ContactUsModalForm from './components/contactus_modal_form';
import NotificationModal from './components/NotifModal';
import Login from './pages/Login';
import Dashboard from './pages/cms/Dashboard';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CMSProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/cms/*" element={<Dashboard />} />
                <Route path="/" element={
                  <>
                    <Navbar />
                    <Header />
                    <Services />
                    <About />
                    <Gallery />
                    <Testimonial />
                    <Footer />
                    <ContactUsModalForm />
                    <NotificationModal />
                  </>
                } />
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
      </AuthProvider>
    </LanguageProvider>
  );
}

function storeLanguageInLocalStorage(language) {
  localStorage.setItem("language", language);
}

export default App
