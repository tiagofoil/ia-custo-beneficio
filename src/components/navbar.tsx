"use client";

export function Navbar() {
  return (
    <nav className="nav">
      <div className="container nav-content">
        <a href="/" className="nav-logo">
          <div className="nav-logo-icon">IA</div>
          <span className="nav-logo-text">Custo Benefício</span>
        </a>

        <div className="nav-links">
          <a href="#ranking" className="nav-link">Ranking</a>
          <a href="#metodologia" className="nav-link">Como Funciona</a>
        </div>

        <a 
          href="https://github.com/tiagofoil/ia-custo-beneficio"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-link"
        >
          GitHub
        </a>
      </div>
    </nav>
  );
}
