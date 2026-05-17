import * as chrono from "chrono-node"

const KEYWORDS = ["deadline", "submit", "due", "meeting", "remind", "before", "by", "plan", "appointment", "exam", "test", "interview"]

export const detectDeadlines = (text) => {
  if (!text) return []
  const results = chrono.parse(text)
  return results
    .filter(r => {
      const surrounding = text.substring(Math.max(0, r.index - 60), r.index + 60).toLowerCase()
      return KEYWORDS.some(k => surrounding.includes(k))
    })
    .map(r => ({
      label: text.substring(Math.max(0, r.index - 40), r.index).trim().split("\n").pop().trim(),
      date: r.start.date().toISOString().split("T")[0],
      dateText: r.text,
    }))
    .filter(r => r.label.length > 0)
}