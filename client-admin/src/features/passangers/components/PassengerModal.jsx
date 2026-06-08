import { useEffect, useRef, useState } from 'react';
import { usePassengerStore } from '../store/passengerStore.js';

const INPUT_STYLE = {
    width: '100%', padding: '10px 14px', borderRadius: 10,
    border: '1.5px solid #e5e7eb', fontSize: 14, color: '#111827',
    outline: 'none', boxSizing: 'border-box', background: '#fff',
    transition: 'border-color 0.15s',
};

export const PassengerModal = ({ passenger = null, onClose }) => {
    const isEdit = Boolean(passenger);

    const addPassenger  = usePassengerStore((s) => s.addPassenger);
    const editPassenger = usePassengerStore((s) => s.editPassenger);
    const loading       = usePassengerStore((s) => s.loading);

    const [name,   setName]   = useState(passenger?.name   ?? '');
    const [userId, setUserId] = useState(passenger?.userId ?? '');
    const [errors, setErrors] = useState({});
    const inputRef = useRef(null);

    useEffect(() => { setTimeout(() => inputRef.current?.focus(), 50); }, []);

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    const validate = () => {
        const e = {};
        if (!name.trim())       e.name   = 'El nombre es obligatorio';
        else if (name.trim().length < 3) e.name = 'Mínimo 3 caracteres';
        if (!isEdit && !userId.trim()) e.userId = 'El ID de cuenta es obligatorio';
        return e;
    };

    const handleSubmit = async () => {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }

        const result = isEdit
            ? await editPassenger(passenger._id, { name: name.trim() })
            : await addPassenger({ name: name.trim(), userId: userId.trim() });

        if (result?.success !== false) onClose();
    };

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
                boxShadow: '0 20px 60px rgba(0,0,0,0.18)', overflow: 'hidden',
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '20px 24px 16px', borderBottom: '1px solid #f3f4f6',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 9, background: '#e8f0fe',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <svg width="18" height="18" fill="none" stroke="#005691" strokeWidth="2" viewBox="0 0 24 24">
                                {isEdit
                                    ? <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>
                                    : <><circle cx="9" cy="7" r="4" /><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" strokeLinecap="round" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="16" y1="11" x2="22" y2="11" /></>
                                }
                            </svg>
                        </div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: '#111827' }}>
                            {isEdit ? 'Editar pasajero' : 'Vincular pasajero a cuenta'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4, display: 'flex' }}
                    >
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                            Nombre completo
                        </label>
                        <input
                            ref={inputRef}
                            value={name}
                            onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                            placeholder="Ej. María García"
                            style={{ ...INPUT_STYLE, borderColor: errors.name ? '#ef4444' : '#e5e7eb' }}
                        />
                        {errors.name && (
                            <p style={{ margin: '6px 0 0', fontSize: 12, color: '#ef4444' }}>{errors.name}</p>
                        )}
                    </div>

                    {!isEdit && (
                        <div>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                                ID de cuenta (userId)
                            </label>
                            <input
                                value={userId}
                                onChange={(e) => { setUserId(e.target.value); setErrors((p) => ({ ...p, userId: '' })); }}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                                placeholder="ID del usuario en el sistema de auth"
                                style={{ ...INPUT_STYLE, borderColor: errors.userId ? '#ef4444' : '#e5e7eb' }}
                            />
                            {errors.userId && (
                                <p style={{ margin: '6px 0 0', fontSize: 12, color: '#ef4444' }}>{errors.userId}</p>
                            )}
                            <p style={{ margin: '6px 0 0', fontSize: 11.5, color: '#9ca3af' }}>
                                Este ID vincula al pasajero con su cuenta de acceso al sistema.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '0 24px 20px', display: 'flex', gap: 10, justifyContent: 'flex-end',
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '9px 18px', borderRadius: 10, border: '1.5px solid #e5e7eb',
                            background: '#fff', color: '#374151', fontSize: 14, fontWeight: 500, cursor: 'pointer',
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        style={{
                            padding: '9px 22px', borderRadius: 10, border: 'none',
                            background: loading ? '#93c5fd' : '#005691',
                            color: '#fff', fontSize: 14, fontWeight: 600, cursor: loading ? 'default' : 'pointer',
                            display: 'flex', alignItems: 'center', gap: 6,
                        }}
                    >
                        {loading && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}>
                                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                            </svg>
                        )}
                        {isEdit ? 'Guardar cambios' : 'Vincular pasajero'}
                    </button>
                </div>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};