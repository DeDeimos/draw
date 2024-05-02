import s from "./index.module.scss";

const Message = ({id, content, sender, isIncoming }) => {
  return (
    <div 
        key={id}
        className={
            isIncoming ? s.message + " " + s.message_from : s.message
        }
        >
            <div className={s.message_content}>
                <div className={s.message_picture}>
                    <img src={content} alt="drawing" />
                </div>
                <div className={s.message_sender}>{sender}</div>
            </div>
        </div>
  );
};

export default Message;
