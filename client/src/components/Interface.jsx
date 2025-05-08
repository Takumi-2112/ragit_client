import { useState } from "react";
import "../styles/Interface.css";
import Chatfield from "./Chatfield";
import PDFURLModal from "./PDFURLModal";

function Interface() {
  const [modalOpen, setModalOpen] = useState(true);
  const [pdf, setPDF] = useState(false);
  const [url, setURL] = useState(false);

  const handleModalClose = () => {
    setModalOpen(false);
    setPDF(false);
    setURL(false);
  }
  const handleModalOpen = () => {
    setModalOpen(true);
  }

  const handlePDFClick = () => {
    setPDF(true);
  }

  const handleURLClick = () => {
    setURL(true);
  }

  return (
    <>
      {modalOpen && <PDFURLModal />}
      <div className="master-interface">
        <h1 className="interface-title">Build Your Knowledge Pool Now</h1>
        <div className="interface-content">
          <Chatfield />
        </div>
      </div>
    </>
  );
}

export default Interface;
