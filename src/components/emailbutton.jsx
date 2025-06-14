import React from 'react'

export function Emailbutton (props) {
const input = " " + props.input

  return (
    <>
        <button className='px-8 py-3 ' onClick={props.contactForm}>
            <i className="fa-solid fa-envelope"></i>{input}
        </button>
    
    </>
    
  )
}
