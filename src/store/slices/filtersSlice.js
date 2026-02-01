import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  location: '',
  vehicleType: '', // one of: van | fullyIntegrated | alcove | ...
  transmission: '', // e.g. "automatic"
  equipment: {
    AC: false,
    kitchen: false,
    TV: false,
    bathroom: false,
    radio: false,
    refrigerator: false,
    microwave: false,
    gas: false,
    water: false,
  },
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setLocation(state, action) {
      state.location = action.payload ?? ''
    },
    setVehicleType(state, action) {
      state.vehicleType = action.payload ?? ''
    },
    setTransmission(state, action) {
      state.transmission = action.payload ?? ''
    },
    toggleEquipment(state, action) {
      const key = action.payload
      if (!(key in state.equipment)) return
      state.equipment[key] = !state.equipment[key]
    },
    resetFilters() {
      return initialState
    },
    applyFilters(state, action) {
      const next = action.payload
      if (!next || typeof next !== 'object') return
      return {
        ...state,
        ...next,
        equipment: { ...state.equipment, ...(next.equipment ?? {}) },
      }
    },
  },
})

export const {
  setLocation,
  setVehicleType,
  setTransmission,
  toggleEquipment,
  resetFilters,
  applyFilters,
} = filtersSlice.actions

export const filtersReducer = filtersSlice.reducer

