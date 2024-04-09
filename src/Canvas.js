import React, { useRef, useEffect, useState } from "react";
import UploadFile from './UploadFile';
import './style.css';

function Canvas(props) {
    const [drawing, setDrawing] = useState(false);
    const canvasRef = useRef(null);
    const [imageDraw,setDrawImage] = useState(null);


    useEffect(()=>{
        const imageContext = canvasRef.current.getContext('2d');
        const image = new Image();
                image.src = imageDraw;
                image.onload=()=>{
                    imageContext.drawImage(image,0,0,100,100);
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
            <canvas ref={canvasRef} 
            className="canvas" height={props.height} width={props.width}/>
            <UploadFile imageSource={setDrawImage}/>
        </div>
    );
}

export default Canvas;
