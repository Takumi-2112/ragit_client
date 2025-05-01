import { useState } from "react";
import "../styles/Chatfield.css";

function Chatfield() {
  const [messages, setMessages] = useState([
    { text: "Hello Mr. Azran, how can I assist you today?", sender: "bot" },
  ]);

  const addMessage = (newMessage) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: newMessage, sender: "user" },
    ]);
  };

  return (
    <div className="master-chatfield">
      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.sender === "user" ? "user-message" : "bot-message"
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="textarea-container">
        <textarea
          name="chatfield"
          className="chatfield-textarea"
          placeholder="Enter your prompt here ..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              const newMessage = e.target.value.trim();
              if (newMessage) {
                addMessage(newMessage);
                e.target.value = "";
              }
            }
          }}
        ></textarea>
      </div>
    </div>
  );
}

export default Chatfield;
