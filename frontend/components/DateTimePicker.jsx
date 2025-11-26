"use client"

export default function DateTimePicker({ date, time, onDateChange, onTimeChange, minDate }) {
  return (
    <div className="datetime-group">
      <div style={{ position: "relative" }}>
        <input
          type="date"
          className="form-input"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          min={minDate || undefined}
          style={{ paddingLeft: "36px" }}
        />
        <svg
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "16px",
            height: "16px",
            color: "hsl(var(--color-muted-foreground))",
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </div>

      <div style={{ position: "relative" }}>
        <input
          type="time"
          className="form-input"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          style={{ paddingLeft: "36px" }}
        />
        <svg
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "16px",
            height: "16px",
            color: "hsl(var(--color-muted-foreground))",
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      </div>
    </div>
  )
}
