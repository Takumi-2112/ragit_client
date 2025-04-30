import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import "./styles/App.css";

function App() {
  return (
    <div className="master-app">
      <Navbar />
      <div className="app-content">
        <h1 className="app-title">Ever wanted to be a know-it-all on any document or website within seconds?</h1>
        <button className="" onClick={() => alert("Test complete!")}>Do it here!</button>
      </div>
    </div>
  );
}

export default App;
