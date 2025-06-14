import React from 'react'

export default function Longwabutton (props) {

const desc = props.desc

  return (
    <button className='px-8 py-3 mr-2 whatsapp'>
        <a href="https://wa.me/628123666187" rel="noopener noreferrer">
            <i className="fa-brands fa-whatsapp"></i>&nbsp;
            {desc}
        </a>
    </button>
  )
}
