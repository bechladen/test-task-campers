import { ClipLoader } from 'react-spinners'
import styles from './InlineLoader.module.css'

export function InlineLoader() {
  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      <ClipLoader color="#E44848" size={28} />
    </div>
  )
}

