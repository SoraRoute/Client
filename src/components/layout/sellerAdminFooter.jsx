// Shared Module
// Authors: Nishtha & Pinki

export default function Footer() {
    return (
        <footer className="border-t border-paper-line bg-back-raised py-4 text-center text-sm text-ink-muted">
            <p>
                © {new Date().getFullYear()} MarketHive. All rights reserved.
            </p>
        </footer>
    );
}