import s from "./index.module.scss";

const Message = ({ id, content, sender, time, isIncoming, isError }) => {
  return (
    <div
      key={id}
      className={isIncoming ? s.message + " " + s.message_from : s.message}
    >
      <div 
      style={{
        border: isError ? "5px solid red" : "5px solid #0468ff", 
        background: isError ? "red" : "inherit",
      }}
      className={s.message_content}>
        <div className={s.message_picture}>
          {isError ? (
            <p>Ваше сообщение не доставлено</p>
          ) : (
            <img src={content} alt="drawing" />
          )}
          {/* <img src={content} alt="drawing" /> */}
        </div>
        <div 
      style={{
        background: isError ? "red" : "#0468ff"
      }}
        className={s.message_bottom}>
          <div className={s.message_time}>
            {new Date(time).toLocaleTimeString()}
          </div>
          <div className={s.message_sender}>{sender}</div>
        </div>
      </div>
    </div>
  );
};

export default Message;
