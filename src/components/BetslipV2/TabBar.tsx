import type { BetTab } from './types'
import styles from './TabBar.module.css'

const TABS: { id: BetTab; label: string }[] = [
  { id: 'single',    label: 'Single' },
  { id: 'acca',      label: 'Acca' },
  { id: 'multiples', label: 'Multiples' },
]

type Props = {
  active: BetTab
  onChange: (tab: BetTab) => void
}

export function TabBar({ active, onChange }: Props) {
  return (
    <nav className={styles.tabBar} role="tablist" aria-label="Bet slip type">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          className={`${styles.tab} ${active === tab.id ? styles['tab--active'] : ''}`}
          onClick={() => onChange(tab.id)}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
