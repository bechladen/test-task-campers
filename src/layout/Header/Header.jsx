import { useEffect, useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import clsx from 'clsx'
import { FiMenu, FiX } from 'react-icons/fi'
import styles from './Header.module.css'

const getNavClass = ({ isActive }) =>
  clsx(styles.link, isActive && styles.linkActive)

export function Header() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const links = useMemo(
    () => [
      { to: '/', label: 'Home' },
      { to: '/catalog', label: 'Catalog' },
      { to: '/favourites', label: 'Favourites' },
    ],
    [],
  )

  useEffect(() => {
    // close burger menu on navigation
    setIsOpen(false)
  }, [location.pathname])

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink className={styles.brand} to="/">
          TravelTrucks
        </NavLink>

        <nav className={styles.nav} aria-label="Primary navigation">
          {links.map((l) => (
            <NavLink key={l.to} className={getNavClass} to={l.to}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className={styles.burger}
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {isOpen && (
        <>
          <button
            type="button"
            className={styles.backdrop}
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          />
          <div className={styles.mobileMenu} id="mobile-nav" role="dialog" aria-label="Menu">
            <nav className={styles.mobileNav} aria-label="Mobile navigation">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  className={getNavClass}
                  to={l.to}
                  onClick={() => setIsOpen(false)}
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </>
      )}
    </header>
  )
}

