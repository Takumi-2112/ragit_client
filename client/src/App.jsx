import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Interface from "./components/Interface";
import RegisterLoginModal from "./components/RegisterLoginModal";
import About from "./components/About";
import Footer from "./components/Footer";
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
  const [isAbout, setIsAbout] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
    const username = localStorage.getItem("username");

    if (token && userId && username) {
      setIsAuthenticated(true);
      setUserInfo({ userId, username });
      loadChatHistory(token);
    }
  }, []);

  const loadChatHistory = async (token) => {
    try {
      const response = await fetch("https://ragit-server.onrender.com/chat-history", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.chat_history && data.chat_history.length > 0) {
          setMessages(data.chat_history);
        }
      } else {
        console.log("Could not load chat history");
        // Keep default welcome message if no history available
      }
    } catch (error) {
      console.log("Error loading chat history:", error);
      // Keep default welcome message if error occurs
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const userMessage = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsTyping(true); // Start typing indicator

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("https://ragit-server.onrender.com/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
    } finally {
      setIsTyping(false); // Stop typing indicator
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
      // Load chat history for newly authenticated user
      loadChatHistory(token);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      // Call logout endpoint (optional - JWT is stateless)
      if (token) {
        await fetch("https://ragit-server.onrender.com/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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

  const handleClearChat = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("https://ragit-server.onrender.com/clear-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Reset messages to default welcome message
        setMessages([
          { sender: "bot", text: "Hello! How can I assist you today?" },
        ]);
      } else {
        console.error("Failed to clear chat history");
      }
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  const handleAboutToggle = () => {
    setIsAbout((prevState) => !prevState);
  };

  return (
    <div className="master-app">
      <Navbar
        isAuthenticated={isAuthenticated}
        userInfo={userInfo}
        handleLogout={handleLogout}
        handleClearChat={handleClearChat}
        menuOpen={menuOpen}
        toggleMenu={toggleMenu}
      />

      <RegisterLoginModal
        register={register}
        setRegister={setRegister}
        login={login}
        setLogin={setLogin}
        handleRegisterLoginModalClose={handleRegisterLoginModalClose}
        setMessages={setMessages}
      />

      {!interfaceState ? (
        <div className="app-content">
          <h1 className="app-title">
            Ever wanted to be a know-it-all on any document or website within
            seconds?
          </h1>
          {isAbout ? (
            <i
              className="fa-solid fa-angle-down down-arrow"
              onClick={handleAboutToggle}
            ></i>
          ) : (
            <i
              className="fa-solid fa-angle-down up-arrow"
              onClick={handleAboutToggle}
            ></i>
          )}
          <About isAbout={isAbout} />
          <button className="chat-access" onClick={handleGetStartedClick}>
            {isAuthenticated
              ? `Log back in ${userInfo.username}!`
              : "Get Started"}
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
            isTyping={isTyping} // Pass typing state to Interface
          />
        </div>
      )}
      <Footer login={login} />
    </div>
  );
}

export default App;
