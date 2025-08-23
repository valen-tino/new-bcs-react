import AOS from 'aos';
import 'aos/dist/aos.css';

import React, { useEffect } from 'react'

import TeamCard from '../../components/teamcard'
import { Pattern } from '../all/allpics'
import { useCMS } from '../../contexts/CMSContext'
import dataTeam from '../../data/dataTeam'

function Team (props){

  const { team: cmsTeam, uiText } = useCMS();
  
  // Use CMS data if available, otherwise fall back to static data
  const team = (cmsTeam && cmsTeam.length > 0) ? cmsTeam : dataTeam.OurTeam;
  
  const lang = uiText?.team?.[props.language] || {
    heading: "Our Team"
  };
  
  useEffect(() => {
    AOS.init();
  }, []);
  
  return (
    <div>
      <section id='team'>
        <div className='relative flex flex-col justify-between w-full font-Sora rounded-3xl' id='hero'>
        <img className='absolute z-0 invisible md:bottom-0 md:right-0 md:visible' src={Pattern} alt="deco-only" data-aos="fade-up" />
            <div className='grid bg-orange-200 md:grid-cols-2'>
                <div className='flex flex-col justify-center w-full px-5 pt-16 pb-6 md:pt-20 md:pl-10 md:items-start'>
                    <h1 className='z-10 py-2 text-5xl leading-tight text-bold' data-aos="fade-up"><i className="fa-solid fa-people-group"></i> {lang.heading}</h1><br/>
                    <div className="z-10 flex flex-col gap-10 md:flex-row">
                        {team.map((item,key) => {
                             // Handle both CMS data structure and static data structure
                             const name = item.name || '';
                             const title = item.position || item.title || '';
                             const desc = item.description || item.desc || '';
                             const path = item.image || item.path || '';
                             return (
                                <TeamCard key={key} name={name} title={title} desc={desc} path={path}/>
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