import React from 'react'
import { useState } from 'react'
import NotifModal from '../../components/NotifModal'
import { NotifContent, NotifPNG, NyepiContent, NyepiPNG } from '../all/allpics'
import { useCMS } from '../../contexts/CMSContext'
import { useNotification } from '../../contexts/NotificationContext'

export default function Notif(props){
const { uiText } = useCMS();
const [showInfo,setShowInfo] = useState(false)
const handleOnClose = () => setShowInfo(false)
const { activeNotification } = useNotification()

// Use active notification if available, otherwise fall back to CMS uiText
const lang = activeNotification 
  ? (props.language === "Indonesia" ? activeNotification.Indonesia : activeNotification.English)
  : uiText?.notif?.[props.language] || {
    update: "Important Update",
    ck: "Click here",
    title: "Notification",
    sub: "Important Notice",
    desc: "Please check our latest updates and announcements."
  };

  return (
    <>
        <div className="items-center py-2 mx-0 text-center text-white uppercase bg-red-500 rounded-b-2xl font-Sora md:mx-2" data-aos="fade-down">
          {lang.update} &nbsp;
          <button 
            onClick={() => setShowInfo(true)}
            className="min-h-[44px] min-w-[44px] px-3 py-2 touch-manipulation underline hover:no-underline transition-all duration-200"
            aria-label="Open notification details"
          >
            {lang.ck}
          </button>
        </div>
        
        <NotifModal 
        onClose={handleOnClose} 
        visible={showInfo} 
        title={lang.title}
        sub={lang.sub}
        desc={lang.desc}
        pic={activeNotification && activeNotification.imageType === 'nyepi' ? NyepiContent : NotifContent}
        png={activeNotification && activeNotification.imageType === 'nyepi' ? NyepiPNG : NotifPNG}/>
    </>
  )
}


