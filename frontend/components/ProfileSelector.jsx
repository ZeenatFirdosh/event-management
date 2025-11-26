"use client"

import { useState, useRef, useEffect } from "react"
import { useDispatch } from "react-redux"
import { createProfile } from "../store/slices/profileSlice"

export default function ProfileSelector({ profiles = [], currentProfile, onProfileChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [newProfileName, setNewProfileName] = useState("")
  const [showAddInput, setShowAddInput] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const dropdownRef = useRef(null)
  const dispatch = useDispatch()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setShowAddInput(false)
        setSearchQuery("")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleAddProfile = async () => {
    if (newProfileName.trim()) {
      await dispatch(createProfile(newProfileName.trim()))
      setNewProfileName("")
      setShowAddInput(false)
    }
  }

  // Ensure profiles is always an array
  const safeProfiles = Array.isArray(profiles) ? profiles : []

  const filteredProfiles = safeProfiles.filter((profile) => profile.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="custom-select" ref={dropdownRef}>
      <div
        className={`select-trigger ${isOpen ? "open" : ""} ${!currentProfile ? "placeholder" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{currentProfile ? currentProfile.name : "Select current profile..."}</span>
        <span style={{ fontSize: "12px" }}>▼</span>
      </div>

      {isOpen && (
        <div className="select-dropdown">
          <div style={{ padding: "8px", borderBottom: "1px solid hsl(var(--color-border))" }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search current profile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              style={{ fontSize: "14px", padding: "8px 10px", width: "100%" }}
            />
          </div>

          <div
            className={`select-option ${!currentProfile ? "selected" : ""}`}
            onClick={() => {
              onProfileChange(null)
              setIsOpen(false)
              setSearchQuery("")
            }}
          >
            All Profiles (View All Events)
          </div>

          {filteredProfiles.length > 0 ? (
            filteredProfiles.map((profile) => (
              <div
                key={profile._id}
                className={`select-option ${currentProfile?._id === profile._id ? "selected" : ""}`}
                onClick={() => {
                  onProfileChange(profile._id)
                  setIsOpen(false)
                  setSearchQuery("")
                }}
              >
                {profile.name}
              </div>
            ))
          ) : (
            <div style={{ padding: "12px", textAlign: "center", color: "hsl(var(--color-muted-foreground))" }}>
              No profiles found
            </div>
          )}

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
              <span>+ Add Profile</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
