import { useState, type ReactNode } from 'react'
import {
  Search,
  Flame,
  Sparkles,
  Star,
  Zap,
  ChevronRight,
  ChevronLeft,
  Gamepad2,
  Rocket,
  Trophy,
  Clock,
  Info,
  ArrowUpDown,
  SlidersHorizontal,
} from 'lucide-react'
import styles from './CasinoLobbyPage.module.css'

// ─── Data types ───────────────────────────────────────────────

interface Category {
  id: string
  label: string
  icon: ReactNode
}

interface PromoItem {
  id: string
  tag: string
  title: string
  subtitle: string
}

type GameBadge = 'HOT' | 'NEW' | null

interface GameItem {
  id: string
  title: string
  provider: string
  badge: GameBadge
  playCount: string
  gradientFrom: string
  gradientTo: string
}

interface Provider {
  id: string
  name: string
}

// ─── Mock data ────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  { id: 'all',     label: 'All',         icon: <Star size={14} /> },
  { id: 'popular', label: 'Popular',     icon: <Flame size={14} /> },
  { id: 'new',     label: 'New',         icon: <Sparkles size={14} /> },
  { id: 'slots',   label: 'Slots',       icon: <Gamepad2 size={14} /> },
  { id: 'crash',   label: 'Crash Games', icon: <Rocket size={14} /> },
  { id: 'table',   label: 'Table Games', icon: <Trophy size={14} /> },
  { id: 'live',    label: 'Live Casino', icon: <Zap size={14} /> },
  { id: 'instant', label: 'Instant',     icon: <Star size={14} /> },
]

const PROMOS: PromoItem[] = [
  {
    id: 'p1',
    tag: 'PROMOTION',
    title: '2× VIP Progress',
    subtitle: 'Play any eligible game to earn double VIP points this weekend.',
  },
  {
    id: 'p2',
    tag: 'PROMOTION',
    title: 'Weekend Reload',
    subtitle: 'Get 50% up to €200 on every deposit this Saturday & Sunday.',
  },
  {
    id: 'p3',
    tag: 'PROMOTION',
    title: 'Free Spins Drop',
    subtitle: '100 Free Spins on Gates of Olympus — no wagering required.',
  },
]

const FEATURED_GAMES: GameItem[] = [
  { id: 'fg1', title: 'African Spirit',   provider: 'Pragmatic Play', badge: null,  playCount: '18.2k playing', gradientFrom: '#92400e', gradientTo: '#f59e0b' },
  { id: 'fg2', title: 'Amazonia Spirit',  provider: 'Pragmatic Play', badge: 'NEW', playCount: '14.7k playing', gradientFrom: '#14532d', gradientTo: '#16a34a' },
  { id: 'fg3', title: 'Aztec Fire 2',     provider: 'Playson',        badge: null,  playCount: '9.3k playing',  gradientFrom: '#7c2d12', gradientTo: '#ea580c' },
  { id: 'fg4', title: 'Amazonia Wins',    provider: 'Pragmatic Play', badge: 'HOT', playCount: '7.1k playing',  gradientFrom: '#4a1d96', gradientTo: '#7c3aed' },
  { id: 'fg5', title: 'Solar Spirit',     provider: 'Pragmatic Play', badge: null,  playCount: '6.8k playing',  gradientFrom: '#1e3a5f', gradientTo: '#0284c7' },
]

const SUPER_SLOTS_GAMES: GameItem[] = [
  { id: 'ss1', title: 'Aztec Fire',            provider: 'Playson',   badge: 'NEW', playCount: '8.3k playing', gradientFrom: '#78350f', gradientTo: '#b45309' },
  { id: 'ss2', title: 'Black Wolf',             provider: 'Amatic',   badge: null,  playCount: '7.2k playing', gradientFrom: '#0f172a', gradientTo: '#1d4ed8' },
  { id: 'ss3', title: 'Book of Sun',            provider: 'Booongo',  badge: null,  playCount: '6.8k playing', gradientFrom: '#451a03', gradientTo: '#92400e' },
  { id: 'ss4', title: 'Book of Wizard',         provider: "Play'n GO", badge: null, playCount: '5.9k playing', gradientFrom: '#1e1b4b', gradientTo: '#4338ca' },
  { id: 'ss5', title: 'Golden Dragon Inferno',  provider: 'Habanero', badge: null,  playCount: '4.7k playing', gradientFrom: '#7f1d1d', gradientTo: '#c2410c' },
]

