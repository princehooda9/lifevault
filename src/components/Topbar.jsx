import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { Search } from "lucide-react"
import { formatBytes } from "../utils/formatters"
import { MAX_STORAGE_BYTES } from "../utils/constants"

export default function Topbar({ onSearch, totalBytes }) {
  const { user } = useAuth()
  const [query, setQuery] = useState("")

  const handleSearch = (e) => {
    setQuery(e.target.value)
    onSearch(e.target.value)
  }

  const usedPercent = Math.min((totalBytes / MAX_STORAGE_BYTES) * 100, 100).toFixed(1)

  return (
    <header style={{ position: "fixed", top: 0, left: "240px", right: 0, height: "64px", background: "#111111", borderBottom: "1px solid #2a2a2a", display: "flex", alignItems: "center", padding: "0 24px", gap: "16px", zIndex: 10 }}>
      
      {/* Search */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "10px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "8px 14px" }}>
        <Search size={16} color="#888" />
        <input
          type="text"
          placeholder="Search files and notes..."
          value={query}
          onChange={handleSearch}
          style={{ background: "transparent", border: "none", outline: "none", color: "white", fontSize: "0.9rem", flex: 1 }}
        />
      </div>

      {/* Storage pill */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "8px 14px", whiteSpace: "nowrap" }}>
        <div style={{ width: "80px", height: "6px", background: "#2a2a2a", borderRadius: "999px", overflow: "hidden" }}>
          <div style={{ width: `${usedPercent}%`, height: "100%", background: "#6366f1", borderRadius: "999px" }} />
        </div>
        <span style={{ color: "#888", fontSize: "0.8rem" }}>{formatBytes(totalBytes)} / 25 GB</span>
      </div>

      {/* Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {user?.photoURL
          ? <img src={user.photoURL} width={32} height={32} style={{ borderRadius: "50%" }} alt="avatar" />
          : <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.85rem" }}>{user?.email?.[0]?.toUpperCase()}</div>
        }
        <span style={{ color: "#888", fontSize: "0.85rem" }}>{user?.displayName || user?.email}</span>
      </div>
    </header>
  )
}