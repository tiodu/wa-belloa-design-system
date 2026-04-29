import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  X,
  Search,
  ChevronRight,
  CircleDot,
  Trophy,
  Dices,
  Monitor,
  Radio,
  Zap,
  Flame,
  Sparkles,
  Star,
  Rocket,
  Tv2,
} from 'lucide-react'
import styles from './MobileSideMenuV2.module.css'

// ─── Types ────────────────────────────────────────────────────

type Tab = 'sports' | 'live' | 'casino' | 'virtuals'

type Props = {
  isOpen: boolean
  onClose: () => void
  isLoggedIn: boolean
}

// ─── Zone 4 data ──────────────────────────────────────────────

const SPORTS_ROWS = [
  { id: 'football',    label: 'Football',     icon: <CircleDot size={17} /> },
  { id: 'tennis',      label: 'Tennis',       icon: <CircleDot size={17} /> },
  { id: 'basketball',  label: 'Basketball',   icon: <Trophy size={17} /> },
  { id: 'live-events', label: 'Live Events',  icon: <Radio size={17} /> },
  { id: 'in-play',     label: 'In-Play',      icon: <Zap size={17} /> },
  { id: 'virtuals',    label: 'Virtuals',     icon: <Monitor size={17} /> },
]

const LIVE_ROWS = [
  { id: 'football',   label: 'Football',    count: 34 },
  { id: 'tennis',     label: 'Tennis',      count: 18 },
  { id: 'basketball', label: 'Basketball',  count: 12 },
  { id: 'horse',      label: 'Horse Racing', count: 8 },
  { id: 'cricket',    label: 'Cricket',     count: 7 },
  { id: 'esports',    label: 'Esports',     count: 14 },
]

const CASINO_PILLS = [
  { id: 'popular',    label: 'Popular',    icon: <Flame size={12} /> },
  { id: 'new',        label: 'New',        icon: <Sparkles size={12} /> },
  { id: 'slots',      label: 'Slots',      icon: <Star size={12} /> },
  { id: 'live',       label: 'Live Casino', icon: <Zap size={12} /> },
  { id: 'crash',      label: 'Crash',      icon: <Rocket size={12} /> },
  { id: 'gameshows',  label: 'Game Shows', icon: <Tv2 size={12} /> },
]

const CASINO_ROWS = [
  { id: 'live-casino',   label: 'Live Casino',    icon: <Zap size={17} /> },
  { id: 'slots',         label: 'Slots',          icon: <Dices size={17} /> },
  { id: 'game-shows',    label: 'Game Shows',     icon: <Tv2 size={17} /> },
  { id: 'new-releases',  label: 'New Releases',   icon: <Sparkles size={17} /> },
]

const VIRTUALS_ROWS = [
  { id: 'vfootball', label: 'Virtual Football',      icon: <CircleDot size={17} /> },
  { id: 'vhorses',   label: 'Virtual Horse Racing',  icon: <Trophy size={17} /> },
  { id: 'vtennis',   label: 'Virtual Tennis',        icon: <CircleDot size={17} /> },
  { id: 'vbasket',   label: 'Virtual Basketball',    icon: <Trophy size={17} /> },
]

const LIVE_COUNT = 93

// ─── Zone 4 panels ────────────────────────────────────────────

function SportsPanel({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <div className={styles.panel}>
      <p className={styles.panelHeader}>Top Sports</p>
      {SPORTS_ROWS.map(row => (
        <button key={row.id} className={styles.navRow}>
          <span className={styles.navRowIcon}>{row.icon}</span>
          <span className={styles.navRowLabel}>{row.label}</span>
          <ChevronRight size={14} className={styles.navRowChevron} />
        </button>
      ))}
      <button className={styles.footerLink} onClick={() => onNavigate('/prototype')}>All Sports →</button>
    </div>
  )
}

function LivePanel() {
  return (
    <div className={styles.panel}>
      <p className={styles.panelHeader}>Live Now · {LIVE_COUNT} events</p>
      {LIVE_ROWS.map(row => (
        <button key={row.id} className={styles.navRow}>
          <span className={styles.navRowIcon}><CircleDot size={17} /></span>
          <span className={styles.navRowLabel}>{row.label}</span>
          <span className={styles.liveCount}>{row.count}</span>
          <ChevronRight size={14} className={styles.navRowChevron} />
        </button>
      ))}
      <button className={styles.footerLink}>View all live →</button>
    </div>
  )
}

