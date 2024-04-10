import React from "react";
import ReactDOM from "react";
import {useState} from "react";


function Input(){
      const [text,setText] = useState("");

      function changeText(event){
        const newText = event.target.value
        setText(newText);
        console.log(text);
      }

    return (
        <input type="text" onChange={changeText} placeholder="Add a text" value={text}/>
    )
}

export default Input;