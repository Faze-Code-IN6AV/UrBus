import { useState } from "react";
import { LoginForm } from "../components/LoginForm.jsx";
import { Register } from "../components/Register.jsx";
import { ForgotPassword } from "../components/ForgotPassword.jsx";
import { ResendVerification } from "../components/ResendVerification.jsx";

function CloudBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="xMidYMin slice">
            <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d6eaf8" />
                <stop offset="100%" stopColor="#eaf4fb" />
            </linearGradient>
            </defs>
            <rect width="400" height="220" fill="url(#skyGrad)" />
            <ellipse cx="80" cy="80" rx="70" ry="38" fill="#ddeef7" opacity="0.8" />
            <ellipse cx="110" cy="68" rx="48" ry="30" fill="#e8f4fa" opacity="0.9" />
            <ellipse cx="55" cy="90" rx="40" ry="22" fill="#cce6f4" opacity="0.6" />
            <ellipse cx="290" cy="60" rx="85" ry="42" fill="#ddeef7" opacity="0.8" />
            <ellipse cx="330" cy="48" rx="55" ry="32" fill="#e8f4fa" opacity="0.9" />
            <ellipse cx="260" cy="72" rx="42" ry="24" fill="#cce6f4" opacity="0.6" />
            <ellipse cx="185" cy="95" rx="60" ry="32" fill="#ddeef7" opacity="0.55" />
            <ellipse cx="200" cy="82" rx="38" ry="24" fill="#e8f4fa" opacity="0.7" />
        </svg>
        </div>
    );
    }

export const AuthPage = () => {
    const [view, setView] = useState("login");

    const views = {
        login: <LoginForm onNavigate={setView} />,
        register: <Register onNavigate={setView} />,
        forgot: <ForgotPassword onNavigate={setView} />,
        resend: <ResendVerification onNavigate={setView} />,
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center" style={{ background: "#eaf4fb" }}>
        <div className="relative w-full max-w-sm mx-auto min-h-screen md:min-h-0 flex flex-col">
            <div className="relative overflow-hidden md:rounded-3xl md:shadow-xl flex-1 flex flex-col" style={{ background: "#eaf4fb" }}>
            <CloudBackground />
            <div className="relative z-10 flex flex-col items-center px-7 pt-10 pb-10 gap-1 flex-1">
                {views[view]}
            </div>
            </div>
        </div>
        </div>
    );
}
