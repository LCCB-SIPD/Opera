import styles from "./css/styles.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <div className={styles.brand}>Opera</div>
                <nav className={styles.nav} aria-label="Footer navigation">
                    <a href="#about">About</a>
                    <a href="#contact">Contact</a>
                    <a href="#privacy">Privacy</a>
                </nav>
            </div>
            <div className={styles.copyright}>© {new Date().getFullYear()} Opera — All rights reserved</div>
        </footer>
    );
}