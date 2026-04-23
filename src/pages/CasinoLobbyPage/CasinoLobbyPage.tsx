import { useState, type ReactNode } from 'react'
import {
  Search,
  Gift,
  Menu,
  Flame,
  Sparkles,
  TrendingUp,
  Star,
  Zap,
  ChevronRight,
  Home,
  Trophy,
  Gamepad2,
  Rocket,
  Play,
  ClipboardList,
} from 'lucide-react'
import styles from './CasinoLobbyPage.module.css'
import { MobileSideMenu } from '../../components/MobileSideMenu'

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

// ─── Mock data ────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  { id: 'all',     label: 'All',         icon: <Star size={16} /> },
  { id: 'popular', label: 'Popular',     icon: <Flame size={16} /> },
  { id: 'new',     label: 'New',         icon: <Sparkles size={16} /> },
  { id: 'slots',   label: 'Slots',       icon: <Gamepad2 size={16} /> },
  { id: 'crash',   label: 'Crash Games', icon: <Rocket size={16} /> },
  { id: 'table',   label: 'Table Games', icon: <Trophy size={16} /> },
  { id: 'live',    label: 'Live Casino', icon: <Zap size={16} /> },
  { id: 'instant', label: 'Instant',     icon: <Star size={16} /> },
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
  { id: 'fg1', title: 'Gates of Olympus',      provider: 'Pragmatic Play',  badge: 'HOT', playCount: '18.2k playing', gradientFrom: '#1a1060', gradientTo: '#3730a3' },
  { id: 'fg2', title: 'Sweet Bonanza',          provider: 'Pragmatic Play',  badge: 'HOT', playCount: '14.7k playing', gradientFrom: '#5b0a2e', gradientTo: '#9d174d' },
  { id: 'fg3', title: 'Wanted Dead or a Wild',  provider: 'Hacksaw Gaming',  badge: null,  playCount: '9.3k playing',  gradientFrom: '#431407', gradientTo: '#7c2d12' },
  { id: 'fg4', title: 'Big Bass Splash',         provider: 'Pragmatic Play',  badge: null,  playCount: '7.1k playing',  gradientFrom: '#0c4a6e', gradientTo: '#0369a1' },
  { id: 'fg5', title: 'The Dog House',           provider: 'Pragmatic Play',  badge: 'HOT', playCount: '6.8k playing',  gradientFrom: '#14532d', gradientTo: '#166534' },
]

const NEW_GAMES: GameItem[] = [
  { id: 'ng1', title: 'Fortune Tiger',     provider: 'PG Soft',       badge: 'NEW', playCount: '5.4k playing', gradientFrom: '#713f12', gradientTo: '#a16207' },
  { id: 'ng2', title: 'Mahjong Ways 2',    provider: 'PG Soft',       badge: 'NEW', playCount: '4.2k playing', gradientFrom: '#042f2e', gradientTo: '#134e4a' },
  { id: 'ng3', title: 'Fruit Party 2',     provider: 'Pragmatic Play', badge: 'NEW', playCount: '3.9k playing', gradientFrom: '#500724', gradientTo: '#9d174d' },
  { id: 'ng4', title: 'Wolf Gold Megaways', provider: 'Pragmatic Play', badge: 'NEW', playCount: '3.1k playing', gradientFrom: '#1e1b4b', gradientTo: '#3730a3' },
  { id: 'ng5', title: "Book of Dead 2",    provider: "Play'n GO",      badge: 'NEW', playCount: '2.8k playing', gradientFrom: '#27272a', gradientTo: '#52525b' },
]

const POPULAR_GAMES: GameItem[] = [
  { id: 'pp1', title: 'Starburst',       provider: 'NetEnt',       badge: null, playCount: '18.2k playing', gradientFrom: '#1e3a5f', gradientTo: '#1e40af' },
  { id: 'pp2', title: 'Mega Moolah',     provider: 'Microgaming',  badge: null, playCount: '14.7k playing', gradientFrom: '#3b1a00', gradientTo: '#78350f' },
  { id: 'pp3', title: "Gonzo's Quest",   provider: 'NetEnt',       badge: null, playCount: '11.3k playing', gradientFrom: '#172554', gradientTo: '#1d4ed8' },
  { id: 'pp4', title: 'Book of Ra',      provider: 'Novomatic',    badge: null, playCount: '9.8k playing',  gradientFrom: '#292524', gradientTo: '#57534e' },
  { id: 'pp5', title: 'Reactoonz',       provider: "Play'n GO",    badge: null, playCount: '8.1k playing',  gradientFrom: '#0d3d30', gradientTo: '#065f46' },
]

