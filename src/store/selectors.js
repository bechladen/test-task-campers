import { createSelector } from '@reduxjs/toolkit'

export const selectCampers = (state) => state.campers.items
export const selectCampersStatus = (state) => state.campers.status
export const selectCampersError = (state) => state.campers.error

export const selectFilters = (state) => state.filters
export const selectFavoriteIds = (state) => state.favorites.ids

export const selectFilteredCampers = createSelector(
  [selectCampers, selectFilters],
  (campers, filters) => {
    const locationNeedle = filters.location.trim().toLowerCase()
    const vehicleType = filters.vehicleType
    const transmission = String(filters.transmission ?? '').toLowerCase()
    const activeEquipment = Object.entries(filters.equipment).filter(
      ([, v]) => Boolean(v),
    )

    return (campers ?? []).filter((c) => {
      if (locationNeedle) {
        const loc = String(c?.location ?? '').toLowerCase()
        if (!loc.includes(locationNeedle)) return false
      }

      if (vehicleType) {
        const form = String(c?.form ?? '').toLowerCase()
        if (form !== vehicleType.toLowerCase()) return false
      }

      if (transmission) {
        const t = String(c?.transmission ?? '').toLowerCase()
        if (t !== transmission) return false
      }

      for (const [key] of activeEquipment) {
        if (!c?.[key]) return false
      }

      return true
    })
  },
)

