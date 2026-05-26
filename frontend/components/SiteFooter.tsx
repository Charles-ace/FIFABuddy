export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-copy">
          <span className="site-footer-label">Built on</span>
          <strong>X Layer</strong>
        </div>

        <div className="site-footer-copy">
          <span className="site-footer-label">Built by</span>
          <a
            className="site-footer-link"
            href="https://x.com/charlesace_"
            target="_blank"
            rel="noreferrer"
          >
            @charlesace_
          </a>
        </div>
      </div>
    </footer>
  );
}
