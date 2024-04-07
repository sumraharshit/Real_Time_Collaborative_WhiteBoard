import React, { useRef, useEffect, useState } from "react";
import UploadFile from './UploadFile';
import './style.css';

function Canvas() {
    const [drawing, setDrawing] = useState(false);
    const canvasRef = useRef(null);


        useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

    //    function drawingImage()
    //     {if (uploadedImage) {
    //         const image = new Image();
    //         image.onload = () => {
    //           context.drawImage(image, 0, 0);
    //         };
    //         image.src = uploadedImage;
    //       }}

      function handleDraw(event){
           if(drawing)
            { const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            context.beginPath();
            context.arc(x,y,4,-1,2*Math.PI);
            // context.moveTo(x,y);
            // context.lineTo(event.screenX,event.screenY);
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

    //    drawingImage();

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
            height={700}
            width={400}
            className="canvas"/>
            <UploadFile/>
        </div>
    );
}

export default Canvas;
