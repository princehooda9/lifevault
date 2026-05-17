import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { useFiles } from "../hooks/useFiles"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import FileCard from "../components/FileCard"
import { groupFilesByYearCategory } from "../utils/groupingLogic"
import { ChevronDown, ChevronRight } from "lucide-react"

export default function Archive() {
  const { user } = useAuth()
  const { files, loading, refresh } = useFiles(user?.uid)
  const [search, setSearch] = useState("")
  const [collapsed, setCollapsed] = useState({})

  const totalBytes = files.reduce((acc, f) => acc + (f.fileSize || 0), 0)
  const priorityCount = files.filter(f => f.priorityLevel && f.priorityLevel !== "Archived").length

  const archived = files.filter(f =>
    f.priorityLevel === "Archived" &&
    f.fileName?.toLowerCase().includes(search.toLowerCase())
  )

  const grouped = groupFilesByYearCategory(archived)
  const years = Object.keys(grouped).sort((a, b) => b - a)

  const toggle = (key) => setCollapsed(p => ({ ...p, [key]: !p[key] }))

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Sidebar priorityCount={priorityCount} onCategorySelect={() => {}} activeCategory="" />
      <Topbar onSearch={setSearch} totalBytes={totalBytes} />
      <main style={{ marginLeft: "240px", paddingTop: "88px", padding: "88px 32px 32px" }}>

        <h2 style={{ color: "white", margin: "0 0 8px" }}>Digital Archive</h2>
        <p style={{ color: "#888", margin: "0 0 32px" }}>Files marked as Archived, organized by year and category</p>

        {archived.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: "3rem", margin: "0 0 16px" }}>🗄️</p>
            <p style={{ color: "white", fontSize: "1.1rem", margin: "0 0 8px" }}>No archived files</p>
            <p style={{ color: "#888" }}>Mark files as "Archived" in Priority Vault to see them here</p>
          </div>
        )}

        {years.map(year => (
          <div key={year} style={{ marginBottom: "32px" }}>
            <button onClick={() => toggle(year)} style={{ display: "flex", alignItems: "center", gap: "8px", background: "transparent", border: "none", color: "white", cursor: "pointer", fontSize: "1.1rem", fontWeight: "600", marginBottom: "16px", padding: 0 }}>
              {collapsed[year] ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
              📅 {year}
            </button>

            {!collapsed[year] && Object.entries(grouped[year]).map(([cat, catFiles]) => (
              <div key={cat} style={{ marginLeft: "24px", marginBottom: "24px" }}>
                <button onClick={() => toggle(`${year}-${cat}`)} style={{ display: "flex", alignItems: "center", gap: "8px", background: "transparent", border: "none", color: "#888", cursor: "pointer", fontSize: "0.9rem", marginBottom: "12px", padding: 0 }}>
                  {collapsed[`${year}-${cat}`] ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                  📂 {cat} ({catFiles.length})
                </button>

                {!collapsed[`${year}-${cat}`] && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px", marginLeft: "24px" }}>
                    {catFiles.map(f => <FileCard key={f.id} file={f} onRefresh={refresh} />)}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </main>
    </div>
  )
}