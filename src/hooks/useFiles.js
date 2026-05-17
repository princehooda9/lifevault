import { useState, useEffect } from "react"
import { getFiles } from "../services/fileService"

export const useFiles = (userId) => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    if (!userId) return
    setLoading(true)
    const data = await getFiles(userId)
    setFiles(data)
    setLoading(false)
  }

  useEffect(() => { refresh() }, [userId])

  return { files, loading, refresh }
}