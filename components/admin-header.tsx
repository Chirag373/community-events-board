export default function AdminHeader() {
  return (
    <header className="header">
      <div className="header-inner">
        <a href="/admin" className="brand">
          <span className="brand-mark">
            c<span>·</span>
          </span>
          <span>
            community<span className="brand-sub">EVENTS BOARD</span>
          </span>
        </a>
        <nav aria-label="Admin navigation">
          <a className="nav-active" href="/admin">
            Admin
          </a>
        </nav>
      </div>
    </header>
  );
}
