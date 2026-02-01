import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchCamperByIdApi, fetchCampersApi } from '../../api/campers'

export const fetchCampers = createAsyncThunk(
  'campers/fetchCampers',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCampersApi()
    } catch (err) {
      return rejectWithValue(err?.message ?? 'Failed to load campers')
    }
  },
)

export const fetchCamperById = createAsyncThunk(
  'campers/fetchCamperById',
  async (id, { rejectWithValue }) => {
    try {
      return await fetchCamperByIdApi(id)
    } catch (err) {
      return rejectWithValue(err?.message ?? 'Failed to load camper')
    }
  },
)

const initialState = {
  items: [],
  status: 'idle', // idle | loading | succeeded | failed
  error: null,

  byId: {},
  byIdStatus: {}, // id -> status
  byIdError: {}, // id -> error
}

const campersSlice = createSlice({
  name: 'campers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCampers.pending, (state) => {
        state.status = 'loading'
        state.error = null
        state.items = []
      })
      .addCase(fetchCampers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload ?? []
        state.error = null
      })
      .addCase(fetchCampers.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? action.error?.message ?? 'Failed to load'
        state.items = []
      })

      .addCase(fetchCamperById.pending, (state, action) => {
        const id = String(action.meta.arg)
        state.byIdStatus[id] = 'loading'
        state.byIdError[id] = null
      })
      .addCase(fetchCamperById.fulfilled, (state, action) => {
        const camper = action.payload
        if (!camper?.id) return
        const id = String(camper.id)
        state.byId[id] = camper
        state.byIdStatus[id] = 'succeeded'
        state.byIdError[id] = null
      })
      .addCase(fetchCamperById.rejected, (state, action) => {
        const id = String(action.meta.arg)
        state.byIdStatus[id] = 'failed'
        state.byIdError[id] =
          action.payload ?? action.error?.message ?? 'Failed to load'
      })
  },
})

export const campersReducer = campersSlice.reducer

