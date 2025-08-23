import React, { useState, useEffect } from 'react'
import AOS from 'aos';
import 'aos/dist/aos.css';

import { visa, bali, wedding, translate, travel, info} from '../all/allpics'
import { useCMS } from '../../contexts/CMSContext'
import dataVisaAbroad from '../../data/dataVisaAbroad'
import dataVisaBali from '../../data/dataVisaBali';
import Modal from '../../components/modal'
import Longwabutton from '../../components/longwabutton';
import { Emailbutton } from '../../components/emailbutton';

function Services(props){
    useEffect(() => {
        AOS.init();
    }, []);

    // Normalize CMS items to the shape { title, desc } expected by the UI
    const normalizeVisaAbroadItems = (items = []) => {
        return items.map((i) => {
            const title = i.title || `${i.country || ''}`;
            const flag = i.flag || '';
            let desc = i.desc || i.description || '';
            if (Array.isArray(i.requirements) && i.requirements.length > 0) {
                const reqText = i.requirements.map((r, idx) => `${idx + 1}. ${r}`).join('\n');
                desc = desc ? `${desc}\nRequirements:\n${reqText}` : `Requirements:\n${reqText}`;
            }
            return { ...i, title, desc };
        });
    };

    const normalizeVisaBaliItems = (items = []) => {
        return items.map((i) => {
            // const durationPart = i.duration ? ` (${i.duration})` : '';
            const title = i.title || `${i.type || ''}`.trim();
            let desc = i.desc || i.description || '';
            if (Array.isArray(i.requirements) && i.requirements.length > 0) {
                const reqText = i.requirements.map((r, idx) => `${idx + 1}. ${r}`).join('\n');
                desc = desc ? `${desc}\n\nRequirements:\n${reqText}` : `Requirements:\n${reqText}`;
            }
            return { ...i, title, desc };
        });
    };

    const [modal, setModal] = useState(false)
    const [tempData, setTempData] = useState([])
    const { visaAbroad: cmsVisaAbroad, visaBali: cmsVisaBali, services: servicesData, uiText } = useCMS();
    
    // Use CMS data if available and valid (has non-empty titles), otherwise use fallback static data
    const normalizedAbroad = normalizeVisaAbroadItems(cmsVisaAbroad || []);
    const filteredAbroad = normalizedAbroad.filter(i => typeof i.title === 'string' && i.title.trim().length > 0);
    const visaAbroad = filteredAbroad.length > 0 ? filteredAbroad : dataVisaAbroad.VisaAbroad;

    const normalizedBali = normalizeVisaBaliItems(cmsVisaBali || []);
    const filteredBali = normalizedBali.filter(i => typeof i.title === 'string' && i.title.trim().length > 0);
    const visaBali = filteredBali.length > 0 ? filteredBali : dataVisaBali.VisaBali;

    const getData = (title, desc) => {
        let tempData = [title, desc];
        setTempData(item => [1, ...tempData]);
        return setModal(true)
    }

    // Helper function to get CMS description with language support
    const getCMSDescription = (serviceType, fallback, language = 'English') => {
        const serviceData = servicesData?.[serviceType];
        
        if (serviceData?.description) {
            // Check if description is bilingual object
            if (typeof serviceData.description === 'object' && serviceData.description[language]) {
                return serviceData.description[language];
            }
            // Fallback to string description (for backward compatibility)
            if (typeof serviceData.description === 'string') {
                return serviceData.description;
            }
        }
        return fallback;
    };

    // Determine current language
    const currentLanguage = props.language === "Indonesia" ? "Indonesian" : "English";

    // Get UI text content with CMS descriptions merged in
    const getServiceContent = () => {
        const baseContent = uiText?.services ? 
            (props.language === "Indonesia" ? uiText.services.Indonesia : uiText.services.English) : 
            {
                vaa: "Visa Assistance Abroad",
                vaadesc: "We provide visa assistance for various countries including Schengen, UK, USA, Australia, Japan, Korea, and more.",
                vaasub: "Select a country to see requirements",
                vab: "Visa Assistance in Bali",
                vabdesc: "We also offer visa assistance services in Bali, Indonesia.",
                wedding: "Wedding Ceremony Organizer",
                weddingsub: "Make your special day unforgettable",
                weddingbtn: "View Gallery",
                translate: "Translation Documents",
                travel: "Travel Insurance",
                others: "Other Services",
                email: "Email Us",
                wa: "WhatsApp Us"
            };
        
        // Override with CMS descriptions
        return {
            ...baseContent,
            weddingdesc: getCMSDescription('wedding', "We provide comprehensive wedding ceremony organization services in Bali.", currentLanguage),
            translatedesc: getCMSDescription('translation', "Professional translation services for all document types.", currentLanguage),
            traveldesc: getCMSDescription('travel', "Comprehensive travel insurance coverage.", currentLanguage),
            otherssub: getCMSDescription('others', "We also provide additional services", currentLanguage)
        };
    };

    const lang = getServiceContent();

    return (
        <>
        {/* bg-orange-100 */}
            <section id='services'>
                <div className='relative flex flex-col justify-between w-full px-5 bg-orange-100 font-Sora md:p-0'>
                    
                    {/* Visa Assistance Abroad */}
                    <div className='grid md:grid-cols-2 max-w-[1240px] m-auto rounded-full pt-8'>
                        <div className='flex flex-col justify-center visible md:items-end sm:hidden' data-aos="fade-down">
                            <div className='p-10 bg-orange-200 rounded-l-full rounded-br-full shadow-lg'>
                                <img src={visa} className='z-10 w-fit h-fit' alt='Visa Assistance Abroad'/>
                            </div>
                        </div>

                        <div className='flex flex-col justify-center w-full gap-5 py-0 md:items-start md:px-20 md:py-40'>

                            <h1 className='z-10 py-2 pl-2 text-5xl leading-tight text-bold' data-aos="fade-down">{lang.vaa}</h1>
                            <h2 className='pl-2 text-sm text-bold' data-aos="fade-down">{lang.vaadesc}</h2>
                            <h3 className='pl-2 text-lg text-bold' data-aos="fade-down">{lang.vaasub}</h3>
                            <div className='flex flex-wrap gap-2 pr-4'>
                                {visaAbroad.map((item, key) => (
                                    <button
                                        key={key}
                                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 transition-colors duration-200 modal-open"
                                        data-aos="fade-up"
                                        onClick={() => getData(item.title, item.desc)}
                                    >
                                        {item.flag && (
                                        <img src={item.flag} alt={item.title} className="w-6 h-4 object-cover" />
                                        )}
                                        {item.title}
                                    </button>
                                    ))}
                            </div>

                        </div>

                        <div className='flex flex-col justify-center invisible w-full sm:visible md:items-end' data-aos="fade-down">
                            <div className='p-10 bg-orange-200 rounded-l-full rounded-br-full shadow-lg'>
                                <img src={visa} className='z-10 w-fit h-fit' alt='Visa Assistance Abroad'/>
                            </div>
                        </div>
                    </div>
                    {/* End of Visa Assistance Abroad */}

                    {/* Visa Assistance in Bali */}
                    <div className='grid md:grid-cols-2 max-w-[1240px] m-auto rounded-full pt-8'>
                        <div className='flex flex-col justify-center w-full md:items-end' data-aos="fade-down">
                            <div className='p-10 bg-orange-200 rounded-r-full rounded-bl-full shadow-lg'>
                                <img src={bali} className='z-10 w-fit h-fit' alt='Visa Assistance in Bali'/>
                            </div>
                        </div>

                        <div className='flex flex-col justify-center w-full gap-5 py-0 md:items-start md:px-20 md:py-40'>

                            <h1 className='z-10 py-2 pl-2 text-5xl leading-tight text-bold' data-aos="fade-down">{lang.vab}</h1>
                            <h2 className='pl-2 pr-2 text-sm text-bold' data-aos="fade-down">{lang.vabdesc}</h2>
                            <div className='flex flex-wrap gap-2 py-2 pr-4'>
                                {visaBali.map((item, key) => {
                                    return (
                                        <button 
                                            className='px-4 py-2 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 transition-colors duration-200 modal-open' 
                                            data-aos="fade-up" 
                                            key={key} 
                                            onClick={() => getData(item.title, item.desc)}
                                        >{item.title}</button>
                                    )
                                })}

                            </div>

                        </div>

                    </div>
                    {/* End of Visa Assistance in Bali */}

                    {/* Wedding Ceremony Organizer */}            
                    <div className='grid md:grid-cols-2 max-w-[1240px] m-auto rounded-full pt-8'>

                        <div className='flex flex-col justify-center visible w-full md:items-end sm:hidden' data-aos="fade-down">
                            <div className='p-10 bg-orange-200 rounded-l-full rounded-br-full shadow-lg'>
                                <img src={wedding} className='z-10 w-fit h-fit' alt='Wedding Ceremony Organizer'/>
                            </div>
                        </div>

                        <div className='flex flex-col justify-center w-full gap-5 py-0 md:items-start md:px-20 md:py-40'>

                            <h1 className='z-10 py-2 pl-2 text-5xl leading-tight text-bold' data-aos="fade-down">{lang.wedding}</h1>
                            <h2 className='pl-2 text-sm' data-aos="fade-down">
                                {lang.weddingsub}<br/><br/><span dangerouslySetInnerHTML={{__html: lang.weddingdesc}}></span>
                            </h2>
                            <div className='flex flex-wrap gap-2 py-2 pr-2'>
                                <button className='px-8 py-3 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 transition-colors duration-200' data-aos="fade-up"><a href='#gallery'><i className="fa-solid fa-images"></i> {lang.weddingbtn}</a></button>
                            </div>


                        </div>

                        <div className='flex flex-col justify-center invisible w-full sm:visible md:items-end' data-aos="fade-down">
                            <div className='p-10 bg-orange-200 rounded-l-full rounded-br-full shadow-lg'>
                                <img src={wedding} className='z-10 w-fit h-fit' alt='Wedding Ceremony Organizer'/>
                            </div>
                        </div>
                    </div>
                    {/* End of Wedding Ceremony Organizer */}   

                    {/* Translate Document */}
                    <div className='grid md:grid-cols-2 max-w-[1240px] m-auto rounded-full pt-8'>
                        <div className='flex flex-col justify-center w-full md:items-end' data-aos="fade-down">
                            <div className='p-10 bg-orange-200 rounded-r-full rounded-bl-full shadow-lg'>
                                <img src={translate} className='z-10 w-fit h-fit' alt='Translate Document'/>
                            </div>
                        </div>

                        <div className='flex flex-col justify-center w-full gap-5 py-0 md:items-start md:px-20 md:py-40'>

                            <h1 className='z-10 py-2 pl-2 text-5xl leading-tight text-bold' data-aos="fade-down">{lang.translate}</h1>
                            <div className='pl-2 pr-2 text-sm text-bold'>
                                <div data-aos="fade-down">
                                <span dangerouslySetInnerHTML={{__html: lang.translatedesc}}></span><br/>
                                </div>
                            </div>
                            <div className='flex flex-wrap gap-4 py-2 pr-2'>
                            <Emailbutton input={lang.email} contactForm={props.contactForm}/> <Longwabutton desc={lang.wa}/>
                            </div>
                        </div>

                    </div>
                    {/* End of Translate Document */}

                    {/* Travel Insurance */}            
                    <div className='grid md:grid-cols-2 max-w-[1240px] m-auto rounded-full pt-8'>

                        <div className='flex flex-col justify-center visible w-full md:items-end sm:hidden' data-aos="fade-down">
                            <div className='p-10 bg-orange-200 rounded-l-full rounded-br-full shadow-lg'>
                                <img src={travel} className='z-10 w-fit h-fit' alt='Travel Insurance'/>
                            </div>
                        </div>

                        <div className='flex flex-col justify-center w-full gap-5 py-0 md:items-start md:px-20 md:py-40'>

                            <h1 className='z-10 py-2 pl-2 text-5xl leading-tight text-bold' data-aos="fade-down">{lang.travel}</h1>
                            <h2 className='pl-2 text-sm text-bold' data-aos="fade-down">
                                <p className='text-md' dangerouslySetInnerHTML={{__html: lang.traveldesc}}></p><br />                                
                            </h2>

                            <div className='flex flex-wrap gap-4 py-2 pr-2' data-aos="fade-up">
                            <Emailbutton input={lang.email} contactForm={props.contactForm}/> <Longwabutton desc={lang.wa}/>
                            </div>


                        </div>

                        <div className='flex flex-col content-center justify-center invisible w-full md:items-end sm:visible' data-aos="fade-down">
                            <div className='p-10 bg-orange-200 rounded-l-full rounded-br-full shadow-lg'>
                                <img src={travel} className='z-10 w-fit h-fit' alt='Travel Insurance'/>
                            </div>
                        </div>
                    </div>
                    {/* End of Travel Insurance */}   
                    
                    {/* Other Services */}                     
                    <div className='grid md:grid-cols-2 max-w-[1240px] m-auto rounded-full pt-8'>
                        <div className='flex flex-col justify-center w-full md:items-end' data-aos="fade-down">
                            <div className='p-10 bg-orange-200 rounded-r-full rounded-bl-full shadow-lg'>
                                <img src={info} className='z-10 w-fit h-fit' alt='Other Services'/>
                            </div>
                        </div>

                        <div className='flex flex-col justify-center w-full gap-5 py-0 md:items-start md:px-20 md:py-40'>

                            <h1 className='z-10 py-2 pl-2 text-5xl leading-tight text-bold' data-aos="fade-down">{lang.others}</h1>
                            <div className='pl-2 pr-2 text-sm text-bold'>
                                <div data-aos="fade-down"><span dangerouslySetInnerHTML={{__html: lang.otherssub}}></span></div>
                                
                            </div>
                            <div className='flex flex-wrap gap-4 py-2 pr-2'>
                            <Emailbutton input={lang.email} contactForm={props.contactForm}/> <Longwabutton desc={lang.wa}/>
                            </div>
                        </div>

                    </div>
                    {/* End of Other Services */} 

                </div>
                {modal === true ? <Modal title={tempData[1]} desc={tempData[2]} hide={() => setModal(false)} /> : null}
            </section>
            <br />
        </>

    )
}

export default Services
