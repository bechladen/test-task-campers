import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCampers } from '../../store/slices/campersSlice'
import {
  selectCampersError,
  selectCampersStatus,
  selectFilteredCampers,
} from '../../store/selectors'
import { FiltersPanel } from './components/FiltersPanel/FiltersPanel'
import { CamperCard } from './components/CamperCard/CamperCard'
import { InlineLoader } from '../../ui/InlineLoader/InlineLoader'
import styles from './CatalogPage.module.css'

const PAGE_SIZE = 4

export function CatalogPage() {
  const dispatch = useDispatch()
  const status = useSelector(selectCampersStatus)
  const error = useSelector(selectCampersError)
  const filtered = useSelector(selectFilteredCampers)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    document.title = 'TravelTrucks | Catalog'
  }, [])

  useEffect(() => {
    dispatch(fetchCampers())
  }, [dispatch])

  const visibleItems = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount],
  )

  const canLoadMore = visibleCount < filtered.length

  const handleSearch = () => {
    // Requirement: reset previous results before showing new ones
    setVisibleCount(PAGE_SIZE)
  }

  const handleLoadMore = () => {
    setVisibleCount((n) => n + PAGE_SIZE)
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <aside className={styles.sidebar}>
          <FiltersPanel onSearch={handleSearch} />
        </aside>

        <section className={styles.content} aria-label="Campers list">
          {status === 'loading' && <InlineLoader />}

          {status === 'failed' && (
            <div className={styles.message} role="alert">
              {error || 'Failed to load campers'}
            </div>
          )}

          {status === 'succeeded' && visibleItems.length === 0 && (
            <div className={styles.message}>No campers found</div>
          )}

          <div className={styles.list}>
            {visibleItems.map((c) => (
              <CamperCard key={c.id} camper={c} />
            ))}
          </div>

          {status === 'succeeded' && canLoadMore && (
            <div className={styles.loadMoreWrap}>
              <button className={styles.loadMore} onClick={handleLoadMore}>
                Load more
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

