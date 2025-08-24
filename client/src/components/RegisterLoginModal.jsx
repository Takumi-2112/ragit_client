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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFormData = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (register) {
      
      try {
        const payload = {
          username: formData.username.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password  
        };

        const response = await fetch("http://localhost:8123/register", {
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
          alert(data.error);
        }

        // Clear sensitive data after processing response
        clearFormData();
      } catch (error) {
        console.error("Registration error:", error);
        alert("Registration failed. Please try again.");
        clearFormData();
      }
    } else if (login) {
      // Handle login
      try {
        const payload = {
          username: formData.username.trim(),
          password: formData.password  // Send plain text password over HTTPS
        };

        const response = await fetch("http://localhost:8123/login", {
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
          alert(data.error);
        }

        // Clear sensitive data after processing response
        clearFormData();
      } catch (error) {
        console.error("Login error:", error);
        alert("Login failed. Please try again.");
        clearFormData();
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
                />
                <input
                  className="auth-inputs"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete="new-password"
                  required
                />
                <button className="form-submit-button" type="submit">
                  Register
                </button>
              </form>
              <p>
                Already have an account?{" "}
                <span
                  onClick={() => {
                    clearFormData();
                    setRegister(false);
                    setLogin(true);
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
                />
                <button className="form-submit-button" type="submit">
                  Login
                </button>
              </form>
              <p>
                Don't have an account?{" "}
                <span
                  onClick={() => {
                    clearFormData();
                    setLogin(false);
                    setRegister(true);
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