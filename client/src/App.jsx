import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Interface from "./components/Interface";
import RegisterLoginModal from "./components/RegisterLoginModal";
import About from "./components/About";
import Footer from "./components/Footer";
import "./styles/App.css";

function App() {
  const [interfaceState, setInterfaceState] = useState(false);
  // Initialize messages as empty array instead of with default message
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [register, setRegister] = useState(false);
  const [login, setLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isAbout, setIsAbout] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Add loading state to prevent premature rendering
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
    const username = localStorage.getItem("username");

    if (token && userId && username) {
      setIsAuthenticated(true);
      setUserInfo({ userId, username });
      setIsLoadingHistory(true);
      loadChatHistory(token);
    } else {
      // If not authenticated, set default welcome message
      setMessages([{ sender: "bot", text: "Hello! How can I assist you today?" }]);
    }
  }, []);

  const loadChatHistory = async (token) => {
    try {
      const response = await fetch("https://localhost:8223/chat-history", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Always set messages based on what the server returns
        if (data.chat_history && Array.isArray(data.chat_history) && data.chat_history.length > 0) {
          setMessages(data.chat_history);
        } else {
          // If server returns empty history, set default message
          setMessages([{ sender: "bot", text: "Hello! How can I assist you today?" }]);
        }
      } else {
        console.log("Could not load chat history - Response not OK");
        // On error, set default welcome message
        setMessages([{ sender: "bot", text: "Hello! How can I assist you today?" }]);
      }
    } catch (error) {
      console.log("Error loading chat history:", error);
      // On error, set default welcome message
      setMessages([{ sender: "bot", text: "Hello! How can I assist you today?" }]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const userMessage = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("https://localhost:8223/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        if (response.status === 401) {
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
      setIsTyping(false);
    }
  };

  const handleInterfaceToggle = () => {
    setInterfaceState((prevState) => !prevState);
  };

  const handleGetStartedClick = () => {
    if (isAuthenticated) {
      setInterfaceState(true);
    } else {
      setRegister(true);
      setLogin(false);
    }
  };

  const handleRegisterLoginModalClose = () => {
    setRegister(false);
    setLogin(false);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
    const username = localStorage.getItem("username");

    if (token && userId && username) {
      setIsAuthenticated(true);
      setUserInfo({ userId, username });
      setInterfaceState(true);
      // Load chat history for newly authenticated user
      setIsLoadingHistory(true);
      loadChatHistory(token);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        await fetch("https://localhost:8223/logout", {
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
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("username");

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

      const response = await fetch("https://localhost:8223/clear-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
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

  // Show loading state while fetching chat history
  if (isLoadingHistory) {
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
        <div className="app-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <p>Loading chat history...</p>
        </div>
        <Footer login={login} />
      </div>
    );
  }

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
            isTyping={isTyping}
          />
        </div>
      )}
      <Footer login={login} />
    </div>
  );
}

export default App;