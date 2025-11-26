"use client"

import { useSelector } from "react-redux"
import EventCard from "./EventCard"
import TimezoneSelect from "./TimezoneSelect"

export default function EventList({ currentProfile, selectedTimezone, setSelectedTimezone }) {
  const { items: events = [] } = useSelector((state) => state.events)

  // Ensure events is always an array
  const safeEvents = Array.isArray(events) ? events : []

  const filteredEvents = currentProfile
    ? safeEvents.filter((event) => event.profiles?.some((p) => p._id === currentProfile._id))
    : safeEvents

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Events</h2>
      </div>
      <div className="card-body">
        <div className="form-group">
          <label className="form-label">View in Timezone</label>
          <TimezoneSelect value={selectedTimezone} onChange={setSelectedTimezone} />
        </div>

        {filteredEvents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-text">No events found</div>
          </div>
        ) : (
          <div>
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} timezone={selectedTimezone} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
