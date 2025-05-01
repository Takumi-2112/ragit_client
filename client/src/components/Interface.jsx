import "../styles/Interface.css";
import Chatfield from "./Chatfield";

function Interface() {
  return (
    <div className="master-interface">
      <h1 className="interface-title">Build Your Knowledge Pool Now</h1>
      <div className="interface-content">
        <Chatfield />
      </div>
    </div>
  );
}

export default Interface;