const MOST_PLAYED_GAMES: GameItem[] = [
  { id: 'mp1',  title: 'Book of Sun',           provider: 'Booongo',   badge: null, playCount: '22.1k playing', gradientFrom: '#451a03', gradientTo: '#92400e' },
  { id: 'mp2',  title: 'Book of Sun Choice',    provider: 'Booongo',   badge: null, playCount: '19.3k playing', gradientFrom: '#431407', gradientTo: '#b45309' },
  { id: 'mp3',  title: 'Book of Wizard DC',     provider: "Play'n GO", badge: null, playCount: '17.8k playing', gradientFrom: '#1e1b4b', gradientTo: '#4338ca' },
  { id: 'mp4',  title: 'African Spirit',        provider: 'Pragmatic Play', badge: null, playCount: '16.2k playing', gradientFrom: '#92400e', gradientTo: '#f59e0b' },
  { id: 'mp5',  title: 'Amazonia Spirit',       provider: 'Pragmatic Play', badge: null, playCount: '15.5k playing', gradientFrom: '#14532d', gradientTo: '#16a34a' },
  { id: 'mp6',  title: 'Aztec Fire',            provider: 'Playson',   badge: null, playCount: '14.8k playing', gradientFrom: '#78350f', gradientTo: '#b45309' },
  { id: 'mp7',  title: 'Black Wolf',            provider: 'Amatic',    badge: null, playCount: '13.9k playing', gradientFrom: '#0f172a', gradientTo: '#1d4ed8' },
  { id: 'mp8',  title: 'Amazonia Wins',         provider: 'Pragmatic Play', badge: null, playCount: '13.1k playing', gradientFrom: '#4a1d96', gradientTo: '#7c3aed' },
  { id: 'mp9',  title: 'Book of Sun Multichance', provider: 'Booongo', badge: null, playCount: '12.4k playing', gradientFrom: '#7c2d12', gradientTo: '#ea580c' },
  { id: 'mp10', title: 'Book of Dead',          provider: "Play'n GO", badge: null, playCount: '11.8k playing', gradientFrom: '#27272a', gradientTo: '#57534e' },
]

const PROVIDERS: Provider[] = [
  { id: 'pp',    name: 'Pragmatic Play' },
  { id: 'pg',    name: 'PG Soft' },
  { id: 'net',   name: 'NetEnt' },
  { id: 'micro', name: 'Microgaming' },
  { id: 'hack',  name: 'Hacksaw Gaming' },
  { id: 'pgo',   name: "Play'n GO" },
  { id: 'boo',   name: 'Booongo' },
  { id: 'play',  name: 'Playson' },
]

const ALL_GAMES: GameItem[] = [
  ...FEATURED_GAMES,
  ...SUPER_SLOTS_GAMES,
  { id: 'ag1', title: 'African Spirit Deluxe',   provider: 'Pragmatic Play', badge: null,  playCount: '10.1k playing', gradientFrom: '#78350f', gradientTo: '#ca8a04' },
  { id: 'ag2', title: 'Aztec Fire 3',             provider: 'Playson',        badge: 'NEW', playCount: '8.8k playing',  gradientFrom: '#7c2d12', gradientTo: '#f97316' },
  { id: 'ag3', title: 'Book of Sun Multichance',  provider: 'Booongo',        badge: null,  playCount: '7.6k playing',  gradientFrom: '#451a03', gradientTo: '#ea580c' },
  { id: 'ag4', title: 'Zeus Thunder',             provider: 'Pragmatic Play', badge: null,  playCount: '6.9k playing',  gradientFrom: '#1e3a5f', gradientTo: '#2563eb' },
  { id: 'ag5', title: 'Cleopatra Gold',           provider: 'IGT',            badge: null,  playCount: '5.3k playing',  gradientFrom: '#422006', gradientTo: '#a16207' },
]

