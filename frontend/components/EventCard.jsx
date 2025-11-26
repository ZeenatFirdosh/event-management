"use client"

import { useState } from "react"
import { formatDateTime, formatLogTimestamp } from "../utils/timezone"
import EditEventModal from "./EditEventModal"
import EventLogsModal from "./EventLogsModal"

export default function EventCard({ event, timezone }) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showLogsModal, setShowLogsModal] = useState(false)

  const profileNames = event.profiles?.map((p) => p.name).join(", ") || "Unknown"

  return (
    <>
      <div className="event-card">
        <div className="event-profiles">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span>{profileNames}</span>
        </div>

        <div className="event-datetime">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <div className="event-datetime-content">
            <div className="event-datetime-label">Start: {formatDateTime(event.startDateTime, timezone)}</div>
          </div>
        </div>

        <div className="event-datetime">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <div className="event-datetime-content">
            <div className="event-datetime-label">End: {formatDateTime(event.endDateTime, timezone)}</div>
          </div>
        </div>

        <div className="event-meta">
          <div>Created: {formatLogTimestamp(event.createdAt, timezone)}</div>
          <div>Updated: {formatLogTimestamp(event.updatedAt, timezone)}</div>
        </div>

        <div className="event-actions">
          <button className="btn btn-secondary" onClick={() => setShowEditModal(true)}>
            <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </button>
          <button className="btn btn-secondary" onClick={() => setShowLogsModal(true)}>
            <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            View Logs
          </button>
        </div>
      </div>

      {showEditModal && <EditEventModal event={event} timezone={timezone} onClose={() => setShowEditModal(false)} />}

      {showLogsModal && (
        <EventLogsModal eventId={event._id} timezone={timezone} onClose={() => setShowLogsModal(false)} />
      )}
    </>
  )
}
