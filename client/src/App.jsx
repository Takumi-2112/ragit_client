import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Interface from "./components/Interface";
import RegisterLoginModal from "./components/RegisterLoginModal";
import "./styles/App.css";

function App() {
  const [interfaceState, setInterfaceState] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [register, setRegister] = useState(false);
  const [login, setLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // Check if user is already authenticated on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
    const username = localStorage.getItem("username");

    if (token && userId && username) {
      setIsAuthenticated(true);
      setUserInfo({ userId, username });
      // Optionally verify token with backend here
    }
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const userMessage = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch("http://localhost:8080/message", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          handleLogout();
          throw new Error("Authentication required. Please log in again.");
        }
        throw new Error("Server error occurred");
      }

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
          text: err.message.includes("Authentication") 
            ? "Please log in to continue chatting."
            : "Server error; Server not responding ⚠️ Wait a few seconds and try again ✅",
        },
      ]);
    }
  };

  const handleInterfaceToggle = () => {
    setInterfaceState((prevState) => !prevState);
  };

  const handleGetStartedClick = () => {
    if (isAuthenticated) {
      // User is already authenticated, go to interface
      setInterfaceState(true);
    } else {
      // User needs to authenticate, show register modal
      setRegister(true);
      setLogin(false);
    }
  };

  const handleRegisterLoginModalClose = () => {
    setRegister(false);
    setLogin(false);
    
    // Check if user just authenticated
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
    const username = localStorage.getItem("username");

    if (token && userId && username) {
      setIsAuthenticated(true);
      setUserInfo({ userId, username });
      setInterfaceState(true); // Go to interface after successful auth
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Call logout endpoint (optional - JWT is stateless)
      if (token) {
        await fetch("http://localhost:8080/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });
      }
    } catch (error) {
      console.log("Logout endpoint call failed (not critical):", error);
    } finally {
      // Always clear local storage and reset state, even if endpoint fails
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("username");
      
      // Reset app state
      setIsAuthenticated(false);
      setUserInfo(null);
      setInterfaceState(false);
      setMessages([
        { sender: "bot", text: "Hello! How can I assist you today?" },
      ]);
    }
  };

  return (
    <div className="master-app">
      <Navbar 
        isAuthenticated={isAuthenticated} 
        userInfo={userInfo}
        handleLogout={handleLogout}
      />
      
      {/* Render modal only when register or login is true */}
      <RegisterLoginModal
        register={register}
        setRegister={setRegister}
        login={login}
        setLogin={setLogin}
        handleRegisterLoginModalClose={handleRegisterLoginModalClose}
      />

      {!interfaceState ? (
        <div className="app-content">
          <h1 className="app-title">
            Ever wanted to be a know-it-all on any document or website within
            seconds?
          </h1>
          <button
            className="chat-access"
            onClick={handleGetStartedClick}
          >
            {isAuthenticated ? "Continue Chatting" : "Get Started"}
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
            handleInterfaceToggle={handleInterfaceToggle}
            isAuthenticated={isAuthenticated}
          />
        </div>
      )}
    </div>
  );
}

export default App;