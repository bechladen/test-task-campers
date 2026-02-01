import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa'
import { FiMapPin } from 'react-icons/fi'
import clsx from 'clsx'

import { toggleFavorite } from '../../../../store/slices/favoritesSlice'
import { selectFavoriteIds } from '../../../../store/selectors'
import { formatPrice } from '../../../../utils/format'
import styles from './CamperCard.module.css'

export function CamperCard({ camper }) {
  const dispatch = useDispatch()
  const favoriteIds = useSelector(selectFavoriteIds)
  const isFav = favoriteIds.includes(String(camper.id))

  const handleToggleFav = () => {
    dispatch(toggleFavorite(camper.id))
  }

  const imageUrl = camper?.gallery?.[0]?.thumb ?? camper?.gallery?.[0]?.original

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {imageUrl ? (
          <img className={styles.image} src={imageUrl} alt={camper.name} />
        ) : (
          <div className={styles.imageFallback} aria-hidden="true" />
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.topRow}>
          <h3 className={styles.title}>{camper.name}</h3>
          <div className={styles.rightTop}>
            <div className={styles.price}>€{formatPrice(camper.price)}</div>
            <button
              type="button"
              className={clsx(styles.favBtn, isFav && styles.favBtnActive)}
              onClick={handleToggleFav}
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFav ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>
        </div>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <FaStar className={styles.star} aria-hidden="true" />
            {Number(camper.rating ?? 0).toFixed(1)} ({camper.reviews?.length ?? 0}{' '}
            Reviews)
          </span>
          <span className={styles.metaItem}>
            <FiMapPin aria-hidden="true" /> {camper.location}
          </span>
        </div>

        <p className={styles.desc}>{camper.description}</p>

        <div className={styles.tags}>
          {camper.transmission && (
            <span className={styles.tag}>{capitalize(camper.transmission)}</span>
          )}
          {camper.engine && <span className={styles.tag}>{camper.engine}</span>}
          {camper.kitchen && <span className={styles.tag}>Kitchen</span>}
          {camper.AC && <span className={styles.tag}>AC</span>}
        </div>

        <Link
          className={styles.more}
          to={`/catalog/${camper.id}`}
          target="_blank"
          rel="noreferrer"
        >
          Show more
        </Link>
      </div>
    </article>
  )
}

function capitalize(v) {
  const s = String(v)
  return s ? s[0].toUpperCase() + s.slice(1) : s
}

