import AOS from 'aos';
import 'aos/dist/aos.css';

import React, { useEffect } from 'react'

export default function teamCard (props) {
    useEffect(() => {
        AOS.init();
    }, []);
    const name = props.name
    const title = props.title
    const desc = props.desc
    const rawPath = props.path || ''
    const path = (rawPath.startsWith('http') || rawPath.includes('/')) ? rawPath : `team/${rawPath}`
  
    return (
    <>
        <div className="basis-1/3" data-aos="fade-up">
            <div className="flex flex-col justify-center w-auto mx-auto transition duration-300 ease-in-out delay-150 bg-orange-100 shadow-lg hover:shadow-xl md:w-96 rounded-2xl hover:-translate-y-0 hover:scale-110">
                <img className="object-cover object-center w-auto h-auto aspect-square md:w-96 rounded-t-2xl" src={path} alt={name}/>
                <div className="p-6">
                    <small className="text-gray-800 text-md">{title}</small>
                    <h1 className="pb-2 text-2xl font-medium text-gray-800">{name}</h1>
                    <p className="leading-6 text-gray-500 text">{desc}</p>
                </div>
            </div>
         </div>
    </>

  )}
