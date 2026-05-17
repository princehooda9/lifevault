import { db } from "../firebase/firebase"
import {
  collection, addDoc, getDocs, deleteDoc,
  doc, updateDoc, query, where, orderBy, serverTimestamp
} from "firebase/firestore"

export const getFolders = async (userId) => {
  const q = query(
    collection(db, "folders"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const createFolder = async (name, parentId = null, userId) => {
  await addDoc(collection(db, "folders"), {
    name,
    parentId,
    userId,
    createdAt: serverTimestamp(),
  })
}

export const deleteFolder = async (folderId) => {
  await deleteDoc(doc(db, "folders", folderId))
}

export const renameFolder = async (folderId, name) => {
  await updateDoc(doc(db, "folders", folderId), { name })
}