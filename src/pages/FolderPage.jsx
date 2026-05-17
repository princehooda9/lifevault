import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { useFiles } from "../hooks/useFiles"
import { useFolders } from "../hooks/useFolders"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import FileCard from "../components/FileCard"
import UploadModal from "../components/UploadModal"
import { createFolder, deleteFolder, renameFolder } from "../services/folderService"
import { updateFile } from "../services/fileService"
import { Folder, FolderPlus, Trash2, ChevronRight, Upload, Pencil } from "lucide-react"
import toast from "react-hot-toast"

export default function FolderPage() {
  const { folderId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { files, refresh: refreshFiles } = useFiles(user?.uid)
  const { folders, refresh: refreshFolders } = useFolders(user?.uid)
  const [search, setSearch] = useState("")
  const [showUpload, setShowUpload] = useState(false)
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [renamingId, setRenamingId] = useState(null)
  const [renamingName, setRenamingName] = useState("")

  const currentId = folderId || null
  const totalBytes = files.reduce((acc, f) => acc + (f.fileSize || 0), 0)
  const priorityCount = files.filter(f => f.priorityLevel && f.priorityLevel !== "Archived").length

  // Current folder info
  const currentFolder = folders.find(f => f.id === currentId)

  // Breadcrumb path
  const getBreadcrumb = () => {
    const crumbs = []
    let current = currentFolder
    while (current) {
      crumbs.unshift(current)
      current = folders.find(f => f.id === current.parentId)
    }
    return crumbs
  }

  // Subfolders in current folder
  const subFolders = folders.filter(f => f.parentId === currentId)

  // Files in current folder
  const folderFiles = files.filter(f =>
    f.folderId === currentId &&
    f.fileName?.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return toast.error("Enter a folder name")
    await createFolder(newFolderName.trim(), currentId, user.uid)
    toast.success("Folder created!")
    setNewFolderName("")
    setShowNewFolder(false)
    refreshFolders()
  }

  const handleDeleteFolder = async (id) => {
    if (!confirm("Delete this folder? Files inside will not be deleted.")) return
    await deleteFolder(id)
    toast.success("Folder deleted")
    refreshFolders()
  }

  const handleRenameFolder = async (id) => {
    if (!renamingName.trim()) return
    await renameFolder(id, renamingName.trim())
    toast.success("Folder renamed!")
    setRenamingId(null)
    refreshFolders()
  }

  // Move file to current folder
  const handleMoveFile = async (fileId) => {
    await updateFile(fileId, { folderId: currentId })
    toast.success("File moved!")
    refreshFiles()
  }

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Sidebar priorityCount={priorityCount} onCategorySelect={() => {}} activeCategory="" />
      <Topbar onSearch={setSearch} totalBytes={totalBytes} />

      <main style={{ marginLeft: "240px", paddingTop: "88px", padding: "88px 32px 32px" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <span onClick={() => navigate("/folders")} style={{ color: "#6366f1", cursor: "pointer", fontSize: "0.9rem" }}>
            📁 My Folders
          </span>
          {getBreadcrumb().map(crumb => (
            <span key={crumb.id} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ChevronRight size={14} color="#888" />
              <span onClick={() => navigate(`/folders/${crumb.id}`)} style={{ color: crumb.id === currentId ? "white" : "#6366f1", cursor: "pointer", fontSize: "0.9rem" }}>
                {crumb.name}
              </span>
            </span>
          ))}
        </div>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <h2 style={{ color: "white", margin: 0 }}>{currentFolder?.name || "My Folders"}</h2>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => setShowNewFolder(true)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", color: "white", cursor: "pointer", fontSize: "0.85rem" }}>
              <FolderPlus size={16} /> New Folder
            </button>
            <button onClick={() => setShowUpload(true)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "#6366f1", border: "none", borderRadius: "8px", color: "white", cursor: "pointer", fontSize: "0.85rem" }}>
              <Upload size={16} /> Upload Here
            </button>
          </div>
        </div>

        {/* New Folder Input */}
        {showNewFolder && (
          <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "16px", marginBottom: "24px", display: "flex", gap: "12px" }}>
            <input
              autoFocus
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCreateFolder()}
              placeholder="Folder name..."
              style={{ flex: 1, background: "#2a2a2a", border: "1px solid #3a3a3a", borderRadius: "8px", padding: "8px 12px", color: "white", outline: "none" }}
            />
            <button onClick={handleCreateFolder} style={{ padding: "8px 16px", background: "#6366f1", border: "none", borderRadius: "8px", color: "white", cursor: "pointer" }}>Create</button>
            <button onClick={() => setShowNewFolder(false)} style={{ padding: "8px 16px", background: "#2a2a2a", border: "none", borderRadius: "8px", color: "white", cursor: "pointer" }}>Cancel</button>
          </div>
        )}

        {/* Subfolders */}
        {subFolders.length > 0 && (
          <section style={{ marginBottom: "32px" }}>
            <h3 style={{ color: "#888", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 16px" }}>Folders</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
              {subFolders.map(folder => (
                <div key={folder.id} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "16px", cursor: "pointer", position: "relative" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#3a3a3a"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2a2a"}
                >
                  {renamingId === folder.id ? (
                    <input
                      autoFocus
                      value={renamingName}
                      onChange={e => setRenamingName(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") handleRenameFolder(folder.id); if (e.key === "Escape") setRenamingId(null) }}
                      onBlur={() => handleRenameFolder(folder.id)}
                      style={{ background: "#2a2a2a", border: "1px solid #6366f1", borderRadius: "6px", padding: "4px 8px", color: "white", outline: "none", width: "100%" }}
                    />
                  ) : (
                    <div onClick={() => navigate(`/folders/${folder.id}`)} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Folder size={24} color="#6366f1" />
                      <span style={{ color: "white", fontSize: "0.9rem", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{folder.name}</span>
                    </div>
                  )}

                  {/* Folder actions */}
                  <div style={{ display: "flex", gap: "4px", marginTop: "12px" }}>
                    <button onClick={e => { e.stopPropagation(); setRenamingId(folder.id); setRenamingName(folder.name) }}
                      style={{ padding: "4px 8px", background: "#2a2a2a", border: "none", borderRadius: "6px", color: "#888", cursor: "pointer", fontSize: "0.78rem", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Pencil size={12} /> Rename
                    </button>
                    <button onClick={e => { e.stopPropagation(); handleDeleteFolder(folder.id) }}
                      style={{ padding: "4px 8px", background: "#2a2a2a", border: "none", borderRadius: "6px", color: "#f87171", cursor: "pointer", fontSize: "0.78rem", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Files */}
        <section>
          <h3 style={{ color: "#888", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 16px" }}>
            Files ({folderFiles.length})
          </h3>

          {folderFiles.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ fontSize: "3rem", margin: "0 0 16px" }}>📂</p>
              <p style={{ color: "white", fontSize: "1.1rem", margin: "0 0 8px" }}>No files here yet</p>
              <p style={{ color: "#888", margin: "0 0 24px" }}>Upload files here or move existing files into this folder</p>
              <button onClick={() => setShowUpload(true)} style={{ padding: "10px 24px", background: "#6366f1", border: "none", borderRadius: "8px", color: "white", cursor: "pointer" }}>
                Upload File
              </button>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {folderFiles.map(f => <FileCard key={f.id} file={f} onRefresh={refreshFiles} />)}
          </div>
        </section>
      </main>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onRefresh={refreshFiles}
          defaultFolderId={currentId}
        />
      )}
    </div>
  )
}