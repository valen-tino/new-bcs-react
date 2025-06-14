import React from 'react'

export default function Link (props){
const to = props.to
const name = props.name
const icon = "pr-1 " + props.icon

const isFooter = props.isFooter

let iconState = isFooter ? icon : "pr-0";
let classes = isFooter ? "navlinks flex items-center justify-center gap-1.5 sm:justify-start" : "navlinks";
let fontColor = isFooter ? "text-gray-700" : "text-black";

  return (
    <>   
        <li>
            <a className={classes} target="_self" rel="noreferrer" href={to}>
                <i className={iconState}></i>
                <span className={fontColor}>{name}</span>
            </a>
        </li>  
    </>
  )};
