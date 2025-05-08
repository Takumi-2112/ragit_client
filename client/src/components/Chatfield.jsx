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
        <div className="textarea-wrapper">
          <textarea
            name="chatfield"
            className="chatfield-textarea"
            placeholder="Enter your prompt here . . ."
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
          />
          <div className="textarea-icons">
            <i className="fa-solid fa-file-pdf pdf"></i>
            <i className="fa-solid fa-globe website"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatfield;
