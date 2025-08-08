import { useState } from "react";
import "../styles/RegisterLoginModal.css";

function RegisterLoginModal({
  register,
  setRegister,
  login,
  setLogin,
  handleRegisterLoginModalOpen,
  handleRegisterLoginModalClose,
}) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (register) {
      // Handle registration
      try {
        const response = await fetch("http://localhost:8080/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();
        
        if (response.ok) {
          // Store token and user data
          localStorage.setItem("token", data.token);
          localStorage.setItem("user_id", data.user_id);
          localStorage.setItem("username", data.username);
          
          // Close modal and redirect to interface
          handleRegisterLoginModalClose();
          // You might want to call a function to update the app state here
          console.log("Registration successful:", data);
        } else {
          console.error("Registration failed:", data.error);
          alert(data.error);
        }
      } catch (error) {
        console.error("Registration error:", error);
        alert("Registration failed. Please try again.");
      }
    } else if (login) {
      // Handle login
      try {
        const response = await fetch("http://localhost:8080/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username, // or email depending on your backend
            password: formData.password,
          }),
        });

        const data = await response.json();
        
        if (response.ok) {
          // Store token and user data
          localStorage.setItem("token", data.token);
          localStorage.setItem("user_id", data.user_id);
          localStorage.setItem("username", data.username);
          
          // Close modal and redirect to interface
          handleRegisterLoginModalClose();
          // You might want to call a function to update the app state here
          console.log("Login successful:", data);
        } else {
          console.error("Login failed:", data.error);
          alert(data.error);
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("Login failed. Please try again.");
      }
    }

    // Reset form
    setFormData({
      username: "",
      email: "",
      password: "",
    });
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
              onClick={handleRegisterLoginModalClose}
            ></i>
          </div>
          {register && (
            <>
              <h2>Register</h2>
              <form onSubmit={handleSubmit}>
                <input 
                  type="text" 
                  name="username"
                  placeholder="Username" 
                  value={formData.username}
                  onChange={handleInputChange}
                  required 
                />
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                />
                <input 
                  type="password" 
                  name="password"
                  placeholder="Password" 
                  value={formData.password}
                  onChange={handleInputChange}
                  required 
                />
                <button type="submit">Register</button>
              </form>
              <p>
                Already have an account?{" "}
                <span 
                  onClick={() => {
                    setRegister(false);
                    setLogin(true);
                  }}
                  style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
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
                  type="text" 
                  name="username"
                  placeholder="Username" 
                  value={formData.username}
                  onChange={handleInputChange}
                  required 
                />
                <input 
                  type="password" 
                  name="password"
                  placeholder="Password" 
                  value={formData.password}
                  onChange={handleInputChange}
                  required 
                />
                <button type="submit">Login</button>
              </form>
              <p>
                Don't have an account?{" "}
                <span 
                  onClick={() => {
                    setLogin(false);
                    setRegister(true);
                  }}
                  style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
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