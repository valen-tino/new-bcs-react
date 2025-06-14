import AOS from 'aos';
import 'aos/dist/aos.css';

import React,{useState, useEffect} from 'react'
import { logoIcon } from '../all/allpics'
import Longwabutton from '../../components/longwabutton';
import { Emailbutton } from '../../components/emailbutton';
import Link from '../../components/link';

import { content } from './content';
import NotifModal from '../../components/NotifModal';

function ContactUs (props){
  useEffect(() => {
    AOS.init();
  }, []);
  const [showInfo,setShowInfo] = useState(false)
  const handleOnClose = () => setShowInfo(false)
  const lang = props.language === "Indonesia" ? (content.Indonesia) : (content.English);
  
  return (
    <>
    <footer>
      <section id='contactus' className="bg-orange-100 font-Sora">
      <div className="max-w-screen-xl px-4 pt-16 pb-6 mx-auto sm:px-6 lg:px-8 lg:pt-24">
      
        <div className="flex flex-col items-center p-6 mb-10 bg-orange-200 rounded-lg shadow-lg sm:flex-row sm:justify-between" data-aos="fade-up">
          <strong className="text-xl text-center md:text-left sm:text-xl">{lang.desc}</strong>
          <div className="flex-row">
          <Emailbutton input={lang.email} contactForm={props.contactForm}/> &nbsp;<Longwabutton desc={lang.wa}/>
          </div>

        </div>
        
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div data-aos="fade-up">
              <iframe title='Office Location' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.565477096446!2d115.26276991457078!3d-8.637644893792881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd23f5fb17fd911%3A0x7efaf8b22c37d465!2sPerumahan%20Bumisanthi%20no.%2031!5e0!3m2!1sen!2sid!4v1661126256267!5m2!1sen!2sid" width="300" height="250" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>

          <div className='px-2' data-aos="fade-up">
              <div className="flex justify-center text-teal-600 sm:justify-start">
                <img src={logoIcon} width="100px" height='50px' alt='BCS Logo'/>
              </div>

              <div className='mt-6'>
                <p className="justify-center text-lg leading-relaxed gray-500 sm:text-left">
                {lang.desc2}</p>
                <button className='my-2' onClick={() => setShowInfo(true)}>{lang.legal}</button>
                <br/>
                <NotifModal 
                  onClose={handleOnClose} 
                  visible={showInfo} 
                  title={lang.legal} 
                  desc={lang.legaldetails} 
                  sub={lang.sub}/>    
              </div>

          </div>
          
          <div className="px-2 text-center sm:text-left" data-aos="fade-up">
              <p className="text-lg font-medium text-gray-900">Links</p>

              <nav className="mt-8">
                <ul className="space-y-0 text-sm">
                  <Link name={lang.firstlink} to="#hero" isFooter="yes"/>
                  <Link name={lang.secondlink} to="#services" isFooter="yes"/>
                  <Link name={lang.thirdlink} to="#about" isFooter="yes"/>
                  <Link name={lang.fourthlink} to="#gallery" isFooter="yes"/>
                  <Link name={lang.fifthlink} to="#testi" isFooter="yes"/>
                </ul>
              </nav>
          </div>

          <div className="px-2 text-center sm:text-left" data-aos="fade-up">
              <p className="text-lg font-medium text-gray-900">{lang.wa}</p>

              <ul className="mt-8 space-y-0 text-sm">
                <Link to="https://www.instagram.com/vinsensiusjehaut/" icon="fa-brands fa-instagram" name="vinsensiusjehaut" isFooter="yes"/>
                <Link to="https://www.facebook.com/vinsen.jehaut.3" icon="fa-brands fa-facebook" name="Vinsen Jehaut" isFooter="yes" />
                <Link to="mailto:bcs.bali2008@gmail.com" icon="fa-solid fa-envelope" name="bcs.bali2008@gmail.com" isFooter="yes"/>
                <Link to="https://wa.me/6281558759959" icon="fa-solid fa-phone" name="+62 (0) 81-558-759-959" isFooter="yes"/>
                <Link to="https://wa.me/628123666187" icon="fa-solid fa-phone" name="+62 (0) 8123-666-187" isFooter="yes"/>
                <Link to="https://www.google.com/maps/place/Perumahan+Bumisanthi+no.+31,+Jl.+Pratu+Made+Rambug+No.31,+Batubulan,+Sukawati,+Gianyar+Regency,+Bali+80237/@-8.6376449,115.2649586,17z/data=!4m5!3m4!1s0x2dd23f5fb17fd911:0x7efaf8b22c37d465!8m2!3d-8.6376449!4d115.2649586?force=pwa&source=mlapk" icon="fa-solid fa-location-dot" name="Jl. Pratu Made Rambug, Perum Bumi Santi No.31 Br. Sasih Batubulan Sukawati Gianyar - Bali" isFooter="yes"/>
              </ul>
          </div>

        </div>

        <div className="pt-6 mt-12 border-t border-gray-100" >
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-sm text-gray-500">
              <span className="block sm:inline"><a target="_self" rel="noreferrer" href='/pdf/akte-notaris-bcs.pdf'><u>{lang.akte}</u></a></span>
              <span className="block sm:inline"><a target="_self" rel="noreferrer" href="//www.dmca.com/Protection/Status.aspx?ID=52331252-4693-457d-994c-2fdaf815ca30" title="DMCA.com Protection Status" className="dmca-badge"> <img src ="https://images.dmca.com/Badges/dmca_protected_sml_120n.png?ID=52331252-4693-457d-994c-2fdaf815ca30"  alt="DMCA.com Protection Status" /></a></span>&nbsp;
            </p>
            <p className="mt-4 text-sm text-gray-500 sm:order-first sm:mt-0">
            {lang.copy} &copy; {new Date().getFullYear()} Created by <a href='//tino.pw/' target="_self" rel="noreferrer"><u>Valen Jehaut</u></a>
            </p>
          </div>
        </div>
      </div>
      </section>
      
    </footer>

    </>
    

    


  )
}

export default ContactUs

