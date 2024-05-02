import React from "react";
import Canvas from "./Canvas";
import {useState} from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Home from "./Home";



function App() {
  // const [canvasNumber,setCanvasNumber] = useState([0]);


  // function addCanavas(){
  //   setCanvasNumber((prevValue)=>{
  //     return ([...prevValue,0]);
  //   })
  // }

  // document.addEventListener('scroll',(event)=>{
  //     if(window.scrollY%70===0){
  //        addCanavas();
  //     }
  // }) 
   

  return (
    <div className="App">
      {/* <button onClick={addCanavas}>+</button> */}
      <h1>Canvas is Present</h1>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* <Route path="/whiteboard/:boardId" element={canvasNumber.map((note,index)=>{
         return (<Canvas key={index} height={700}
         width={1000}/>); */}

         <Route path="/whiteboard/:boardId" element={
          <Canvas height={700}
          width={1000}  id="Canvas"/>}/>
          </Routes> 
          </BrowserRouter>
      <Toaster position="top-center"></Toaster>
      
      
     
     {/* {canvasNumber.map((note,index)=>{
         return (<Canvas key={index} height={700}
         width={1000}/>);
       
     })} */}

     {/* <Input /> */}
     
    </div>
  );
}

export default App;
