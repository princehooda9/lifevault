import { formatBytes } from "../utils/formatters"
import { MAX_STORAGE_BYTES } from "../utils/constants"

export default function StorageBar({ files }) {
  const byType = files.reduce((acc, f) => {
    const type = f.fileType?.startsWith("image") ? "Images"
      : f.fileType?.includes("pdf") ? "PDFs"
      : f.fileType?.includes("zip") ? "Archives"
      : "Documents"
    acc[type] = (acc[type] || 0) + (f.fileSize || 0)
    return acc
  }, {})

  const total = Object.values(byType).reduce((a, b) => a + b, 0)
  const usedPercent = Math.min((total / MAX_STORAGE_BYTES) * 100, 100).toFixed(1)

  const colors = { Images: "#6366f1", PDFs: "#f59e0b", Archives: "#10b981", Documents: "#3b82f6" }

  return (
    <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
        <h3 style={{ color: "white", margin: 0, fontSize: "0.95rem" }}>Storage Usage</h3>
        <span style={{ color: "#888", fontSize: "0.85rem" }}>{formatBytes(total)} / 25 GB</span>
      </div>

      {/* Main bar */}
      <div style={{ height: "8px", background: "#2a2a2a", borderRadius: "999px", overflow: "hidden", marginBottom: "16px" }}>
        <div style={{ width: `${usedPercent}%`, height: "100%", background: "#6366f1", borderRadius: "999px" }} />
      </div>

      {/* Breakdown */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {Object.entries(byType).map(([type, bytes]) => (
          <div key={type} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: colors[type] || "#888" }} />
              <span style={{ color: "#888", fontSize: "0.85rem" }}>{type}</span>
            </div>
            <span style={{ color: "#888", fontSize: "0.85rem" }}>{formatBytes(bytes)}</span>
          </div>
        ))}
        {Object.keys(byType).length === 0 && (
          <p style={{ color: "#888", fontSize: "0.85rem", margin: 0 }}>No files uploaded yet</p>
        )}
      </div>
    </div>
  )
}