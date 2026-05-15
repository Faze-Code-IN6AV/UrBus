import { useState, useEffect, useRef, useCallback } from 'react';
import { getWhatsAppStatus, getWhatsAppQR, sendArrivalNotification, sendDelayNotification, sendRouteChangeNotification } from '../../../shared/api/notification.js';
import { useAuthStore } from '../../../features/auth/store/authStore.js';

const POLL_INTERVAL_DISCONNECTED = 5000;
const POLL_INTERVAL_CONNECTED = 30000;

export const WhatsAppBubble = () => {
  const user = useAuthStore((state) => state.user);
  const [open, setOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [qrImage, setQrImage] = useState(null);
  const [loadingQR, setLoadingQR] = useState(false);
  const [sending, setSending] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [formData, setFormData] = useState({ number: '', busName: '', minutes: '' });
  const panelRef = useRef(null);

  // Solo admins pueden ver la burbuja
  if (user?.role !== 'ADMIN_ROLE') return null;
  const pollRef = useRef(null);

  const showFeedback = (msg, ok = true) => {
    setFeedback({ msg, ok });
    setTimeout(() => setFeedback(null), 3000);
  };

  const fetchStatus = useCallback(async () => {
    try {
      const res = await getWhatsAppStatus();
      setIsReady(res.data.isReady);
    } catch {
      setIsReady(false);
    }
  }, []);

  const fetchQR = useCallback(async () => {
    setLoadingQR(true);
    try {
      const res = await getWhatsAppQR();
      if (res.data.isReady) {
        setIsReady(true);
        setQrImage(null);
      } else {
        setQrImage(res.data.qr || null);
      }
    } catch {
      setQrImage(null);
    } finally {
      setLoadingQR(false);
    }
  }, []);

  // Polling de estado
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, isReady ? POLL_INTERVAL_CONNECTED : POLL_INTERVAL_DISCONNECTED);
    pollRef.current = interval;
    return () => clearInterval(interval);
  }, [isReady, fetchStatus]);

  // Al abrir el panel, cargar QR o estado
  useEffect(() => {
    if (open) {
      if (!isReady) {
        fetchQR();
        // Refrescar QR cada 20s mientras está abierto y no conectado
        const qrInterval = setInterval(() => {
          if (!isReady) fetchQR();
        }, 20000);
        return () => clearInterval(qrInterval);
      }
    }
  }, [open, isReady, fetchQR]);

  // Cerrar al click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        const bubble = document.getElementById('wa-bubble-btn');
        if (bubble && bubble.contains(e.target)) return;
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleSend = async (type) => {
    const { number, busName, minutes } = formData;
    if (!number || !busName) {
      showFeedback('Número y nombre del bus son requeridos', false);
      return;
    }
    setSending(type);
    try {
      if (type === 'arrival') await sendArrivalNotification(number, busName);
      else if (type === 'delay') {
        if (!minutes) { showFeedback('Ingresa los minutos de retraso', false); setSending(null); return; }
        await sendDelayNotification(number, busName, minutes);
      }
      else if (type === 'route') await sendRouteChangeNotification(number, busName);
      showFeedback('¡Mensaje enviado correctamente!');
    } catch (err) {
      showFeedback(err?.response?.data?.error || 'Error al enviar', false);
    } finally {
      setSending(null);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    marginBottom: '8px',
    color: '#1f2937',
    background: '#f9fafb',
  };

  const btnStyle = (color, disabled) => ({
    width: '100%',
    padding: '9px',
    borderRadius: '8px',
    border: 'none',
    background: disabled ? '#d1d5db' : color,
    color: '#fff',
    fontSize: '13px',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit',
    transition: 'background 0.15s',
    marginBottom: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  });

  return (
    <>
      {/* Panel flotante */}
      {open && (
        <div
          ref={panelRef}
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '24px',
            width: '300px',
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            zIndex: 9999,
            overflow: 'hidden',
            fontFamily: "'Segoe UI', sans-serif",
            animation: 'wa-popup 0.2s ease',
          }}
        >
          {/* Header */}
          <div style={{ background: '#25D366', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <div>
              <p style={{ margin: 0, color: '#fff', fontWeight: '700', fontSize: '14px' }}>WhatsApp</p>
              <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.85)' }}>
                {isReady ? '● Conectado' : '○ Desconectado'}
              </p>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '16px', maxHeight: '460px', overflowY: 'auto' }}>
            {!isReady ? (
              // Estado desconectado → mostrar QR
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px', margin: '0 0 12px' }}>
                  Escanea el código QR con WhatsApp para vincular
                </p>
                {loadingQR ? (
                  <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', border: '3px solid #25D366', borderTopColor: 'transparent', borderRadius: '50%', animation: 'wa-spin 0.8s linear infinite' }} />
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>Generando QR...</span>
                  </div>
                ) : qrImage ? (
                  <>
                    <img src={qrImage} alt="QR WhatsApp" style={{ width: '200px', height: '200px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                    <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '8px' }}>
                      El QR se actualiza automáticamente
                    </p>
                    <button
                      onClick={fetchQR}
                      style={{ marginTop: '8px', background: 'none', border: '1px solid #25D366', color: '#25D366', borderRadius: '8px', padding: '6px 16px', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      Refrescar QR
                    </button>
                  </>
                ) : (
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <p style={{ fontSize: '12px', color: '#9ca3af' }}>QR no disponible aún</p>
                    <button
                      onClick={fetchQR}
                      style={{ background: '#25D366', border: 'none', color: '#fff', borderRadius: '8px', padding: '8px 20px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: '600' }}
                    >
                      Intentar de nuevo
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Estado conectado → mensajes predeterminados
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Enviar notificación
                </p>

                <input
                  style={inputStyle}
                  placeholder="Número (ej: 55551234)"
                  value={formData.number}
                  onChange={e => setFormData(f => ({ ...f, number: e.target.value }))}
                />
                <input
                  style={inputStyle}
                  placeholder="Nombre del bus"
                  value={formData.busName}
                  onChange={e => setFormData(f => ({ ...f, busName: e.target.value }))}
                />

                <div style={{ height: '1px', background: '#f3f4f6', margin: '4px 0 10px' }} />

                <button
                  style={btnStyle('#25D366', sending === 'arrival')}
                  onClick={() => handleSend('arrival')}
                  disabled={!!sending}
                >
                  {sending === 'arrival' ? <span style={{ width: '14px', height: '14px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'wa-spin 0.8s linear infinite' }} /> : '🚌'}
                  Bus por llegar
                </button>

                <button
                  style={btnStyle('#f59e0b', sending === 'route')}
                  onClick={() => handleSend('route')}
                  disabled={!!sending}
                >
                  {sending === 'route' ? <span style={{ width: '14px', height: '14px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'wa-spin 0.8s linear infinite' }} /> : '🔄'}
                  Cambio de ruta
                </button>

                <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end' }}>
                  <input
                    style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                    placeholder="Min. de retraso"
                    type="number"
                    min="1"
                    value={formData.minutes}
                    onChange={e => setFormData(f => ({ ...f, minutes: e.target.value }))}
                  />
                  <button
                    style={{ ...btnStyle('#ef4444', sending === 'delay'), width: 'auto', padding: '9px 14px', marginBottom: 0 }}
                    onClick={() => handleSend('delay')}
                    disabled={!!sending}
                  >
                    {sending === 'delay' ? <span style={{ width: '14px', height: '14px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'wa-spin 0.8s linear infinite' }} /> : '⏱️'}
                    Retraso
                  </button>
                </div>

                {feedback && (
                  <div style={{ marginTop: '10px', padding: '8px 12px', borderRadius: '8px', background: feedback.ok ? '#dcfce7' : '#fee2e2', color: feedback.ok ? '#15803d' : '#dc2626', fontSize: '12px', fontWeight: '600', textAlign: 'center' }}>
                    {feedback.msg}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Burbuja */}
      <button
        id="wa-bubble-btn"
        onClick={handleToggle}
        title="WhatsApp"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#25D366',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(37,211,102,0.45)',
          zIndex: 9998,
          transition: 'transform 0.2s, box-shadow 0.2s',
          outline: 'none',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,211,102,0.55)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,211,102,0.45)'; }}
      >
        {/* Indicador de estado */}
        <div style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: isReady ? '#4ade80' : '#fbbf24',
          border: '2px solid #fff',
          transition: 'background 0.3s',
        }} />

        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
            <line x1="18" y1="6" x2="6" y2="18" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        )}
      </button>

      {/* Estilos de animación */}
      <style>{`
        @keyframes wa-popup {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes wa-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};