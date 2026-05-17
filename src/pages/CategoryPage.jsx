import { useParams } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { useFiles } from "../hooks/useFiles"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import FileCard from "../components/FileCard"
import UploadModal from "../components/UploadModal"
import { useState } from "react"
import { Upload } from "lucide-react"

export default function CategoryPage() {
  const { category } = useParams()
  const { user } = useAuth()
  const { files, loading, refresh } = useFiles(user?.uid)
  const [search, setSearch] = useState("")
  const [showUpload, setShowUpload] = useState(false)

  const totalBytes = files.reduce((acc, f) => acc + (f.fileSize || 0), 0)
  const priorityCount = files.filter(f => f.priorityLevel && f.priorityLevel !== "Archived").length

  const filtered = files.filter(f =>
    f.category === decodeURIComponent(category) &&
    f.fileName?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Sidebar priorityCount={priorityCount} onCategorySelect={() => {}} activeCategory={decodeURIComponent(category)} />
      <Topbar onSearch={setSearch} totalBytes={totalBytes} />

      <main style={{ marginLeft: "240px", paddingTop: "88px", padding: "88px 32px 32px" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div>
            <h2 style={{ color: "white", margin: "0 0 4px" }}>{decodeURIComponent(category)}</h2>
            <p style={{ color: "#888", margin: 0, fontSize: "0.9rem" }}>{filtered.length} file{filtered.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={() => setShowUpload(true)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "#6366f1", border: "none", borderRadius: "8px", color: "white", cursor: "pointer", fontSize: "0.85rem" }}>
            <Upload size={16} /> Upload
          </button>
        </div>

        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "12px", height: "160px" }} />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: "3rem", margin: "0 0 16px" }}>📂</p>
            <p style={{ color: "white", fontSize: "1.1rem", margin: "0 0 8px" }}>No files in {decodeURIComponent(category)}</p>
            <p style={{ color: "#888", margin: "0 0 24px" }}>Upload a file and assign it to this category</p>
            <button onClick={() => setShowUpload(true)} style={{ padding: "10px 24px", background: "#6366f1", border: "none", borderRadius: "8px", color: "white", cursor: "pointer" }}>
              Upload File
            </button>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {filtered.map(f => <FileCard key={f.id} file={f} onRefresh={refresh} />)}
          </div>
        )}
      </main>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onRefresh={refresh} />}
    </div>
  )
}