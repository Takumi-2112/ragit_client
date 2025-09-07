import "../styles/PDFURLModal.css";

function PDFURLModal({ pdf, setPDF, url, stURL, handlePDFURLModalClose }) {

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get the token from localStorage
    const token = localStorage.getItem("token");
    
    if (!token) {
      alert("Authentication required. Please log in again.");
      return;
    }

    if (pdf) {
      // If PDF is selected, send it to the server
      const formData = new FormData();
      formData.append("file", pdf);

      try {
        const response = await fetch("https://localhost:8223/upload-pdf", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}` // Add auth token
          },
          body: formData,
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Authentication expired. Please log in again.");
          }
          throw new Error("Failed to upload PDF");
        }
        
        console.log("PDF upload response:", response);

        const data = await response.json();
        console.log("Server response:", data);
        alert("PDF Uploaded and processed successfully!");

      } catch (error) {
        console.error("Error uploading PDF:", error.message);
        alert(`Failed to upload PDF: ${error.message}`);
      }
    } else if (url) {
      try {
        const response = await fetch("https://localhost:8223/ingest-url", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Add auth token
          },
          body: JSON.stringify({ url }),
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Authentication expired. Please log in again.");
          }
          throw new Error("Failed to ingest URL");
        }

        const data = await response.json();
        console.log("Server response:", data);
        alert("URL ingested successfully!");

      } catch (error) {
        console.error("Error ingesting URL:", error.message);
        alert(`Failed to ingest URL: ${error.message}`);
      }
    } else {
      alert("Please select a PDF or enter a URL.");
    }

    handlePDFURLModalClose();
  };

  return (
    <div className="modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-close-container">
            <i className="fa-solid fa-xmark close-modal" onClick={handlePDFURLModalClose}></i>
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