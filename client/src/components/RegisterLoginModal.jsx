import { useState } from "react";
import "../styles/RegisterLoginModal.css";

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://ragit-server.onrender.com' 
  : 'http://localhost:8123';

function RegisterLoginModal({
  register,
  setRegister,
  login,
  setLogin,
  handleRegisterLoginModalClose,
  setMessages,
}) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error message when user starts typing
    if (errorMessage) setErrorMessage("");
  };

  const clearFormData = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
    });
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    if (register) {
      try {
        // Client-side validation
        if (formData.username.trim().length < 3) {
          setErrorMessage("Username must be at least 3 characters long");
          setIsLoading(false);
          return;
        }
        
        if (formData.password.length < 6) {
          setErrorMessage("Password must be at least 6 characters long");
          setIsLoading(false);
          return;
        }

        const payload = {
          username: formData.username.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password  // Send plain text - server will hash it
        };

        const response = await fetch(`${API_BASE_URL}/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
          // Store token and user data
          localStorage.setItem("token", data.token);
          localStorage.setItem("user_id", data.user_id);
          localStorage.setItem("username", data.username);

          // Set initial messages (new user gets default welcome message)
          setMessages([
            { sender: "bot", text: "Hello! How can I assist you today?" },
          ]);

          // Close modal and redirect to interface
          handleRegisterLoginModalClose();
          console.log("Registration successful");
        } else {
          console.error("Registration failed:", data.error);
          setErrorMessage(data.error || "Registration failed");
        }

        // Clear sensitive data after processing response
        clearFormData();
      } catch (error) {
        console.error("Registration error:", error);
        setErrorMessage("Registration failed. Please try again.");
        clearFormData();
      } finally {
        setIsLoading(false);
      }
    } else if (login) {
      // Handle login
      try {
        const payload = {
          username: formData.username.trim(),
          password: formData.password  // Send plain text - server will verify against hash
        };

        const response = await fetch(`${API_BASE_URL}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
          // Store token and user data
          localStorage.setItem("token", data.token);
          localStorage.setItem("user_id", data.user_id);
          localStorage.setItem("username", data.username);

          // Load user's chat history from the login response
          if (data.chat_history && data.chat_history.length > 0) {
            setMessages(data.chat_history);
          } else {
            // Fallback to default message if no history
            setMessages([
              { sender: "bot", text: "Hello! How can I assist you today?" },
            ]);
          }

          // Close modal and redirect to interface
          handleRegisterLoginModalClose();
          console.log("Login successful");
        } else {
          console.error("Login failed:", data.error);
          setErrorMessage(data.error || "Login failed");
        }

        // Clear sensitive data after processing response
        clearFormData();
      } catch (error) {
        console.error("Login error:", error);
        setErrorMessage("Login failed. Please try again.");
        clearFormData();
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Only render the modal if register or login is true
  if (!register && !login) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-close-container">
            <i
              className="fa-solid fa-xmark close-modal"
              onClick={() => {
                clearFormData();
                handleRegisterLoginModalClose();
              }}
            ></i>
          </div>
          {register && (
            <>
              <h2>Register</h2>
              {errorMessage && (
                <div style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>
                  {errorMessage}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <input
                  className="auth-inputs"
                  type="text"
                  name="username"
                  placeholder="Username (min 3 characters)"
                  value={formData.username}
                  onChange={handleInputChange}
                  autoComplete="username"
                  required
                  disabled={isLoading}
                />
                <input
                  className="auth-inputs"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  autoComplete="email"
                  required
                  disabled={isLoading}
                />
                <input
                  className="auth-inputs"
                  type="password"
                  name="password"
                  placeholder="Password (min 6 characters)"
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete="new-password"
                  required
                  disabled={isLoading}
                />
                <button 
                  className="form-submit-button" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Registering..." : "Register"}
                </button>
              </form>
              <p>
                Already have an account?{" "}
                <span
                  style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
                  onClick={() => {
                    if (!isLoading) {
                      clearFormData();
                      setRegister(false);
                      setLogin(true);
                    }
                  }}
                >
                  Login here
                </span>
              </p>
            </>
          )}
          {login && (
            <>
              <h2>Login</h2>
              {errorMessage && (
                <div style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>
                  {errorMessage}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <input
                  className="auth-inputs"
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  autoComplete="username"
                  required
                  disabled={isLoading}
                />
                <input
                  className="auth-inputs"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete="current-password"
                  required
                  disabled={isLoading}
                />
                <button 
                  className="form-submit-button" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </form>
              <p>
                Don't have an account?{" "}
                <span
                  style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
                  onClick={() => {
                    if (!isLoading) {
                      clearFormData();
                      setLogin(false);
                      setRegister(true);
                    }
                  }}
                >
                  Register here
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegisterLoginModal;