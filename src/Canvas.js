import React, { useRef, useEffect, useState } from "react";
// import Button from "./Button";
import UploadFile from './UploadFile';

function Canvas() {
    const [drawing, setDrawing] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);

    const canvasRef = useRef(null);

        useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

      const handleDraw = (event)=>{
        let isHandle = true;

        canvas.addEventListener('mouseup', ()=>{
            isHandle = false;
        })
           if(drawing && isHandle)
            { const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            context.beginPath();
            context.arc(x, y, 5, 0, 2 * Math.PI);
            context.arc(x + 1, y + 1, 5, 0, 2 * Math.PI);
            context.fillStyle = 'black';
            context.fill();
        

            if (uploadedImage) {
                const image = new Image();
                image.onload = () => {
                  context.clearRect(0, 0, canvas.width, canvas.height); // Optional: Clear canvas before drawing image
                  context.drawImage(image, 0, 0);
                };
                image.src = uploadedImage;
              }
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
    }, [drawing, , uploadedImage]); 

    return (
        <div>
            <button onClick={() => {
                setDrawing(!drawing);
            }}>click</button>
            <canvas ref={canvasRef} />
            <UploadFile/>
        </div>
    );
}

export default Canvas;
