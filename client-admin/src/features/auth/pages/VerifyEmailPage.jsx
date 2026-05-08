/*import urbuLogo from "../../../assets/img/UrBus-logo.png";
import { Spinner } from "../components/Spinner.jsx";
import { useVerifyEmail } from "../hooks/useVerifyEmail.js";
import { useLocation } from "wouter";
 
function CloudBackground() {
    return (
        <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            aria-hidden
        >
            <svg
                viewBox="0 0 400 220"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full"
                preserveAspectRatio="xMidYMin slice"
            >
                <defs>
                    <linearGradient id="skyGrad3" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#d6eaf8" />
                        <stop offset="100%" stopColor="#eaf4fb" />
                    </linearGradient>
                </defs>
 
                <rect width="400" height="220" fill="url(#skyGrad3)" />
 
                <ellipse
                    cx="80"
                    cy="80"
                    rx="70"
                    ry="38"
                    fill="#ddeef7"
                    opacity="0.8"
                />
 
                <ellipse
                    cx="290"
                    cy="60"
                    rx="85"
                    ry="42"
                    fill="#ddeef7"
                    opacity="0.8"
                />
 
                <ellipse
                    cx="185"
                    cy="95"
                    rx="60"
                    ry="32"
                    fill="#ddeef7"
                    opacity="0.55"
                />
            </svg>
        </div>
    );
}
 
export const VerifyEmailPage = () => {
 
    // IMPORTANTE:
    // usar setLocation
    const [, setLocation] = useLocation();
 
    const params = new URLSearchParams(window.location.search);
 
    const token = params.get("token");
 
    const { status, message } = useVerifyEmail(token);
 
    return (
        <div
            className="min-h-screen w-full flex items-center justify-center"
            style={{ background: "#eaf4fb" }}
        >
            <div className="relative w-full max-w-sm mx-auto min-h-screen md:min-h-0 flex flex-col">
 
                <div
                    className="relative overflow-hidden md:rounded-3xl md:shadow-xl flex-1 flex flex-col"
                    style={{ background: "#eaf4fb" }}
                >
                    <CloudBackground />
 
                    <div className="relative z-10 flex flex-col items-center px-7 pt-10 pb-10 gap-4 flex-1">
 
                        <div
                            className="rounded-full border-[3px] bg-white overflow-hidden flex items-center justify-center shadow-md"
                            style={{
                                borderColor: "#f0c030",
                                width: 110,
                                height: 110
                            }}
                        >
                            <img
                                src={urbuLogo}
                                alt="UrBus Logo"
                                className="w-24 h-24 object-contain"
                            />
                        </div>
 
                        <h1 className="text-2xl font-bold text-gray-800 text-center">
                            Verificación de correo
                        </h1>
 
                        {status === "loading" && (
                            <div className="flex flex-col items-center gap-3">
 
                                <Spinner size={32} />
 
                                <p className="text-sm text-gray-500">
                                    Verificando tu correo...
                                </p>
 
                            </div>
                        )}
 
                        {status === "success" && (
                            <div className="flex flex-col items-center gap-3">
 
                                <div
                                    className="w-14 h-14 rounded-full flex items-center justify-center"
                                    style={{ background: "#f5c518" }}
                                >
                                    <svg
                                        width="28"
                                        height="28"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M5 13l4 4L19 7"
                                            stroke="white"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
 
                                <p className="text-center text-sm text-gray-700 font-medium">
                                    ¡Correo verificado correctamente!
                                </p>
 
                                <button
                                    onClick={() => setLocation("/")}
                                    className="w-full py-3.5 rounded-2xl font-semibold text-white text-base shadow-md flex items-center justify-center active:scale-95 transition-transform"
                                    style={{
                                        background:
                                            "linear-gradient(135deg,#f5c518 0%,#e6a800 100%)"
                                    }}
                                >
                                    Ir al Login
                                </button>
 
                            </div>
                        )}
 
                        {status === "error" && (
                            <div className="flex flex-col items-center gap-3">
 
                                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-red-100">
 
                                    <svg
                                        width="28"
                                        height="28"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M18 6L6 18M6 6l12 12"
                                            stroke="#ef4444"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                        />
                                    </svg>
 
                                </div>
 
                                <p className="text-center text-sm text-red-600">
                                    {message}
                                </p>
 
                                <button
                                    onClick={() => setLocation("/")}
                                    className="w-full py-3.5 rounded-2xl font-semibold text-white text-base shadow-md flex items-center justify-center active:scale-95 transition-transform"
                                    style={{
                                        background:
                                            "linear-gradient(135deg,#f5c518 0%,#e6a800 100%)"
                                    }}
                                >
                                    Volver al Login
                                </button>
 
                            </div>
                        )}
 
                    </div>
                </div>
            </div>
        </div>
    );
};
*/