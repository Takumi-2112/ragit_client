import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Interface from "./components/Interface";
import "./styles/App.css";


function App() {
  const [interfaceState, setInterfaceState] = useState(false);

  const handleInterrfaceToggle = () => {  
    setInterfaceState((prevState) => !prevState);
  }

  return (
    <div className="master-app">
      <Navbar />
      {!interfaceState ? (
        <div className="app-content">
          <h1 className="app-title">
            Ever wanted to be a know-it-all on any document or website within seconds?
          </h1>
          <button className="chat-access" onClick={() => handleInterrfaceToggle()}>
            Get started
          </button>
        </div>
      ) : <div className="app-content"><Interface handleInterrfaceToggle={handleInterrfaceToggle} /> </div>}
    </div>
  );
}

export default App;