import { useState, useRef } from "react"
import { uploadFile } from "../services/fileService"
import { useAuth } from "../hooks/useAuth"
import { CATEGORIES, SMART_GROUPS, PRIORITY_LEVELS } from "../utils/constants"
import { detectSmartGroup } from "../utils/groupingLogic"
import { Upload, X } from "lucide-react"
import toast from "react-hot-toast"

const ACCEPTED = ".pdf,.doc,.docx,.ppt,.pptx,.zip,.txt,.jpg,.jpeg,.png,.gif,.webp"

export default function UploadModal({ onClose, onRefresh, defaultFolderId = null }) {
  const { user } = useAuth()
  const [file, setFile] = useState(null)
  const [category, setCategory] = useState("Personal")
  const [smartGroup, setSmartGroup] = useState("")
  const [priority, setPriority] = useState("")
  const [reminder, setReminder] = useState("")
  const [uploading, setUploading] = useState(false)
  const [drag, setDrag] = useState(false)
  const inputRef = useRef()
  const [folderId] = useState(defaultFolderId)

  const handleFile = (f) => {
    setFile(f)
    setSmartGroup(detectSmartGroup(f.name, f.type))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDrag(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file")
    try {
      setUploading(true)
      await uploadFile(file, category, smartGroup, reminder, priority, user.uid, folderId)
      toast.success("File uploaded!")
      onRefresh()
      onClose()
    } catch (err) {
      toast.error("Upload failed: " + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "480px" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h3 style={{ color: "white", margin: 0 }}>Upload File</h3>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer" }}><X size={20} /></button>
        </div>

        {/* Drop Zone */}
        <div
          onClick={() => inputRef.current.click()}
          onDragOver={e => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
          style={{ border: `2px dashed ${drag ? "#6366f1" : "#2a2a2a"}`, borderRadius: "12px", padding: "40px", textAlign: "center", cursor: "pointer", marginBottom: "20px", transition: "border-color 0.15s", background: drag ? "rgba(99,102,241,0.05)" : "transparent" }}
        >
          <Upload size={32} color={drag ? "#6366f1" : "#888"} style={{ margin: "0 auto 12px" }} />
          {file
            ? <p style={{ color: "white", margin: 0 }}>{file.name}</p>
            : <>
                <p style={{ color: "white", margin: "0 0 4px" }}>Drag & drop or click to browse</p>
                <p style={{ color: "#888", margin: 0, fontSize: "0.85rem" }}>PDF, DOCX, PPTX, ZIP, Images, TXT</p>
              </>
          }
          <input ref={inputRef} type="file" accept={ACCEPTED} style={{ display: "none" }} onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
        </div>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
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

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={uploading}
          style={{ width: "100%", padding: "12px", background: "#6366f1", border: "none", borderRadius: "8px", color: "white", cursor: "pointer", fontSize: "0.95rem", fontWeight: "600" }}
        >
          {uploading ? "Uploading..." : "Upload File"}
        </button>
      </div>
    </div>
  )
}