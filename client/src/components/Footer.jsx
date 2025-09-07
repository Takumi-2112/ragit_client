import "../styles/Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="master-footer">
      <div className="footer-content">
        <p>&copy; {currentYear}, RAG it! All rights reserved.</p>
        {/* <div className="bot-footer">
          <img className="bot-footer-img" src={botChameleonLogo} alt="D2V Labs logo" />
        </div> */}
        <p className="footer-credits">
          Developed by <a href="https://www.linkedin.com/in/thomas-azran-b3427b311/">Thomas Azran</a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;