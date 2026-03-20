import { useState, useRef, useEffect } from 'react'
import styles from './VersionSelector.module.css'

export type ControlOption = { value: string; label: string }

export type ControlItem = {
  id: string
  label: string
  options: ControlOption[]
  value: string
}

type Props = {
  controls: ControlItem[]
  onChange: (id: string, value: string) => void
}

function Dropdown({ item, onChange }: { item: ControlItem; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  const current = item.options.find((o) => o.value === item.value)

  return (
    <div className={styles.control} ref={ref}>
      <span className={styles.controlLabel}>{item.label}</span>
      <button
        className={`${styles.trigger} ${open ? styles['trigger--open'] : ''}`}
        onClick={() => setOpen((v) => !v)}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{current?.label ?? item.value}</span>
        <svg className={styles.chevron} width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul className={styles.menu} role="listbox">
          {item.options.map((opt) => (
            <li
              key={opt.value}
              className={`${styles.option} ${opt.value === item.value ? styles['option--active'] : ''}`}
              role="option"
              aria-selected={opt.value === item.value}
              onClick={() => { onChange(opt.value); setOpen(false) }}
            >
              {opt.value === item.value && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              <span>{opt.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function VersionSelector({ controls, onChange }: Props) {
  return (
    <div className={styles.bar}>
      <span className={styles.title}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" />
          <rect x="7" y="1" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" />
          <rect x="1" y="7" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" />
          <rect x="7" y="7" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        Component Controls
      </span>

      <div className={styles.controls}>
        {controls.map((item) => (
          <Dropdown
            key={item.id}
            item={item}
            onChange={(value) => onChange(item.id, value)}
          />
        ))}
      </div>
    </div>
  )
}
