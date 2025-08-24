import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink } from 'react-router-dom';
import { logoIcon } from '../all/allpics';
import { Emailbutton } from '../../components/emailbutton';
import { useCMS } from '../../contexts/CMSContext';

function Navbar(props) {
  const [Nav, setNav] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { uiText } = useCMS();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleNav = () => {
    setNav(!Nav);
  };

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(window.pageYOffset);
    };
    window.addEventListener('scroll', updatePosition);
    updatePosition();
    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  // Check if we're on the homepage
  const isHomePage = location.pathname === '/';

  // Handle hash navigation on initial load or page change
  useEffect(() => {
    const hash = location.hash;
    if (hash && isHomePage) {
      const sectionId = hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // Small delay to ensure page is loaded
    }
  }, [location, isHomePage]);

  const lang = uiText?.nav?.[props.language] || {
    home: "Home",
    services: "Services",
    about: "About",
    team: "Team",
    gallery: "Gallery",
    testi: "Testimonials",
    contactus: "Contact",
    email: "Email Us"
  };

  // Handle navigation for cross-page scenarios
  const handleNavigation = (sectionId, isMobile = false) => {
    if (isMobile) {
      setNav(false); // Close mobile menu
    }
    
    if (isHomePage) {
      // If on homepage, scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on other page, navigate to homepage with hash
      navigate(`/#${sectionId}`);
      
      // After navigation, scroll to the section
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // Navigation item component that handles both scroll and route navigation
  const NavItem = ({ sectionId, children, isMobile = false }) => {
    const href = isHomePage ? `#${sectionId}` : `/#${sectionId}`;
    
    const handleClick = (e) => {
      e.preventDefault(); // Prevent default anchor behavior
      if (isMobile) {
        setNav(false); // Close mobile menu
      }
      
      if (isHomePage) {
        // If on homepage, scroll to section
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // If on other page, navigate to homepage with hash
        navigate(`/#${sectionId}`);
        
        // After navigation, scroll to the section
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    };

    return (
      <a
        href={href}
        className="cursor-pointer"
        onClick={handleClick}
      >
        {children}
      </a>
    );
  };

  return (
    <>
      <nav className={`sticky top-0 z-50 max-w-screen h-[80px] bg-orange-100 font-Sora ${scrollPosition > 0 ? 'drop-shadow-xl' : 'drop-shadow-none'}`}>
        <div className='flex items-center justify-between h-full px-2'>
          <div className='flex items-center'>
            <a href="/" className='mr-4 font-bold transition duration-300 ease-in-out delay-150 md:ml-8 hover:-translate-y-1 hover:scale-110' onClick={(e) => { e.preventDefault(); navigate('/'); }}>
              <img src={logoIcon} width='100px' height='50px' alt='BCS Logo'/>
            </a>
            <ul className='hidden md:flex'>
              <li className='nav-list'><NavItem sectionId="hero">{lang.home}</NavItem></li>
              <li className='nav-list'><NavItem sectionId="services">{lang.services}</NavItem></li>
              <li className='nav-list'><NavItem sectionId="about">{lang.about}</NavItem></li>
              {/* <li className='nav-list'><NavItem sectionId="team">{lang.team}</NavItem></li>
              <li className='nav-list'><NavItem sectionId="gallery">{lang.gallery}</NavItem></li> */}
              <li className='nav-list'><NavItem sectionId="testi">{lang.testi}</NavItem></li>
              <li className='nav-list'><a href="/announcements" className="cursor-pointer" onClick={(e) => { e.preventDefault(); navigate('/announcements'); }}>Announcements</a></li>
              <li className='nav-list'><NavItem sectionId="contactus">{lang.contactus}</NavItem></li>
            </ul>
          </div>

          <div className='hidden pr-4 md:flex'>
            <Emailbutton input={lang.email} contactForm={props.contactForm}/>
            <select
              className="px-2 ml-2 text-black bg-orange-300 rounded-full custom-select min-h-[44px] touch-manipulation"
              value={props.language}
              onChange={e => props.handleSetLanguage(e.target.value)}
              aria-label="Select language"
            >
              <option value="English">English</option>
              <option value="Indonesia">Indonesia</option>
            </select>
          </div>

          <div className='px-8 md:hidden' onClick={toggleNav}>
            <button 
              className="min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
              aria-label={Nav ? "Close menu" : "Open menu"}
              aria-expanded={Nav}
            >
              {Nav ? <i className="text-black fa-solid fa-times"></i> : <i className="fa-solid fa-bars"></i>}
            </button>
          </div>
        </div>

        <ul className={!Nav ? 'hidden' : 'sticky bg-orange-100 w-full px-8'}>
          <li className='nav-list'><NavItem sectionId="hero" isMobile={true}>{lang.home}</NavItem></li>
          <li className='nav-list'><NavItem sectionId="services" isMobile={true}>{lang.services}</NavItem></li>
          <li className='nav-list'><NavItem sectionId="about" isMobile={true}>{lang.about}</NavItem></li>
          {/* <li className='nav-list'><NavItem sectionId="team" isMobile={true}>{lang.team}</NavItem></li>
          <li className='nav-list'><NavItem sectionId="gallery" isMobile={true}>{lang.gallery}</NavItem></li> */}
          <li className='nav-list'><NavItem sectionId="testi" isMobile={true}>{lang.testi}</NavItem></li>
          <li className='nav-list'><a href="/announcements" className="cursor-pointer" onClick={(e) => { e.preventDefault(); navigate('/announcements'); setNav(false); }}>Announcements</a></li>
          <li className='nav-list'><NavItem sectionId="contactus" isMobile={true}>{lang.contactus}</NavItem></li>
          <div className='flex flex-col pb-2 my-4 text-center gap-y-3'>
            <Emailbutton input={lang.email} contactForm={props.contactForm}/>
            <select
              className="py-3 pl-2 text-black bg-orange-300 rounded-full custom-select min-h-[44px] touch-manipulation"
              value={props.language}
              onChange={e => props.handleSetLanguage(e.target.value)}
              aria-label="Select language"
            >
              <option value="English">English</option>
              <option value="Indonesia">Indonesia</option>
            </select>
          </div>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;