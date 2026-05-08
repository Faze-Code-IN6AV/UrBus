import { Outlet, useNavigate } from "react-router-dom";

export const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.root}>
      <aside style={styles.sidebar}>
        <div style={styles.logoArea}>
          <span style={styles.logoText}>UrBus</span>
        </div>
      </aside>

      <div style={styles.main}>
        <header style={styles.header}>
          <span style={styles.pageTitle}>Panel de Administración</span>
          <div style={styles.headerRight}>
            <div style={styles.avatar}>A</div>
            <button style={styles.logoutBtn} onClick={() => navigate("/")}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16,17 21,12 16,7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Salir
            </button>
          </div>
        </header>
        <main style={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const styles = {
  root: { display: "flex", height: "100vh", fontFamily: "'Segoe UI', sans-serif", overflow: "hidden" },
  sidebar: { width: "220px", background: "#1a1f2e", display: "flex", flexDirection: "column", flexShrink: 0 },
  logoArea: { padding: "18px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" },
  logoText: { color: "#fff", fontWeight: "700", fontSize: "18px" },
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#f4f6fb" },
  header: { background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 24px", height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 },
  pageTitle: { fontSize: "15px", fontWeight: "600", color: "#111827" },
  headerRight: { display: "flex", alignItems: "center", gap: "12px" },
  avatar: { width: "34px", height: "34px", borderRadius: "50%", background: "#3b82f6", color: "#fff", fontWeight: "700", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" },
  logoutBtn: { display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", background: "transparent", border: "1px solid #e5e7eb", borderRadius: "8px", color: "#6b7280", fontSize: "13px", cursor: "pointer" },
  content: { flex: 1, overflow: "auto", padding: "28px" },
};