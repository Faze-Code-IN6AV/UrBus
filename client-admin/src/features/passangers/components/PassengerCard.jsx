import { useAuthStore }     from '../../auth/store/authStore.js';
import { usePassengerStore } from '../store/passengerStore.js';

const AVATAR_PALETTE = [
    { bg: '#f9d4c8', color: '#b85c3a' },
    { bg: '#d4e8f9', color: '#2e6fa3' },
    { bg: '#d4f0e0', color: '#2e7d52' },
    { bg: '#f9e8d4', color: '#a06030' },
    { bg: '#e8d4f9', color: '#6030a0' },
    { bg: '#f9f0d4', color: '#8a7020' },
];

function PassengerAvatar({ name }) {
    const initials = name
        ? name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
        : '?';
    const palette = AVATAR_PALETTE[name ? name.charCodeAt(0) % AVATAR_PALETTE.length : 0];
    return (
        <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: palette.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 17, fontWeight: 800, color: palette.color,
            flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            letterSpacing: '-0.5px',
        }}>
            {initials}
        </div>
    );
}

function Checkbox({ checked, onChange, title, disabled }) {
    return (
        <div
            onClick={disabled ? undefined : onChange}
            title={title}
            style={{
                width: 26, height: 26, borderRadius: 6,
                border: checked ? 'none' : '2px solid #d1d5db',
                background: checked ? '#4ade80' : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.65 : 1,
                flexShrink: 0,
                transition: 'all 0.15s',
                boxShadow: checked ? '0 2px 6px rgba(74,222,128,0.35)' : 'none',
            }}
        >
            {checked && (
                <svg width="15" height="15" fill="none" stroke="#fff" strokeWidth="2.8" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
        </div>
    );
}

function IconBtn({ onClick, title, color, children }) {
    return (
        <button
            onClick={onClick}
            title={title}
            style={{
                width: 30, height: 30, borderRadius: 8,
                border: `1.5px solid ${color}30`,
                background: `${color}12`, color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0, transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = `${color}25`}
            onMouseLeave={(e) => e.currentTarget.style.background = `${color}12`}
        >
            {children}
        </button>
    );
}

export const PassengerCard = ({ passenger, onEdit, onDelete }) => {
    const user    = useAuthStore((s) => s.user);
    const isAdmin = user?.role === 'ADMIN_ROLE';
    const userId  = user?.id || user?._id;
    const canToggleStatus = isAdmin || user?.role === 'DRIVER_ROLE' || String(passenger.userId) === String(userId);

    const toggleStatus = usePassengerStore((s) => s.toggleStatus);
    const { _id, name, status, address } = passenger;
    const isPresent = status === 'PRESENT';

    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 18px',
            background: '#fff',
        }}>
            <PassengerAvatar name={name} />

            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                    margin: 0, fontWeight: 700, fontSize: 15.5,
                    color: '#1a1a2e', lineHeight: 1.25,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                    {name}
                </p>
                <p style={{
                    margin: '3px 0 0', fontSize: 12.5, color: '#9ca3af',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                    {address ?? `ID: ${_id?.slice(-6)}`}
                </p>
            </div>

            <Checkbox
                checked={isPresent}
                onChange={canToggleStatus ? () => toggleStatus(_id) : undefined}
                title={canToggleStatus ? (isPresent ? 'Marcar como ausente' : 'Marcar como presente') : 'Solo puedes marcar tu propia asistencia'}
                disabled={!canToggleStatus}
            />

            {isAdmin && (
                <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                    <IconBtn onClick={() => onEdit(passenger)} title="Editar" color="#005691">
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </IconBtn>
                    <IconBtn onClick={() => onDelete(passenger)} title="Eliminar" color="#ef4444">
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6M14 11v6" strokeLinecap="round"/>
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                        </svg>
                    </IconBtn>
                </div>
            )}
        </div>
    );
};