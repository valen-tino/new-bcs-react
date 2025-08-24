import React from 'react'

export default function NotifModal({visible,onClose,pic,png,title,desc,sub}){

if(!visible) return null;

  return (
    <div>
        <div className="sticky inset-0 z-50 flex items-center overflow-x-hidden overflow-y-auto text-left outline-none font-Sora focus:outline-none">
            <div className="relative w-auto max-w-3xl mx-auto my-6 y">
              <div className="relative flex flex-col w-full bg-orange-100 border border-orange-500 outline-none focus:outline-none rounded-xl" data-aos="fade-down">
                <div className="relative flex-auto p-2">
                  <button 
                    className='my-2 min-h-[44px] min-w-[44px] flex items-center justify-center bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full shadow-md hover:shadow-lg transition-all duration-200 touch-manipulation'
                    onClick={onClose}
                    aria-label="Close notification"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                    <picture className='rounded-xl'>
                      <source srcset={pic} type="image/webp"/>
                      <img src={png} alt={pic}/>
                    </picture>

                  <h1 className='text-2xl'>{title}</h1><br/>
                  <h2>{sub}</h2>
                  <p className='text-sm md:text-md'>{desc}</p>
                </div>

              </div>
            </div>
        </div>
    </div>

  )
}
