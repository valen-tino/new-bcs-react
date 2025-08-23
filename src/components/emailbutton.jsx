import React from 'react'

export function Emailbutton (props) {
const input = " " + props.input

  return (
    <>
        <button className='px-6 py-3 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 transition-colors duration-200 font-Sora' onClick={props.contactForm}>
            <i className="fa-solid fa-envelope"></i>{input}
        </button>
    
    </>
    
  )
}
