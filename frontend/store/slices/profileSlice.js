import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export const fetchProfiles = createAsyncThunk("profiles/fetchProfiles", async () => {
  const response = await fetch(`${API_BASE_URL}/profiles`)
  const result = await response.json()
  return result.data || []
})

export const createProfile = createAsyncThunk("profiles/createProfile", async (name) => {
  const response = await fetch(`${API_BASE_URL}/profiles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  })
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.message || "Failed to create profile")
  }
  return result.data
})

const profileSlice = createSlice({
  name: "profiles",
  initialState: {
    items: [],
    currentProfile: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentProfile: (state, action) => {
      state.currentProfile = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfiles.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.loading = false
        state.items = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
        state.items = []
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        if (action.payload && typeof action.payload === 'object') {
          state.items.push(action.payload)
        }
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.error = action.error.message
      })
  },
})

export const { setCurrentProfile } = profileSlice.actions
export default profileSlice.reducer
