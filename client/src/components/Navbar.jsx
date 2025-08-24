import "../styles/Navbar.css";
import logoTitle from "../assets/azranhq-white.png";

function Navbar({ isAuthenticated, userInfo, handleLogout, menuOpen, toggleMenu }) {
  return (
    <div className={`navbar ${menuOpen ? "menu-open" : ""}`}>
      <h1 className="nav-title">RAG it!</h1>
      {/* <div className="nav-title-logo"><img className='nav-logo-image' src={logoTitle} alt="" /></div> */}
      
      {/* Hamburger icon - positioned correctly */}
      <div className="hamburger" onClick={toggleMenu}>
        <div className={`bar ${menuOpen ? "open" : ""}`}></div>
        <div className={`bar ${menuOpen ? "open" : ""}`}></div>
        <div className={`bar ${menuOpen ? "open" : ""}`}></div>
      </div>

      {/* Navigation links */}
      <div className={`nav-links ${menuOpen ? "show" : ""}`}>
        <a
          className="linkedin"
          href="https://www.linkedin.com/in/thomas-azran-b3427b311/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn{" "}
          <span className="link">
            <i className="fa-brands fa-linkedin"></i>
          </span>
        </a>
        <a 
          className="github" 
          href="https://github.com/Takumi-2112/ragit_client"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github{" "}
          <span className="git">
            <i className="fa-brands fa-github"></i>
          </span>
        </a>
        {isAuthenticated && (
            <span className="logout-button" onClick={handleLogout}>
              Logout <span>{userInfo && `(${userInfo.username})`}</span>
            </span>
        )}
      </div>
    </div>
  );
}

export default Navbar;