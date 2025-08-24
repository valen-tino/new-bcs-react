import React from "react"

export default function Whatsapp () {
return(
    <>
    <a 
        href="https://wa.me/628123666187" 
        className="bg-green-600 whatsapp_float" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Contact us via WhatsApp"
    >
        <i className="fa fa-whatsapp whatsapp-icon" aria-hidden="true"></i>
    </a>
    </>
)
}