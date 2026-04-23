import { useState, type CSSProperties } from 'react'
import {
  X,
  ChevronDown,
  ChevronRight,
  Search,
  Radio,
  Play,
  Monitor,
  Dices,
  Gamepad2,
  Flame,
  Sparkles,
  Zap,
  Star,
  Rocket,
  Smartphone,
  Gift,
  LayoutGrid,
  Flag,
  Bike,
  Target,
  Snowflake,
  Shield,
  Users,
  MoreHorizontal,
  CircleDot,
  Trophy,
} from 'lucide-react'
import styles from './MobileSideMenu.module.css'

// ─── Types ────────────────────────────────────────────────────

type Props = {
  isOpen: boolean
  onClose: () => void
  isLoggedIn: boolean
  onToggleAuth: () => void
}

// Each tile accepts an optional imageUrl — B2B clients swap this to their
// own branded icon assets. Without it, the Lucide icon + accent tint is the fallback.
type NavTile = {
  id: string
  label: string
  icon: React.ReactNode
  accentColor: string
  imageUrl?: string
}

// ─── Data ─────────────────────────────────────────────────────

const QUICK_LINKS: NavTile[] = [
  { id: 'football', label: 'Football', icon: <CircleDot size={26} />, accentColor: 'rgba(20, 87, 80, 0.55)' },
  { id: 'live',     label: 'Live',     icon: <Radio size={26} />,     accentColor: 'rgba(180, 28, 28, 0.45)' },
  { id: 'in-play',  label: 'In-Play',  icon: <Play size={26} />,      accentColor: 'rgba(20, 50, 130, 0.45)' },
  { id: 'virtuals', label: 'Virtuals', icon: <Monitor size={26} />,   accentColor: 'rgba(80, 28, 140, 0.45)' },
  { id: 'casino',   label: 'Casino',   icon: <Dices size={26} />,     accentColor: 'rgba(160, 100, 10, 0.45)' },
  { id: 'esports',  label: 'eSports',  icon: <Gamepad2 size={26} />,  accentColor: 'rgba(20, 100, 60, 0.45)' },
]

const CASINO_CATS = [
  { id: 'popular',     label: 'Popular',     icon: <Flame size={13} /> },
  { id: 'new',         label: 'New',         icon: <Sparkles size={13} /> },
  { id: 'slots',       label: 'Slots',       icon: <Star size={13} /> },
  { id: 'crash',       label: 'Crash',       icon: <Rocket size={13} /> },
  { id: 'live-casino', label: 'Live Casino', icon: <Zap size={13} /> },
  { id: 'instant',     label: 'Instant',     icon: <Trophy size={13} /> },
]

const FOR_YOU_ITEMS: NavTile[] = [
  { id: 'app',    label: 'App Download', icon: <Smartphone size={22} />, accentColor: 'rgba(14, 179, 158, 0.22)' },
  { id: 'promos', label: 'Promotions',   icon: <Gift size={22} />,       accentColor: 'rgba(224, 116, 32, 0.22)' },
]

const SPORTS_LIST = [
  { id: 'all',        label: 'All Sports',  icon: <LayoutGrid size={16} /> },
  { id: 'football',   label: 'Football',    icon: <CircleDot size={16} /> },
  { id: 'basketball', label: 'Basketball',  icon: <Shield size={16} /> },
  { id: 'tennis',     label: 'Tennis',      icon: <Target size={16} /> },
  { id: 'volleyball', label: 'Volleyball',  icon: <CircleDot size={16} /> },
  { id: 'handball',   label: 'Handball',    icon: <CircleDot size={16} /> },
  { id: 'boxing',     label: 'Boxing',      icon: <Shield size={16} /> },
  { id: 'ice-hockey', label: 'Ice Hockey',  icon: <Snowflake size={16} /> },
  { id: 'formula1',   label: 'Formula 1',   icon: <Flag size={16} /> },
  { id: 'cycling',    label: 'Cycling',     icon: <Bike size={16} /> },
  { id: 'esports',    label: 'E-Sports',    icon: <Gamepad2 size={16} /> },
  { id: 'ufc',        label: 'UFC - MMA',   icon: <Shield size={16} /> },
  { id: 'cricket',    label: 'Cricket',     icon: <CircleDot size={16} /> },
  { id: 'darts',      label: 'Darts',       icon: <Target size={16} /> },
  { id: 'snooker',    label: 'Snooker',     icon: <CircleDot size={16} /> },
  { id: 'kabaddi',    label: 'Kabaddi',     icon: <Users size={16} /> },
  { id: 'others',     label: 'Others',      icon: <MoreHorizontal size={16} /> },
]

// ─── Component ────────────────────────────────────────────────

