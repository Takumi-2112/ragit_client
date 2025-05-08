import "../styles/PDFURLModal.css";

function PDFURLModal({ pdf, setPDF, url, stURL, handleModalClose }) {
  return (
    <div className="modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-close-container">
            <i className="fa-solid fa-xmark close-modal" onClick={handleModalClose}></i>
          </div>
          <form>
            <div className="modal-inputs">
              {pdf && true ? (
                <>
                  <label
                    htmlFor="file-upload"
                    className="pdf-upload-label-title"
                  >
                    Upload PDF:
                  </label>
                  <input
                    type="file"
                    id="pdf-upload"
                    accept="application/pdf"
                    className="pdf-upload-input"  
                    onChange={(e) => setPDF(e.target.files[0])}
                  />
                </>
              ) : (
                <>
                  <label htmlFor="url-input" className="url-input-label-title">
                    Enter URL:
                  </label>
                  <input
                    type="text"
                    id="url-input"
                    placeholder="Enter URL"
                    onChange={(e) => stURL(e.target.value)}
                  />
                </>
              )}
              <button className="form-submit-button">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PDFURLModal;
