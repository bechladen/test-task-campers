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
  const stageRef = useRef(null)
  const imgRef = useRef(null)
  const [baseSize, setBaseSize] = useState({ w: 0, h: 0 })
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
    setBaseSize({ w: 0, h: 0 })
  }, [isOpen, startIndex, safeImages.length])

  const canShow = isOpen && safeImages.length > 0
  const src = safeImages[index]
  const counter = `${index + 1} / ${safeImages.length}`
  const zoom = isHovering ? HOVER_ZOOM : 1

  const prev = () => {
    setIndex((i) => (i - 1 + safeImages.length) % safeImages.length)
    setOffset({ x: 0, y: 0 })
    setIsHovering(false)
    setBaseSize({ w: 0, h: 0 })
  }
  const next = () => {
    setIndex((i) => (i + 1) % safeImages.length)
    setOffset({ x: 0, y: 0 })
    setIsHovering(false)
    setBaseSize({ w: 0, h: 0 })
  }

  const onImageLoad = () => {
    // Capture the “fit” size at zoom=1, used to calculate pan bounds.
    const rect = imgRef.current?.getBoundingClientRect()
    if (!rect) return
    setBaseSize({ w: rect.width, h: rect.height })
  }

  const onMouseMove = (e) => {
    if (!isHovering || isDragging || zoom <= 1) return
    const stageRect = stageRef.current?.getBoundingClientRect()
    if (!stageRect) return

    const relX = clamp01((e.clientX - stageRect.left) / stageRect.width)
    const relY = clamp01((e.clientY - stageRect.top) / stageRect.height)

    const maxPanX = Math.max(0, (baseSize.w * zoom - stageRect.width) / 2)
    const maxPanY = Math.max(0, (baseSize.h * zoom - stageRect.height) / 2)

    // Move image opposite to cursor to reveal the hovered area.
    const x = (0.5 - relX) * 2 * maxPanX
    const y = (0.5 - relY) * 2 * maxPanY

    setOffset({ x, y })
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
        ref={stageRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false)
          setOffset({ x: 0, y: 0 })
          endDrag()
        }}
        onMouseMove={onMouseMove}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        data-zoomed={zoom > 1 ? 'true' : 'false'}
        data-dragging={isDragging ? 'true' : 'false'}
      >
        <div
          className={styles.pan}
          style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
        >
          <img
            ref={imgRef}
            className={styles.image}
            src={src}
            alt={`Preview ${index + 1}`}
            style={{ transform: `scale(${zoom})` }}
            onLoad={onImageLoad}
            draggable="false"
          />
        </div>
      </div>
    </Modal>
  )
}

function clamp01(n) {
  if (n < 0) return 0
  if (n > 1) return 1
  return n
}

