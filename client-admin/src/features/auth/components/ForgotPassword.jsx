import { useState } from "react";
import urbuLogo from "../../../assets/img/UrBus-logo.png";
import { Spinner } from "./Spinner.jsx";
import { forgotPassword } from "../../../shared/api";
import { showError, showSuccess } from "../../../shared/utils/toast.js";
 
const EmailIcon = () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="#9ca3af" strokeWidth="2" />
        <path d="M3 7l9 6 9-6" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
    </svg>
);
 
export const ForgotPassword = ({ onNavigate }) => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
 
    const handleSubmit = async () => {
        if (!email.trim()) {
            showError("Por favor ingresa tu correo electrónico.");
            return;
        }

        setLoading(true);
        try {
            await forgotPassword(email.trim());
            setSent(true);
            showSuccess("Si el correo existe, recibirás instrucciones.");
        } catch (err) {
            const message = err.response?.data?.message || "Error al enviar el correo de recuperación.";
            showError(message);
        } finally {
            setLoading(false);
        }
    };
 
    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSubmit();
    };
 
    return (
        <>
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
            ¿Olvidaste tu contraseña?
        </h1>
        <p className="text-center text-sm text-gray-500 mb-5 leading-relaxed">
            {sent
            ? "¡Revisa tu correo! Te enviamos instrucciones para restablecer tu contraseña."
            : "Ingresa tu correo y te enviaremos instrucciones para restablecer tu contraseña."}
        </p>
 
        <div
            className="rounded-full border-[3px] bg-white overflow-hidden flex items-center justify-center shadow-md mb-6"
            style={{ borderColor: "#f0c030", width: 110, height: 110 }}
        >
            <img src={urbuLogo} alt="UrBus Logo" className="w-24 h-24 object-contain" />
        </div>
 
        {!sent && (
            <>
            <div className="flex items-center bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-3 gap-3 w-full">
                <EmailIcon />
                <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 outline-none text-gray-700 text-sm bg-transparent placeholder-gray-400"
                />
            </div>
 
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3.5 rounded-2xl font-semibold text-white text-base shadow-md mt-4 flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg,#f5c518 0%,#e6a800 100%)" }}
            >
                {loading && <Spinner />}
                {loading ? "Enviando..." : "Enviar instrucciones"}
            </button>
            </>
        )}
 
        {sent && (
            <button
            onClick={() => { setSent(false); setEmail(""); onNavigate("login"); }}
            className="w-full py-3.5 rounded-2xl font-semibold text-white text-base shadow-md mt-4 active:scale-95 transition-transform"
            style={{ background: "linear-gradient(135deg,#f5c518 0%,#e6a800 100%)" }}
            >
            Volver al Login
            </button>
        )}
 
        <p className="text-center text-sm text-gray-500 mt-2">
            ¿Recordaste tu contraseña?{" "}
            <button onClick={() => onNavigate("login")} className="font-semibold" style={{ color: "#2196F3" }}>
            Ingresar
            </button>
        </p>
        </>
    );
}