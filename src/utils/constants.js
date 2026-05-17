export const CATEGORIES = [
  "Personal", "Work", "Career", "Finance",
  "Certificates", "Projects", "Notes",
  "Important Documents", "Archive"
]

export const SMART_GROUPS = [
  "Resumes", "Certificates", "Invoices",
  "Reports", "Presentations", "Images",
  "Archives", "Notes", "Documents"
]

export const PRIORITY_LEVELS = ["Important", "Urgent", "Frequent", "Archived"]

export const PRIORITY_COLORS = {
  Important: "text-red-400 bg-red-400/10 border-red-400/20",
  Urgent: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  Frequent: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Archived: "text-gray-400 bg-gray-400/10 border-gray-400/20",
}

export const MAX_STORAGE_BYTES = 25 * 1024 * 1024 * 1024 // 25GB