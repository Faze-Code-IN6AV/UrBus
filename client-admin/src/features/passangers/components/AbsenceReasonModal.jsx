import { useState } from 'react';
import { usePassengerStore } from '../store/passengerStore.js';

const REASONS = [
    { value: 'SALUD',           label: 'Motivos de Salud' },
    { value: 'EMERGENCIA',      label: 'Emergencias' },
    { value: 'EXTRACURRICULAR', label: 'Actividades Extracurriculares' },
    { value: 'OTRO',            label: 'Otro Motivo' },
];

export const AbsenceReasonModal = ({ passenger, onClose }) => {
    const setPassengerAbsenceReason = usePassengerStore((s) => s.setPassengerAbsenceReason);
    const [reason, setReason] = useState('');
    const [note, setNote] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleAccept = async () => {
        if (!reason) return;
        setSubmitting(true);
        const result = await setPassengerAbsenceReason(passenger._id, { reason, note: note.trim() || undefined });
        setSubmitting(false);
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
                background: '#fff', borderRadius: 20, width: '100%', maxWidth: 380,
                boxShadow: '0 20px 60px rgba(0,0,0,0.18)', overflow: 'hidden',
            }}>
                <div style={{
                    padding: '20px 22px 14px', borderBottom: '1px solid #f3f4f6',
                }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: '#111827' }}>
                        ¿Motivo de ausencia?
                    </p>
                    <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#9ca3af' }}>
                        {passenger?.name}
                    </p>
                </div>

                <div style={{ padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {REASONS.map((r) => (
                        <label
                            key={r.value}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                padding: '10px 12px', borderRadius: 10,
                                border: `1.5px solid ${reason === r.value ? '#005691' : '#e5e7eb'}`,
                                background: reason === r.value ? '#e8f1f9' : '#fff',
                                cursor: 'pointer', transition: 'all 0.15s',
                            }}
                        >
                            <input
                                type="radio"
                                name="absence-reason"
                                value={r.value}
                                checked={reason === r.value}
                                onChange={() => setReason(r.value)}
                                style={{ accentColor: '#005691', width: 16, height: 16 }}
                            />
                            <span style={{ fontSize: 13.5, fontWeight: 600, color: '#374151' }}>
                                {r.label}
                            </span>
                        </label>
                    ))}

                    {reason === 'OTRO' && (
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Describe el motivo (opcional)"
                            rows={3}
                            style={{
                                width: '100%', boxSizing: 'border-box',
                                padding: '10px 14px', borderRadius: 10,
                                border: '1.5px solid #e5e7eb', fontSize: 13.5,
                                color: '#111827', outline: 'none', resize: 'vertical',
                                fontFamily: 'inherit', marginTop: 2,
                            }}
                        />
                    )}
                </div>

                <div style={{
                    padding: '0 22px 20px', display: 'flex', gap: 10, justifyContent: 'flex-end',
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '9px 18px', borderRadius: 10, border: '1.5px solid #e5e7eb',
                            background: '#fff', color: '#374151', fontSize: 13.5, fontWeight: 500, cursor: 'pointer',
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleAccept}
                        disabled={!reason || submitting}
                        style={{
                            padding: '9px 20px', borderRadius: 10, border: 'none',
                            background: (!reason || submitting) ? '#93c5fd' : '#005691',
                            color: '#fff', fontSize: 13.5, fontWeight: 600,
                            cursor: (!reason || submitting) ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {submitting ? 'Guardando...' : 'Aceptar'}
                    </button>
                </div>
            </div>
        </div>
    );
};
