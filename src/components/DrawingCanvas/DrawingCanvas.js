import { useEffect, useRef, useState } from "react";
import "./DrawingCanvas.css";
import ColorInput from "./ColorInput";
import Compress from "react-image-file-resizer";

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000");
  const [lineWidth, setLineWidth] = useState(5);

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

  const saveImageToLocal = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      if (blob) {
        console.log("Размер изображения до сжатия:", blob.size, "байт");

        Compress.imageFileResizer(
          blob,
          400,
          150,
          "PNG",
          100,
          0,
          (uri) => {
            console.log(
              "Размер изображения после сжатия:",
              uri.length * 0.75,
              "байт"
            );
            // uri содержит сжатое изображение в формате base64
            // Здесь может быть ваша логика загрузки изображения
          },
          "base64"
        );
      }
    }, "image/png");
  };

  return (
    <div className="footer">
      <div className="left">
        <canvas
          className="canvas-container"
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        ></canvas>
        <ColorInput color={color} setColor={setColor} />
        {/* <input type="color" value={color} onChange={(event) => setColor(event.target.value)} /> */}
        <input
          type="range"
          value={lineWidth}
          onChange={(event) => setLineWidth(event.target.value)}
          min={1}
          max={50}
        />
      </div>

      <div>
        <button onClick={setToDraw}>Draw</button>
        <button onClick={setToErase}>Erase</button>
        <button onClick={setToEraseAll}>Erase All</button>
        <a
          id="download_image_link"
          href="download_link"
          onClick={saveImageToLocal}
        >
          Download Image
        </a>
      </div>
    </div>
  );
};

export default DrawingCanvas;