export function MobileSideMenu({ isOpen, onClose, isLoggedIn, onToggleAuth }: Props) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeQuickLink, setActiveQuickLink] = useState('football')
  const [activeCasinoCat, setActiveCasinoCat] = useState('')
  const [glassMode, setGlassMode] = useState(false)

  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div className={`${styles.drawer}${glassMode ? ` ${styles.drawerGlass}` : ''}`}>

        {/* 1 · Header ──────────────────────────────────────── */}
        <div className={styles.header}>
          <div className={styles.headerLogo}>B</div>

          {isLoggedIn ? (
            <div className={styles.headerUser}>
              <span className={styles.headerUsername}>SportsFan</span>
              <span className={styles.headerBalance}>€10,000.00</span>
            </div>
          ) : (
            <div className={styles.headerAuthLinks}>
              <button className={styles.headerAuthBtn}>Log in</button>
              <button className={styles.headerAuthBtn}>Register</button>
            </div>
          )}

          <button className={styles.closeBtn} onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        {/* 2 · Search bar ──────────────────────────────────── */}
        <div className={styles.searchSection}>
          <div className={styles.searchBar}>
            <button className={styles.searchCategory}>
              Casino
              <ChevronDown size={13} />
            </button>
            <div className={styles.searchDivider} />
            <div className={styles.searchInputWrap}>
              <Search size={15} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search your game"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className={styles.searchClear} onClick={() => setSearchQuery('')} aria-label="Clear">
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3 · Most Popular ────────────────────────────────── */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Most Popular</p>
          <div className={styles.quickLinks}>
            {QUICK_LINKS.map(link => (
              <button
                key={link.id}
                className={`${styles.quickTile}${activeQuickLink === link.id ? ` ${styles.quickTileActive}` : ''}`}
                onClick={() => setActiveQuickLink(link.id)}
              >
                <div
                  className={styles.quickTileIconWrap}
                  style={{ '--accent': link.accentColor } as CSSProperties}
                >
                  {link.imageUrl
                    ? <img src={link.imageUrl} alt={link.label} className={styles.quickTileImg} />
                    : <span className={styles.quickTileIcon}>{link.icon}</span>
                  }
                </div>
                <span className={styles.quickTileLabel}>{link.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4 · Fun with Casino Games ───────────────────────── */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Fun with Casino Games</p>
          <div className={styles.casinoCats}>
            {CASINO_CATS.map(cat => (
              <button
                key={cat.id}
                className={`${styles.casinoCat}${activeCasinoCat === cat.id ? ` ${styles.casinoCatActive}` : ''}`}
                onClick={() => setActiveCasinoCat(prev => prev === cat.id ? '' : cat.id)}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5 · For You ─────────────────────────────────────── */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>For you</p>
          <div className={styles.forYouList}>
            {FOR_YOU_ITEMS.map(item => (
              <button key={item.id} className={styles.forYouItem}>
                <div
                  className={styles.forYouIconWrap}
                  style={{ '--accent': item.accentColor } as CSSProperties}
                >
                  {item.imageUrl
                    ? <img src={item.imageUrl} alt={item.label} className={styles.forYouImg} />
                    : <span className={styles.forYouIcon}>{item.icon}</span>
                  }
                </div>
                <span className={styles.forYouLabel}>{item.label}</span>
                <ChevronRight size={14} className={styles.rowArrow} />
              </button>
            ))}
          </div>
        </div>

        {/* 6 · Browse all sports ───────────────────────────── */}
        <div className={`${styles.section} ${styles.sectionElevated}`}>
          <p className={styles.sectionTitle}>Browse all sports</p>
          <div className={styles.sportsList}>
            {SPORTS_LIST.map(sport => (
              <button key={sport.id} className={styles.sportItem}>
                <span className={styles.sportIcon}>{sport.icon}</span>
                <span className={styles.sportLabel}>{sport.label}</span>
                <ChevronRight size={14} className={styles.rowArrow} />
              </button>
            ))}
          </div>
        </div>

        {/* Demo controls ───────────────────────────────────── */}
        <div className={styles.demoControls}>
          <div className={styles.demoRow}>
            <span className={styles.demoLabel}>Auth State</span>
            <div className={styles.demoBtns}>
              <button
                className={`${styles.demoBtn}${isLoggedIn ? ` ${styles.demoBtnActive}` : ''}`}
                onClick={() => !isLoggedIn && onToggleAuth()}
              >
                Logged In
              </button>
              <button
                className={`${styles.demoBtn}${!isLoggedIn ? ` ${styles.demoBtnActive}` : ''}`}
                onClick={() => isLoggedIn && onToggleAuth()}
              >
                Logged Out
              </button>
            </div>
          </div>
          <div className={styles.demoRow}>
            <span className={styles.demoLabel}>Background</span>
            <div className={styles.demoBtns}>
              <button
                className={`${styles.demoBtn}${!glassMode ? ` ${styles.demoBtnActive}` : ''}`}
                onClick={() => setGlassMode(false)}
              >
                Solid
              </button>
              <button
                className={`${styles.demoBtn}${glassMode ? ` ${styles.demoBtnActive}` : ''}`}
                onClick={() => setGlassMode(true)}
              >
                Glass
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
