import React from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom';
import {v4 as uuidv4} from 'uuid';
import Input from './Input';
import toast from 'react-hot-toast';
import {useNavigate} from "react-router-dom";

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
       
       navigate(`/whiteboard/${uniqueId}`, {state: userName});
       toast.success("Joined Board Successfully!")
    }

    return (
        <div>
            <Input placeholder="Enter the Board Id" value={uniqueId} changeFunction={writeId}/>
            <Input placeholder="Enter the UserName" value={userName} changeFunction={writeUserName}/>
             <button onClick={generateUniqueId}>Create A New Board Room</button>
             <button onClick={joinBoard}>JOIN BOARD</button>
        </div>
    )
}

export default Home;