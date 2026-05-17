import { db } from "../firebase/firebase"
import {
  collection, addDoc, getDocs, deleteDoc,
  doc, updateDoc, query, where, orderBy, serverTimestamp
} from "firebase/firestore"
import { detectDeadlines } from "../utils/deadlineDetector"

export const getNotes = async (userId) => {
  const q = query(
    collection(db, "notes"),
    where("userId", "==", userId),
    orderBy("updatedAt", "desc")
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const createNote = async (userId) => {
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  const ref = await addDoc(collection(db, "notes"), {
    title: `Note — ${today}`,
    content: "",
    detectedEvents: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    userId,
  })
  return ref.id
}

export const updateNote = async (noteId, title, content) => {
  const detectedEvents = detectDeadlines(content.replace(/<[^>]*>/g, " "))
  await updateDoc(doc(db, "notes", noteId), {
    title,
    content,
    detectedEvents,
    updatedAt: serverTimestamp(),
  })
}

export const deleteNote = async (noteId) => {
  await deleteDoc(doc(db, "notes", noteId))
}