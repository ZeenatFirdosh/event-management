"use client"

import { useState, useRef, useEffect } from "react"
import { TIMEZONES } from "../utils/timezone"

export default function TimezoneSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedTimezone = TIMEZONES.find((tz) => tz.value === value)

  return (
    <div className="custom-select" ref={dropdownRef}>
      <div className={`select-trigger ${isOpen ? "open" : ""}`} onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedTimezone?.label || "Select timezone..."}</span>
        <span style={{ fontSize: "12px" }}>▼</span>
      </div>

      {isOpen && (
        <div className="select-dropdown">
          {TIMEZONES.map((tz) => (
            <div
              key={tz.value}
              className="select-option"
              onClick={() => {
                onChange(tz.value)
                setIsOpen(false)
              }}
            >
              {tz.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
