import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ChevronLeft,
  Search,
  ArrowUpDown,
  SlidersHorizontal,
  Info,
  Star,
  Flame,
  Sparkles,
  Gamepad2,
  Rocket,
  Trophy,
  Zap,
} from 'lucide-react'
import styles from './CasinoCategoryPage.module.css'

// ─── Data ─────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'all',     label: 'All',         icon: <Star size={14} /> },
  { id: 'popular', label: 'Popular',     icon: <Flame size={14} /> },
  { id: 'new',     label: 'New',         icon: <Sparkles size={14} /> },
  { id: 'slots',   label: 'Slots',       icon: <Gamepad2 size={14} /> },
  { id: 'crash',   label: 'Crash Games', icon: <Rocket size={14} /> },
  { id: 'table',   label: 'Table Games', icon: <Trophy size={14} /> },
  { id: 'live',    label: 'Live Casino', icon: <Zap size={14} /> },
]

interface GameItem {
  id: string
  title: string
  badge: 'HOT' | 'NEW' | null
  gradientFrom: string
  gradientTo: string
}

const GAMES_BY_CATEGORY: Record<string, { title: string; games: GameItem[] }> = {
  'live-casino': {
    title: 'Live Casino',
    games: [
      { id: 'lc1', title: 'Crazy Time',         badge: 'HOT', gradientFrom: '#7c2d12', gradientTo: '#f97316' },
      { id: 'lc2', title: 'Lightning Roulette',  badge: null,  gradientFrom: '#1e3a5f', gradientTo: '#0284c7' },
      { id: 'lc3', title: 'Mega Ball',           badge: 'NEW', gradientFrom: '#14532d', gradientTo: '#16a34a' },
      { id: 'lc4', title: 'Dream Catcher',       badge: null,  gradientFrom: '#4a1d96', gradientTo: '#7c3aed' },
      { id: 'lc5', title: 'Live Blackjack',      badge: null,  gradientFrom: '#0f172a', gradientTo: '#1d4ed8' },
      { id: 'lc6', title: 'Baccarat Pro',        badge: null,  gradientFrom: '#27272a', gradientTo: '#57534e' },
      { id: 'lc7', title: 'Deal or No Deal',     badge: 'HOT', gradientFrom: '#78350f', gradientTo: '#b45309' },
      { id: 'lc8', title: 'Monopoly Live',       badge: null,  gradientFrom: '#1e1b4b', gradientTo: '#4338ca' },
    ],
  },
  'slots': {
    title: 'Slots',
    games: [
      { id: 'sl1', title: 'Gates of Olympus',    badge: 'HOT', gradientFrom: '#1e3a5f', gradientTo: '#2563eb' },
      { id: 'sl2', title: 'Sweet Bonanza',       badge: null,  gradientFrom: '#7c2d12', gradientTo: '#f97316' },
      { id: 'sl3', title: 'Aztec Fire',          badge: 'NEW', gradientFrom: '#78350f', gradientTo: '#b45309' },
      { id: 'sl4', title: 'Book of Dead',        badge: null,  gradientFrom: '#27272a', gradientTo: '#57534e' },
      { id: 'sl5', title: 'Book of Sun',         badge: null,  gradientFrom: '#451a03', gradientTo: '#92400e' },
      { id: 'sl6', title: 'Black Wolf',          badge: null,  gradientFrom: '#0f172a', gradientTo: '#1d4ed8' },
      { id: 'sl7', title: 'African Spirit',      badge: null,  gradientFrom: '#92400e', gradientTo: '#f59e0b' },
      { id: 'sl8', title: 'Amazonia Spirit',     badge: 'NEW', gradientFrom: '#14532d', gradientTo: '#16a34a' },
      { id: 'sl9', title: 'Solar Spirit',        badge: null,  gradientFrom: '#1e3a5f', gradientTo: '#0284c7' },
      { id: 'sl10', title: 'Zeus Thunder',       badge: null,  gradientFrom: '#1e3a5f', gradientTo: '#2563eb' },
    ],
  },
  'game-shows': {
    title: 'Game Shows',
    games: [
      { id: 'gs1', title: 'Crazy Time',          badge: 'HOT', gradientFrom: '#7c2d12', gradientTo: '#f97316' },
      { id: 'gs2', title: 'Monopoly Live',       badge: null,  gradientFrom: '#1e1b4b', gradientTo: '#4338ca' },
      { id: 'gs3', title: 'Deal or No Deal',     badge: null,  gradientFrom: '#78350f', gradientTo: '#b45309' },
      { id: 'gs4', title: 'Mega Ball',           badge: 'NEW', gradientFrom: '#14532d', gradientTo: '#16a34a' },
      { id: 'gs5', title: 'Dream Catcher',       badge: null,  gradientFrom: '#4a1d96', gradientTo: '#7c3aed' },
      { id: 'gs6', title: 'Funky Time',          badge: 'HOT', gradientFrom: '#92400e', gradientTo: '#f59e0b' },
    ],
  },
  'new-releases': {
    title: 'New Releases',
    games: [
      { id: 'nr1', title: 'Amazonia Spirit',     badge: 'NEW', gradientFrom: '#14532d', gradientTo: '#16a34a' },
      { id: 'nr2', title: 'Aztec Fire 3',        badge: 'NEW', gradientFrom: '#7c2d12', gradientTo: '#f97316' },
      { id: 'nr3', title: 'Mega Ball 2',         badge: 'NEW', gradientFrom: '#1e3a5f', gradientTo: '#0284c7' },
      { id: 'nr4', title: 'Solar Spirit 2',      badge: 'NEW', gradientFrom: '#4a1d96', gradientTo: '#7c3aed' },
      { id: 'nr5', title: 'Book of Wizard DC',   badge: 'NEW', gradientFrom: '#1e1b4b', gradientTo: '#4338ca' },
      { id: 'nr6', title: 'Funky Time',          badge: 'NEW', gradientFrom: '#92400e', gradientTo: '#f59e0b' },
    ],
  },
}

