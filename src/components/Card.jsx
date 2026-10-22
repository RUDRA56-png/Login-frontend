export default function Card({ title, subtitle, children, footer }) {
  return (
    <main className="page">
      <div className="card">
        <h1>{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}
        {children}
        {footer && <div className="footer">{footer}</div>}
      </div>
    </main>
  );
}
