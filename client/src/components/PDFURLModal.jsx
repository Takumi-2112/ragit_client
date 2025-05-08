import "../styles/PDFURLModal.css";

function PDFURLModal() {
  return (
    <div className="modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-close-container" >
            <i className="fa-solid fa-xmark close-modal"></i>
          </div>
          <h2 className="login-title">
            LOGIN
          </h2>
          <form >
            <div className="modal-inputs">
              <input
                type="email"
                name="email"
                placeholder="Email"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
              />
            </div>
          </form>
          <div className="modal-interact">
            <button className="login-button">
              Login
            </button>
            <p>
              Don't have an account?{" "}
              <span
                className="sign-up-here"
                >
                Sign Up here!
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFURLModal;