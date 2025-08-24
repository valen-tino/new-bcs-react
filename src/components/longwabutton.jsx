import React from 'react'

export default function Longwabutton (props) {

const desc = props.desc

  return (
    <button className='px-6 py-3 min-h-[44px] min-w-[44px] bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors duration-200 mr-2 font-Sora touch-manipulation'>
        <a href="https://wa.me/628123666187" rel="noopener noreferrer" className="text-white flex items-center gap-2">
            <i className="fa-brands fa-whatsapp"></i>
            <span>{desc}</span>
        </a>
    </button>
  )
}
