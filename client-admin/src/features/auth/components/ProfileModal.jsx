import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../auth/store/authStore.js';
import toast from 'react-hot-toast';
import userDefault from '../../../assets/img/user.png';

const authBaseUrl = import.meta.env.VITE_AUTH_URL?.replace(/\/api\/v1\/?$/, '');

const normalizeCloudinaryUrl = (url) => {
  if (!url) return url;
  return url.replace(/(\/v\d+)(?!\/)/, '$1/');
};

const normalizeProfilePicture = (url) => {
  if (!url) return null;
  if (/^(https?:)?\/\//.test(url)) {
    const resolved = url.startsWith('//') ? `https:${url}` : url;
    return normalizeCloudinaryUrl(resolved);
  }
  if (url.startsWith('/')) return normalizeCloudinaryUrl(`${authBaseUrl}${url}`);
  return normalizeCloudinaryUrl(`${authBaseUrl}/${url}`);
};

const modalOverlay = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
  zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
  backdropFilter: 'blur(3px)', animation: 'fadeInOverlay 0.18s ease',
};

const modalBox = {
  background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '480px',
  margin: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
  overflow: 'hidden', animation: 'slideUp 0.22s ease',
};

const avatarSection = {
  background: 'linear-gradient(135deg, #005691 0%, #1E88E5 100%)',
  padding: '28px 24px 20px', display: 'flex', flexDirection: 'column',
  alignItems: 'center', gap: '12px',
};

const avatarWrapper = {
  position: 'relative', width: '80px', height: '80px',
};

const avatarImg = {
  width: '80px', height: '80px', borderRadius: '50%',
  objectFit: 'cover', border: '3px solid rgba(255,255,255,0.5)',
};

const cameraBtn = {
  position: 'absolute', bottom: 0, right: 0,
  width: '26px', height: '26px', borderRadius: '50%',
  background: '#FFC107', border: '2px solid #fff',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', transition: 'transform 0.15s',
};

const headerName = {
  color: '#fff', fontWeight: '700', fontSize: '17px', margin: 0, textAlign: 'center',
};

const headerRole = {
  color: 'rgba(255,255,255,0.65)', fontSize: '12px', margin: '2px 0 0', textAlign: 'center',
};

const formSection = { padding: '20px 24px' };

const fieldLabel = {
  display: 'block', fontSize: '11px', fontWeight: '600',
  color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '5px',
};

const fieldInput = {
  width: '100%', padding: '9px 12px', border: '1.5px solid #e5e7eb',
  borderRadius: '10px', fontSize: '14px', color: '#111827',
  background: '#fafafa', outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.15s',
  fontFamily: "'Segoe UI', sans-serif",
};

const fieldRow = { marginBottom: '14px' };

const rowTwo = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' };

const footer = {
  padding: '14px 24px 20px', display: 'flex', gap: '10px', justifyContent: 'flex-end',
  borderTop: '1px solid #f3f4f6',
};

const btnCancel = {
  padding: '8px 18px', border: '1.5px solid #e5e7eb', borderRadius: '10px',
  background: 'transparent', color: '#6b7280', fontSize: '13px', fontWeight: '500',
  cursor: 'pointer', fontFamily: "'Segoe UI', sans-serif",
};

const btnSave = {
  padding: '8px 22px', border: 'none', borderRadius: '10px',
  background: 'linear-gradient(135deg, #005691, #1E88E5)',
  color: '#fff', fontSize: '13px', fontWeight: '600',
  cursor: 'pointer', fontFamily: "'Segoe UI', sans-serif",
  transition: 'opacity 0.15s',
};

const readonlyField = {
  ...fieldInput, color: '#9ca3af', background: '#f3f4f6', cursor: 'not-allowed',
};

const ROLE_LABELS = {
  ADMIN_ROLE: 'Administrador',
  USER_ROLE: 'Usuario',
  PASSENGER_ROLE: 'Pasajero',
};