const CASINO_NAV_ROUTES: Record<string, string> = {
  'live-casino':  '/casino/live-casino',
  'slots':        '/casino/slots',
  'game-shows':   '/casino/game-shows',
  'new-releases': '/casino/new-releases',
}

function CasinoPanel({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [activePill, setActivePill] = useState('popular')
  return (
    <div className={styles.panel}>
      <p className={styles.panelHeader}>Casino</p>
      <div className={styles.pillsRow}>
        {CASINO_PILLS.map(pill => (
          <button
            key={pill.id}
            className={`${styles.pill}${activePill === pill.id ? ` ${styles.pillActive}` : ''}`}
            onClick={() => setActivePill(pill.id)}
          >
            {pill.icon}
            {pill.label}
          </button>
        ))}
      </div>
      <p className={styles.panelSubHeader}>Top Picks</p>
      {CASINO_ROWS.map(row => (
        <button
          key={row.id}
          className={styles.navRow}
          onClick={() => onNavigate(CASINO_NAV_ROUTES[row.id] ?? '/casino')}
        >
          <span className={styles.navRowIcon}>{row.icon}</span>
          <span className={styles.navRowLabel}>{row.label}</span>
          <ChevronRight size={14} className={styles.navRowChevron} />
        </button>
      ))}
      <button className={styles.footerLink} onClick={() => onNavigate('/casino')}>All Casino Games →</button>
    </div>
  )
}

function VirtualsPanel() {
  return (
    <div className={styles.panel}>
      <p className={styles.panelHeader}>Virtual Sports</p>
      {VIRTUALS_ROWS.map(row => (
        <button key={row.id} className={styles.navRow}>
          <span className={styles.navRowIcon}>{row.icon}</span>
          <span className={styles.navRowLabel}>{row.label}</span>
          <ChevronRight size={14} className={styles.navRowChevron} />
        </button>
      ))}
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────

export function MobileSideMenuV2({ isOpen, onClose, isLoggedIn }: Props) {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('sports')
  const navigate = useNavigate()

  function handleNavigate(path: string) {
    onClose()
    navigate(path)
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.drawer}>

        {/* Zone 1 — Identity + Money */}
        <div className={styles.zone1}>
          <div className={styles.identityRow}>
            {isLoggedIn ? (
              <>
                <div className={styles.avatar}>S</div>
                <div className={styles.userInfo}>
                  <span className={styles.username}>SportsFan</span>
                  <span className={styles.balance}>€10,000.00</span>
                </div>
              </>
            ) : (
              <div className={styles.authLinks}>
                <button className={styles.authBtn}>Log in</button>
                <button className={`${styles.authBtn} ${styles.authBtnPrimary}`}>Register</button>
              </div>
            )}
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>
          {isLoggedIn && (
            <div className={styles.moneyRow}>
              <button className={styles.moneyBtn}>Withdraw</button>
              <button className={`${styles.moneyBtn} ${styles.moneyBtnDeposit}`}>Deposit</button>
            </div>
          )}
        </div>

        {/* Zone 2 — Global Search */}
        <div className={styles.zone2}>
          <div className={styles.searchBar}>
            <Search size={15} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search events, games or teams…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className={styles.searchClear} onClick={() => setSearch('')} aria-label="Clear">
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Zone 3 — Mode Selector */}
        <div className={styles.zone3}>
          {(['sports', 'live', 'casino', 'virtuals'] as Tab[]).map(tab => (
            <button
              key={tab}
              className={`${styles.tab}${activeTab === tab ? ` ${styles.tabActive}` : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'live' ? (
                <>
                  Live
                  <span className={styles.liveBadge}>{LIVE_COUNT}</span>
                </>
              ) : (
                tab.charAt(0).toUpperCase() + tab.slice(1)
              )}
            </button>
          ))}
        </div>

        {/* Zone 4 — Deep Nav (scrollable) */}
        <div className={styles.zone4}>
          {activeTab === 'sports'   && <SportsPanel onNavigate={handleNavigate} />}
          {activeTab === 'live'     && <LivePanel />}
          {activeTab === 'casino'   && <CasinoPanel onNavigate={handleNavigate} />}
          {activeTab === 'virtuals' && <VirtualsPanel />}
        </div>

      </div>
    </div>
  )
}
