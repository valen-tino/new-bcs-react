import AOS from 'aos';
import 'aos/dist/aos.css';
import React, {useState} from 'react'

import { logoIcon} from '../all/allpics'
import useScrollPosition from '../../hooks/useScrollPosition'
import { Emailbutton } from '../../components/emailbutton';
import { content } from './content';
import { Link } from "react-scroll";

function Navbar(props) {
  AOS.init();
  const [Nav, setNav] = useState(false)
  
  const scrollPosition = useScrollPosition()
  const toggleNav = () => setNav(!Nav)
  
  function classFunc(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const lang = props.language === "Indonesia" ? (content.Indonesia) : (content.English);


    return (
      <>
        <nav className={classFunc(scrollPosition > 0 ? 'drop-shadow-xl' : 'drop-shadow-none','sticky top-0 z-50 max-w-screen h-[80px] bg-orange-100 font-Sora')} >
          <div className='flex items-center justify-between h-full px-2'>

            <div className='flex items-center'>
              <div className='mr-4 font-bold transition duration-300 ease-in-out delay-150 md:ml-8 hover:-translate-y-1 hover:scale-110'>
                <img src={logoIcon} width='100px' height='50px' alt='BCS Logo'/>
              </div>
                <ul className='hidden md:flex'>
                  <li><Link activeClass="is-active" to="hero" spy={true} smooth={true} offset={-100} duration={500}>{lang.home}</Link></li>
                  <li><Link activeClass="is-active" to="services" spy={true} smooth={true} offset={-100} duration={500}>{lang.services}</Link></li>
                  <li><Link activeClass="is-active" to="about" spy={true} smooth={true} offset={-100} duration={500}>{lang.about}</Link></li>
                  <li><Link activeClass="is-active" to="gallery" spy={true} smooth={true} offset={-100} duration={500}>{lang.gallery}</Link></li>
                  <li><Link activeClass="is-active" to="testi" spy={true} smooth={true} offset={-100} duration={500}>{lang.testi}</Link></li> 
                  <li><Link activeClass="is-active" to="contactus" spy={true} smooth={true} offset={-100} duration={500}>{lang.contactus}</Link></li>
                </ul>  
            </div>

            <div className='hidden pr-4 md:flex'>
            {/* <Longwabutton desc={lang.wa}/>   */}
            <Emailbutton input={lang.email} contactForm={props.contactForm}/>
              <select
                className="px-2 ml-2 text-black bg-orange-300 rounded-full custom-select"
                value={props.language}
                onChange={e => props.handleSetLanguage(e.target.value)}
              >
                <option value="English">English</option>
                <option value="Indonesia">Indonesia</option>
              </select>
            </div>

            <div className='px-8 md:hidden' onClick={toggleNav}>
              {Nav ? <i className="text-black fa-solid fa-times"></i> : <i className="fa-solid fa-bars"></i>}
            </div>
            
          </div>

          <ul className={!Nav ? 'hidden' : 'sticky  bg-orange-100 w-full px-8'}>
              <li><Link activeClass="is-active" to="hero" spy={true} smooth={true} offset={-100} duration={500}>{lang.home}</Link></li>
              <li><Link activeClass="is-active" to="services" spy={true} smooth={true} offset={-100} duration={500}>{lang.services}</Link></li>
              <li><Link activeClass="is-active" to="about" spy={true} smooth={true} offset={-100} duration={500}>{lang.about}</Link></li>
              <li><Link activeClass="is-active" to="gallery" spy={true} smooth={true} offset={-100} duration={500}>{lang.gallery}</Link></li>
              <li><Link activeClass="is-active" to="testi" spy={true} smooth={true} offset={-100} duration={500}>{lang.testi}</Link></li>
              <li><Link activeClass="is-active" to="contactus" spy={true} smooth={true} offset={-100} duration={500}>{lang.contactus}</Link></li>
              <div className='flex flex-col pb-2 my-4 text-center gap-y-3'>
              <Emailbutton input={lang.email} contactForm={props.contactForm}/>
                <select
                  className="py-3 pl-2 text-black bg-orange-300 rounded-full custom-select"
                  value={props.language}
                  onChange={e => props.handleSetLanguage(e.target.value)}
                >
                  <option value="English">English</option>
                  <option value="Indonesia">Indonesia</option>
                </select>
              </div>
          </ul>
        </nav>
      </>
      
    )
}

export default Navbar