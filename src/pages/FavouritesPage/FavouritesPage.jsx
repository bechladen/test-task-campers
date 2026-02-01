import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { fetchCampers } from '../../store/slices/campersSlice'
import { selectCampers, selectCampersStatus, selectFavoriteIds } from '../../store/selectors'
import { CamperCard } from '../CatalogPage/components/CamperCard/CamperCard'
import { InlineLoader } from '../../ui/InlineLoader/InlineLoader'
import styles from './FavouritesPage.module.css'

export function FavouritesPage() {
  const dispatch = useDispatch()
  const campers = useSelector(selectCampers)
  const status = useSelector(selectCampersStatus)
  const favoriteIds = useSelector(selectFavoriteIds)

  useEffect(() => {
    document.title = 'TravelTrucks | Favourites'
  }, [])

  useEffect(() => {
    if (status === 'idle') dispatch(fetchCampers())
  }, [dispatch, status])

  const favoriteCampers = useMemo(() => {
    const ids = new Set(favoriteIds)
    return (campers ?? []).filter((c) => ids.has(String(c.id)))
  }, [campers, favoriteIds])

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Favourites</h1>

        {status === 'loading' && <InlineLoader />}

        {favoriteIds.length === 0 && status !== 'loading' && (
          <div className={styles.empty}>
            <p className={styles.emptyText}>You have no favourite campers yet.</p>
            <Link className={styles.cta} to="/catalog">
              Browse catalog
            </Link>
          </div>
        )}

        {favoriteIds.length > 0 && (
          <div className={styles.list}>
            {favoriteCampers.map((c) => (
              <CamperCard key={c.id} camper={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

