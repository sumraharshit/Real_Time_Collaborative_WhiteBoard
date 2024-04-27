import React from "react";
import ReactDOM from "react";


function Input(props){

    
    return (
        <input type="text" placeholder={props.placeholder} value={props.value} onChange={props.changeFunction}/>
    )
}

export default Input;