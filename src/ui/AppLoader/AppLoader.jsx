import { ClipLoader } from 'react-spinners'
import styles from './AppLoader.module.css'

export function AppLoader() {
  return (
    <div className={styles.backdrop} role="status" aria-live="polite">
      <ClipLoader color="#E44848" size={40} />
    </div>
  )
}

