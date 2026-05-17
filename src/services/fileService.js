import { db } from "../firebase/firebase"
import {
  collection, addDoc, getDocs, deleteDoc,
  doc, updateDoc, query, where, orderBy, serverTimestamp
} from "firebase/firestore"
import { detectSmartGroup } from "../utils/groupingLogic"

// Upload file to Cloudinary then save metadata to Firestore
export const uploadFile = async (file, category, smartGroup, reminderDate, priorityLevel, userId, folderId = null) => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

  const isPDF = file.type === "application/pdf"
const uploadType = isPDF ? "raw" : "auto"

const res = await fetch(
  `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`,
  { method: "POST", body: formData }
)
  const data = await res.json()
  if (!data.secure_url) throw new Error("Upload failed")

  const autoGroup = detectSmartGroup(file.name, file.type)

  await addDoc(collection(db, "files"), {
    fileName: file.name,
    fileURL: data.secure_url,
    fileType: file.type,
    fileSize: file.size,
    category: category || "Personal",
    smartGroup: smartGroup || autoGroup,
    priorityLevel: priorityLevel || null,
    reminderDate: reminderDate || null,
    isPinned: false,
    uploadedAt: serverTimestamp(),
    lastAccessed: serverTimestamp(),
    lastModified: serverTimestamp(),
    source: "local",
    userId,
    folderId: folderId,
  })
}

// Get all files for a user
export const getFiles = async (userId) => {
  const q = query(
    collection(db, "files"),
    where("userId", "==", userId),
    orderBy("uploadedAt", "desc")
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// Delete file
export const deleteFile = async (fileId) => {
  await deleteDoc(doc(db, "files", fileId))
}

// Update file fields
export const updateFile = async (fileId, updates) => {
  await updateDoc(doc(db, "files", fileId), {
    ...updates,
    lastModified: serverTimestamp(),
  })
}

// Pin/unpin
export const togglePin = async (fileId, current) => {
  await updateDoc(doc(db, "files", fileId), { isPinned: !current })
}

// Update last accessed
export const touchFile = async (fileId) => {
  await updateDoc(doc(db, "files", fileId), { lastAccessed: serverTimestamp() })
}