import React from 'react';
import { useState } from 'react';
import {v4 as uuidv4} from 'uuid';
import toast from 'react-hot-toast';
import {useNavigate} from "react-router-dom";
import './style.css';

function Home(){
    const navigate = useNavigate();
    
   const [uniqueId,setUniqueId] = useState("");
   const [userName,setUserName] = useState("");

   function writeId(event){
    let newId = event.target.value
    setUniqueId(newId);

  }

  function writeUserName(event){
      setUserName(event.target.value);
  }

   function generateUniqueId(event){
     event.preventDefault();
     let id = uuidv4();
     toast.success('New Board ID Succesfully Generated!');
     setUniqueId(id);
    }

    function joinBoard(){
       if(!uniqueId || !userName){
        toast.error("Fill the Fields");
        return;
       }
       
       navigate(`/whiteboard/${uniqueId}`, {state: {userName: userName}});
       toast.success("Joined Board Successfully!")
    }

    return (
        <div className='home-details'>
            <h1>UNLEASH YOUR IDEAS AND CREATIVITY
            </h1>
            <input className="input" placeholder="Enter the Board Id" value={uniqueId} onChange={writeId}/>
            <input className="input" placeholder="Enter the UserName" value={userName} onChange ={writeUserName}/>
             <div><button className="button" onClick={generateUniqueId} style={{fontSize: "20px"}}>Create A New Board Room</button>
             <button className="button" style={{backgroundColor: "green", fontSize: "20px"}} onClick={joinBoard}>JOIN BOARD</button></div>
        </div>
    )
}

export default Home;