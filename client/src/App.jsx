import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Interface from "./components/Interface";
import "./styles/App.css";

function App() {
  const [interfaceState, setInterfaceState] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello Mr. Azran, how can I assist you today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const userMessage = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    try {
      const response = await fetch("http://localhost:8080/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok)
        throw new Error(
          "RESPONSE WAS NOT OKAY: ERROR IN FETCHING DATA FROM SERVER 500"
        );
      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: data.message },
      ]);
    } catch (err) {
      console.error("Error sending message:", err.message);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          text: "Server error; Server not responding ⚠️ Wait a few seconds and try again ✅",
        },
      ]);
    }
  };

  const handleInterrfaceToggle = () => {
    setInterfaceState((prevState) => !prevState);
  };

  return (
    <div className="master-app">
      <Navbar />
      {!interfaceState ? (
        <div className="app-content">
          <h1 className="app-title">
            Ever wanted to be a know-it-all on any document or website within
            seconds?
          </h1>
          <button
            className="chat-access"
            onClick={() => handleInterrfaceToggle()}
          >
            Get started
          </button>
        </div>
      ) : (
        <div className="app-content">
          <Interface
            messages={messages}
            setMessages={setMessages}
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            handleInterrfaceToggle={handleInterrfaceToggle}
          />
        </div>
      )}
    </div>
  );
}

export default App;
