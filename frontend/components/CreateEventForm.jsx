"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createEvent, fetchEvents } from "../store/slices/eventSlice"
import MultiSelectProfiles from "./MultiSelectProfiles"
import TimezoneSelect from "./TimezoneSelect"
import DateTimePicker from "./DateTimePicker"

export default function CreateEventForm({ currentProfile, selectedTimezone, setSelectedTimezone }) {
  const dispatch = useDispatch()
  const { items: profiles = [] } = useSelector((state) => state.profiles)

  const [selectedProfiles, setSelectedProfiles] = useState([])
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("09:00")
  const [endDate, setEndDate] = useState("")
  const [endTime, setEndTime] = useState("09:00")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (selectedProfiles.length === 0 || !startDate || !endDate) {
      alert("Please fill in all fields")
      return
    }

    const eventData = {
      profiles: selectedProfiles,
      timezone: selectedTimezone,
      startDateTime: `${startDate}T${startTime}`,
      endDateTime: `${endDate}T${endTime}`,
    }

    await dispatch(createEvent(eventData))

    // Reset form
    setSelectedProfiles([])
    setStartDate("")
    setStartTime("09:00")
    setEndDate("")
    setEndTime("09:00")

    // Refresh events
    dispatch(fetchEvents())
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Create Event</h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Profiles</label>
            <MultiSelectProfiles
              profiles={profiles}
              selectedProfiles={selectedProfiles}
              setSelectedProfiles={setSelectedProfiles}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Timezone</label>
            <TimezoneSelect value={selectedTimezone} onChange={setSelectedTimezone} />
          </div>

          <div className="form-group">
            <label className="form-label">Start Date & Time</label>
            <DateTimePicker date={startDate} time={startTime} onDateChange={setStartDate} onTimeChange={setStartTime} />
          </div>

          <div className="form-group">
            <label className="form-label">End Date & Time</label>
            <DateTimePicker
              date={endDate}
              time={endTime}
              onDateChange={setEndDate}
              onTimeChange={setEndTime}
              minDate={startDate}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", fontSize: "15px" }}>
            <span style={{ fontSize: "18px" }}>+</span>
            Create Event
          </button>
        </form>
      </div>
    </div>
  )
}
