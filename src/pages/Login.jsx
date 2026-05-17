import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginWithGoogle, loginWithEmail, registerWithEmail } from "../services/authService"
import toast from "react-hot-toast"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleGoogle = async () => {
    try {
      setLoading(true)
      await loginWithGoogle()
      navigate("/")
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEmail = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      if (isRegister) await registerWithEmail(email, password)
      else await loginWithEmail(email, password)
      navigate("/")
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#111111", border: "1px solid #2a2a2a", borderRadius: "16px", padding: "48px", width: "100%", maxWidth: "420px" }}>
        
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ color: "#6366f1", fontSize: "2rem", fontWeight: "bold", margin: 0 }}>⚡ LifeVault</h1>
          <p style={{ color: "#888", marginTop: "8px", fontSize: "0.9rem" }}>Your personal cloud workspace</p>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          style={{ width: "100%", padding: "12px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", color: "white", cursor: "pointer", fontSize: "0.95rem", marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
        >
          <img src="https://www.google.com/favicon.ico" width="18" height="18" alt="G" />
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div style={{ flex: 1, height: "1px", background: "#2a2a2a" }} />
          <span style={{ color: "#888", fontSize: "0.85rem" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: "#2a2a2a" }} />
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmail} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ padding: "12px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", color: "white", fontSize: "0.95rem", outline: "none" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ padding: "12px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", color: "white", fontSize: "0.95rem", outline: "none" }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ padding: "12px", background: "#6366f1", border: "none", borderRadius: "8px", color: "white", cursor: "pointer", fontSize: "0.95rem", fontWeight: "600" }}
          >
            {loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
          </button>
        </form>

        {/* Toggle */}
        <p style={{ textAlign: "center", color: "#888", fontSize: "0.85rem", marginTop: "20px" }}>
          {isRegister ? "Already have an account? " : "Don't have an account? "}
          <span
            onClick={() => setIsRegister(!isRegister)}
            style={{ color: "#6366f1", cursor: "pointer" }}
          >
            {isRegister ? "Sign In" : "Create one"}
          </span>
        </p>
      </div>
    </div>
  )
}