import { useState } from "react";
import "../styles/RegisterLoginModal.css";

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
  const [loginError, setLoginError] = useState(false);
  const [serverFailure, setServerFailure] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
          password: formData.password, // Send plain text - server will hash it
        };

        const response = await fetch("https://ragit-server.onrender.com/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
          // store token and user data
          localStorage.setItem("token", data.token);
          localStorage.setItem("user_id", data.user_id);
          localStorage.setItem("username", data.username);

          setMessages([
            { sender: "bot", text: "Hello! How can I assist you today?" },
          ]);

          handleRegisterLoginModalClose();
          console.log("Registration successful");
        } else {
          console.error("Registration failed:", data.error);
          setErrorMessage(data.error || "Registration failed");
          setLoginError(false);
          setServerFailure(false);
        }

        clearFormData();
      } catch (error) {
        console.error("Registration error:", error);
        setErrorMessage("Registration failed. Please try again.");
        setServerFailure(true);
        clearFormData();
      } finally {
        setIsLoading(false);
      }
    } else if (login) {
      try {
        const payload = {
          username: formData.username.trim(),
          password: formData.password, // send plain text - server will verify against hash
        };

        const response = await fetch("https://ragit-server.onrender.com/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user_id", data.user_id);
          localStorage.setItem("username", data.username);

          // load chat history from the login response
          if (data.chat_history && data.chat_history.length > 0) {
            setMessages(data.chat_history);
          } else {
            setMessages([
              { sender: "bot", text: "Hello! How can I assist you today?" },
            ]);
          }

          handleRegisterLoginModalClose();
          console.log("Login successful");
          setLoginError(false);
          setServerFailure(false);
        } else {
          console.error("Login failed:", data.error);
          setErrorMessage("Invalid username or password");
          setLoginError(true);
          setServerFailure(false);
        }
        
        clearFormData();
      } catch (error) {
        console.error("Login error:", error);
        setErrorMessage("Invalid username or password");
        setServerFailure(true);
        clearFormData();
      } finally {
        setIsLoading(false);

      }
    }
  };

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
                <div className="auth-error-message">{errorMessage}</div>
              )}
              {serverFailure && (
                <div className="auth-error-message">
                  Please try again.
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
                  style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
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
              {loginError && (
                <div className="auth-error-message">
                  Invalid username or password
                </div>
              )}
              {serverFailure && (
                <div className="auth-error-message">
                  Please try again.
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
                  style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
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
