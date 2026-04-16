import { Link } from 'react-router-dom'
import styles from './HomeHubPage.module.css'

export function HomeHubPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>WA Belloa Design System</h1>
        <p className={styles.subtitle}>Choose a workspace to continue.</p>
      </section>

      <section className={styles.grid}>
        <Link className={styles.card} to="/betslip">
          <span className={styles.cardTag}>Official</span>
          <h2 className={styles.cardTitle}>Belloa Betslip</h2>
          <p className={styles.cardDescription}>
            Floating betslip controls, current mobile and desktop previews, and documentation matrix.
          </p>
        </Link>

        <Link className={styles.card} to="/sportsbook">
          <span className={styles.cardTag}>Playground</span>
          <h2 className={styles.cardTitle}>Sportsbook Playground</h2>
          <p className={styles.cardDescription}>
            Full desktop sportsbook layout and the three legacy betslip implementations.
          </p>
        </Link>

        <Link className={styles.card} to="/my-bets">
          <span className={styles.cardTag}>Placeholder</span>
          <h2 className={styles.cardTitle}>My Bets</h2>
          <p className={styles.cardDescription}>
            Temporary destination page for post-placement navigation from the floating betslip summary.
          </p>
        </Link>

        <Link className={styles.card} to="/casino">
          <span className={styles.cardTag}>New</span>
          <h2 className={styles.cardTitle}>Casino Lobby</h2>
          <p className={styles.cardDescription}>
            Mobile-first casino lobby with header, search, category filters, promotion cards, and scrollable game rows.
          </p>
        </Link>
      </section>
    </main>
  )
}
