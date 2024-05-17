import React, { useRef, useEffect, useState } from "react";
import UploadFile from './UploadFile';
import './style.css';
import './styleCanvas.css';
import { initSocket } from "./socket";
import { useNavigate,useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "./Button";
import { MdDraw } from "react-icons/md";
import { AiOutlineClear } from "react-icons/ai";
import { FaImage,FaRegSquareMinus } from "react-icons/fa6";
import { FaRegPlusSquare,FaMicrophoneAlt,FaUndoAlt } from "react-icons/fa";


function Canvas(props) {
      

    const [clients, setClients] = useState([]);
    const socketRef = useRef(null);
    const location = useLocation();
    const {boardId} = useParams();
    const navigate = useNavigate();
    const [width,setWidth] = useState(1.0);
    const [startDrawing,setStartDrawing] = useState(true);

    const [drawing, setDrawing] = useState(false);
    const canvasRef = useRef(null);
    const [imageDraw,setImageDraw] = useState(null);

    const [points,setPoints]=useState([]);
    const [pcollection,setPCollection] = useState([]);
    
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
            if(startDrawing)
       {
            setDrawing(true);
            context.beginPath();
            context.lineWidth = width;
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top
            context.moveTo(x,y);
            context.stroke();  
            context.strokeStyle = shapeColor;
            setPoints((prev)=>{
              return ([...prev,{x, y, size: width, color: shapeColor, mode: "draw"}]);
            });
            }
            canvas.dispatchEvent(new CustomEvent('canvasChange'));
       }

        function handleNotDraw(event){
         if(startDrawing)
          {setDrawing(false);
          context.lineWidth = width;
          const x = event.clientX - rect.left+1;
          const y = event.clientY - rect.top+1;
          context.lineTo(x,y);
          context.stroke();
          context.strokeStyle = shapeColor;
          context.closePath();
          setPoints((prev)=>{
            return ([...prev,{x, y, size: width, color: shapeColor, mode: "draw"}]);
          });
          console.log(points);}
          setPCollection((prev)=>{
            return([...prev,points]);
          });
          console.log(pcollection);
          canvas.dispatchEvent(new CustomEvent('canvasChange'));
         }

         function handleMoveDraw(event) {
              if(startDrawing && drawing){
                context.lineWidth = width;
                const x = event.clientX - rect.left+1;
                const y = event.clientY - rect.top+1;
                context.lineTo(x,y);
                context.strokeStyle = shapeColor;
                context.stroke();
                setPoints((prev)=>{
                  return ([...prev,{x, y, size: width, color: shapeColor, mode: "draw"}]);
                });
               
                console.log(points);
              }
              canvas.dispatchEvent(new CustomEvent('canvasChange'));
         }

      canvas.addEventListener('mousedown', handleDraw);

     canvas.addEventListener('mousemove', handleMoveDraw);
     
       
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


    }, [drawing, startDrawing]); 


    useEffect(() => {
      
      const canvas = canvasRef.current;
      if (!canvas) return;

      const handleCanvasChange = () => {
          const code = canvas.toDataURL();
          socketRef.current.emit('board_change', { boardId, code });
      };

      canvas.addEventListener('canvasChange', handleCanvasChange);

      return () => {
          canvas.removeEventListener('canvasChange', handleCanvasChange);
      };
  }, [boardId]);

    
  function clearCanvas(){
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.dispatchEvent(new CustomEvent('canvasChange'));
  }

  function redraw(){
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if(pcollection.length===0)
      return;

    context.clearRect(0,0,canvas.width,canvas.height);
     pcollection.forEach(points=>{

      for(let i=0;i<points.length;i++){
        let point = points[i];
  
        let begin = false;
  
        if(context.lineWidth !== point.size){
             context.lineWidth = points.size;
             begin = true;
        }
  
        if(context.strokeStyle !== point.color)
          {
            context.strokeStyle = point.color;
            begin = true;
          }
  
          if(point.mode === "begin" || begin)
            {
              context.beginPath();
              context.moveTo(point.x,point.y);
            }
            
            if(point.mode==="draw")
            {context.lineTo(point.x,point.y);}
  
            if(point.mode === "end" || (i===points.length-1))
              {
                context.stroke();
              }

              context.stroke();
      }

     });
    
    
  }

  function undo() {
    pcollection.pop();
    redraw();
  }

    return (
        <div className="canvasPage">
          <div className="column left">
          <h1>Users Online:</h1>
        
          {clients.map((client) => (
            <div key={client.socketId} className="users"><div class="box">{client.userName.charAt(0)}</div><h2>{client.userName}</h2></div>
          ))}
        
          </div>
          <div className="column right">
            <canvas ref={canvasRef}   
            className="canvas" height={props.height} width={props.width}/>  
        </div>
        <div className="tools">
        <button style={{backgroundColor: "#243b55"}} className="button"><FaMicrophoneAlt size="20"/></button>
         <UploadFile imageSource={handleImageUploadSuccess} id="uploadedImage"/>
            {/* NEED TO TRY TO CHANGE The color Button elements*/}
            <Button value="#000000" name="Black" buttonFunction={changeColour}/>  
            <Button value="#0000FF" name="Blue"  buttonFunction={changeColour}/>
            <Button value="#FF0000" name="Red" buttonFunction={changeColour}/>
            <Button value="#FFC0CB" name="Pink" buttonFunction={changeColour}/>
            <Button value="#00FF00" name="Green" buttonFunction={changeColour}/>
            <button style={{backgroundColor: "#243b55"}} className="button" value={width} name="decrease" onClick={lineWidth}><FaRegSquareMinus size="20"/></button>
            <button style={{backgroundColor: "#243b55"}} className="button" value={width} name="increase" onClick={lineWidth}><FaRegPlusSquare  size="20"/></button>
           
            <button style={{backgroundColor: "#243b55"}} className="button" onClick={() => {
               setStartDrawing(prev => !prev);
           }}><MdDraw size="20"/></button>
           <button style={{backgroundColor: "#243b55"}} className="button" onClick={clearCanvas}><AiOutlineClear size="20"/></button>
           <button style={{backgroundColor: "#243b55"}} className="button" onClick={undo}><FaUndoAlt size="20"/></button>
        </div>
        </div>
    );
}

export default Canvas;
