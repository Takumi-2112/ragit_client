import '../styles/Navbar.css'

function Navbar () {
  return (
    <div className="navbar">
      <h1 className="nav-title">RAG it!</h1>
      <div className="nav-links">
        <a href="/"><span className='lotus'>Lotus</span><span className='verse'>Verse</span></a>
        <a href="/about">LinkedIn</a>
        <a href="/contact">Github</a>
      </div>
    </div>
  )
}
export default Navbar