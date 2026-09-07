import { useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react'

export interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  className?: string
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void
  children: ReactNode
}

/** Native <dialog>: focus trap, Escape and inert background come for free. */
export function Dialog({ open, onClose, title, className, onKeyDown, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const wasOpen = useRef(false)

  // Only act on transitions of the `open` prop: a dialog closed natively with
  // Escape reports `open === false` before its close event has reached React,
  // and must not be re-opened by an unrelated re-render in between.
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !wasOpen.current && !dialog.open) dialog.showModal()
    else if (!open && wasOpen.current && dialog.open) dialog.close()
    wasOpen.current = open
  }, [open])

  return (
    <dialog
      ref={ref}
      className={`dialog${className ? ` ${className}` : ''}`}
      aria-label={title}
      onCancel={onClose}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="dialog-inner" onKeyDown={onKeyDown}>
        <div className="dialog-head">
          <h2 className="dialog-title">{title}</h2>
          <button type="button" className="btn btn-sm btn-ghost" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        {open ? children : null}
      </div>
    </dialog>
  )
}
