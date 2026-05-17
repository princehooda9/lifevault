import { Bell } from "lucide-react"

export default function ReminderBadge({ date }) {
  if (!date) return null
  const isOverdue = new Date(date) < new Date()
  return (
    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", color: isOverdue ? "#f87171" : "#888" }}>
      <Bell size={12} />
      {date}
    </span>
  )
}