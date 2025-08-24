import { useState, useEffect, useRef } from "react";
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
  isTyping // Add isTyping prop
}) {
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]); // Add isTyping to dependency array

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent the default behavior (new line)
      handleSend(e); // Submit the form
    }
  };

  return (
    <div className="master-chatfield">
      <div className="messages-container" ref={messagesContainerRef}>
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
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="message bot-message typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
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
              disabled={isTyping} // Disable input while typing
            />
            <div className="textarea-icons">
              <div className="textarea-input-buttons">
              <i
                className="fa-solid fa-file-pdf pdf"
                onClick={handlePDFClick}
                style={{ opacity: isTyping ? 0.5 : 1, pointerEvents: isTyping ? 'none' : 'auto' }}
              ></i>
              <i
                className="fa-solid fa-globe website"
                onClick={handleURLClick}
                style={{ opacity: isTyping ? 0.5 : 1, pointerEvents: isTyping ? 'none' : 'auto' }}
              ></i>
              </div>
              <button 
                className="send-button" 
                disabled={isTyping}
                style={{ opacity: isTyping ? 0.5 : 1 }}
              >
                {isTyping ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chatfield;