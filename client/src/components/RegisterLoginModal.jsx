import { useState } from "react";
import "../styles/RegisterLoginModal.css";

// Constants
const API_BASE_URL = "https://ragit-server.onrender.com";
const MIN_USERNAME_LENGTH = 3;
const MIN_PASSWORD_LENGTH = 6;
const DEFAULT_BOT_MESSAGE = { sender: "bot", text: "Hello! How can I assist you today?" };

// Validation functions
const validateForm = (formData, isRegistration) => {
  const { username, password, email } = formData;

  if (username.trim().length < MIN_USERNAME_LENGTH) {
    return `Username must be at least ${MIN_USERNAME_LENGTH} characters long`;
  }
  
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`;
  }

  if (isRegistration && (!email || !email.includes("@"))) {
    return "Please enter a valid email address";
  }

  return null;
};

// API functions
const makeAuthRequest = async (endpoint, payload) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || `${endpoint.slice(1)} failed`);
  }
  
  return data;
};

const registerUser = async (formData) => {
  return makeAuthRequest("/register", {
    username: formData.username.trim(),
    email: formData.email.trim().toLowerCase(),
    password: formData.password
  });
};

const loginUser = async (formData) => {
  return makeAuthRequest("/login", {
    username: formData.username.trim(),
    password: formData.password
  });
};

// Storage functions
const storeUserData = (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user_id", data.user_id);
  localStorage.setItem("username", data.username);
};

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
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errorMessage) setErrorMessage("");
  };

  const clearForm = () => {
    setFormData({ username: "", email: "", password: "" });
    setErrorMessage("");
  };

  const switchMode = (toLogin) => {
    if (isLoading) return;
    
    clearForm();
    setRegister(!toLogin);
    setLogin(toLogin);
  };

  const handleAuthSuccess = (data, isRegistration) => {
    storeUserData(data);
    
    // Set messages based on response
    const messages = (data.chat_history?.length > 0) 
      ? data.chat_history 
      : [DEFAULT_BOT_MESSAGE];
    
    setMessages(messages);
    handleRegisterLoginModalClose();
    
    console.log(`${isRegistration ? 'Registration' : 'Login'} successful`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Client-side validation
      const validationError = validateForm(formData, register);
      if (validationError) {
        setErrorMessage(validationError);
        return;
      }

      // Make API request
      const data = register 
        ? await registerUser(formData)
        : await loginUser(formData);

      handleAuthSuccess(data, register);
      
    } catch (error) {
      console.error(`${register ? 'Registration' : 'Login'} error:`, error);
      setErrorMessage(error.message || `${register ? 'Registration' : 'Login'} failed. Please try again.`);
    } finally {
      clearForm();
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    clearForm();
    handleRegisterLoginModalClose();
  };

  // Don't render if modal should be closed
  if (!register && !login) return null;

  const isRegistration = register;
  const modalTitle = isRegistration ? "Register" : "Login";
  const submitText = isLoading 
    ? (isRegistration ? "Registering..." : "Logging in...")
    : modalTitle;

  return (
 <div className="modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-close-container">
            <i className="fa-solid fa-xmark close-modal" onClick={handleClose} />
          </div>
          
          <h2>{modalTitle}</h2>
          
          {errorMessage && (
            <div style={{ 
              color: 'red', 
              marginBottom: '10px', 
              fontSize: '14px' 
            }}>
              {errorMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <input
              className={`auth-inputs ${errorMessage ? 'input-error' : ''}`}
              type="text"
              name="username"
              placeholder={`Username (min ${MIN_USERNAME_LENGTH} characters)`}
              value={formData.username}
              onChange={handleInputChange}
              autoComplete="username"
              required
              disabled={isLoading}
              style={{
                borderColor: errorMessage ? '#ff4444' : '',
                borderWidth: errorMessage ? '2px' : '1px'
              }}
            />
            
            {isRegistration && (
              <input
                className={`auth-inputs ${errorMessage ? 'input-error' : ''}`}
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="email"
                required
                disabled={isLoading}
                style={{
                  borderColor: errorMessage ? '#ff4444' : '',
                  borderWidth: errorMessage ? '2px' : '1px'
                }}
              />
            )}
            
            <input
              className={`auth-inputs ${errorMessage ? 'input-error' : ''}`}
              type="password"
              name="password"
              placeholder={`Password (min ${MIN_PASSWORD_LENGTH} characters)`}
              value={formData.password}
              onChange={handleInputChange}
              autoComplete={isRegistration ? "new-password" : "current-password"}
              required
              disabled={isLoading}
              style={{
                borderColor: errorMessage ? '#ff4444' : '',
                borderWidth: errorMessage ? '2px' : '1px'
              }}
            />
            
            <button 
              className="form-submit-button" 
              type="submit"
              disabled={isLoading}
            >
              {submitText}
            </button>
          </form>
          
          <p>
            {isRegistration ? "Already have an account? " : "Don't have an account? "}
            <span
              style={{ 
                cursor: isLoading ? 'not-allowed' : 'pointer',
                color: isLoading ? '#ccc' : 'inherit'
              }}
              onClick={() => switchMode(!isRegistration)}
            >
              {isRegistration ? "Login here" : "Register here"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterLoginModal;