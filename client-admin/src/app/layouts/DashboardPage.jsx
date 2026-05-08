import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={styles.root}>
      {/* Overlay móvil */}
      {isMobile && sidebarOpen && (
        <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside style={{
        ...styles.sidebar,
        ...(isMobile ? {
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 50,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s ease",
        } : {}),
      }}>
        <div style={styles.logoArea}>
          <span style={styles.logoText}>UrBus</span>
        </div>
      </aside>

      {/* MAIN */}
      <div style={styles.main}>
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            {isMobile && (
              <button style={styles.menuBtn} onClick={() => setSidebarOpen(true)}>
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
            )}
            <span style={styles.pageTitle}>Panel de Administración</span>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.avatar}>A</div>
            <button style={styles.logoutBtn} onClick={() => navigate("/")}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16,17 21,12 16,7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              {!isMobile && "Salir"}
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
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 40 },
  sidebar: { width: "220px", background: "#1a1f2e", display: "flex", flexDirection: "column", flexShrink: 0 },
  logoArea: { padding: "18px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" },
  logoText: { color: "#fff", fontWeight: "700", fontSize: "18px" },
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#f4f6fb" },
  header: { background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 24px", height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 },
  headerLeft: { display: "flex", alignItems: "center", gap: "12px" },
  pageTitle: { fontSize: "15px", fontWeight: "600", color: "#111827" },
  headerRight: { display: "flex", alignItems: "center", gap: "12px" },
  avatar: { width: "34px", height: "34px", borderRadius: "50%", background: "#005691", color: "#fff", fontWeight: "700", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" },
  menuBtn: { display: "flex", alignItems: "center", background: "transparent", border: "none", cursor: "pointer", color: "#111827", padding: "4px" },
  logoutBtn: { display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", background: "transparent", border: "1px solid #e5e7eb", borderRadius: "8px", color: "#6b7280", fontSize: "13px", cursor: "pointer" },
  content: { flex: 1, overflow: "auto", padding: "28px" },
};