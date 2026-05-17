import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { logout } from "../services/authService"

const ALLOWED_EMAIL = "princehooda97@gmail.com"

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#6366f1", fontSize: "1.2rem" }}>Loading...</p>
    </div>
  )

  if (!user) return <Navigate to="/login" replace />

  if (user.email !== ALLOWED_EMAIL) {
    logout()
    return <Navigate to="/login" replace />
  }

  return children
}