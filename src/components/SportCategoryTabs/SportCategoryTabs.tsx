import { useState } from 'react'
import styles from './SportCategoryTabs.module.css'

interface SportTab {
  id: string
  label: string
  icon: string | null
  isLive?: boolean
  dimIcon?: boolean
}

const TABS: SportTab[] = [
  { id: 'all',        label: 'All',      icon: '⚽🏀' },
  { id: 'inplay',     label: 'In-Play',  icon: null, isLive: true },
  { id: 'football',   label: 'Football', icon: '⚽', dimIcon: true },
  { id: 'tennis',     label: 'Tennis',   icon: '🎾' },
  { id: 'basketball', label: 'Basket..', icon: '🏀' },
  { id: 'mma',        label: 'MMA',      icon: '🥊' },
  { id: 'cricket',    label: 'Cricket',  icon: '🏏' },
  { id: 'hockey',     label: 'Hockey',   icon: '🏒' },
]

interface SportCategoryTabsProps {
  activeId?: string
  onChange?: (id: string) => void
}

export function SportCategoryTabs({ activeId: controlledActive, onChange }: SportCategoryTabsProps) {
  const [internalActive, setInternalActive] = useState('all')
  const activeId = controlledActive ?? internalActive

  function handleClick(id: string) {
    setInternalActive(id)
    onChange?.(id)
  }

  return (
    <div className={styles.container}>
      <div className={styles.track}>
        {TABS.map(tab => {
          const isActive = tab.id === activeId
          return (
            <button
              key={tab.id}
              type="button"
              className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
              onClick={() => handleClick(tab.id)}
            >
              <div className={styles.tabInner}>
                {tab.isLive ? (
                  <div className={styles.liveBadge}>
                    <span className={styles.liveBadgeText}>Live</span>
                  </div>
                ) : (
                  <span className={`${styles.tabIcon} ${tab.id === 'all' ? styles.tabIconAll : ''} ${tab.dimIcon && !isActive ? styles.tabIconInactive : ''}`}>
                    {tab.icon}
                  </span>
                )}
                <span className={`${styles.tabLabel} ${isActive ? styles.tabLabelActive : ''}`}>
                  {tab.label}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
