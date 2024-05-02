import React from "react";

function Button({value,name,buttonFunction}){
   return (<button value={value} onClick={(event)=>{ buttonFunction(event) }}>{name}</button>);
}

export default Button;