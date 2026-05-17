import { X,Download } from "lucide-react"
import { useState, useEffect } from "react"

export default function FilePreviewModal({ file, onClose }) {
  const [textContent, setTextContent] = useState("")

  useEffect(() => {
    if (file.fileType?.includes("text")) {
      fetch(file.fileURL)
        .then(r => r.text())
        .then(setTextContent)
    }
  }, [file])

  const isImage = file.fileType?.startsWith("image")
  const isPDF = file.fileType?.includes("pdf") || file.fileName?.endsWith(".pdf")
  const isTXT = file.fileType?.includes("text")

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      
      <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "16px", width: "90%", maxWidth: "900px", maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #2a2a2a" }}>
          <p style={{ color: "white", margin: 0, fontSize: "0.95rem", fontWeight: "500" }}>{file.fileName}</p>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer" }}>
  <X size={20} />
</button>
        </div>

        {/* Preview */}
        <div style={{ flex: 1, overflow: "auto", padding: isImage ? "0" : "20px", display: "flex", alignItems: isImage ? "center" : "flex-start", justifyContent: "center", background: "#0a0a0a" }}>
          
          {isImage && (
            <img src={file.fileURL} alt={file.fileName}
              style={{ maxWidth: "100%", maxHeight: "75vh", objectFit: "contain" }} />
          )}

          {isPDF && (
  <iframe
    src={file.fileURL.replace("/upload/", "/upload/fl_sanitize/")}
    title={file.fileName}
    style={{ width: "100%", height: "75vh", border: "none", borderRadius: "8px" }}
  />
)}

          {isTXT && (
            <pre style={{ color: "#ccc", fontSize: "0.9rem", lineHeight: "1.7", whiteSpace: "pre-wrap", wordBreak: "break-word", width: "100%", margin: 0 }}>
              {textContent || "Loading..."}
            </pre>
          )}

          {!isImage && !isPDF && !isTXT && (
            <div style={{ textAlign: "center", padding: "60px" }}>
              <p style={{ fontSize: "4rem", margin: "0 0 16px" }}>📄</p>
              <p style={{ color: "white", fontSize: "1.1rem", margin: "0 0 8px" }}>Preview not available</p>
              <p style={{ color: "#888", margin: "0 0 24px" }}>This file type can't be previewed in browser</p>
              <a href={file.fileURL} download target="_blank" rel="noreferrer">
                <button style={{ padding: "10px 24px", background: "#6366f1", border: "none", borderRadius: "8px", color: "white", cursor: "pointer" }}>
                  Download to View
                </button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}