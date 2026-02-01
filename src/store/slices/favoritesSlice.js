import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  ids: [], // array of camper ids (string)
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite(state, action) {
      const id = String(action.payload)
      const idx = state.ids.indexOf(id)
      if (idx >= 0) state.ids.splice(idx, 1)
      else state.ids.push(id)
    },
    clearFavorites(state) {
      state.ids = []
    },
  },
})

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions
export const favoritesReducer = favoritesSlice.reducer

