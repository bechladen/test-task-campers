import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiMapPin } from 'react-icons/fi'
import { FaCogs, FaShower, FaTv, FaUtensils } from 'react-icons/fa'
import { GiCaravan, GiWindSlap } from 'react-icons/gi'
import clsx from 'clsx'

import { applyFilters, resetFilters } from '../../../../store/slices/filtersSlice'
import { selectFilters } from '../../../../store/selectors'
import styles from './FiltersPanel.module.css'

const VEHICLE_TYPES = [
  { key: 'panelTruck', label: 'Van', Icon: GiCaravan },
  { key: 'fullyIntegrated', label: 'Fully Integrated', Icon: GiCaravan },
  { key: 'alcove', label: 'Alcove', Icon: GiCaravan },
]

export function FiltersPanel({ onSearch }) {
  const dispatch = useDispatch()
  const filters = useSelector(selectFilters)

  // local draft to avoid instant filtering while typing
  const [draftLocation, setDraftLocation] = useState(filters.location)
  const [draftType, setDraftType] = useState(filters.vehicleType)
  const [draftTransmission, setDraftTransmission] = useState(filters.transmission)
  const [draftEquipment, setDraftEquipment] = useState(filters.equipment)

  const isSelectedEquipment = useMemo(() => {
    return new Set(Object.entries(draftEquipment).filter(([, v]) => v).map(([k]) => k))
  }, [draftEquipment])

  const handleToggleEquipment = (key) => {
    setDraftEquipment((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleTypeClick = (key) => {
    setDraftType((cur) => (cur === key ? '' : key))
  }

  const handleTransmissionClick = () => {
    setDraftTransmission((cur) => (cur === 'automatic' ? '' : 'automatic'))
  }

  const handleSearch = () => {
    dispatch(
      applyFilters({
        location: draftLocation,
        vehicleType: draftType,
        transmission: draftTransmission,
        equipment: draftEquipment,
      }),
    )
    onSearch?.()
  }

  // For 1:1 UI we don't render a "Reset" button.
  // Still keep a quick internal helper if needed later.
  const resetAll = () => {
    dispatch(resetFilters())
    setDraftLocation('')
    setDraftType('')
    setDraftTransmission('')
    setDraftEquipment({
      AC: false,
      kitchen: false,
      TV: false,
      bathroom: false,
      radio: false,
      refrigerator: false,
      microwave: false,
      gas: false,
      water: false,
    })
    onSearch?.()
  }

  return (
    <div className={styles.panel}>
      <div className={styles.group}>
        <div className={styles.label}>Location</div>
        <div className={styles.inputWrap}>
          <FiMapPin className={styles.inputIcon} aria-hidden="true" />
          <input
            className={styles.input}
            value={draftLocation}
            onChange={(e) => setDraftLocation(e.target.value)}
            placeholder="City"
            name="location"
          />
        </div>
      </div>

      <div className={styles.group}>
        <div className={styles.subheading}>Filters</div>
        <div className={styles.sectionTitle}>Vehicle equipment</div>
        <div className={styles.divider} />

        <div className={styles.grid}>
          {/* NOTE: We only show equipment tiles present in the design.
              Real filtering uses boolean fields where available. */}
          <button
            type="button"
            className={clsx(
              styles.tile,
              isSelectedEquipment.has('AC') && styles.tileActive,
            )}
            onClick={() => handleToggleEquipment('AC')}
          >
            <GiWindSlap className={styles.tileIcon} aria-hidden="true" />
            <span className={styles.tileLabel}>AC</span>
          </button>

          <button
            type="button"
            className={clsx(
              styles.tile,
              draftTransmission === 'automatic' && styles.tileActive,
            )}
            onClick={handleTransmissionClick}
          >
            <FaCogs className={styles.tileIcon} aria-hidden="true" />
            <span className={styles.tileLabel}>Automatic</span>
          </button>

          <button
            type="button"
            className={clsx(
              styles.tile,
              isSelectedEquipment.has('kitchen') && styles.tileActive,
            )}
            onClick={() => handleToggleEquipment('kitchen')}
          >
            <FaUtensils className={styles.tileIcon} aria-hidden="true" />
            <span className={styles.tileLabel}>Kitchen</span>
          </button>

          <button
            type="button"
            className={clsx(
              styles.tile,
              isSelectedEquipment.has('TV') && styles.tileActive,
            )}
            onClick={() => handleToggleEquipment('TV')}
          >
            <FaTv className={styles.tileIcon} aria-hidden="true" />
            <span className={styles.tileLabel}>TV</span>
          </button>

          <button
            type="button"
            className={clsx(
              styles.tile,
              isSelectedEquipment.has('bathroom') && styles.tileActive,
            )}
            onClick={() => handleToggleEquipment('bathroom')}
          >
            <FaShower className={styles.tileIcon} aria-hidden="true" />
            <span className={styles.tileLabel}>Bathroom</span>
          </button>
        </div>

        <div className={styles.sectionTitle}>Vehicle type</div>
        <div className={styles.divider} />
        <div className={styles.gridTypes}>
          {VEHICLE_TYPES.map((t) => (
            <button
              key={t.key}
              type="button"
              className={clsx(styles.tile, draftType === t.key && styles.tileActive)}
              onClick={() => handleTypeClick(t.key)}
            >
              <t.Icon className={styles.tileIcon} aria-hidden="true" />
              <span className={styles.tileLabel}>{t.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.actions}>
          <button className={styles.primary} onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
    </div>
  )
}

