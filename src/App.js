import React from "react";
import { ReactDOM } from 'react';
import Canvas from "./Canvas";
import {useState} from "react";



function App() {
  const [canvasNumber,setCanvasNumber] = useState([0]);


  function addCanavas(){
    setCanvasNumber((prevValue)=>{
      return ([...prevValue,0]);
    })
  }

  // document.addEventListener('scroll',(event)=>{
  //     if(window.scrollY%70===0){
  //        addCanavas();
  //     }
  // }) 
   

  return (
    <div className="App">
      <h1>Canvas is Present</h1>
      <button onClick={addCanavas}>+</button>
     
     {canvasNumber.map((note,index)=>{
         return (<Canvas key={index} height={700}
         width={400}/>);
       
     })}

     {/* <Input /> */}
     
    </div>
  );
}

export default App;
