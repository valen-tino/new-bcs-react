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

    const lang = servicesData && uiText?.services ? 
        (props.language === "Indonesia" ? servicesData.Indonesia : servicesData.English) : 
        (props.language === "Indonesia" ? {
            vaa: "Visa Assistance Abroad",
            vaadesc: "We provide visa assistance for various countries including Schengen, UK, USA, Australia, Japan, Korea, and more. Our experienced team will guide you through the entire process.",
            vaasub: "Select a country to see requirements",
            vab: "Visa Assistance in Bali",
            vabdesc: "We also offer visa assistance services in Bali, Indonesia. Our services range from helping you apply for a visa to providing the necessary documents for your application.",
            wedding: "Wedding Ceremony Organizer",
            weddingsub: "Make your special day unforgettable",
            weddingdesc: "We provide comprehensive wedding ceremony organization services in Bali, including legal documentation, venue selection, and coordination with local authorities.",
            weddingsub2: "Contact us for more details",
            weddingbtn: "View Gallery",
            translate: "Translation Documents",
            translatedesc: "BCS will provide translation services for any documents into any languages with certified translators.",
            translatedesc2: "Provided by Sworn Translation Services in Indonesia for various languages including English, Chinese, Japanese, Korean, German, Arabic, and more.",
            suchas: "such as:",
            travel: "Travel Insurance",
            traveldesc: "Protect your journey with comprehensive travel insurance coverage.",
            travelsub: "Travel with peace of mind",
            traveldesc2: "We partner with",
            ck: "Chubb Insurance",
            traveldesc3: "to provide you with reliable travel insurance coverage.",
            others: "Other Services",
            otherssub: "We also provide additional services",
            contactus: "Contact Us",
            email: "Email Us",
            wa: "WhatsApp Us"
        } : {
            vaa: "Visa Assistance Abroad",
            vaadesc: "We provide visa assistance for various countries including Schengen, UK, USA, Australia, Japan, Korea, and more. Our experienced team will guide you through the entire process.",
            vaasub: "Select a country to see requirements",
            vab: "Visa Assistance in Bali",
            vabdesc: "We also offer visa assistance services in Bali, Indonesia. Our services range from helping you apply for a visa to providing the necessary documents for your application.",
            wedding: "Wedding Ceremony Organizer",
            weddingsub: "Make your special day unforgettable",
            weddingdesc: "We provide comprehensive wedding ceremony organization services in Bali, including legal documentation, venue selection, and coordination with local authorities.",
            weddingsub2: "Contact us for more details",
            weddingbtn: "View Gallery",
            translate: "Translation Documents",
            translatedesc: "BCS will provide translation services for any documents into any languages with certified translators.",
            translatedesc2: "Provided by Sworn Translation Services in Indonesia for various languages including English, Chinese, Japanese, Korean, German, Arabic, and more.",
            suchas: "such as:",
            travel: "Travel Insurance",
            traveldesc: "Protect your journey with comprehensive travel insurance coverage.",
            travelsub: "Travel with peace of mind",
            traveldesc2: "We partner with",
            ck: "Chubb Insurance",
            traveldesc3: "to provide you with reliable travel insurance coverage.",
            others: "Other Services",
            otherssub: "We also provide additional services",
            contactus: "Contact Us",
            email: "Email Us",
            wa: "WhatsApp Us"
        })

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
                                {lang.weddingsub}<br/><br/>{lang.weddingdesc}
                            </h2>
                            <h3 className='pl-2 text-lg text-bold' data-aos="fade-down">{lang.weddingsub2}</h3>
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
                                {lang.translatedesc}&nbsp;{lang.suchas}<br/><br/>
                                </div>


                                <div className="flex flex-col">
                                    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                                        <div className="inline-block min-w-full sm:px-6 lg:px-8 ">
                                            <div className="overflow-hidden">
                                                <table className="min-w-full text-center">

                                                    <tbody className='text-left'>
                                                        <tr data-aos="fade-down">
                                                            <td className="py-1 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                                - KTP / ID CARD
                                                            </td>
                                                            <td className="py-1 text-sm font-light text-gray-900 whitespace-nowrap">
                                                                -Akte Nikah / <br />Marriage Certifcate
                                                            </td>
                                                        </tr>
                                                        <tr data-aos="fade-down">
                                                            <td className="py-1 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                                - IJAZAH / Diploma Certificate
                                                            </td>
                                                            <td className="py-1 text-sm font-light text-gray-900 whitespace-nowrap">
                                                                - Akte Nikah 
                                                            </td>
                                                        </tr>
                                                        <tr data-aos="fade-down">
                                                            <td className="py-1 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                                - Transkrip Nilai /<br/>Academic Transcripts
                                                            </td>
                                                            <td className="py-1 text-sm font-light text-gray-900 whitespace-nowrap">
                                                                - Akte Cerai / Divorce Certificate
                                                            </td>
                                                        </tr>
                                                        <tr data-aos="fade-down">
                                                            <td className="py-1 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                                - Akte Lahir / <br/>Birth Certificate
                                                            </td>
                                                            <td className="py-1 text-sm font-light text-gray-900 whitespace-nowrap">
                                                                - Akte Jual Beli /<br/>Notary document
                                                            </td>
                                                        </tr>
                                                        <tr data-aos="fade-down">
                                                            <td className="py-1 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                                - SKCK / Police Clearence certificate
                                                            </td>
                                                            <td className="py-1 text-sm font-light text-gray-900 whitespace-nowrap">
                                                                - Keterangan Belum Nikah/ <br/>Single Certificate
                                                            </td>
                                                        </tr>
                                                        <tr data-aos="fade-down">
                                                            <td className="py-1 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                                - Surat Wali Hakim/
                                                            </td>
                                                            <td className="py-1 text-sm font-light text-gray-900 whitespace-nowrap">
                                                                - Surat Penetapan Pengadilan <br/>Wali/Pengampu
                                                            </td>
                                                        </tr>
                                                        <tr data-aos="fade-down">
                                                            <td className="py-1 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                                - Surat Rekom BPJS
                                                            </td>
                                                            <td className="py-1 text-sm font-light text-gray-900 whitespace-nowrap">
                                                                - Surat Penetapan Pengadilan <br/>Anak Angkat
                                                            </td>
                                                        </tr>
                                                        <tr data-aos="fade-down">
                                                            <td className="py-1 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                                - Surat Kuasa Asuh Anak
                                                            </td>
                                                            <td className="py-1 text-sm font-light text-gray-900 whitespace-nowrap">
                                                                - Surat Penetapan Pengadilan <br/>Anak Angkat
                                                            </td>
                                                        </tr>
                                                        <tr data-aos="fade-down">
                                                            <td className="py-1 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                                - Kartu Keluarga / <br/>Family Card
                                                            </td>
                                                            <td className="py-1 text-sm font-light text-gray-900 whitespace-nowrap">
                                                                - Surat Penetapan Pengadilan <br/>Hak Asuh Anak
                                                            </td>
                                                        </tr>
                                                        <tr data-aos="fade-down">
                                                            <td className="py-1 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                                - Akte lahir / <br/>Birth Certificate
                                                            </td>
                                                            <td className="py-1 text-sm font-light text-gray-900 whitespace-nowrap">
                                                                - Surat Penetapan Pengadilan <br/>Hak Asuh Anak
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br />
                                <div data-aos="fade-down">
                                {lang.translatedesc2}
                                </div>
                            </div>

                            <h1 className='pl-2 pr-2 text-lg text-bold' data-aos="fade-down">{lang.contactus}</h1>
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
                                <p className='text-md'>{lang.traveldesc}</p><br />
                                <p className='text-2xl'><u>All you need to know to travel smarter.</u></p><br/>
                                {lang.travelsub}<br/><br/>
                                {lang.traveldesc2}&nbsp;<button className='px-3 py-1 bg-orange-500 text-white rounded-md shadow-sm hover:bg-orange-600 transition-colors duration-200'><a href='//www.chubb.com/id-en/personal/travel-insurance.html'>{lang.ck}</a></button><br/><br/>
                                {lang.traveldesc3}
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
                                <div data-aos="fade-down">{lang.otherssub}&nbsp;{lang.suchas}</div>

                                <div className="flex flex-col">
                                    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                                        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8 ">
                                            <div className="overflow-hidden">
                                                <table className="min-w-full text-center">
                                                    <tbody className='text-left'>
                                                        <tr data-aos="fade-down">
                                                            <td className="py-1 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                            - Cetak KTP 
                                                            </td>
                                                            <td className="py-1 text-sm font-light text-gray-900 whitespace-nowrap">
                                                            - Akte Lahir Elektronik
                                                            </td>
                                                        </tr>
                                                        <tr data-aos="fade-down">
                                                            <td className="py-1 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                            - KK Elektronik
                                                            </td>
                                                            <td className="py-1 text-sm font-light text-gray-900 whitespace-nowrap">
                                                            - Akte Cerai
                                                            </td>
                                                        </tr>
                                                        <tr data-aos="fade-down">
                                                            <td className="py-1 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                            - Surat Pengakuan <br/>Anak
                                                            </td>
                                                            <td className="py-1 text-sm font-light text-gray-900 whitespace-nowrap">
                                                            - SKTT untuk WNA
                                                            </td>
                                                        </tr>
                                                        <tr data-aos="fade-down">
                                                            <td className="py-1 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                            - Pelaporan <br/>perkawinan<br/>campur
                                                            </td>
                                                            <td className="py-1 text-sm font-light text-gray-900 whitespace-nowrap">
                                                            -  Samsat motor dan <br/> mobil khusus wilayah <br/> Denpasar, Badung <br/>dan Gianyar
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br />
                                
                            </div>

                            <h1 className='pl-2 pr-2 text-lg text-bold' data-aos="fade-down">{lang.contactus}</h1>
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
