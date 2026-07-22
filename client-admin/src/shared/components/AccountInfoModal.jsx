import { useEffect } from 'react';
import { formatDateGT } from '../utils/date.js';

function InfoRow({ label, value, icon }) {
    return (
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 0' }}>
            <div style={{
                width: 32, height: 32, borderRadius: 9, background: '#f4f6fb',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#005691', flexShrink: 0,
            }}>
                {icon}
            </div>
            <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 11.5, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                    {label}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: 14.5, fontWeight: 600, color: '#111827', wordBreak: 'break-word' }}>
                    {value || 'No disponible'}
                </p>
            </div>
        </div>
    );
}

// Modal reutilizable para mostrar la información de contacto de una cuenta.
// Se usa tanto desde Usuarios y Roles como desde Lista de Pasajeros (para poder
// contactar a alguien, ej. un pasajero que no se presentó).
export const AccountInfoModal = ({ account, loading = false, onClose }) => {
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    const fullName = [account?.name, account?.surname].filter(Boolean).join(' ');

    return (
        <div
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 100, padding: 16,
            }}
        >
            <div style={{
                background: '#fff', borderRadius: 20, width: '100%', maxWidth: 400,
                boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden',
            }}>
                <div style={{
                    padding: '20px 22px 16px', display: 'flex',
                    alignItems: 'center', justifyContent: 'space-between',
                    borderBottom: '1px solid #f3f4f6',
                }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#111827' }}>
                            Información de la cuenta
                        </h2>
                        {!loading && fullName && (
                            <p style={{ margin: '2px 0 0', fontSize: 13, color: '#9ca3af' }}>{fullName}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            width: 30, height: 30, borderRadius: 8, border: 'none',
                            background: '#f4f6fb', color: '#6b7280', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}
                    >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                            <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
                            <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <div style={{ padding: '4px 22px 22px' }}>
                    {loading ? (
                        <div style={{ padding: '30px 0', textAlign: 'center', color: '#9ca3af', fontSize: 13.5 }}>
                            Cargando información...
                        </div>
                    ) : !account ? (
                        <div style={{ padding: '30px 0', textAlign: 'center', color: '#9ca3af', fontSize: 13.5 }}>
                            No se pudo cargar la información de esta cuenta.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <InfoRow
                                label="Nombre completo"
                                value={fullName}
                                icon={(
                                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <circle cx="12" cy="8" r="4" />
                                        <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" strokeLinecap="round" />
                                    </svg>
                                )}
                            />
                            <div style={{ height: 1, background: '#f3f4f6' }} />
                            <InfoRow
                                label="Usuario"
                                value={account.username}
                                icon={(
                                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <rect x="3" y="4" width="18" height="16" rx="2" />
                                        <path d="M7 8h10M7 12h6" strokeLinecap="round" />
                                    </svg>
                                )}
                            />
                            <div style={{ height: 1, background: '#f3f4f6' }} />
                            <InfoRow
                                label="Teléfono"
                                value={account.phone}
                                icon={(
                                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            />
                            <div style={{ height: 1, background: '#f3f4f6' }} />
                            <InfoRow
                                label="Correo electrónico"
                                value={account.email}
                                icon={(
                                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <rect x="2" y="4" width="20" height="16" rx="2" />
                                        <path d="m22 6-10 7L2 6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            />
                            <div style={{ height: 1, background: '#f3f4f6' }} />
                            <InfoRow
                                label="Cuenta creada"
                                value={formatDateGT(account.createdAt)}
                                icon={(
                                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <rect x="3" y="4" width="18" height="18" rx="2" />
                                        <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
