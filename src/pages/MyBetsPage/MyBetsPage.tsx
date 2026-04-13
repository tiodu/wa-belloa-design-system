import { Link } from 'react-router-dom'
import styles from './MyBetsPage.module.css'

export function MyBetsPage() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <span className={styles.tag}>New page</span>
        <h1 className={styles.title}>My Bets</h1>
        <p className={styles.description}>
          Placeholder view for settled and open bets. We can replace this with tabs, filters, and detailed bet slips next.
        </p>
        <div className={styles.summaryGrid}>
          <article className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Open Bets</span>
            <strong className={styles.summaryValue}>12</strong>
          </article>
          <article className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Settled Today</span>
            <strong className={styles.summaryValue}>7</strong>
          </article>
          <article className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Net Return</span>
            <strong className={styles.summaryValue}>₺184.20</strong>
          </article>
        </div>
        <Link className={styles.backLink} to="/betslip">
          Back to Belloa Betslip
        </Link>
      </section>
    </main>
  )
}
