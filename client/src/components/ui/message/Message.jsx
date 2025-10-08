import "./Message.css";

const Message = ({ type, text, variant="full" }) => {
  if (!text) return null;

  return (
    <div className={`message-${variant} message--${type}--${variant}`}>
      {text}
    </div>
  );
};

export default Message;
