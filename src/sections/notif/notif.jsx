import React from 'react'
import { useState } from 'react'
import  NotifModal from '../../components/NotifModal'
import { NotifContent,NotifPNG,NyepiContent,NyepiPNG } from '../all/allpics'
import { content } from './content'

export default function Notif(props){

const [showInfo,setShowInfo] = useState(false)
const handleOnClose = () => setShowInfo(false)
const lang = props.language === "Indonesia" ? (content.Indonesia) : (content.English);

  return (
    <>
        <div className="items-center py-2 mx-0 text-center text-white uppercase bg-red-500 rounded-b-2xl font-Sora md:mx-2" data-aos="fade-down">
          {lang.update} &nbsp;
          <button onClick={() => setShowInfo(true)}>{lang.ck}</button>
        </div>
        
        <NotifModal 
        onClose={handleOnClose} 
        visible={showInfo} 

        // Note : Change from NyepiContent & NyepiPNG to NotifContent & NotifPNG at January 24th 
        pic={NotifContent}
        png={NotifPNG}/>
    </>
  )
}


