"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchProfiles, setCurrentProfile } from "../store/slices/profileSlice"
import { fetchEvents, fetchEventsByProfile } from "../store/slices/eventSlice"
import CreateEventForm from "./CreateEventForm"
import EventList from "./EventList"
import ProfileSelector from "./ProfileSelector"

export default function EventManagement() {
  const dispatch = useDispatch()
  const { items: profiles = [], currentProfile } = useSelector((state) => state.profiles)
  const [selectedTimezone, setSelectedTimezone] = useState("America/New_York")

  useEffect(() => {
    dispatch(fetchProfiles())
    dispatch(fetchEvents())
  }, [dispatch])

  const handleProfileChange = (profileId) => {
    // Ensure profiles is an array before calling .find()
    const safeProfiles = Array.isArray(profiles) ? profiles : []
    const profile = safeProfiles.find((p) => p._id === profileId)
    dispatch(setCurrentProfile(profile))
    if (profileId) {
      dispatch(fetchEventsByProfile(profileId))
    } else {
      dispatch(fetchEvents())
    }
  }

  return (
    <div style={{ minHeight: "100vh", padding: "24px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <header style={{ marginBottom: "32px" }}>
          <div
            style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}
          >
            <div>
              <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "4px" }}>Event Management</h1>
              <p style={{ color: "hsl(var(--color-muted-foreground))" }}>
                Create and manage events across multiple timezones
              </p>
            </div>
            <div style={{ width: "220px" }}>
              <ProfileSelector
                profiles={profiles}
                currentProfile={currentProfile}
                onProfileChange={handleProfileChange}
              />
            </div>
          </div>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", gap: "24px" }}>
          <CreateEventForm
            currentProfile={currentProfile}
            selectedTimezone={selectedTimezone}
            setSelectedTimezone={setSelectedTimezone}
          />
          <EventList
            currentProfile={currentProfile}
            selectedTimezone={selectedTimezone}
            setSelectedTimezone={setSelectedTimezone}
          />
        </div>
      </div>
    </div>
  )
}
