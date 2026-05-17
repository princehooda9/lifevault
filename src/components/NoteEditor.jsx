import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { Bold, Italic, List, ListOrdered, Heading2 } from "lucide-react"

export default function NoteEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Write anything... deadlines, plans, thoughts. Dates will be detected automatically." }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  if (!editor) return null

  const btn = (action, active, icon) => (
    <button
      onClick={action}
      style={{ padding: "6px 10px", background: active ? "#6366f1" : "#2a2a2a", border: "none", borderRadius: "6px", color: active ? "white" : "#888", cursor: "pointer" }}
    >
      {icon}
    </button>
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: "6px", padding: "12px 16px", borderBottom: "1px solid #2a2a2a" }}>
        {btn(() => editor.chain().focus().toggleBold().run(), editor.isActive("bold"), <Bold size={14} />)}
        {btn(() => editor.chain().focus().toggleItalic().run(), editor.isActive("italic"), <Italic size={14} />)}
        {btn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive("heading"), <Heading2 size={14} />)}
        {btn(() => editor.chain().focus().toggleBulletList().run(), editor.isActive("bulletList"), <List size={14} />)}
        {btn(() => editor.chain().focus().toggleOrderedList().run(), editor.isActive("orderedList"), <ListOrdered size={14} />)}
      </div>
      {/* Editor */}
      <div style={{ flex: 1, padding: "20px", overflow: "auto", color: "white", fontSize: "0.95rem", lineHeight: "1.7" }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}