import { useAuthStore } from "../../auth/store/authStore.js";

const AVATARS = {
    "Carla López":     { bg: "#d1f0e0", emoji: "👩‍🦱" },
    "Mateo Hérnandez": { bg: "#dce8fa", emoji: "🧑‍🦱" },
    "Sófia Ramírez":   { bg: "#fce4d6", emoji: "👩‍🦰" },
    "Lucas Pérez":     { bg: "#fff3c4", emoji: "🧑"   },
    "Ana Torres":      { bg: "#dce8fa", emoji: "🧑‍🦲" },
};

function PassengerAvatar({ name }) {
    const av = AVATARS[name] ?? { bg: "#e5e7eb", emoji: "🧑" };
    return (
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: av.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
            {av.emoji}
        </div>
    );
}

function CheckboxIcon({ checked }) {
    return checked ? (
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" style={{ flexShrink: 0 }}>
            <rect x="1" y="1" width="24" height="24" rx="5" fill="white" stroke="#4CAF50" strokeWidth="2" />
            <path d="M6.5 13.5L10.5 17.5L19.5 8.5" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ) : (
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" style={{ flexShrink: 0 }}>
            <rect x="1" y="1" width="24" height="24" rx="5" fill="white" stroke="#d1d5db" strokeWidth="2" />
        </svg>
    );
}

function StatusBadge({ present }) {
    return (
        <span style={{ fontSize: 12, fontWeight: 600, color: "#fff", padding: "4px 12px", borderRadius: 999, background: present ? "#4CAF50" : "#F44336", flexShrink: 0 }}>
            {present ? "Presente" : "Ausente"}
        </span>
    );
}

export const PassengerCard = ({ passenger }) => {
    const user = useAuthStore((state) => state.user);
    const isAdmin = user?.role === "ADMIN_ROLE";

    const { name, address, checked, present } = passenger;

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px" }}>
            <PassengerAvatar name={name} />
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#111827", lineHeight: 1.3 }}>{name}</p>
                <p style={{ margin: "2px 0 0", fontSize: 13, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{address}</p>
            </div>
            {isAdmin
                ? <StatusBadge present={present} />
                : <CheckboxIcon checked={checked} />
            }
        </div>
    );
};