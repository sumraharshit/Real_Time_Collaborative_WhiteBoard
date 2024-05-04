import React, { useRef, useEffect, useState } from "react";
import UploadFile from './UploadFile';
import './style.css';
import Input from "./Input";
import { initSocket } from "./socket";
import { useNavigate,useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {fabric} from "fabric";
import Button from "./Button";

function Canvas(props) {
      
    const [clients, setClients] = useState([]);
    const socketRef = useRef(null);
    const location = useLocation();
    const {boardId} = useParams();
    const navigate = useNavigate();
    const [width,setWidth] = useState(1.0);

    const [drawing, setDrawing] = useState(false);
    const canvasRef = useRef(null);
    const [imageDraw,setImageDraw] = useState(null);
    const [displayText,setDisplayText] = useState(false);

    
    let shapeColor;
    function changeColour(event){
      let color = event.target.value;
      switch(color){
    
        case "#000000":
          shapeColor="#000000";
          break;
    
        case "#0000FF":
          shapeColor="#0000FF";
          break;
    
        case "#FF0000":
          shapeColor="#FF0000";
          break;
    
        case "#FFC0CB":
          shapeColor="#FFC0CB";
          break;
    
        case "#00FF00":
          shapeColor="#00FF00";
          break;
          
      }
    }
     
    function lineWidth(event){
        // let name = event.target.name;
        // let currentWidth = width;
        // if(name === "increase"){
        //    setWidth((prevWidth)=>prevWidth +1);  
        // }

        // else if(name === "decrease"){
        //   setWidth((prevWidth)=>prevWidth-1);
        //   }
        let name = event.target.name;
        if(name === 'increase')
        setWidth((prev)=>{return (prev<10 && prev+1)});

        else if(name === 'decrease')
          setWidth((prev)=>{return (prev>1 && prev-1)});
        }

    

    const handleImageUploadSuccess = (imageUrl) => {
        setImageDraw(imageUrl);

        socketRef.current.emit("image_update", {
            boardId,
            imageUrl,
          });
        };

    useEffect(()=>{
        const init = async()=>{
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error',(err)=> handleError(err));
            socketRef.current.on('connect_failed',(err)=> handleError(err));

            const handleError = (err)=>{
                console.log('socket error',err);
                toast.error("Socket connection failed");
                navigate("/");
            }
            socketRef.current.emit('join',{
                boardId,
                userName: location.state.userName,
            });

            socketRef.current.on('joined',({clients,userName, socketId})=>{

                if(userName !== location.state.userName){
                    toast.success(`${userName} joined`);
                }

                setClients(clients);
                
            });

            socketRef.current.on("disconnected", ({ socketId, userName }) => {
                toast.success(`${userName} left the board`);
                setClients((prev) => prev.filter((client) => client.socketId !== socketId));
              });

            socketRef.current.on("board_change", ({ code }) => {
                if (code !== null) {
                  if (canvasRef.current) {
                    const context = canvasRef.current.getContext('2d');
                    const image = new Image();
                    image.src = code;
                    image.onload = () => context.drawImage(image, 0, 0); 
                  }
                }
              });
                 
              socketRef.current.on("image_update", ({ imageUrl }) => {
                setImageDraw(imageUrl); 
              });
            };

            init();

        return ()=>{
            if(socketRef.current)
            {socketRef.current.disconnect();
            socketRef.current.off("joined");
            socketRef.current.off("disconneted");}
        }
    },[]);

    useEffect(()=>{

        const imageContext = canvasRef.current?.getContext('2d');
        if (imageContext && imageDraw)
       { const image = new Image();
                image.src = imageDraw;
                image.onload=()=>{
                    imageContext.drawImage(image,90,90,650,500);
                }}
            
    },[imageDraw])

        useEffect(() => {
            
            const canvas = canvasRef.current;
            if (!canvas) return;
            const context = canvas.getContext('2d');
            const rect = canvas.getBoundingClientRect();
          function handleDraw(event){
            setDrawing(true);

            context.beginPath();
            context.lineWidth = width;
            context.moveTo(event.clientX - rect.left,event.clientY - rect.top);
            context.stroke();  
            context.strokeStyle = shapeColor;
            context.fill();  
            canvas.dispatchEvent(new CustomEvent('canvasChange'));
        
       }

        function handleNotDraw(event){
          setDrawing(false);
          context.lineWidth = width;
          context.lineTo(event.clientX - rect.left+1,event.clientY - rect.top+1);
          context.stroke();
          context.strokeStyle = shapeColor;
          context.closePath();
         }

         function handleMoveDraw(event) {
              if(drawing){
                context.lineWidth = width;
                context.lineTo(event.clientX - rect.left+1,event.clientY - rect.top+1);
                context.strokeStyle = shapeColor;
                context.stroke();
              }
         }

       canvas.addEventListener('mousedown',
        
        handleDraw
          
        // BAAD MEIN OPTIMISE KRENGE!!  
        // context.beginPath();
        //     context.moveTo(event.clientX - rect.left,event.clientY - rect.top);
        //     context.stroke(); 
        //     canvas.dispatchEvent(new CustomEvent('canvasChange'));
       );

     canvas.addEventListener('mousemove', handleMoveDraw);
     

    //  DEKHTE H BAAD MEIN!!
    // canvas.addEventListener('mousemove', (event)=>{
    //   if(drawing){
    //     context.lineTo(event.clientX - rect.left+1,event.clientY - rect.top+1);
    //     context.stroke();
    //     canvas.dispatchEvent(new CustomEvent('canvasChange'));
    //   }

       
      canvas.addEventListener('mouseup', handleNotDraw);
      canvas.addEventListener('mouseleave', ()=>{
        setDrawing(false);
      });



       canvas.addEventListener('canvasChange', () => {
         const code = canvas.toDataURL(); 
    
        socketRef.current.emit("board_change", {
          boardId,
          code,
        });
      });

        return () => {
            canvas.removeEventListener('mousedown', ()=>{
                setDrawing(true);
            });
            
            canvas.removeEventListener('mousemove',handleMoveDraw)
            canvas.removeEventListener('mouseup', handleNotDraw);
            canvas.removeEventListener('mouseleave', handleNotDraw);

        };


    }, [drawing]); 



    return (
        <div>
            <button onClick={() => {
                setDrawing(!drawing);
            }}>click</button>
            <button onClick={()=>{
               setDisplayText(!displayText)
            }} >ADD TEXT</button>
            <button value={width} name="increase" onClick={lineWidth}/>
            <button value={width} name="decrease" onClick={lineWidth}/>
            <canvas ref={canvasRef} 
            className="canvas" height={props.height} width={props.width} id={props.id}/>
            <UploadFile imageSource={handleImageUploadSuccess}/>
            <Button value="#000000" name="Black" buttonFunction={changeColour}/>
            <Button value="#0000FF" name="Blue"  buttonFunction={changeColour}/>
            <Button value="#FF0000" name="Red" buttonFunction={changeColour}/>
            <Button value="#FFC0CB" name="Pink" buttonFunction={changeColour}/>
            <Button value="#00FF00" name="Green" buttonFunction={changeColour}/>
             {displayText && <Input placeholder="Add a text"/>}
        </div>
    );
}

export default Canvas;
