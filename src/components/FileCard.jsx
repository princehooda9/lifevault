import { useState } from "react"
import { Download, Trash2, Link, Pin, MoreVertical } from "lucide-react"
import { deleteFile, togglePin, updateFile } from "../services/fileService"
import { formatBytes, formatRelative } from "../utils/formatters"
import { CATEGORIES, SMART_GROUPS, PRIORITY_LEVELS } from "../utils/constants"
import PriorityBadge from "./PriorityBadge"
import ReminderBadge from "./ReminderBadge"
import FilePreviewModal from "./FilePreviewModal"
import { Eye } from "lucide-react"
import toast from "react-hot-toast"
import { useFolders } from "../hooks/useFolders"
import { useAuth } from "../hooks/useAuth"

const FILE_ICONS = {
  pdf: "📄", image: "🖼️", zip: "🗜️",
  doc: "📝", ppt: "📊", txt: "📃", default: "📁"
}

function getIcon(fileType) {
  if (!fileType) return FILE_ICONS.default
  if (fileType.includes("pdf")) return FILE_ICONS.pdf
  if (fileType.startsWith("image")) return FILE_ICONS.image
  if (fileType.includes("zip")) return FILE_ICONS.zip
  if (fileType.includes("word") || fileType.includes("doc")) return FILE_ICONS.doc
  if (fileType.includes("presentation") || fileType.includes("ppt")) return FILE_ICONS.ppt
  if (fileType.includes("text")) return FILE_ICONS.txt
  return FILE_ICONS.default
}

