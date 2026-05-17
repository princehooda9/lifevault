import { NavLink, useNavigate } from "react-router-dom"
import { logout } from "../services/authService"
import { useFiles } from "../hooks/useFiles"
import { useAuth } from "../hooks/useAuth"
import toast from "react-hot-toast"
import { LayoutDashboard, FileText, Shield, Clock, Archive,LogOut,  Folder } from "lucide-react"

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/notes", icon: FileText, label: "Notes" },
  { to: "/vault", icon: Shield, label: "Priority Vault" },
  { to: "/activity", icon: Clock, label: "Recent Activity" },
  { to: "/archive", icon: Archive, label: "Archives" },
  { to: "/folders", icon: Folder, label: "Folders" },
]

export default function Sidebar({ priorityCount, onCategorySelect, activeCategory }) {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleLogout = async () => {
    await logout()
    toast.success("Logged out")
    navigate("/login")
  }

  return (
    <aside style={{ width: "240px", height: "100vh", background: "#111111", borderRight: "1px solid #2a2a2a", display: "flex", flexDirection: "column",overflowY: "auto", padding: "24px 0", position: "fixed", top: 0, left: 0 }}>
      
      {/* Logo */}
      <div style={{ padding: "0 24px 32px" }}>
        <h1 style={{ color: "#6366f1", fontSize: "1.4rem", fontWeight: "bold", margin: 0 }}>⚡ LifeVault</h1>
        <p style={{ color: "#888", fontSize: "0.75rem", margin: "4px 0 0" }}>Personal Cloud Workspace</p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px", padding: "0 12px" }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: "12px",
              padding: "10px 12px", borderRadius: "8px", textDecoration: "none",
              color: isActive ? "#fff" : "#888",
              background: isActive ? "#1a1a1a" : "transparent",
              fontSize: "0.9rem", transition: "all 0.15s",
            })}
          >
            <Icon size={18} />
            <span>{label}</span>
            {label === "Priority Vault" && priorityCount > 0 && (
              <span style={{ marginLeft: "auto", background: "#6366f1", color: "white", borderRadius: "999px", padding: "2px 8px", fontSize: "0.75rem" }}>
                {priorityCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Categories */}
      <div style={{ padding: "0 12px", marginBottom: "8px" }}>
        <p style={{ color: "#888", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", padding: "0 12px", marginBottom: "4px" }}>Categories</p>
        {["Personal","Work","Career","Finance","Certificates","Projects","Notes","Important Documents","Archive"].map(cat => (
          <button key={cat}
            onClick={() => navigate(`/category/${encodeURIComponent(cat)}`)}
            style={{ width: "100%", textAlign: "left", padding: "8px 12px", borderRadius: "8px", background: activeCategory === cat ? "#1a1a1a" : "transparent", border: "none", color: activeCategory === cat ? "white" : "#888", cursor: "pointer", fontSize: "0.85rem" }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Logout */}
      <div style={{ padding: "0 12px" }}>
        <button
          onClick={handleLogout}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "8px", background: "transparent", border: "none", color: "#888", cursor: "pointer", fontSize: "0.9rem" }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}