import { useState } from "react";
import "../styles/Interface.css";
import Chatfield from "./Chatfield";
import PDFURLModal from "./PDFURLModal";

function Interface() {
  const [modalOpen, setModalOpen] = useState(false);
  const [pdf, setPDF] = useState(false);
  const [url, setURL] = useState(false);

  const handleModalClose = () => {
    setModalOpen(false);
    setPDF(false);
    setURL(false);
  };
  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handlePDFClick = () => {
    setModalOpen(true);
    setPDF(true);
  };

  const handleURLClick = () => {
    setModalOpen(true);
    setURL(true);
  };

  return (
    <>
      {modalOpen && (
        <PDFURLModal
          pdf={pdf}
          setPDF={setPDF}
          url={url}
          stURL={setURL}
          handleModalClose={handleModalClose}
        />
      )}
      <div className="master-interface">
        <h1 className="interface-title">Build Your Knowledge Pool Now</h1>
        <div className="interface-content">
          <Chatfield
            handleURLClick={handleURLClick}
            handlePDFClick={handlePDFClick}
          />
        </div>
      </div>
    </>
  );
}

export default Interface;
