import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export const fetchEvents = createAsyncThunk("events/fetchEvents", async () => {
  const response = await fetch(`${API_BASE_URL}/events`)
  const result = await response.json()
  return result.data || []
})

export const fetchEventsByProfile = createAsyncThunk("events/fetchEventsByProfile", async (profileId) => {
  const response = await fetch(`${API_BASE_URL}/events/profile/${profileId}`)
  const result = await response.json()
  return result.data || []
})

export const createEvent = createAsyncThunk("events/createEvent", async (eventData) => {
  const response = await fetch(`${API_BASE_URL}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventData),
  })
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.message || "Failed to create event")
  }
  return result.data
})

export const updateEvent = createAsyncThunk("events/updateEvent", async ({ id, eventData }) => {
  const response = await fetch(`${API_BASE_URL}/events/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventData),
  })
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.message || "Failed to update event")
  }
  return result.data
})

export const fetchEventLogs = createAsyncThunk("events/fetchEventLogs", async (eventId) => {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}/logs`)
  const result = await response.json()
  return result.data || []
})

const eventSlice = createSlice({
  name: "events",
  initialState: {
    items: [],
    currentEventLogs: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearEventLogs: (state) => {
      state.currentEventLogs = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false
        state.items = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
        state.items = []
      })
      .addCase(fetchEventsByProfile.fulfilled, (state, action) => {
        state.items = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(fetchEventsByProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
        state.items = []
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        if (action.payload && typeof action.payload === 'object') {
          state.items.push(action.payload)
        }
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.error = action.error.message
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        if (action.payload && typeof action.payload === 'object') {
          const index = state.items.findIndex((e) => e._id === action.payload._id)
          if (index !== -1) {
            state.items[index] = action.payload
          }
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.error = action.error.message
      })
      .addCase(fetchEventLogs.fulfilled, (state, action) => {
        state.currentEventLogs = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(fetchEventLogs.rejected, (state, action) => {
        state.error = action.error.message
        state.currentEventLogs = []
      })
  },
})

export const { clearEventLogs } = eventSlice.actions
export default eventSlice.reducer
