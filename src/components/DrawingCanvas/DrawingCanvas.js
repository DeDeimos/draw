import { useEffect, useRef, useState } from "react";
import "./DrawingCanvas.css";
import ColorInput from "./ColorInput";

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000");
  const [lineWidth, setLineWidth] = useState(5);
  const [isMarker, setMarker] = useState(true);
  const sender = "Rodion";

  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "https://source.unsplash.com/random/400x150/?desert",
      sender: "Rodion",
    },
    {
      id: 2,
      content: "https://source.unsplash.com/random/400x150/?sea",
      sender: "Rodion",
    },
    {
      id: 3,
      content: "https://source.unsplash.com/random/400x150/?forest",
      sender: "Azat",
    },
    {
      id: 4,
      content: "https://source.unsplash.com/random/400x150/?landscape",
      sender: "Rodion",
    },
    {
      id: 5,
      content: "https://source.unsplash.com/random/400x150/?sky",
      sender: "Azat",
    },
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 400;
    canvas.height = 150;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    // context.strokeStyle = color;
    context.lineWidth = lineWidth;
    contextRef.current = context;
  }, []);

  useEffect(() => {
    contextRef.current.strokeStyle = color;
  }, [color]);

  useEffect(() => {
    contextRef.current.lineWidth = lineWidth;
  }, [lineWidth]);

  const startDrawing = ({ nativeEvent }) => {
    setMarker(true);
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    setIsDrawing(true);
    nativeEvent.preventDefault();
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }

    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    nativeEvent.preventDefault();
  };

  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const setToDraw = () => {
    contextRef.current.globalCompositeOperation = "source-over";
  };

  const setToErase = () => {
    setMarker(false);
    contextRef.current.globalCompositeOperation = "destination-out";
    // clear all area
    // contextRef.current.clearRect(
    //   0,
    //   0,
    //   canvasRef.current.width,
    //   canvasRef.current.height
    // );
  };
  const setToEraseAll = () => {
    // contextRef.current.globalCompositeOperation = 'destination-out';
    // clear all area
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
  };

  const sendDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    let link = e.currentTarget;
    link.setAttribute("download", "canvas.png");
    let image = canvasRef.current.toDataURL("image/png");
    link.setAttribute("href", image);  
    console.log(image.split(",")[1]);
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        content: image,
        sender: sender,
      },
    ]);
    console.log(messages);
  }

  return (
    <>
      <div className="navbar">
        DrawChat
        <div className="navbar-right">
          <button className="button">Выйти</button>
        </div>
      </div>
      <div className="chat">
        {messages.map((message) => (
          <div
            id={message.id}
            className={
              sender === message.sender ? `message` : `message message_from`
            }
          >
            <div className="message-content">
              <div className="message-picture">
                <img src={message.content} alt="pic" />
                </div>
              <div className="message-sender">{message.sender}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="footer">
        <div className="content">
          <div className="left">
            <ColorInput color={color} setColor={setColor} />
            <input
              className="range-input"
              type="range"
              value={lineWidth}
              onChange={(event) => setLineWidth(event.target.value)}
              min={1}
              max={50}
            />
          </div>
          <canvas
            className="canvas-container"
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          ></canvas>
          <div className="right">
            <button className="button tools" onClick={setToDraw}>
              Маркер
            </button>

            <button className="button  tools" onClick={setToErase}>
              Стерка
            </button>
            <button className="button" onClick={sendDrawing}>
              Отправить
            </button>
            <button className="button" onClick={setToEraseAll}>
              Стереть все
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DrawingCanvas;