// ─── Component ────────────────────────────────────────────────

function CasinoCategoryContent({ categoryKey }: { categoryKey: string }) {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const data = GAMES_BY_CATEGORY[categoryKey] ?? GAMES_BY_CATEGORY['slots']
  const filtered = data.games.filter(g =>
    searchQuery === '' || g.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={styles.mobileBook}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/casino')} type="button">
          <ChevronLeft size={22} />
        </button>
        <span className={styles.headerTitle}>{data.title}</span>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}><Search size={18} /></span>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search games"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className={styles.pillsTrack}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`${styles.pill}${activeCategory === cat.id ? ` ${styles.pillActive}` : ''}`}
              onClick={() => setActiveCategory(cat.id)}
              type="button"
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.subHeader}>
        <span className={styles.gameCount}>{filtered.length} games</span>
        <div className={styles.actions}>
          <button className={styles.actionBtn} type="button">
            <ArrowUpDown size={12} /> Sort
          </button>
          <button className={styles.actionBtn} type="button">
            <SlidersHorizontal size={12} /> Filter
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {filtered.map(g => (
          <div key={g.id} className={styles.gameCard}>
            <div
              className={styles.gameCardImage}
              style={{ background: `linear-gradient(160deg, ${g.gradientFrom}, ${g.gradientTo})` }}
            >
              {g.badge && (
                <span className={`${styles.gameCardBadge} ${g.badge === 'HOT' ? styles.gameCardBadgeHot : ''}`}>
                  {g.badge}
                </span>
              )}
              <button className={styles.gameCardInfo} type="button" aria-label="Game info">
                <Info size={11} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CasinoCategoryPage() {
  const { category = 'slots' } = useParams<{ category: string }>()

  return (
    <main className={styles.page}>
      <span className={styles.frameLabel}>Mobile Preview · Casino</span>
      <div className={styles.phoneFrame}>
        <CasinoCategoryContent categoryKey={category} />
      </div>
    </main>
  )
}
