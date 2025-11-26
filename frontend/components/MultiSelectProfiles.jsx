"use client"

import { useState, useRef, useEffect } from "react"
import { useDispatch } from "react-redux"
import { createProfile } from "../store/slices/profileSlice"

export default function MultiSelectProfiles({ profiles = [], selectedProfiles, setSelectedProfiles }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddInput, setShowAddInput] = useState(false)
  const [newProfileName, setNewProfileName] = useState("")
  const dropdownRef = useRef(null)
  const dispatch = useDispatch()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setShowAddInput(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleProfile = (profileId) => {
    if (selectedProfiles.includes(profileId)) {
      setSelectedProfiles(selectedProfiles.filter((id) => id !== profileId))
    } else {
      setSelectedProfiles([...selectedProfiles, profileId])
    }
  }

  // Ensure profiles is always an array
  const safeProfiles = Array.isArray(profiles) ? profiles : []

  const filteredProfiles = safeProfiles.filter((profile) => profile.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const selectedProfileNames = safeProfiles
    .filter((p) => selectedProfiles.includes(p._id))
    .map((p) => p.name)
    .join(", ")

  const handleAddProfile = async () => {
    if (newProfileName.trim()) {
      const result = await dispatch(createProfile(newProfileName.trim()))
      if (result.payload && result.payload._id) {
        setSelectedProfiles([...selectedProfiles, result.payload._id])
      }
      setNewProfileName("")
      setShowAddInput(false)
    }
  }

  return (
    <div className="custom-select" ref={dropdownRef}>
      <div
        className={`select-trigger ${isOpen ? "open" : ""} ${selectedProfiles.length === 0 ? "placeholder" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        style={
          selectedProfiles.length > 0
            ? {
                backgroundColor: "hsl(var(--color-primary))",
                color: "black",
                borderColor: "hsl(var(--color-primary))",
              }
            : {}
        }
      >
        <span>
          {selectedProfiles.length === 0
            ? "Select profiles..."
            : `${selectedProfiles.length} profile${selectedProfiles.length > 1 ? "s" : ""} selected`}
        </span>
        <span style={{ fontSize: "12px" }}>▼</span>
      </div>

      {isOpen && (
        <div className="select-dropdown">
          <div className="select-search">
            <input
              type="text"
              placeholder="Search profiles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {selectedProfiles.length > 0 && (
            <div
              style={{
                padding: "8px 12px",
                backgroundColor: "hsl(var(--color-primary) / 0.1)",
                fontSize: "13px",
                color: "hsl(var(--color-primary))",
                fontWeight: 500,
              }}
            >
              Selected: {selectedProfileNames}
            </div>
          )}

          {filteredProfiles.map((profile) => (
            <div
              key={profile._id}
              className={`select-option ${selectedProfiles.includes(profile._id) ? "selected" : ""}`}
              onClick={() => toggleProfile(profile._id)}
            >
              <div className="checkbox" />
              <span>{profile.name}</span>
            </div>
          ))}

          {showAddInput ? (
            <div style={{ padding: "8px", borderTop: "1px solid hsl(var(--color-border))" }}>
              <div style={{ display: "flex", gap: "4px" }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter profile name..."
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddProfile()}
                  autoFocus
                  style={{ fontSize: "14px", padding: "6px 10px" }}
                />
                <button
                  className="btn-primary"
                  onClick={handleAddProfile}
                  style={{ padding: "6px 12px", fontSize: "14px" }}
                >
                  Add
                </button>
              </div>
            </div>
          ) : (
            <div className="add-profile-option" onClick={() => setShowAddInput(true)}>
              <span>+</span>
              <span>Add Profile</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
