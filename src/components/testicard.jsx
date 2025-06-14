import AOS from 'aos';
import 'aos/dist/aos.css';

import React, { useEffect } from 'react'

export default function Testicard (props) {
    useEffect(() => {
        AOS.init();
    }, []);
    const clientName = props.clientName
    const email = props.email
    const desc = props.desc
    
    return (
        <div className='mx-3 md:mx-8'>
            <div className='flex mx-0 overflow-hidden bg-orange-300 shadow-lg h-96 md:h-60 md:mx-2 hover:shadow-xl rounded-xl font-Sora'>
                <div className='px-8 py-5 m-auto text-xs leading-relaxed text-center text-black md:text-sm md:text-md '>
                    {desc}
                </div>
                <div className='fixed bottom-0 px-8 py-5 bg-orange-200 rounded-xl'>
                <div className="flex items-center">
                    <div className='text-xs text-left text-black md:text-md'>
                        {clientName + ", " + email}
                    </div>
                </div>
                </div>
            </div>
        </div>
      )
}
