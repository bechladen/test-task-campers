import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { FaStar } from 'react-icons/fa'
import { FiMapPin } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import { fetchCamperById } from '../../store/slices/campersSlice'
import { formatPrice } from '../../utils/format'
import { InlineLoader } from '../../ui/InlineLoader/InlineLoader'
import { ImageLightbox } from '../../ui/ImageLightbox/ImageLightbox'
import styles from './CamperDetailsPage.module.css'

const BookingSchema = Yup.object({
  name: Yup.string().trim().min(2, 'Too short').required('Required'),
  email: Yup.string().trim().email('Invalid email').required('Required'),
  bookingDate: Yup.string().required('Required'),
  comment: Yup.string().max(500, 'Too long'),
})

export function CamperDetailsPage() {
  const { id } = useParams()
  const dispatch = useDispatch()

  const camper = useSelector((s) => s.campers.byId?.[String(id)])
  const status = useSelector((s) => s.campers.byIdStatus?.[String(id)] ?? 'idle')
  const error = useSelector((s) => s.campers.byIdError?.[String(id)])

  const [tab, setTab] = useState('features') // features | reviews
  const reviewsRef = useRef(null)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  useEffect(() => {
    dispatch(fetchCamperById(id))
  }, [dispatch, id])

  useEffect(() => {
    if (camper?.name) document.title = `TravelTrucks | ${camper.name}`
  }, [camper?.name])

  const gallery = camper?.gallery ?? []
  const reviews = camper?.reviews ?? []
  const lightboxImages = useMemo(
    () => gallery.map((g) => g?.original ?? g?.thumb).filter(Boolean),
    [gallery],
  )

  const features = useMemo(() => {
    if (!camper) return []
    const keys = [
      'transmission',
      'engine',
      'AC',
      'bathroom',
      'kitchen',
      'TV',
      'radio',
      'refrigerator',
      'microwave',
      'gas',
      'water',
    ]

    return keys
      .map((k) => {
        const v = camper[k]
        if (!v) return null
        if (k === 'AC') return 'AC'
        if (k === 'TV') return 'TV'
        if (typeof v === 'boolean') return capitalize(k)
        return capitalize(String(v))
      })
      .filter(Boolean)
  }, [camper])

  const details = useMemo(() => {
    if (!camper) return []
    const pairs = [
      ['Form', camper.form],
      ['Length', camper.length],
      ['Width', camper.width],
      ['Height', camper.height],
      ['Tank', camper.tank],
      ['Consumption', camper.consumption],
    ]
    return pairs.filter(([, v]) => v)
  }, [camper])

  const handleReviewsClick = (e) => {
    e.preventDefault()
    setTab('reviews')
    queueMicrotask(() => {
      reviewsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  if (status === 'loading' || status === 'idle') return <InlineLoader />

  if (status === 'failed')
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.message} role="alert">
            {error || 'Failed to load camper'}
          </div>
        </div>
      </div>
    )

  if (!camper)
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.message}>Camper not found</div>
        </div>
      </div>
    )

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <h1 className={styles.title}>{camper.name}</h1>
            <div className={styles.meta}>
              <a className={styles.reviewsLink} href="#reviews" onClick={handleReviewsClick}>
                <FaStar className={styles.star} aria-hidden="true" />{' '}
                {Number(camper.rating ?? 0).toFixed(1)} ({reviews.length} Reviews)
              </a>
              <span className={styles.metaItem}>
                <FiMapPin aria-hidden="true" /> {camper.location}
              </span>
            </div>
            <div className={styles.price}>€{formatPrice(camper.price)}</div>
          </div>
        </div>

        <div className={styles.gallery}>
          {gallery.slice(0, 4).map((img, idx) => (
            <button
              key={img?.original ?? img?.thumb ?? idx}
              type="button"
              className={styles.photoBtn}
              onClick={() => setLightboxIndex(idx)}
              aria-label={`Open image ${idx + 1}`}
            >
              <img
                className={styles.photo}
                src={img?.original ?? img?.thumb}
                alt={`${camper.name} photo ${idx + 1}`}
                loading="lazy"
              />
            </button>
          ))}
        </div>

        <ImageLightbox
          isOpen={lightboxIndex !== null}
          images={lightboxImages}
          startIndex={lightboxIndex ?? 0}
          onClose={() => setLightboxIndex(null)}
        />

        <p className={styles.description}>{camper.description}</p>

        <div className={styles.tabs}>
          <button
            className={tab === 'features' ? styles.tabActive : styles.tab}
            onClick={() => setTab('features')}
          >
            Features
          </button>
          <button
            className={tab === 'reviews' ? styles.tabActive : styles.tab}
            onClick={() => setTab('reviews')}
          >
            Reviews
          </button>
        </div>

        <div className={styles.grid}>
          <div className={styles.left}>
            {tab === 'features' ? (
              <div className={styles.card}>
                <div className={styles.chips}>
                  {features.map((t) => (
                    <span key={t} className={styles.chip}>
                      {t}
                    </span>
                  ))}
                </div>

                <div className={styles.sectionTitle}>Vehicle details</div>
                <div className={styles.table}>
                  {details.map(([k, v]) => (
                    <div key={k} className={styles.row}>
                      <span className={styles.k}>{k}</span>
                      <span className={styles.v}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.reviews} id="reviews" ref={reviewsRef}>
                {reviews.length === 0 ? (
                  <div className={styles.message}>No reviews yet</div>
                ) : (
                  reviews.map((r, idx) => (
                    <div key={idx} className={styles.review}>
                      <div className={styles.avatar}>{String(r.reviewer_name ?? '?')[0]}</div>
                      <div className={styles.reviewBody}>
                        <div className={styles.reviewTop}>
                          <div className={styles.reviewer}>{r.reviewer_name}</div>
                          <Stars value={Number(r.reviewer_rating ?? 0)} />
                        </div>
                        <p className={styles.comment}>{r.comment}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className={styles.right}>
            <div className={styles.formCard}>
              <div className={styles.formTitle}>Book your campervan now</div>
              <div className={styles.formSubtitle}>
                Stay connected! We are always ready to help you.
              </div>

              <Formik
                initialValues={{
                  name: '',
                  email: '',
                  bookingDate: '',
                  comment: '',
                }}
                validationSchema={BookingSchema}
                onSubmit={async (values, helpers) => {
                  // Fake “booking” request; in task only notification is required.
                  await new Promise((r) => setTimeout(r, 600))
                  toast.success('Booking successful!')
                  helpers.resetForm()
                }}
              >
                {({ isSubmitting }) => (
                  <Form className={styles.form} noValidate>
                    <label className={styles.field}>
                      <Field
                        className={styles.input}
                        name="name"
                        placeholder="Name*"
                      />
                      <ErrorMessage name="name" component="div" className={styles.error} />
                    </label>

                    <label className={styles.field}>
                      <Field
                        className={styles.input}
                        name="email"
                        placeholder="Email*"
                        type="email"
                      />
                      <ErrorMessage name="email" component="div" className={styles.error} />
                    </label>

                    <label className={styles.field}>
                      <Field
                        className={styles.input}
                        name="bookingDate"
                        placeholder="Booking date*"
                        type="date"
                      />
                      <ErrorMessage
                        name="bookingDate"
                        component="div"
                        className={styles.error}
                      />
                    </label>

                    <label className={styles.field}>
                      <Field
                        as="textarea"
                        className={styles.textarea}
                        name="comment"
                        placeholder="Comment"
                        rows={4}
                      />
                      <ErrorMessage
                        name="comment"
                        component="div"
                        className={styles.error}
                      />
                    </label>

                    <button className={styles.send} type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Sending…' : 'Send'}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stars({ value }) {
  const v = Math.max(0, Math.min(5, Math.round(value)))
  return (
    <div className={styles.stars} aria-label={`${v} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar
          key={i}
          className={i < v ? styles.starFilled : styles.starEmpty}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

function capitalize(v) {
  const s = String(v)
  if (!s) return s
  return s[0].toUpperCase() + s.slice(1)
}

