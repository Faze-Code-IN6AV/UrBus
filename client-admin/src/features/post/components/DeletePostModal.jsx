import { usePostStore } from '../store/postStore.js';

export const DeletePostModal = ({ post, onClose }) => {
    const removePost = usePostStore((s) => s.removePost);
    const loading = usePostStore((s) => s.loading);

    const handleConfirm = async () => {
        await removePost(post._id);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
        }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div style={{
                background: '#fff', borderRadius: 20,
                width: '100%', maxWidth: 380,
                boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
                padding: '28px 26px 22px',
                textAlign: 'center',
            }}>
                <div style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: '#fef2f2',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 14px',
                }}>
                    <svg width="24" height="24" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" strokeLinecap="round" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                </div>

                <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 800, color: '#111827' }}>
                    Eliminar anuncio
                </h3>
                <p style={{ margin: '0 0 22px', fontSize: 13.5, color: '#6b7280', lineHeight: 1.5 }}>
                    ¿Seguro que quieres eliminar <strong style={{ color: '#374151' }}>"{post.title}"</strong>?
                    Quedará marcado como eliminado pero podrás reactivarlo.
                </p>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        style={{
                            flex: 1, padding: '10px', borderRadius: 10,
                            border: '1.5px solid #e5e7eb',
                            background: '#fff', color: '#374151',
                            fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        style={{
                            flex: 1, padding: '10px', borderRadius: 10, border: 'none',
                            background: '#ef4444', color: '#fff',
                            fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        }}
                    >
                        {loading ? 'Eliminando...' : 'Eliminar'}
                    </button>
                </div>
            </div>
        </div>
    );
};
