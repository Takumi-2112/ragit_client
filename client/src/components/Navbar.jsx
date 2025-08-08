import "../styles/Navbar.css";
import logoTitle from "../assets/azranhq-white.png";

function Navbar({ isAuthenticated, userInfo, handleLogout }) {
  return (
    <div className="navbar">
      <h1 className="nav-title">RAG it!</h1>
      {/* <div className="nav-title-logo"><img className='nav-logo-image' src={logoTitle} alt="" /></div> */}
      <div className="nav-links">
        <a href="/">
          <span className="lotus">Lotus</span>
          <span className="verse">Verse</span>
        </a>
        <a
          className="linkedin"
          href="https://www.linkedin.com/in/thomas-azran-b3427b311/"
        >
          LinkedIn{" "}
          <span className="link">
            <i className="fa-brands fa-linkedin"></i>
          </span>
        </a>
        <a className="github" href="https://github.com/Takumi-2112">
          Github{" "}
          <span className="git">
            <i className="fa-brands fa-github"></i>
          </span>
        </a>
        {isAuthenticated && (
          <button className="logout-button" onClick={handleLogout}>
            Logout {userInfo && `(${userInfo.username})`}
          </button>
        )}
      </div>
    </div>
  );
}
export default Navbar;
