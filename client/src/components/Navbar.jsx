import '../styles/Navbar.css'

function Navbar () {
  return (
    <div className="navbar">
      <h1 className="nav-title">RAG it!</h1>
      <div className="nav-links">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </div>
    </div>
  )
}
export default Navbar