import "../styles/PDFURLModal.css";

function PDFURLModal({ pdf, setPDF, url, stURL, handleModalClose }) {


  const handleSubmit = async (e) => {
  e.preventDefault();

  if (pdf) {
    // If PDF is selected, send it to the server
    const formData = new FormData();
    formData.append("file", pdf);

    try {
      const response = await fetch("http://localhost:8080/upload-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload PDF")
       console.log("PDF upload response:", response);

      const data = await response.json();
      console.log("Server response:", data);
      alert("PDF Uploaded and processed successfully!");

    } catch (error) {
      console.error("Error uploading PDF:", error.message);
      alert("Failed to upload PDF");
    }
  } else if (url) {
    try {
      const response = await fetch("http://localhost:8080/ingest-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error("Failed to ingest URL");

      const data = await response.json();
      console.log("Server response:", data);
      alert("URL ingested successfully!");

    } catch (error) {
      console.error("Error ingesting URL:", error.message);
      alert("Failed to ingest URL");
    }
  } else {
    alert("Please select a PDF or enter a URL.");
  }

  handleModalClose();
};

  return (
    <div className="modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-close-container">
            <i className="fa-solid fa-xmark close-modal" onClick={handleModalClose}></i>
          </div>
          <form className="modal-form" onSubmit={handleSubmit}>
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
