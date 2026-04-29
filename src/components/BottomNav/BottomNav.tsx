import { Home, Radio, Search, ClipboardList, Gamepad2 } from 'lucide-react'
import styles from './BottomNav.module.css'

export type View = 'sportsbook' | 'casino' | 'my-bets'

type Props = {
  activeView: View
  onChange: (v: View) => void
}

export function BottomNav({ activeView, onChange }: Props) {
  return (
    <nav className={styles.bottomNav}>
      <button
        className={`${styles.navItem} ${activeView === 'sportsbook' ? styles.navItemActive : ''}`}
        onClick={() => onChange('sportsbook')}
        type="button"
      >
        <Home size={22} />
        Sports
      </button>
      <button className={styles.navItem} type="button">
        <Radio size={22} />
        Live
      </button>
      <button className={styles.navItem} type="button">
        <Search size={22} />
        Search
      </button>
      <button
        className={`${styles.navItem} ${activeView === 'my-bets' ? styles.navItemActive : ''}`}
        onClick={() => onChange('my-bets')}
        type="button"
      >
        <ClipboardList size={22} />
        My Bets
      </button>
      <button
        className={`${styles.navItem} ${activeView === 'casino' ? styles.navItemActive : ''}`}
        onClick={() => onChange('casino')}
        type="button"
      >
        <Gamepad2 size={22} />
        Casino
      </button>
    </nav>
  )
}
