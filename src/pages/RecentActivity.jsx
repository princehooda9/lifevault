import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { useFiles } from "../hooks/useFiles"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import { formatBytes, formatRelative } from "../utils/formatters"
import { Upload, Eye, Edit } from "lucide-react"

export default function RecentActivity() {
  const { user } = useAuth()
  const { files, loading, refresh } = useFiles(user?.uid)
  const [search, setSearch] = useState("")

  const totalBytes = files.reduce((acc, f) => acc + (f.fileSize || 0), 0)
  const priorityCount = files.filter(f => f.priorityLevel && f.priorityLevel !== "Archived").length

  const activities = files
    .flatMap(f => [
      { type: "uploaded", file: f, time: f.uploadedAt, icon: Upload, color: "#6366f1", label: "Uploaded" },
      f.lastAccessed?.seconds !== f.uploadedAt?.seconds
        ? { type: "accessed", file: f, time: f.lastAccessed, icon: Eye, color: "#10b981", label: "Accessed" }
        : null,
      f.lastModified?.seconds !== f.uploadedAt?.seconds
        ? { type: "modified", file: f, time: f.lastModified, icon: Edit, color: "#f59e0b", label: "Modified" }
        : null,
    ])
    .filter(Boolean)
    .filter(a => a.file.fileName?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (b.time?.seconds || 0) - (a.time?.seconds || 0))
    .slice(0, 50)

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Sidebar priorityCount={priorityCount} onCategorySelect={() => {}} activeCategory="" />
      <Topbar onSearch={setSearch} totalBytes={totalBytes} />
      <main style={{ marginLeft: "240px", paddingTop: "88px", padding: "88px 32px 32px" }}>

        <h2 style={{ color: "white", margin: "0 0 8px" }}>Recent Activity</h2>
        <p style={{ color: "#888", margin: "0 0 32px" }}>Track your file uploads, access, and modifications</p>

        {activities.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: "3rem", margin: "0 0 16px" }}>📊</p>
            <p style={{ color: "white", fontSize: "1.1rem", margin: "0 0 8px" }}>No activity yet</p>
            <p style={{ color: "#888" }}>Upload files to start tracking activity</p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {activities.map((a, i) => {
            const Icon = a.icon
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "16px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `${a.color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={16} color={a.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: "white", margin: 0, fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    <span style={{ color: a.color }}>{a.label}</span> · {a.file.fileName}
                  </p>
                  <p style={{ color: "#888", margin: "2px 0 0", fontSize: "0.8rem" }}>
                    {a.file.category} · {formatBytes(a.file.fileSize)}
                  </p>
                </div>
                <span style={{ color: "#888", fontSize: "0.8rem", flexShrink: 0 }}>{formatRelative(a.time)}</span>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}