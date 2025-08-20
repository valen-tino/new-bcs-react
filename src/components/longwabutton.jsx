import React from 'react'

export default function Longwabutton (props) {

const desc = props.desc

  return (
    <button className='px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors duration-200 mr-2'>
        <a href="https://wa.me/628123666187" rel="noopener noreferrer" className="text-white">
            <i className="fa-brands fa-whatsapp"></i>&nbsp;
            {desc}
        </a>
    </button>
  )
}