// ─── Sub-components ───────────────────────────────────────────

type SearchAndCategoriesProps = {
  activeCategory: string
  onCategoryChange: (id: string) => void
  searchQuery: string
  onSearchChange: (q: string) => void
}

function SearchAndCategories({
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: SearchAndCategoriesProps) {
  return (
    <div className={styles.searchSection}>
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>
          <Search size={18} />
        </span>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search games"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>
      <div className={styles.pillsTrack}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`${styles.pill}${activeCategory === cat.id ? ` ${styles.pillActive}` : ''}`}
            onClick={() => onCategoryChange(cat.id)}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function PromoCard({ promo }: { promo: PromoItem }) {
  return (
    <div className={styles.promoCard}>
      <span className={styles.promoTag}>{promo.tag}</span>
      <div className={styles.promoTitle}>{promo.title}</div>
      <div className={styles.promoSubtitle}>{promo.subtitle}</div>
      <button className={styles.promoBtn}>Play Now</button>
    </div>
  )
}

// ─── Game Card ────────────────────────────────────────────────

function GameCard({ game, showPlaying = true }: { game: GameItem; showPlaying?: boolean }) {
  return (
    <div className={styles.gameCard}>
      <div
        className={styles.gameCardImage}
        style={{ background: `linear-gradient(160deg, ${game.gradientFrom}, ${game.gradientTo})` }}
      >
        {game.badge && (
          <span className={`${styles.gameCardBadge} ${game.badge === 'HOT' ? styles.gameCardBadgeHot : ''}`}>
            {game.badge}
          </span>
        )}
        <button className={styles.gameCardInfoBtn} type="button" aria-label="Game info">
          <Info size={11} />
        </button>
      </div>
      {showPlaying && (
        <div className={styles.gameCardPlaying}>
          <span className={styles.gameCardDot} />
          <span className={styles.gameCardPlayCount}>{game.playCount}</span>
        </div>
      )}
    </div>
  )
}

// ─── Game Row ─────────────────────────────────────────────────

function GameRow({
  title,
  games,
  onViewAll,
}: {
  title: string
  games: GameItem[]
  onViewAll?: () => void
}) {
  return (
    <div className={styles.gameSection}>
      <div className={styles.gameRowHeader}>
        <span className={styles.gameRowIconWrap}>
          <Clock size={13} />
        </span>
        <span className={styles.gameRowTitle}>{title}</span>
        {onViewAll && (
          <button className={styles.viewAllBtn} onClick={onViewAll} type="button">
            View All <ChevronRight size={14} />
          </button>
        )}
      </div>
      <div className={styles.gameTrack}>
        {games.map(g => (
          <GameCard key={g.id} game={g} />
        ))}
      </div>
    </div>
  )
}

// ─── Most Played Row ──────────────────────────────────────────

function MostPlayedCard({ game, rank }: { game: GameItem; rank: number }) {
  return (
    <div className={styles.mostPlayedCard}>
      <span className={styles.mostPlayedRank}>{rank}</span>
      <div
        className={styles.mostPlayedImage}
        style={{ background: `linear-gradient(160deg, ${game.gradientFrom}, ${game.gradientTo})` }}
      >
        <button className={styles.gameCardInfoBtn} type="button" aria-label="Game info">
          <Info size={11} />
        </button>
      </div>
    </div>
  )
}

function MostPlayedRow({ games }: { games: GameItem[] }) {
  return (
    <div className={styles.gameSection}>
      <div className={styles.gameRowHeader}>
        <span className={styles.gameRowIconWrap}>
          <Clock size={13} />
        </span>
        <span className={styles.gameRowTitle}>Most Played</span>
      </div>
      <div className={styles.mostPlayedTrack}>
        {games.slice(0, 10).map((g, i) => (
          <MostPlayedCard key={g.id} game={g} rank={i + 1} />
        ))}
      </div>
    </div>
  )
}

// ─── Providers Row ────────────────────────────────────────────

function ProvidersRow({ onViewAll }: { onViewAll?: () => void }) {
  return (
    <div className={styles.gameSection}>
      <div className={styles.gameRowHeader}>
        <span className={styles.gameRowIconWrap}>
          <Clock size={13} />
        </span>
        <span className={styles.gameRowTitle}>Providers</span>
        {onViewAll && (
          <button className={styles.viewAllBtn} onClick={onViewAll} type="button">
            View All <ChevronRight size={14} />
          </button>
        )}
      </div>
      <div className={styles.providerTrack}>
        {PROVIDERS.map(p => (
          <div key={p.id} className={styles.providerCard}>
            <span className={styles.providerName}>{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── All Games View ───────────────────────────────────────────

function AllGamesView({
  title,
  games,
  onBack,
}: {
  title: string
  games: GameItem[]
  onBack: () => void
}) {
  const [activePill, setActivePill] = useState(CATEGORIES[0].id)
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = games.filter(g =>
    searchQuery === '' || g.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={styles.allGamesView}>
      <div className={styles.allGamesSearch}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>
            <Search size={18} />
          </span>
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
              className={`${styles.pill}${activePill === cat.id ? ` ${styles.pillActive}` : ''}`}
              onClick={() => setActivePill(cat.id)}
              type="button"
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.allGamesHeader}>
        <button className={styles.allGamesBack} onClick={onBack} type="button">
          <ChevronLeft size={16} />
          {title}
        </button>
        <div className={styles.allGamesActions}>
          <button className={styles.allGamesActionBtn} type="button">
            <ArrowUpDown size={12} />
            Sort
          </button>
          <button className={styles.allGamesActionBtn} type="button">
            <SlidersHorizontal size={12} />
            Filter
          </button>
        </div>
      </div>

      <div className={styles.allGamesGrid}>
        {filtered.map(g => (
          <div key={g.id} className={styles.allGamesCard}>
            <div
              className={styles.allGamesCardImage}
              style={{ background: `linear-gradient(160deg, ${g.gradientFrom}, ${g.gradientTo})` }}
            >
              <button className={styles.gameCardInfoBtn} type="button" aria-label="Game info">
                <Info size={11} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────

type SubView = { title: string; games: GameItem[] } | null

export function CasinoLobbyPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [subView, setSubView] = useState<SubView>(null)

  const content = subView ? (
    <AllGamesView
      title={subView.title}
      games={subView.games}
      onBack={() => setSubView(null)}
    />
  ) : (
    <>
      <SearchAndCategories
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className={styles.promoSection}>
        <div className={styles.promoTrack}>
          {PROMOS.map(promo => (
            <PromoCard key={promo.id} promo={promo} />
          ))}
        </div>
      </div>
      <div className={styles.divider} />
      <GameRow
        title="Top Prizes"
        games={FEATURED_GAMES}
        onViewAll={() => setSubView({ title: 'Top Prizes', games: ALL_GAMES })}
      />
      <div className={styles.divider} />
      <GameRow
        title="Super Slots"
        games={SUPER_SLOTS_GAMES}
        onViewAll={() => setSubView({ title: 'Super Slots', games: ALL_GAMES })}
      />
      <div className={styles.divider} />
      <MostPlayedRow games={MOST_PLAYED_GAMES} />
      <div className={styles.divider} />
      <ProvidersRow onViewAll={() => {}} />
    </>
  )

  return <div className={styles.mobileBook}>{content}</div>
}
