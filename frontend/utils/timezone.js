export const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Asia/Singapore", label: "Singapore (SGT)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Australia/Sydney", label: "Sydney (AEDT)" },
]

// Helper to format date in a specific timezone
const formatInTimezone = (date, timezone, options) => {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("en-US", {
    ...options,
    timeZone: timezone,
  }).format(dateObj)
}

export const formatDateTime = (date, tz) => {
  if (!date) return ""
  const dateObj = typeof date === "string" ? new Date(date) : date

  const dateStr = formatInTimezone(dateObj, tz, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const timeStr = formatInTimezone(dateObj, tz, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  return `${dateStr} @ ${timeStr}`
}

export const formatDateTimeShort = (date, tz) => {
  if (!date) return ""
  const dateObj = typeof date === "string" ? new Date(date) : date

  return formatInTimezone(dateObj, tz, {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export const formatTimeOnly = (date, tz) => {
  if (!date) return ""
  const dateObj = typeof date === "string" ? new Date(date) : date

  return formatInTimezone(dateObj, tz, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

export const convertToTimezone = (date, fromTz, toTz) => {
  if (!date) return ""
  const dateObj = typeof date === "string" ? new Date(date) : date
  return dateObj.toISOString()
}

export const formatLogTimestamp = (date, tz) => {
  if (!date) return ""
  const dateObj = typeof date === "string" ? new Date(date) : date

  const dateStr = formatInTimezone(dateObj, tz, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const timeStr = formatInTimezone(dateObj, tz, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  return `${dateStr} at ${timeStr}`
}

// Helper to get current date/time formatted for input fields
export const formatDateForInput = (date) => {
  if (!date) return ""
  const dateObj = typeof date === "string" ? new Date(date) : date
  return dateObj.toISOString().split("T")[0]
}

export const formatTimeForInput = (date) => {
  if (!date) return ""
  const dateObj = typeof date === "string" ? new Date(date) : date
  const hours = String(dateObj.getHours()).padStart(2, "0")
  const minutes = String(dateObj.getMinutes()).padStart(2, "0")
  return `${hours}:${minutes}`
}
