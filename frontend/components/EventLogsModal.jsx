"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchEventLogs, clearEventLogs } from "../store/slices/eventSlice"
import { formatLogTimestamp } from "../utils/timezone"

const formatLogDescription = (log) => {
  const { field, oldValue, newValue } = log.changes
  
  if (field === 'profiles') {
    return `Updated profiles from ${Array.isArray(oldValue) ? oldValue.length : 0} to ${Array.isArray(newValue) ? newValue.length : 0} profiles`
  }
  
  if (field === 'timezone') {
    return `Changed timezone from ${oldValue} to ${newValue}`
  }
  
  if (field === 'startDateTime' || field === 'endDateTime') {
    const fieldName = field === 'startDateTime' ? 'Start Date/Time' : 'End Date/Time'
    return `Updated ${fieldName}`
  }
  
  return `Updated ${field}`
}

export default function EventLogsModal({ eventId, timezone, onClose }) {
  const dispatch = useDispatch()
  const { currentEventLogs } = useSelector((state) => state.events)

  useEffect(() => {
    dispatch(fetchEventLogs(eventId))
    return () => {
      dispatch(clearEventLogs())
    }
  }, [dispatch, eventId])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Event Update History</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {currentEventLogs.length === 0 ? (
            <div className="empty-state" style={{ padding: "40px 20px" }}>
              <div className="empty-state-text">No update history yet</div>
            </div>
          ) : (
            <div>
              {currentEventLogs.map((log, index) => (
                <div key={index} className="log-entry">
                  <div className="log-timestamp">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {formatLogTimestamp(log.timestamp, timezone)}
                  </div>
                  <div className="log-description">{formatLogDescription(log)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
