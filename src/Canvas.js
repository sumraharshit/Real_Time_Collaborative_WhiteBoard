import React, { useRef, useEffect, useState } from "react";
import UploadFile from './UploadFile';
import './style.css';
import Input from "./Input";
import Home from "./Home";
import { initSocket } from "./socket";
import { useNavigate,useLocation, useParams } from "react-router-dom";

function Canvas(props) {

    const socketRef = useRef(null);
    const location = useLocation();
    const {boardId} = useParams();
    const navigate = useNavigate();

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
                username: location.state?.username,
            })
        };
        init();
    },[]);


    const [drawing, setDrawing] = useState(false);
    const canvasRef = useRef(null);
    const [imageDraw,setDrawImage] = useState(null);
    const [displayText,setDisplayText] = useState(false);


    useEffect(()=>{
        const imageContext = canvasRef.current.getContext('2d');
        const image = new Image();
                image.src = imageDraw;
                image.onload=()=>{
                    imageContext.drawImage(image,90,90,650,500);
                }

    },[imageDraw])

        useEffect(() => {
            const canvas = canvasRef.current;
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
