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
                    className='my-2 min-h-[44px] min-w-[44px] flex items-center justify-center bg-white hover:bg-gray-50 text-gray-800 hover:text-gray-900 rounded-full shadow-md hover:shadow-lg transition-all duration-200 touch-manipulation focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'
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

                  <h2 className='text-2xl font-bold text-gray-900 mb-2'>{title}</h2>
                  <h3 className='text-lg font-semibold text-gray-800 mb-3'>{sub}</h3>
                  <p className='text-sm md:text-base text-gray-800 leading-relaxed'>{desc}</p>
                </div>

              </div>
            </div>
        </div>
    </div>

  )
}
