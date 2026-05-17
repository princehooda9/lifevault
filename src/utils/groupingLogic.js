export const detectSmartGroup = (fileName, fileType) => {
  const name = fileName.toLowerCase()
  if (name.includes("resume") || name.includes("cv")) return "Resumes"
  if (name.includes("certificate") || name.includes("cert")) return "Certificates"
  if (name.includes("invoice") || name.includes("bill")) return "Invoices"
  if (name.includes("report")) return "Reports"
  if (fileType?.includes("presentation") || name.includes(".pptx")) return "Presentations"
  if (fileType?.startsWith("image")) return "Images"
  if (fileType?.includes("zip")) return "Archives"
  if (fileType?.includes("text")) return "Notes"
  return "Documents"
}

export const groupFilesBySmartGroup = (files) => {
  return files.reduce((acc, file) => {
    const group = file.smartGroup || "Documents"
    if (!acc[group]) acc[group] = []
    acc[group].push(file)
    return acc
  }, {})
}

export const groupFilesByYearCategory = (files) => {
  return files.reduce((acc, file) => {
    const year = file.uploadedAt?.toDate
      ? file.uploadedAt.toDate().getFullYear()
      : new Date().getFullYear()
    const cat = file.category || "Uncategorized"
    if (!acc[year]) acc[year] = {}
    if (!acc[year][cat]) acc[year][cat] = []
    acc[year][cat].push(file)
    return acc
  }, {})
}