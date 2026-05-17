import { useState, useEffect } from "react"
import { getFolders } from "../services/folderService"

export const useFolders = (userId) => {
  const [folders, setFolders] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    if (!userId) return
    setLoading(true)
    const data = await getFolders(userId)
    setFolders(data)
    setLoading(false)
  }

  useEffect(() => { refresh() }, [userId])

  return { folders, loading, refresh }
}