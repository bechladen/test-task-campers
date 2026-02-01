import { Link } from 'react-router-dom'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.text}>Page not found.</p>
        <Link className={styles.link} to="/">
          Go home
        </Link>
      </div>
    </div>
  )
}

