import AOS from 'aos';
import 'aos/dist/aos.css';

import React from 'react'

import TeamCard from '../../components/teamcard'
import { Pattern } from '../all/allpics'
import { OurTeam } from '../all/alldata'

import { content } from './content';

function Team (props){

  const lang = props.language === "Indonesia" ? (content.Indonesia) : (content.English);
  
  AOS.init();
  return (
    <div>
      <section id='about'>
        <div className='relative flex flex-col justify-between w-full font-Sora rounded-3xl' id='hero'>
        <img className='absolute z-0 invisible md:bottom-0 md:right-0 md:visible' src={Pattern} alt="deco-only" data-aos="fade-up" />
            <div className='grid bg-orange-200 md:grid-cols-2'>
                <div className='flex flex-col justify-center w-full px-5 pt-16 pb-6 md:pt-20 md:pl-10 md:items-start'>
                    <h1 className='z-10 py-2 text-5xl leading-tight text-bold' data-aos="fade-up"><i className="fa-solid fa-people-group"></i> {lang.heading}</h1><br/>
                    <div className="z-10 flex flex-col gap-10 md:flex-row">
                        {OurTeam.OurTeam.map((item,key) => {
                             return (
                                <TeamCard key={key} name={item.name} title={item.title} desc={item.desc} path={item.path}/>
                             )
                         })}
                    </div>
                </div>

            </div>
        </div>
        </section>
    </div>
  )
}

export default Team
