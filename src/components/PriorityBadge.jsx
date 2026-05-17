import { PRIORITY_COLORS } from "../utils/constants"

export default function PriorityBadge({ level }) {
  if (!level) return null
  return (
    <span style={{ fontSize: "0.75rem", padding: "2px 8px", borderRadius: "999px", border: "1px solid", ...getBadgeStyle(level) }}>
      {level}
    </span>
  )
}

function getBadgeStyle(level) {
  const styles = {
    Important: { color: "#f87171", borderColor: "#f87171", background: "rgba(248,113,113,0.1)" },
    Urgent: { color: "#fb923c", borderColor: "#fb923c", background: "rgba(251,146,60,0.1)" },
    Frequent: { color: "#60a5fa", borderColor: "#60a5fa", background: "rgba(96,165,250,0.1)" },
    Archived: { color: "#9ca3af", borderColor: "#9ca3af", background: "rgba(156,163,175,0.1)" },
  }
  return styles[level] || {}
}