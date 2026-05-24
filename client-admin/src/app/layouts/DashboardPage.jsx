import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation, NavLink } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/authStore.js";
import { styles } from "../../styles/dashboard.js";
import { WhatsAppBubble } from "../../features/whatsapp/components/WhatsAppBubble.jsx";

const NAV_ITEMS = [
  {
    label: "Mapa en Vivo",
    path: "/dashboard/location",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <polygon points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
      </svg>
    ),
  },
  {
    label: "Pasajeros",
    path: "/dashboard/passengers",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="9" cy="7" r="4" />
        <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" strokeLinecap="round" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" />
        <path d="M21 21v-2a4 4 0 0 0-3-3.85" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Post",
    path: "/dashboard/posts",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <line x1="4" y1="7" x2="20" y2="7" strokeLinecap="round" />
        <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" />
        <line x1="4" y1="17" x2="20" y2="17" strokeLinecap="round" />
      </svg>
    ),
  },
];

export const DashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Inicial del usuario para el avatar
  const avatarLetter = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.role === "ADMIN_ROLE"
    ? "A"
    : "U";

  // Título de la página actual
  const currentPage = NAV_ITEMS.find((item) =>
    location.pathname === item.path || location.pathname.startsWith(item.path + "/")
  );
  const pageTitle = currentPage?.label ?? "Panel de Administración";

  return (
    <div style={styles.root}>
      {/* Overlay móvil */}
      {isMobile && sidebarOpen && (
        <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside
        style={{
          ...styles.sidebar,
          ...(isMobile
            ? {
                position: "fixed",
                top: 0,
                left: 0,
                height: "100vh",
                zIndex: 50,
                transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
                transition: "transform 0.25s ease",
              }
            : {}),
        }}
      >
        {/* Logo */}
        <div style={styles.logoArea}>
          <div style={styles.logoBadge}>U</div>
          <span style={styles.logoText}>UrBus</span>
        </div>

        {/* Navegación */}
        <nav style={styles.nav}>
          <p style={styles.navGroup}>Principal</p>
          {NAV_ITEMS.map((item) => {
            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(item.path + "/");
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end
                style={{ textDecoration: "none" }}
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <div
                  style={{
                    ...styles.navItem,
                    ...(isActive ? styles.navItemActive : {}),
                  }}
                >
                  <span
                    style={{
                      ...styles.navIcon,
                      color: isActive ? "#005691" : "rgba(255,255,255,0.55)",
                    }}
                  >
                    {item.icon}
                  </span>
                  <span
                    style={{
                      ...styles.navLabel,
                      color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                      fontWeight: isActive ? "600" : "400",
                    }}
                  >
                    {item.label}
                  </span>
                  {isActive && <span style={styles.activeBar} />}
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* Info del usuario en el sidebar */}
        <div style={styles.sidebarUser}>
          <div style={styles.sidebarAvatar}>{avatarLetter}</div>
          <div style={styles.sidebarUserInfo}>
            <p style={styles.sidebarUserName}>{user?.name ?? "Usuario"}</p>
            <p style={styles.sidebarUserRole}>
              {user?.role === "ADMIN_ROLE" ? "Administrador" : "Pasajero"}
            </p>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div style={styles.main}>
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            {isMobile && (
              <button style={styles.menuBtn} onClick={() => setSidebarOpen(true)}>
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            )}
            <span style={styles.pageTitle}>{pageTitle}</span>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.avatar}>{avatarLetter}</div>
            <button style={styles.logoutBtn} onClick={handleLogout}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16,17 21,12 16,7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              {!isMobile && "Salir"}
            </button>
          </div>
        </header>
        <main style={styles.content}>
          <Outlet />
        </main>
      </div>

      {/* Burbuja de WhatsApp — solo para administradores */}
      {user?.role === "ADMIN_ROLE" && <WhatsAppBubble />}
    </div>
  );
};