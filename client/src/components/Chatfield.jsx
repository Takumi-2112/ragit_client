import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import "../styles/Chatfield.css";

function Chatfield({
  messages,
  setMessages,
  input,
  setInput,
  handleSend,
  handleURLClick,
  handlePDFClick,
}) {

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent the default behavior (new line)
      handleSend(e); // Submit the form
    }
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
            {message.sender === "bot" ? (
              <div className="markdown-content">
                <ReactMarkdown>
                  {message.text}
                </ReactMarkdown>
              </div>
            ) : (
              message.text
            )}
          </div>
        ))}
      </div>
      <div className="textarea-container">
        <div className="textarea-wrapper">
          <form onSubmit={handleSend} className="chatfield-form">
            <textarea
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              name="chatfield"
              className="chatfield-textarea"
              placeholder="Enter your prompt here . . ."
            />
            <div className="textarea-icons">
              <i
                className="fa-solid fa-file-pdf pdf"
                onClick={handlePDFClick}
              ></i>
              <i
                className="fa-solid fa-globe website"
                onClick={handleURLClick}
              ></i>
              <button className="send-button">Send</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chatfield;