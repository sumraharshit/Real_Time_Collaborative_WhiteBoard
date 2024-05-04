import React from "react";
import './style.css'

function Button({value,name,buttonFunction}){
   return (<button value={value} style={{backgroundColor: value}} onClick={(event)=>{ buttonFunction(event) }}  className="button" >{name}</button>);
}

export default Button;