import { useAuthStore } from "../../auth/store/authStore.js";
import { PassengerCard } from "../components/PassengerCard.jsx";

const MOCK_PASSENGERS = [
    { id: 1, name: "Carla López",     address: "Calle Norte 45",    checked: true,  present: true  },
    { id: 2, name: "Mateo Hérnandez", address: "Av. Central 120",   checked: false, present: false },
    { id: 3, name: "Sófia Ramírez",   address: "Bosque Sur 58B",    checked: true,  present: true  },
    { id: 4, name: "Lucas Pérez",     address: "Paseo del Lago 14", checked: false, present: false },
    { id: 5, name: "Ana Torres",      address: "Calle Verde 9",     checked: false, present: true  },
];

export const PassengerListPage = () => {
    const user = useAuthStore((state) => state.user);
    const isAdmin = user?.role === "ADMIN_ROLE";

    const presentCount = MOCK_PASSENGERS.filter((p) => p.present).length;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", height: "100%" }}>

            {/* Page header — mismo patrón que LocationPage */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "#e8f0fe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="20" height="20" fill="none" stroke="#005691" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="9" cy="7" r="4" />
                            <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" strokeLinecap="round" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" />
                            <path d="M21 21v-2a4 4 0 0 0-3-3.85" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>
                            Lista de Pasajeros
                        </p>
                        <p style={{ margin: "2px 0 0", fontSize: 13, color: "#6b7280" }}>
                            {isAdmin
                                ? `${presentCount} de ${MOCK_PASSENGERS.length} presentes`
                                : "Marca tu asistencia"
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Cards separadas por pasajero */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {MOCK_PASSENGERS.map((passenger) => (
                    <div
                        key={passenger.id}
                        style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}
                    >
                        <PassengerCard passenger={passenger} />
                    </div>
                ))}
            </div>

        </div>
    );
};