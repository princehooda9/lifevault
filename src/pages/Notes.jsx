import { useState, useEffect, useCallback } from "react"
import { useAuth } from "../hooks/useAuth"
import { useNotes } from "../hooks/useNotes"
import { useFiles } from "../hooks/useFiles"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import NoteEditor from "../components/NoteEditor"
import { createNote, updateNote, deleteNote } from "../services/noteService"
import { formatRelative } from "../utils/formatters"
import { Plus, Trash2, Calendar } from "lucide-react"
import toast from "react-hot-toast"

export default function Notes() {
  const { user } = useAuth()
  const { notes, loading, refresh } = useNotes(user?.uid)
  const { files } = useFiles(user?.uid)
  const [search, setSearch] = useState("")
  const [activeNote, setActiveNote] = useState(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [saving, setSaving] = useState(false)

  const totalBytes = files.reduce((acc, f) => acc + (f.fileSize || 0), 0)
  const priorityCount = files.filter(f => f.priorityLevel && f.priorityLevel !== "Archived").length

  // Auto-save
  useEffect(() => {
    if (!activeNote) return
    const timer = setTimeout(async () => {
      setSaving(true)
      await updateNote(activeNote.id, title, content)
      setSaving(false)
      refresh()
    }, 1000)
    return () => clearTimeout(timer)
  }, [title, content])

  const handleSelect = (note) => {
    setActiveNote(note)
    setTitle(note.title)
    setContent(note.content)
  }

  const handleNew = async () => {
    const id = await createNote(user.uid)
    await refresh()
    toast.success("New note created")
  }

  const handleDelete = async (noteId) => {
    if (!confirm("Delete this note?")) return
    await deleteNote(noteId)
    if (activeNote?.id === noteId) setActiveNote(null)
    refresh()
    toast.success("Note deleted")
  }

  const filtered = notes.filter(n =>
    n.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Sidebar priorityCount={priorityCount} onCategorySelect={() => {}} activeCategory="" />
      <Topbar onSearch={setSearch} totalBytes={totalBytes} />

      <main style={{ marginLeft: "240px", paddingTop: "64px", height: "100vh", display: "flex" }}>
        
        {/* Notes List */}
        <div style={{ width: "280px", borderRight: "1px solid #2a2a2a", display: "flex", flexDirection: "column", height: "calc(100vh - 64px)", overflow: "hidden" }}>
          <div style={{ padding: "16px", borderBottom: "1px solid #2a2a2a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ color: "white", margin: 0, fontSize: "0.95rem" }}>Notes</h3>
            <button onClick={handleNew} style={{ background: "#6366f1", border: "none", borderRadius: "6px", color: "white", cursor: "pointer", padding: "6px 10px", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.85rem" }}>
              <Plus size={14} /> New
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 16px" }}>
                <p style={{ fontSize: "2rem", margin: "0 0 8px" }}>📝</p>
                <p style={{ color: "#888", fontSize: "0.85rem" }}>No notes yet. Create one!</p>
              </div>
            )}
            {filtered.map(note => (
              <div
                key={note.id}
                onClick={() => handleSelect(note)}
                style={{ padding: "12px", borderRadius: "8px", cursor: "pointer", marginBottom: "4px", background: activeNote?.id === note.id ? "#1a1a1a" : "transparent", border: `1px solid ${activeNote?.id === note.id ? "#2a2a2a" : "transparent"}`, position: "relative" }}
                onMouseEnter={e => e.currentTarget.style.background = "#1a1a1a"}
                onMouseLeave={e => e.currentTarget.style.background = activeNote?.id === note.id ? "#1a1a1a" : "transparent"}
              >
                <p style={{ color: "white", margin: "0 0 4px", fontSize: "0.9rem", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: "24px" }}>{note.title || "Untitled"}</p>
                <p style={{ color: "#888", margin: 0, fontSize: "0.78rem" }}>{formatRelative(note.updatedAt)}</p>
                
                {/* Detected events badge */}
                {note.detectedEvents?.length > 0 && (
                  <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#f59e0b", fontSize: "0.75rem", marginTop: "4px" }}>
                    <Calendar size={10} /> {note.detectedEvents.length} deadline{note.detectedEvents.length > 1 ? "s" : ""}
                  </span>
                )}

                <button
                  onClick={e => { e.stopPropagation(); handleDelete(note.id) }}
                  style={{ position: "absolute", top: "12px", right: "8px", background: "transparent", border: "none", color: "#888", cursor: "pointer", padding: "2px" }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "calc(100vh - 64px)", overflow: "hidden" }}>
          {activeNote ? (
            <>
              <div style={{ padding: "16px 24px", borderBottom: "1px solid #2a2a2a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  style={{ background: "transparent", border: "none", outline: "none", color: "white", fontSize: "1.1rem", fontWeight: "600", flex: 1 }}
                  placeholder="Note title..."
                />
                <span style={{ color: "#888", fontSize: "0.78rem" }}>{saving ? "Saving..." : "Saved"}</span>
              </div>

              {/* Detected Deadlines */}
              {activeNote.detectedEvents?.length > 0 && (
                <div style={{ padding: "12px 24px", borderBottom: "1px solid #2a2a2a", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {activeNote.detectedEvents.map((ev, i) => (
                    <span key={i} style={{ display: "flex", alignItems: "center", gap: "6px", background: "#f59e0b20", border: "1px solid #f59e0b40", borderRadius: "999px", padding: "4px 12px", color: "#f59e0b", fontSize: "0.8rem" }}>
                      <Calendar size={12} /> {ev.label} · {ev.date}
                    </span>
                  ))}
                </div>
              )}

              <div style={{ flex: 1, overflow: "auto" }}>
                <NoteEditor content={content} onChange={setContent} />
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
              <p style={{ fontSize: "3rem", margin: 0 }}>📝</p>
              <p style={{ color: "white", fontSize: "1.1rem", margin: 0 }}>Select a note or create a new one</p>
              <button onClick={handleNew} style={{ padding: "10px 24px", background: "#6366f1", border: "none", borderRadius: "8px", color: "white", cursor: "pointer" }}>
                + New Note
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}