"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateEvent, fetchEvents } from "../store/slices/eventSlice"
import MultiSelectProfiles from "./MultiSelectProfiles"
import TimezoneSelect from "./TimezoneSelect"
import DateTimePicker from "./DateTimePicker"
import dayjs from "dayjs"

export default function EditEventModal({ event, timezone, onClose }) {
  const dispatch = useDispatch()
  const { items: profiles = [] } = useSelector((state) => state.profiles)

  const [selectedProfiles, setSelectedProfiles] = useState(event.profiles?.map((p) => p._id) || [])
  const [selectedTimezone, setSelectedTimezone] = useState(event.timezone || timezone)
  const [startDate, setStartDate] = useState(dayjs(event.startDateTime).format("YYYY-MM-DD"))
  const [startTime, setStartTime] = useState(dayjs(event.startDateTime).format("HH:mm"))
  const [endDate, setEndDate] = useState(dayjs(event.endDateTime).format("YYYY-MM-DD"))
  const [endTime, setEndTime] = useState(dayjs(event.endDateTime).format("HH:mm"))

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

    await dispatch(updateEvent({ id: event._id, eventData }))
    await dispatch(fetchEvents())
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Edit Event</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
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
              <DateTimePicker
                date={startDate}
                time={startTime}
                onDateChange={setStartDate}
                onTimeChange={setStartTime}
              />
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

            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Update Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
