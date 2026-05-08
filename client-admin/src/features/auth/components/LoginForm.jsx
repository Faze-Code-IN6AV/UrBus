import { useState } from "react";
import urbuLogo from "../../../assets/img/UrBus-logo.png";
import { Spinner } from "./Spinner.jsx";
import { useAuthStore } from "../store/authStore.js";
import { showError } from "../../../shared/utils/toast.js";
import { useNavigate } from "react-router-dom";
 
function UserIcon() {
    return (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" stroke="#9ca3af" strokeWidth="2" />
        <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}
 
function LockIcon() {
    return (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <rect x="5" y="11" width="14" height="10" rx="2" stroke="#9ca3af" strokeWidth="2" />
        <path d="M8 11V7a4 4 0 018 0v4" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}
 
export const LoginForm = ({ onNavigate }) => {
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const { login, loading } = useAuthStore();
    const navigate = useNavigate();
 
    const handleLogin = async () => {
        if (!usuario.trim() || !password.trim()) {
            showError("Por favor completa todos los campos.");
            return;
        }
 
        const result = await login({ emailOrUsername: usuario, password });
 
        if (result.success) {
            navigate("/dashboard");
        } else {
            showError(result.error || "Error al iniciar sesión");
        }
    };
 
    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleLogin();
    };
 
    return (
        <>
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-5">Login</h1>
 
        <div
            className="rounded-full border-[3px] bg-white overflow-hidden flex items-center justify-center shadow-md mb-6"
            style={{ borderColor: "#f0c030", width: 110, height: 110 }}
        >
            <img src={urbuLogo} alt="UrBus Logo" className="w-24 h-24 object-contain" />
        </div>
 
        <div className="flex flex-col gap-3 w-full">
            <div className="flex items-center bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-3 gap-3">
            <UserIcon />
            <input
                type="text"
                placeholder="Usuario / Correo Electrónico"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 outline-none text-gray-700 text-sm bg-transparent placeholder-gray-400"
            />
            </div>
            <div className="flex items-center bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-3 gap-3">
            <LockIcon />
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 outline-none text-gray-700 text-sm bg-transparent placeholder-gray-400"
            />
            </div>
        </div>
 
        <button
            onClick={() => onNavigate("forgot")}
            className="text-xs self-end mt-1"
            style={{ color: "#2196F3" }}
        >
            ¿Olvidaste tu contraseña?
        </button>
 
        <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3.5 rounded-2xl font-semibold text-white text-base shadow-md mt-3 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            style={{ background: "linear-gradient(135deg,#f5c518 0%,#e6a800 100%)" }}
        >
            {loading ? <Spinner size={20} color="#fff" /> : "Login"}
        </button>
 
        <p className="text-center text-sm text-gray-500 mt-2">
            ¿No tienes cuenta?{" "}
            <button onClick={() => onNavigate("register")} className="font-semibold" style={{ color: "#2196F3" }}>
            Regístrate
            </button>
        </p>
        <p className="text-center text-sm text-gray-500">
            ¿No verificaste tu correo?{" "}
            <button onClick={() => onNavigate("resend")} className="font-semibold" style={{ color: "#2196F3" }}>
            Reenviar
            </button>
        </p>
        </>
    );
}