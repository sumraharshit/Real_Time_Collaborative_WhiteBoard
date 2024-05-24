import React, { useRef, useEffect, useState } from "react";
import UploadFile from './UploadFile';
import './style.css';
import './styleCanvas.css';
import { initSocket } from "./socket";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "./Button";
import { AiOutlineClear } from "react-icons/ai";
import { FaImage, FaRegSquareMinus } from "react-icons/fa6";
import { FaRegPlusSquare, FaMicrophoneAlt, FaUndoAlt } from "react-icons/fa";


function Canvas(props) {
    const [clients, setClients] = useState([]);
    const socketRef = useRef(null);
    const location = useLocation();
    const { boardId } = useParams();
    const navigate = useNavigate();
    const [width, setWidth] = useState(1.0);
    const [drawing, setDrawing] = useState(false);
    const canvasRef = useRef(null);
    const [imageDraw, setImageDraw] = useState(null);
    const [shapeColor, setShapeColor] = useState("#000000");
  const [linesHistory, setLinesHistory] = useState([]);
  const [currentLine, setCurrentLine] = useState([]);

    function changeColour(event) {
        let color = event.target.value;
        setShapeColor(color);
    }

    function lineWidth(event) {
        let name = event.target.name;
        if (name === 'increase')
            setWidth((prev) => { return (prev < 10 ? prev + 1 : prev) });
        else if (name === 'decrease')
            setWidth((prev) => { return (prev > 1 ? prev - 1 : prev) });
    }

    const handleImageUploadSuccess = (imageUrl) => {
        setImageDraw(imageUrl);
        socketRef.current.emit("image_update", {
            boardId,
            imageUrl,
        });
    };

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleError(err));
            socketRef.current.on('connect_failed', (err) => handleError(err));

            const handleError = (err) => {
                console.log('socket error', err);
                toast.error("Socket connection failed");
                navigate("/");
            };

            socketRef.current.emit('join', {
                boardId,
                userName: location.state.userName,
            });

            socketRef.current.on('joined', ({ clients, userName, socketId }) => {
                if (userName !== location.state.userName) {
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

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current.off("joined");
                socketRef.current.off("disconnected");
            }
        };
    }, []);

    useEffect(() => {
        const imageContext = canvasRef.current?.getContext('2d');
        if (imageContext && imageDraw) {
            const image = new Image();
            image.src = imageDraw;
            image.onload = () => {
                imageContext.drawImage(image, 90, 90, 650, 500);
            };
        }
    }, [imageDraw]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        redrawCanvas(context);
      }, [])


const handleDraw = (e) => { 
    const canvas = canvasRef.current;
    const context = canvasRef.current.getContext('2d');
    const rect = canvasRef.current.getBoundingClientRect();
    setDrawing(true);
    setCurrentLine([{ x: e.clientX - rect.left, y: e.clientY - rect.top, color: shapeColor, size: width}]);
    context.beginPath();
    context.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    canvas.dispatchEvent(new CustomEvent('canvasChange'));
  };

  const handleMoveDraw = (e) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const context = canvasRef.current.getContext('2d');
    const rect = canvasRef.current.getBoundingClientRect();
    const newPoint = { x: e.clientX - rect.left, y: e.clientY - rect.top, color: shapeColor, size: width };
    setCurrentLine([...currentLine, newPoint]);

    context.lineTo(newPoint.x, newPoint.y);
    context.strokeStyle = shapeColor;
    context.lineWidth = width;
    context.stroke();
    canvas.dispatchEvent(new CustomEvent('canvasChange'));
  };

  const handleNotDraw = () => {
    const canvas = canvasRef.current;
    setDrawing(false);
    setLinesHistory([...linesHistory, currentLine]);
    setCurrentLine([]);
    canvas.dispatchEvent(new CustomEvent('canvasChange'));
  };


  const undo = () => {
    if (linesHistory.length > 0) {
      const newHistory = linesHistory.slice(0, -1);
      setLinesHistory(newHistory);

      // Redraw canvas
      const context = canvasRef.current.getContext('2d');
      redrawCanvas(context);
    }
  };


  const redrawCanvas = (context) => {
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    const canvas = canvasRef.current;
    linesHistory.forEach(line => {
      context.beginPath();
      line.forEach((point, index) => {
        if (index === 0) {
          context.moveTo(point.x, point.y);
        } else {
          context.lineTo(point.x, point.y);
        }
      });
      context.strokeStyle = line[0].color;
      context.lineWidth = line[0].size;
      context.stroke();
      canvas.dispatchEvent(new CustomEvent('canvasChange'));
    });
  };

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

  
    function clearCanvas() {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        canvas.dispatchEvent(new CustomEvent('canvasChange'));
    } 

    return (
        <div className="canvasPage">
            <div className="column left">
                <h1>Users Online:</h1>
                {clients.map((client) => (
                    <div key={client.socketId} className="users">
                        <div className="box">{client.userName.charAt(0)}</div>
                        <h2>{client.userName}</h2>
                    </div>
                ))}
            </div>
            <div className="column right">
                <canvas ref={canvasRef} className="canvas" height={props.height} width={props.width} onMouseDown={handleDraw}
        onMouseMove={handleMoveDraw}
        onMouseUp={handleNotDraw}/>
            </div>
            <div className="tools">
                <button style={{ backgroundColor: "#243b55" }} className="button">
                    <FaMicrophoneAlt size="20" />
                </button>
                <UploadFile imageSource={handleImageUploadSuccess} id="uploadedImage" />
                <Button value="#000000" name="Black" buttonFunction={changeColour} />
                <Button value="#0000FF" name="Blue" buttonFunction={changeColour} />
                <Button value="#FF0000" name="Red" buttonFunction={changeColour} />
                <Button value="#FFC0CB" name="Pink" buttonFunction={changeColour} />
                <Button value="#00FF00" name="Green" buttonFunction={changeColour} />
                <button style={{ backgroundColor: "#243b55" }} className="button" value={width} name="decrease" onClick={lineWidth}>
                    <FaRegSquareMinus size="20" />
                </button>
                <button style={{ backgroundColor: "#243b55" }} className="button" value={width} name="increase" onClick={lineWidth}>
                    <FaRegPlusSquare size="20" />
                </button>
                <button style={{ backgroundColor: "#243b55" }} className="button" onClick={clearCanvas}>
                    <AiOutlineClear size="20" />
                </button>
                <button style={{ backgroundColor: "#243b55" }} className="button" onClick={undo}>
                    <FaUndoAlt size="20" />
                </button>
            </div>
        </div>
    );
}

export default Canvas;
