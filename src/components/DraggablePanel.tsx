import { useState, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'

interface DraggablePanelProps {
  children: ReactNode
  initialPosition?: { x: number; y: number }
  className?: string
  title?: string
  onClose?: () => void
  onMinimize?: () => void
  minimized?: boolean
  zIndex?: number
}

/**
 * Draggable panel component that can be moved around the screen
 */
export default function DraggablePanel({
  children,
  initialPosition = { x: 100, y: 100 },
  className = '',
  title,
  onClose,
  onMinimize,
  minimized = false,
  zIndex = 40
}: DraggablePanelProps) {
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const panelRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
      setIsDragging(true)
    }
  }

  // Add global event listeners for dragging
  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'grabbing'
    document.body.style.userSelect = 'none'
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isDragging, dragOffset])

  if (minimized) {
    return (
      <div
        ref={panelRef}
        className={`absolute glass-dark rounded-lg shadow-xl border border-accent-green cursor-pointer ${className}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex,
          minWidth: '200px'
        }}
        onMouseDown={handleMouseDown}
        onClick={onMinimize}
      >
        <div className="p-2 flex items-center justify-between">
          {title && <span className="text-sm font-semibold text-text-primary">{title}</span>}
          <span className="text-xs text-text-secondary">Click to expand</span>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={panelRef}
      className={`absolute glass-dark rounded-lg shadow-xl border border-accent-green ${isDragging ? 'cursor-grabbing' : 'cursor-move'} ${className}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex,
        maxWidth: '90vw',
        maxHeight: '90vh'
      }}
    >
      {/* Header with drag handle */}
      {(title || onClose || onMinimize) && (
        <div
          className="flex items-center justify-between p-3 border-b border-border-primary cursor-move"
          onMouseDown={handleMouseDown}
        >
          <h3 className="text-lg font-bold text-text-primary">{title}</h3>
          <div className="flex items-center gap-2">
            {onMinimize && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onMinimize()
                }}
                className="text-text-secondary hover:text-text-primary text-xl leading-none px-2 py-1 rounded hover:bg-bg-tertiary transition-colors"
                aria-label="Minimize"
              >
                −
              </button>
            )}
            {onClose && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onClose()
                }}
                className="text-text-secondary hover:text-text-primary font-bold text-xl leading-none px-2 py-1 rounded hover:bg-bg-tertiary transition-colors"
                aria-label="Close"
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="p-4 overflow-hidden" style={{ maxHeight: 'calc(90vh - 60px)' }}>
        {children}
      </div>
    </div>
  )
}
