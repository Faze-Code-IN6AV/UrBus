import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '../../auth/store/authStore.js';
import { useUserStore } from '../store/userStore.js';
import { UserCard } from '../components/UserCard.jsx';

const ROLE_FILTERS = [
    { value: 'ALL',            label: 'Todos' },
    { value: 'ADMIN_ROLE',     label: 'Administradores' },
    { value: 'PASSENGER_ROLE', label: 'Pasajeros' },
    { value: 'DRIVER_ROLE',    label: 'Conductores' },
    { value: 'USER_ROLE',      label: 'Usuarios' },
];

function SkeletonCard() {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 18px', background: '#fff',
        }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f0f0f0', flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
                <div style={{ height: 14, width: '48%', background: '#f0f0f0', borderRadius: 6 }} />
                <div style={{ height: 12, width: '32%', background: '#f0f0f0', borderRadius: 6 }} />
            </div>
            <div style={{ width: 90, height: 24, borderRadius: 999, background: '#f0f0f0', flexShrink: 0 }} />
            <div style={{ width: 120, height: 30, borderRadius: 9, background: '#f0f0f0', flexShrink: 0 }} />
        </div>
    );
}

function EmptyState({ onRefetch }) {
    return (
        <div style={{ textAlign: 'center', padding: '52px 20px' }}>
            <div style={{
                width: 64, height: 64, borderRadius: '50%', background: '#f3f4f6',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
            }}>
                <svg width="30" height="30" fill="none" stroke="#9ca3af" strokeWidth="1.5" viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" strokeLinecap="round" />
                </svg>
            </div>
            <p style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: '#374151' }}>
                No se encontraron usuarios
            </p>
            <p style={{ margin: '0 0 20px', fontSize: 13, color: '#9ca3af' }}>
                Intenta con otro filtro o actualiza la lista
            </p>
            <button
                onClick={onRefetch}
                style={{
                    padding: '9px 22px', borderRadius: 10, border: 'none',
                    background: '#005691', color: '#fff', fontSize: 13,
                    fontWeight: 600, cursor: 'pointer',
                }}
            >
                Reintentar
            </button>
        </div>
    );
}

export const UserListPage = () => {
    const currentUser = useAuthStore((s) => s.user);
    const currentUserId = currentUser?.id || currentUser?._id;

    const users        = useUserStore((s) => s.users);
    const loading       = useUserStore((s) => s.loading);
    const error         = useUserStore((s) => s.error);
    const fetchUsers    = useUserStore((s) => s.fetchUsers);

    const [roleFilter, setRoleFilter] = useState('ALL');

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const filteredUsers = useMemo(() => {
        if (roleFilter === 'ALL') return users;
        return users.filter((u) => u.role === roleFilter);
    }, [users, roleFilter]);

    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            minHeight: '100%', background: '#f4f6fb',
        }}>
            <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 0 20px 0',
                flexWrap: 'wrap', gap: 12,
            }}>
                <div>
                    <h1 style={{
                        margin: 0, fontSize: 22, fontWeight: 800,
                        color: '#111827', letterSpacing: '-0.3px',
                    }}>
                        Usuarios y Roles
                    </h1>
                    <p style={{ margin: '3px 0 0', fontSize: 13, color: '#9ca3af' }}>
                        {loading
                            ? 'Cargando...'
                            : error
                                ? 'Error al cargar datos'
                                : `${filteredUsers.length} de ${users.length} usuarios`}
                    </p>
                </div>

                <button
                    onClick={fetchUsers}
                    disabled={loading}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '8px 14px', borderRadius: 10,
                        border: '1.5px solid #e5e7eb',
                        background: '#fff', color: '#374151',
                        fontSize: 13, fontWeight: 500, cursor: 'pointer',
                    }}
                >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M1 4v6h6" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3.51 15a9 9 0 1 0 .49-4.95" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Actualizar
                </button>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {ROLE_FILTERS.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => setRoleFilter(f.value)}
                        style={{
                            padding: '7px 14px', borderRadius: 999,
                            border: roleFilter === f.value ? 'none' : '1.5px solid #e5e7eb',
                            background: roleFilter === f.value ? '#005691' : '#fff',
                            color: roleFilter === f.value ? '#fff' : '#374151',
                            fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                        }}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            <div style={{
                background: '#fff',
                borderRadius: 20,
                boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
                overflow: 'hidden',
                border: '1px solid #f0f0f0',
            }}>
                {loading ? (
                    <>
                        {[1, 2, 3, 4, 5].map((k, i) => (
                            <div key={k}>
                                {i > 0 && <div style={{ height: 1, background: '#f3f4f6', margin: '0 18px' }} />}
                                <SkeletonCard />
                            </div>
                        ))}
                    </>
                ) : error || filteredUsers.length === 0 ? (
                    <EmptyState onRefetch={fetchUsers} />
                ) : (
                    filteredUsers.map((u, i) => (
                        <div key={u.id}>
                            {i > 0 && (
                                <div style={{ height: 1, background: '#f3f4f6', margin: '0 18px' }} />
                            )}
                            <UserCard user={u} currentUserId={currentUserId} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};