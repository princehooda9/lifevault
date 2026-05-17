import { useAuth } from "../hooks/useAuth"
import { useFiles } from "../hooks/useFiles"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import FileCard from "../components/FileCard"
import { useState } from "react"

const SECTIONS = [
  { level: "Important", color: "#f87171", emoji: "🔴" },
  { level: "Urgent", color: "#fb923c", emoji: "🟠" },
  { level: "Frequent", color: "#60a5fa", emoji: "🔵" },
  { level: "Archived", color: "#9ca3af", emoji: "⬜" },
]

export default function PriorityVault() {
  const { user } = useAuth()
  const { files, loading, refresh } = useFiles(user?.uid)
  const [search, setSearch] = useState("")

  const totalBytes = files.reduce((acc, f) => acc + (f.fileSize || 0), 0)
  const priorityCount = files.filter(f => f.priorityLevel && f.priorityLevel !== "Archived").length

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Sidebar priorityCount={priorityCount} onCategorySelect={() => {}} activeCategory="" />
      <Topbar onSearch={setSearch} totalBytes={totalBytes} />
      <main style={{ marginLeft: "240px", paddingTop: "88px", padding: "88px 32px 32px" }}>
        
        <h2 style={{ color: "white", margin: "0 0 8px" }}>Priority Vault</h2>
        <p style={{ color: "#888", margin: "0 0 32px" }}>Files organized by priority level</p>

        {SECTIONS.map(({ level, color, emoji }) => {
          const sectionFiles = files.filter(f =>
            f.priorityLevel === level &&
            f.fileName?.toLowerCase().includes(search.toLowerCase())
          )
          return (
            <section key={level} style={{ marginBottom: "40px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid #2a2a2a" }}>
                <span>{emoji}</span>
                <h3 style={{ color, margin: 0, fontSize: "1rem" }}>{level}</h3>
                <span style={{ color: "#888", fontSize: "0.85rem" }}>({sectionFiles.length} files)</span>
              </div>

              {sectionFiles.length === 0 ? (
                <p style={{ color: "#888", fontSize: "0.85rem" }}>No {level.toLowerCase()} files yet</p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
                  {sectionFiles.map(f => <FileCard key={f.id} file={f} onRefresh={refresh} />)}
                </div>
              )}
            </section>
          )
        })}
      </main>
    </div>
  )
}