export default function FileCard({ file, onRefresh }) {
  const [showMenu, setShowMenu] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [priority, setPriority] = useState(file.priorityLevel || "")
  const [category, setCategory] = useState(file.category || "Personal")
  const [smartGroup, setSmartGroup] = useState(file.smartGroup || "Documents")
  const [reminder, setReminder] = useState(file.reminderDate || "")
  const [showPreview, setShowPreview] = useState(false)
  const [showRename, setShowRename] = useState(false)
  const [newName, setNewName] = useState(file.fileName)
  const { user } = useAuth()
  const { folders } = useFolders(user?.uid)
  const [showMove, setShowMove] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Delete this file?")) return
    await deleteFile(file.id)
    toast.success("File deleted")
    onRefresh()
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(file.fileURL)
    toast.success("Link copied!")
  }

  const handlePin = async () => {
    await togglePin(file.id, file.isPinned)
    toast.success(file.isPinned ? "Unpinned" : "Pinned!")
    onRefresh()
  }

  const handleSaveEdit = async () => {
    await updateFile(file.id, {
      priorityLevel: priority || null,
      category,
      smartGroup,
      reminderDate: reminder || null,
    })
    toast.success("File updated!")
    setShowEdit(false)
    onRefresh()
  }
  const handleRename = async () => {
  if (!newName.trim()) return toast.error("Name can't be empty")
  await updateFile(file.id, { fileName: newName.trim() })
  toast.success("File renamed!")
  setShowRename(false)
  onRefresh()
}

  return (
    <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "16px", position: "relative", transition: "border-color 0.15s" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#3a3a3a"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2a2a"}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: "1.8rem" }}>{getIcon(file.fileType)}</span>
          <div style={{ minWidth: 0 }}>
            <p style={{ color: "white", margin: 0, fontSize: "0.9rem", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.fileName}</p>
            <p style={{ color: "#888", margin: "2px 0 0", fontSize: "0.78rem" }}>{formatBytes(file.fileSize)} · {formatRelative(file.uploadedAt)}</p>
          </div>
        </div>
        <button onClick={() => setShowMenu(!showMenu)} style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer", padding: "4px" }}>
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Badges */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
        <span style={{ fontSize: "0.75rem", color: "#888", background: "#2a2a2a", padding: "2px 8px", borderRadius: "999px" }}>{file.category}</span>
        <span style={{ fontSize: "0.75rem", color: "#888", background: "#2a2a2a", padding: "2px 8px", borderRadius: "999px" }}>{file.smartGroup}</span>
        <PriorityBadge level={file.priorityLevel} />
      </div>

      <ReminderBadge date={file.reminderDate} />

      {/* Actions */}
      <div style={{ display: "flex", gap: "8px", marginTop: "12px",flexWrap: "wrap" }}>
        <a href={file.fileURL} target="_blank" rel="noreferrer" onClick={() => updateFile(file.id, { lastAccessed: new Date().toISOString() })}>
          <button style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 10px", background: "#2a2a2a", border: "none", borderRadius: "6px", color: "#888", cursor: "pointer", fontSize: "0.8rem" }}>
            <Download size={14} /> Download
          </button>
        </a>
        <button onClick={() => setShowPreview(true)} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 10px", background: "#2a2a2a", border: "none", borderRadius: "6px", color: "#888", cursor: "pointer", fontSize: "0.8rem" }}>
            <Eye size={14} /> Preview
        </button>
        <button onClick={handleCopyLink} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 10px", background: "#2a2a2a", border: "none", borderRadius: "6px", color: "#888", cursor: "pointer", fontSize: "0.8rem" }}>
          <Link size={14} /> Copy Link
        </button>
        <button onClick={handlePin} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 10px", background: file.isPinned ? "#6366f1" : "#2a2a2a", border: "none", borderRadius: "6px", color: file.isPinned ? "white" : "#888", cursor: "pointer", fontSize: "0.8rem" }}>
          <Pin size={14} /> {file.isPinned ? "Pinned" : "Pin"}
        </button>
        <button onClick={handleDelete} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 10px", background: "#2a2a2a", border: "none", borderRadius: "6px", color: "#f87171", cursor: "pointer", fontSize: "0.8rem", marginLeft: "auto" }}>
          <Trash2 size={14} />
        </button>
      </div>

      {/* Edit Panel */}
      {showMenu && (
        <div style={{ position: "absolute", top: "40px", right: "16px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "8px", zIndex: 20, minWidth: "160px" }}>
          <button onClick={() => { setShowEdit(true); setShowMenu(false) }} style={{ width: "100%", padding: "8px 12px", background: "transparent", border: "none", color: "white", cursor: "pointer", textAlign: "left", fontSize: "0.85rem", borderRadius: "6px" }}>
  ✏️ Edit Details
</button>
<button onClick={() => { setShowRename(true); setShowMenu(false) }} style={{ width: "100%", padding: "8px 12px", background: "transparent", border: "none", color: "white", cursor: "pointer", textAlign: "left", fontSize: "0.85rem", borderRadius: "6px" }}>
  ✏️ Rename File
</button>
<button onClick={() => { setShowMove(true); setShowMenu(false) }} style={{ width: "100%", padding: "8px 12px", background: "transparent", border: "none", color: "white", cursor: "pointer", textAlign: "left", fontSize: "0.85rem", borderRadius: "6px" }}>
  📁 Move to Folder
</button>
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "400px" }}>
            <h3 style={{ color: "white", margin: "0 0 24px" }}>Edit File Details</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: "10px", background: "#2a2a2a", border: "1px solid #3a3a3a", borderRadius: "8px", color: "white" }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={smartGroup} onChange={e => setSmartGroup(e.target.value)} style={{ padding: "10px", background: "#2a2a2a", border: "1px solid #3a3a3a", borderRadius: "8px", color: "white" }}>
                {SMART_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <select value={priority} onChange={e => setPriority(e.target.value)} style={{ padding: "10px", background: "#2a2a2a", border: "1px solid #3a3a3a", borderRadius: "8px", color: "white" }}>
                <option value="">No Priority</option>
                {PRIORITY_LEVELS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <input type="date" value={reminder} onChange={e => setReminder(e.target.value)} style={{ padding: "10px", background: "#2a2a2a", border: "1px solid #3a3a3a", borderRadius: "8px", color: "white" }} />
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button onClick={handleSaveEdit} style={{ flex: 1, padding: "10px", background: "#6366f1", border: "none", borderRadius: "8px", color: "white", cursor: "pointer" }}>Save</button>
              <button onClick={() => setShowEdit(false)} style={{ flex: 1, padding: "10px", background: "#2a2a2a", border: "none", borderRadius: "8px", color: "white", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}{showPreview && <FilePreviewModal file={file} onClose={() => setShowPreview(false)} />}
      {showRename && (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
    <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "400px" }}>
      <h3 style={{ color: "white", margin: "0 0 24px" }}>Rename File</h3>
      <input
        value={newName}
        onChange={e => setNewName(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleRename()}
        style={{ width: "100%", padding: "10px", background: "#2a2a2a", border: "1px solid #3a3a3a", borderRadius: "8px", color: "white", fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }}
      />
      <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
        <button onClick={handleRename} style={{ flex: 1, padding: "10px", background: "#6366f1", border: "none", borderRadius: "8px", color: "white", cursor: "pointer" }}>Rename</button>
        <button onClick={() => setShowRename(false)} style={{ flex: 1, padding: "10px", background: "#2a2a2a", border: "none", borderRadius: "8px", color: "white", cursor: "pointer" }}>Cancel</button>
      </div>
    </div>
  </div>
)}{showMove && (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
    <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "400px" }}>
      <h3 style={{ color: "white", margin: "0 0 24px" }}>Move to Folder</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "300px", overflowY: "auto" }}>
        <button onClick={async () => { await updateFile(file.id, { folderId: null }); toast.success("Moved to root!"); setShowMove(false); onRefresh() }}
          style={{ padding: "10px 12px", background: "#2a2a2a", border: "1px solid #3a3a3a", borderRadius: "8px", color: "white", cursor: "pointer", textAlign: "left", fontSize: "0.85rem" }}>
          📁 Root (No Folder)
        </button>
        {folders.map(f => (
          <button key={f.id} onClick={async () => { await updateFile(file.id, { folderId: f.id }); toast.success(`Moved to ${f.name}!`); setShowMove(false); onRefresh() }}
            style={{ padding: "10px 12px", background: file.folderId === f.id ? "#6366f120" : "#2a2a2a", border: `1px solid ${file.folderId === f.id ? "#6366f1" : "#3a3a3a"}`, borderRadius: "8px", color: "white", cursor: "pointer", textAlign: "left", fontSize: "0.85rem" }}>
            📁 {f.name}
          </button>
        ))}
      </div>
      <button onClick={() => setShowMove(false)} style={{ width: "100%", marginTop: "16px", padding: "10px", background: "#2a2a2a", border: "none", borderRadius: "8px", color: "white", cursor: "pointer" }}>Cancel</button>
    </div>
  </div>
)}
    </div>
  )
}