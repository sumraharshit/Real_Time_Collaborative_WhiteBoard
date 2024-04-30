import React, { useRef, useEffect, useState } from "react";
import UploadFile from './UploadFile';
import './style.css';
import Input from "./Input";
import { initSocket } from "./socket";
import { useNavigate,useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";

function Canvas(props) {
      
    const [clients, setClients] = useState([]);
    const socketRef = useRef(null);
    const location = useLocation();
    const {boardId} = useParams();
    const navigate = useNavigate();

    const [drawing, setDrawing] = useState(false);
    const canvasRef = useRef(null);
    const [imageDraw,setDrawImage] = useState(null);
    const [displayText,setDisplayText] = useState(false);

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

            socketRef.current.on("disconnected",({socketId,userName})=>{
                toast.success(`${userName} left the board`);
                setClients((prev)=>{
                    return prev.filter((client)=>client.socketId != socketId);
                })
            });

            socketRef.current.on("board_change", ({ code }) => {
                if (code !== null) {
                  if (canvasRef.current) {
                    const image = new Image();
                    image.src = code;
                    image.onload = () => {
                      const context = canvasRef.current.getContext('2d');
                      context.drawImage(image, 0, 0);
                    };
                  }
                }
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
 
          function handleDraw(event){
           if(drawing)
            { const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            context.beginPath();
            context.arc(x,y,4,-1,2*Math.PI);
            context.fillStyle = 'black'; 
            context.stroke();  
            context.fill();  
            canvas.dispatchEvent(new CustomEvent('canvasChange'));
        }
        }

       canvas.addEventListener('mousedown', ()=>{
        setDrawing(true);
       });

       canvas.addEventListener('mousemove', handleDraw);
       
       function handleNotDraw(){
        setDrawing(false);
       }
       
       canvas.addEventListener('mouseup', handleNotDraw);
       canvas.addEventListener('mouseleave', handleNotDraw);



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
            
            canvas.removeEventListener('mousemove', handleDraw);
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
            <canvas ref={canvasRef} 
            className="canvas" height={props.height} width={props.width}/>
            <UploadFile imageSource={setDrawImage}/>
             {displayText && <Input placeholder="Add a text"/>}
        </div>
    );
}

export default Canvas;
