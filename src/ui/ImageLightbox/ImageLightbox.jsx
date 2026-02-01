import { useEffect, useMemo, useRef, useState } from 'react'
import Modal from 'react-modal'
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi'
import styles from './ImageLightbox.module.css'

const HOVER_ZOOM = 2

export function ImageLightbox({ isOpen, images, startIndex = 0, onClose }) {
  const safeImages = useMemo(() => (images ?? []).filter(Boolean), [images])
  const [index, setIndex] = useState(startIndex)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    startOffsetX: 0,
    startOffsetY: 0,
  })

  useEffect(() => {
    if (!isOpen) return
    setIndex(Math.max(0, Math.min(startIndex, safeImages.length - 1)))
    setOffset({ x: 0, y: 0 })
    setIsHovering(false)
  }, [isOpen, startIndex, safeImages.length])

  const canShow = isOpen && safeImages.length > 0
  const src = safeImages[index]
  const counter = `${index + 1} / ${safeImages.length}`
  const zoom = isHovering ? HOVER_ZOOM : 1

  const prev = () => {
    setIndex((i) => (i - 1 + safeImages.length) % safeImages.length)
    setOffset({ x: 0, y: 0 })
    setIsHovering(false)
  }
  const next = () => {
    setIndex((i) => (i + 1) % safeImages.length)
    setOffset({ x: 0, y: 0 })
    setIsHovering(false)
  }

  const onPointerDown = (e) => {
    if (zoom <= 1) return
    // only left click / primary touch
    if (e.button !== undefined && e.button !== 0) return
    e.preventDefault()
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      startOffsetX: offset.x,
      startOffsetY: offset.y,
    }
    setIsDragging(true)
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!dragRef.current.active) return
    e.preventDefault()
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    setOffset({
      x: dragRef.current.startOffsetX + dx,
      y: dragRef.current.startOffsetY + dy,
    })
  }

  const endDrag = () => {
    if (!dragRef.current.active) return
    dragRef.current.active = false
    setIsDragging(false)
  }

  return (
    <Modal
      isOpen={canShow}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
      className={styles.content}
      overlayClassName={styles.overlay}
      contentLabel="Image preview"
    >
      <div className={styles.topBar}>
        <div className={styles.counter}>{counter}</div>

        <div className={styles.tools}>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>
      </div>

      <button type="button" className={styles.arrowLeft} onClick={prev} aria-label="Previous">
        <FiChevronLeft />
      </button>
      <button type="button" className={styles.arrowRight} onClick={next} aria-label="Next">
        <FiChevronRight />
      </button>

      <div
        className={styles.stage}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false)
          setOffset({ x: 0, y: 0 })
          endDrag()
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        data-zoomed={zoom > 1 ? 'true' : 'false'}
        data-dragging={isDragging ? 'true' : 'false'}
      >
        <img
          className={styles.image}
          src={src}
          alt={`Preview ${index + 1}`}
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          }}
          draggable="false"
        />
      </div>
    </Modal>
  )
}

