import { useState, useEffect } from "react"
import { getNotes } from "../services/noteService"

export const useNotes = (userId) => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    if (!userId) return
    setLoading(true)
    const data = await getNotes(userId)
    setNotes(data)
    setLoading(false)
  }

  useEffect(() => { refresh() }, [userId])

  return { notes, loading, refresh }
}