export const ProfileModal = ({ onClose }) => {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [form, setForm] = useState({
    name: user?.name ?? '',
    surname: user?.surname ?? '',
    phone: user?.phone ?? '',
  });
  const [preview, setPreview] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const currentPic = preview || normalizeProfilePicture(user?.profilePicture) || userDefault;
  const rolLabel = ROLE_LABELS[user?.role] ?? user?.role ?? 'Usuario';

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = async () => {
    if (saving) return;

    const phoneVal = form.phone.trim();
    if (!/^\d{8}$/.test(phoneVal)) {
      toast.error('El teléfono debe tener exactamente 8 dígitos numéricos');
      return;
    }
    if (!form.name.trim()) {
      toast.error('El nombre es obligatorio');
      return;
    }
    if (!form.surname.trim()) {
      toast.error('El apellido es obligatorio');
      return;
    }

    setSaving(true);
    try {
      const userId = user?.id || user?._id;
      if (!userId) {
        throw new Error('Usuario no válido');
      }

      const fd = new FormData();
      fd.append('Name', form.name.trim());
      fd.append('Surname', form.surname.trim());
      fd.append('Phone', phoneVal);
      if (imgFile) fd.append('ProfilePicture', imgFile);

      const result = await updateProfile(userId, fd);

      if (!result.success) {
        throw new Error(result.error || 'Error al actualizar el perfil');
      }

      toast.success('Perfil actualizado correctamente');
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error al actualizar el perfil';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = (field) => ({
    ...fieldInput,
    borderColor: focusedField === field ? '#005691' : '#e5e7eb',
  });

  return (
    <>
      <style>{`
        @keyframes fadeInOverlay { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
        .camera-btn:hover { transform: scale(1.12) !important; }
        .btn-cancel:hover { border-color: #d1d5db !important; background: #f9fafb !important; }
        .btn-save:hover:not(:disabled) { opacity: 0.88 !important; }
        .btn-save:disabled { opacity: 0.55; cursor: not-allowed; }
      `}</style>

      <div style={modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div style={modalBox}>
          {/* Header con foto */}
          <div style={avatarSection}>
            <div style={avatarWrapper}>
              <img
                src={currentPic}
                alt="Avatar"
                style={avatarImg}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = userDefault; }}
              />
              <div
                className="camera-btn"
                style={cameraBtn}
                onClick={() => fileRef.current?.click()}
                title="Cambiar foto"
              >
                <svg width="12" height="12" fill="none" stroke="#333" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
            </div>
            <div>
              <p style={headerName}>{user?.name} {user?.surname}</p>
              <p style={headerRole}>@{user?.username} · {rolLabel}</p>
            </div>
          </div>

          {/* Formulario */}
          <div style={formSection}>
            <div style={rowTwo}>
              <div>
                <label style={fieldLabel}>Nombre</label>
                <input
                  style={inputStyle('name')}
                  value={form.name}
                  maxLength={25}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  onChange={handleChange('name')}
                />
              </div>
              <div>
                <label style={fieldLabel}>Apellido</label>
                <input
                  style={inputStyle('surname')}
                  value={form.surname}
                  maxLength={25}
                  onFocus={() => setFocusedField('surname')}
                  onBlur={() => setFocusedField(null)}
                  onChange={handleChange('surname')}
                />
              </div>
            </div>

            <div style={fieldRow}>
              <label style={fieldLabel}>Teléfono</label>
              <input
                style={inputStyle('phone')}
                value={form.phone}
                maxLength={8}
                placeholder="00000000"
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
                onChange={handleChange('phone')}
              />
            </div>

            <div style={rowTwo}>
              <div>
                <label style={fieldLabel}>Usuario</label>
                <input style={readonlyField} value={user?.username ?? ''} readOnly />
              </div>
              <div>
                <label style={fieldLabel}>Rol</label>
                <input style={readonlyField} value={rolLabel} readOnly />
              </div>
            </div>

            <div style={fieldRow}>
              <label style={fieldLabel}>Correo electrónico</label>
              <input style={readonlyField} value={user?.email ?? ''} readOnly />
            </div>
          </div>

          <div style={footer}>
            <button className="btn-cancel" style={btnCancel} onClick={onClose}>Cancelar</button>
            <button
              className="btn-save"
              style={btnSave}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};