// ─── Sub-components ───────────────────────────────────────────

function CasinoHeader({ onMenuOpen }: { onMenuOpen: () => void }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button className={styles.headerMenuBtn} aria-label="Menu" onClick={onMenuOpen}>
          <Menu size={20} />
        </button>
        <div className={styles.headerLogo}>B</div>
      </div>
      <div className={styles.headerRight}>
        <button className={styles.headerGiftBtn} aria-label="Promotions">
          <Gift size={16} />
        </button>
        <div className={styles.headerBalance}>
          <span className={styles.headerBalanceCurrency}>€</span>
          <span className={styles.headerBalanceAmount}>10,000.00</span>
        </div>
        <button className={styles.headerDepositBtn}>DEPOSIT</button>
        <div className={styles.headerAvatar}>S</div>
      </div>
    </header>
  )
}

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
          <Search size={20} />
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

function GameThumbnail({ game }: { game: GameItem }) {
  return (
    <div className={styles.gameThumbnail}>
      <div className={styles.gameImage}>
        <div
          className={styles.gameImageBg}
          style={{ background: `linear-gradient(160deg, ${game.gradientFrom}, ${game.gradientTo})` }}
        />
        <div className={styles.gameImageOverlay} />
        {game.badge && (
          <span
            className={`${styles.gameBadge} ${game.badge === 'HOT' ? styles.gameBadgeHot : styles.gameBadgeNew}`}
          >
            {game.badge}
          </span>
        )}
        <div className={styles.gamePlayBtn}>
          <Play size={8} fill="currentColor" />
        </div>
      </div>
      <div className={styles.gameInfo}>
        <div className={styles.gameDot} />
        <span className={styles.gamePlaying}>{game.playCount}</span>
      </div>
    </div>
  )
}

function GameRow({ title, icon, games }: { title: string; icon: ReactNode; games: GameItem[] }) {
  return (
    <div className={styles.gameSection}>
      <div className={styles.gameRowHeader}>
        <span className={styles.gameRowIcon}>{icon}</span>
        <span className={styles.gameRowTitle}>{title}</span>
        <button className={styles.viewAllBtn}>
          View All <ChevronRight size={12} />
        </button>
      </div>
      <div className={styles.gameTrack}>
        {games.map(game => (
          <GameThumbnail key={game.id} game={game} />
        ))}
      </div>
    </div>
  )
}

function BottomNav() {
  return (
    <nav className={styles.bottomNav}>
      <button className={styles.navItem}>
        <Home size={22} />
        Home
      </button>
      <button className={styles.navItem}>
        <Trophy size={22} />
        Leagues
      </button>
      <div className={styles.navBetslipCell}>
        <div className={styles.navBetslipIndicator}>
          Betslip
        </div>
      </div>
      <button className={styles.navItem}>
        <ClipboardList size={22} />
        My Bets
      </button>
      <button className={`${styles.navItem} ${styles.navItemActive}`}>
        <Gamepad2 size={22} />
        Casino
      </button>
    </nav>
  )
}

// ─── Page ─────────────────────────────────────────────────────

export function CasinoLobbyPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(true)

  return (
    <main className={styles.page}>
      <span className={styles.frameLabel}>Mobile Preview · Casino Lobby</span>
      <div className={styles.phoneFrame}>
        <MobileSideMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          isLoggedIn={isLoggedIn}
          onToggleAuth={() => setIsLoggedIn(prev => !prev)}
        />
        <div className={styles.mobileBook}>
          <CasinoHeader onMenuOpen={() => setIsMenuOpen(true)} />
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
            icon={<Flame size={16} />}
            games={FEATURED_GAMES}
          />
          <div className={styles.divider} />
          <GameRow
            title="New Releases"
            icon={<Sparkles size={16} />}
            games={NEW_GAMES}
          />
          <div className={styles.divider} />
          <GameRow
            title="Most Played"
            icon={<TrendingUp size={16} />}
            games={POPULAR_GAMES}
          />
          <BottomNav />
        </div>
      </div>
    </main>
  )
}
