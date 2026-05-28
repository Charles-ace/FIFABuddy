import React from "react";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-logo-box">
          <svg
            className="brand-logo-svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="#ff5a00"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Dotted soccer ball */}
            <circle cx="12" cy="4" r="2" />
            <circle cx="12" cy="20" r="2" />
            <circle cx="4" cy="12" r="2" />
            <circle cx="20" cy="12" r="2" />
            <circle cx="7.76" cy="7.76" r="2" />
            <circle cx="16.24" cy="16.24" r="2" />
            <circle cx="7.76" cy="16.24" r="2" />
            <circle cx="16.24" cy="7.76" r="2" />
            <circle cx="12" cy="12" r="2.5" />
          </svg>
          <span className="footer-logo-text">DOTBALL</span>
        </div>

        <nav className="footer-nav">
          <a href="/" className="footer-nav-link">
            World Cup 2022
          </a>
          <a href="#news" className="footer-nav-link">
            Latest News
          </a>
          <a href="#predictions" className="footer-nav-link">
            Predictions
          </a>
          <a href="#favourites" className="footer-nav-link">
            Favourites
          </a>
        </nav>

        <div className="footer-socials">
          {/* Simple representations of social icons */}
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="footer-social-icon" aria-label="Twitter">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="footer-social-icon" aria-label="Facebook">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
            </svg>
          </a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer" className="footer-social-icon" aria-label="YouTube">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
          <a href="https://discord.com" target="_blank" rel="noreferrer" className="footer-social-icon" aria-label="Discord">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
            </svg>
          </a>
        </div>

        <div className="footer-bottom-row">
          <span>Dotball 2022. All rights reserved.</span>
          <div className="footer-legal-links">
            <a href="#privacy" className="footer-legal-link">
              Privacy Policy
            </a>
            <a href="#terms" className="footer-legal-link">
              Terms of Service
            </a>
            <a href="#cookies" className="footer-legal-link">
              Cookies Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
