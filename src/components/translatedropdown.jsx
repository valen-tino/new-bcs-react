import React from "react";

function TranslateDropdown(props){

const value = props.value
let change = props.change

    return(
        <select
                className="px-2 ml-2 text-white bg-orange-300 rounded-full custom-select"
                value={value}
                onChange={change}
              >
                <option value="en">English</option>
                <option value="id">Indonesia</option>
              </select>
    )
}

export default TranslateDropdown