import { useEffect, useRef, useState } from "react";
import s from "./index.module.scss";
import ColorInput from "../../components/DrawingCanvas/ColorInput";
import Message from "../../entities/message/message";
import io from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "../../entities/user/userSlise";

const url = "http://localhost:5000";

export const ChatPage = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [sendMessages, setSendMessages] = useState([]); // [time1, time2, time3]
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const socketRef = useRef(null);

  useEffect(() => {
    console.log(user.user);
    if (user.user.name === "") {
      navigate("/");
    }
    socketRef.current = io(url, {
      query: { roomId: "1" },
    });

    socketRef.current.on("connect", () => {
      console.log("connected");
    });

    socketRef.current.on("disconnect", () => {
      console.log("disconnected");
    });

    socketRef.current.on("message", (message) => {
      receiveMessage(message);
    });
  }, []);

  const receiveMessage = (message) => {
    // if (message.error && !sendMessages.includes(message.time)) {
    //   console.log("error message");
    //   console.log("message time", message.time);
    //   console.log("messages array", sendMessages);
    // } else {
      setMessages((prevMessages) => [message, ...prevMessages]);
    // }
  };

  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000");
  const [lineWidth, setLineWidth] = useState(5);
  const [isMarker, setMarker] = useState(true);
  const sender = user.user;

  const [messages, setMessages] = useState([]);

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
    // console.log(image.split(",")[1]);
    const time = new Date().getTime();
    socketRef.current.emit("message", {
      time: time,
      payload: image,
      sender: sender,
    });
    
    setSendMessages((prevMessages) => [...prevMessages, time]);
    console.log("sendMessages", sendMessages);
  };

  return (
    <>
      <div className={s.navbar}>
        DrawChat
        <div className={s.navbar_right}>
          <button
            className={s.button}
            onClick={() => {
              dispatch(deleteUser());
              navigate("/");
              socketRef.current.disconnect();
            }}
          >
            Выйти
          </button>
        </div>
      </div>
      <div className={s.chat_wrapper}>
        <div className={s.chat}>
          {messages.map((message) => (
            <Message
              id={message.time}
              content={message.payload}
              sender={message.sender}
              time={message.time}
              isIncoming={sender !== message.sender && message.sender !== null}
              isError={message.error}
            />
          ))}
        </div>
      </div>
      <div className={s.footer}>
        <div className={s.content}>
          <div className={s.left}>
            <ColorInput color={color} setColor={setColor} />
            <input
              className={s.range_input}
              type="range"
              value={lineWidth}
              onChange={(event) => setLineWidth(event.target.value)}
              min={1}
              max={50}
            />
          </div>
          <canvas
            className={s.canvas_container}
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          ></canvas>
          <div className={s.right}>
            <button className={s.button + " " + s.tools} onClick={setToDraw}>
              Маркер
            </button>

            <button className={s.button + " " + s.tools} onClick={setToErase}>
              Стерка
            </button>
            <button className={s.button} onClick={sendDrawing}>
              Отправить
            </button>
            <button className={s.button} onClick={setToEraseAll}>
              Стереть все
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
