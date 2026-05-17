import { useState, useEffect, useCallback } from "react"
import { useAuth } from "../hooks/useAuth"
import { useFiles } from "../hooks/useFiles"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import StorageBar from "../components/StorageBar"
import FileCard from "../components/FileCard"
import UploadModal from "../components/UploadModal"
import { groupFilesBySmartGroup } from "../utils/groupingLogic"
import { Upload, Pin } from "lucide-react"
import { useNotes } from "../hooks/useNotes"
import { createNote, updateNote } from "../services/noteService"
import { Calendar } from "lucide-react"
import toast from "react-hot-toast"

export default function Dashboard() {
  const { user } = useAuth()
  const { files, loading, refresh } = useFiles(user?.uid)
  const { notes } = useNotes(user?.uid)
  const [search, setSearch] = useState("")
  const [showUpload, setShowUpload] = useState(false)
  const [view, setView] = useState("grid") // grid | list | grouped
  const [activeCategory, setActiveCategory] = useState("")

  // Keyboard shortcut Ctrl+U
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "u") {
        e.preventDefault()
        setShowUpload(true)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  const totalBytes = files.reduce((acc, f) => acc + (f.fileSize || 0), 0)
  const priorityCount = files.filter(f => f.priorityLevel && f.priorityLevel !== "Archived").length

  const filtered = files.filter(f => {
    const matchSearch = f.fileName?.toLowerCase().includes(search.toLowerCase())
    const matchCategory = activeCategory ? f.category === activeCategory : true
    return matchSearch && matchCategory
  })

  const pinned = filtered.filter(f => f.isPinned)
  const recent = filtered.filter(f => !f.isPinned).slice(0, 6)
  const grouped = groupFilesBySmartGroup(filtered)

  const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }
  const listStyle = { display: "flex", flexDirection: "column", gap: "12px" }

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Sidebar priorityCount={priorityCount} onCategorySelect={setActiveCategory} activeCategory={activeCategory} />
      <Topbar onSearch={setSearch} totalBytes={totalBytes} />

      <main style={{ marginLeft: "240px", paddingTop: "88px", padding: "88px 32px 32px" }}>
        
        {/* Welcome + Upload */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ color: "white", margin: 0 }}>Welcome back, {user?.displayName?.split(" ")[0] || "there"} 👋</h2>
          <div style={{ display: "flex", gap: "8px" }}>
            {["grid", "list", "grouped"].map(v => (
              <button key={v} onClick={() => setView(v)} style={{ padding: "8px 14px", background: view === v ? "#6366f1" : "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", color: view === v ? "white" : "#888", cursor: "pointer", fontSize: "0.85rem", textTransform: "capitalize" }}>
                {v}
              </button>
            ))}
            <button onClick={() => setShowUpload(true)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "#6366f1", border: "none", borderRadius: "8px", color: "white", cursor: "pointer", fontSize: "0.85rem" }}>
              <Upload size={16} /> Upload <span style={{ opacity: 0.7, fontSize: "0.75rem" }}>Ctrl+U</span>
            </button>
          </div>
        </div>
        {/* Quick Capture */}
        <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "16px", marginBottom: "24px", display: "flex", gap: "12px", alignItems: "center" }}>
        <span style={{ fontSize: "1.2rem" }}>⚡</span>
        <input
        placeholder="Quick note... mention a deadline or plan and it'll be detected automatically"
        onKeyDown={async (e) => {
        if (e.key === "Enter" && e.target.value.trim()) {
          const id = await createNote(user.uid)
          await updateNote(id, `Quick Note — ${new Date().toLocaleDateString()}`, `<p>${e.target.value.trim()}</p>`)
          e.target.value = ""
          toast.success("Note saved! Check Notes page.")
          refresh()
      }
    }}
    style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "white", fontSize: "0.9rem" }}
  />
  <span style={{ color: "#888", fontSize: "0.78rem", whiteSpace: "nowrap" }}>Press Enter to save</span>
</div>
        {/* Detected Deadlines */}
        {notes.flatMap(n => n.detectedEvents || []).length > 0 && (
        <div style={{ background: "#1a1a1a", border: "1px solid #f59e0b40", borderRadius: "12px", padding: "20px", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <Calendar size={16} color="#f59e0b" />
          <h3 style={{ color: "white", margin: 0, fontSize: "0.95rem" }}>Upcoming Deadlines</h3>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {notes.flatMap(n => (n.detectedEvents || []).map(ev => ({ ...ev, noteTitle: n.title }))).map((ev, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: "6px", background: "#f59e0b20", border: "1px solid #f59e0b40", borderRadius: "999px", padding: "6px 14px", color: "#f59e0b", fontSize: "0.85rem" }}>
          <Calendar size={12} /> {ev.label} · {ev.date}
        </span>
      ))}
    </div>
  </div>
)}
        {/* Storage Bar */}
        <div style={{ marginBottom: "32px" }}>
          <StorageBar files={files} />
        </div>

        {/* Pinned */}
        {pinned.length > 0 && (
          <section style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <Pin size={16} color="#6366f1" />
              <h3 style={{ color: "white", margin: 0, fontSize: "1rem" }}>Pinned Files</h3>
            </div>
            <div style={gridStyle}>
              {pinned.map(f => <FileCard key={f.id} file={f} onRefresh={refresh} />)}
            </div>
          </section>
        )}

        {/* Files */}
        <section>
          <h3 style={{ color: "white", margin: "0 0 16px", fontSize: "1rem" }}>
            {activeCategory ? `${activeCategory} Files` : "All Files"}
            <span style={{ color: "#888", fontWeight: "normal", fontSize: "0.85rem", marginLeft: "8px" }}>({filtered.length})</span>
          </h3>

          {loading && (
            <div style={gridStyle}>
              {[1,2,3].map(i => (
                <div key={i} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "16px", height: "160px", animation: "pulse 1.5s infinite" }} />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ fontSize: "3rem", margin: "0 0 16px" }}>📁</p>
              <p style={{ color: "white", fontSize: "1.1rem", margin: "0 0 8px" }}>No files yet</p>
              <p style={{ color: "#888", margin: "0 0 24px" }}>Upload your first file to get started</p>
              <button onClick={() => setShowUpload(true)} style={{ padding: "10px 24px", background: "#6366f1", border: "none", borderRadius: "8px", color: "white", cursor: "pointer" }}>
                Upload File
              </button>
            </div>
          )}

          {!loading && view === "grouped" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              {Object.entries(grouped).map(([group, groupFiles]) => (
                <div key={group}>
                  <h4 style={{ color: "#888", margin: "0 0 12px", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{group} ({groupFiles.length})</h4>
                  <div style={gridStyle}>
                    {groupFiles.map(f => <FileCard key={f.id} file={f} onRefresh={refresh} />)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && view !== "grouped" && (
            <div style={view === "grid" ? gridStyle : listStyle}>
              {filtered.map(f => <FileCard key={f.id} file={f} onRefresh={refresh} />)}
            </div>
          )}
        </section>
      </main>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onRefresh={refresh} />}
    </div>
  )
}