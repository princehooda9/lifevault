import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { useAuth } from "./hooks/useAuth"
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Notes from "./pages/Notes"
import PriorityVault from "./pages/PriorityVault"
import Archive from "./pages/Archive"
import RecentActivity from "./pages/RecentActivity"
import CategoryPage from "./pages/CategoryPage"
import FolderPage from "./pages/FolderPage"

export default function App() {
  const { user, loading } = useAuth()

  if (loading) return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#6366f1" }}>Loading...</p>
    </div>
  )

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ style: { background: "#1a1a1a", color: "white", border: "1px solid #2a2a2a" } }} />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
        <Route path="/vault" element={<ProtectedRoute><PriorityVault /></ProtectedRoute>} />
        <Route path="/archive" element={<ProtectedRoute><Archive /></ProtectedRoute>} />
        <Route path="/activity" element={<ProtectedRoute><RecentActivity /></ProtectedRoute>} />
        <Route path="/category/:category" element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />
        <Route path="/folders" element={<ProtectedRoute><FolderPage /></ProtectedRoute>} />
        <Route path="/folders/:folderId" element={<ProtectedRoute><FolderPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}