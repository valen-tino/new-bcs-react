import './App.css';
import React, { useState } from "react";
import { Navbar,Hero,Services,About,Team,Gallery,Testimonial } from './sections/all/allsections'
import Whatsapp from './components/floatwabutton';
import ContactUs from './sections/footer/contactus';
import Notif from './sections/notif/notif';
import ContactUsModal from './components/contactus_modal_form';

function App() {
  let languageStoredInLocalStorage = localStorage.getItem("language");
  let [language, setLanguage] = useState(languageStoredInLocalStorage ? languageStoredInLocalStorage : "Indonesia");
  const [ContactUsFormModal, setContactUsFormModal] = useState(false)

  return (
      <>
        <Notif language={language}/>
        <Navbar
          contactForm={() =>setContactUsFormModal(true)}
          language={language}
          handleSetLanguage={language => {
            setLanguage(language);
            storeLanguageInLocalStorage(language);
          }}
        />
        <Hero language={language}/>
        <Services language={language} contactForm={() =>setContactUsFormModal(true)}/>
        <About language={language}/>
        <Team language={language}/>
        <Gallery language={language}/>
        <Testimonial language={language}/>
        <ContactUs language={language} contactForm={() =>setContactUsFormModal(true)}/>
        <Whatsapp/>

        {ContactUsFormModal === true ? <ContactUsModal language={language} hide={() => setContactUsFormModal(false)} /> : ''}
      </>
   )
}

function storeLanguageInLocalStorage(language) {
  localStorage.setItem("language", language);
}

export default App
