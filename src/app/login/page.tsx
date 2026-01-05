"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { faEyeSlash, faEye, faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage("");

        const response = await fetch("/api/user/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data: any = await response.json();
            if (data.token) {
                sessionStorage.setItem("token", data.token);
                router.push("/home");
            }
        } else {
            setErrorMessage(
                response.status === 401
                    ? "Username atau password salah. Silakan coba lagi."
                    : "Terjadi kesalahan server. Silakan coba lagi."
            );
            setLoading(false);
        }
    };

    const refreshAccessToken = async () => {
        if (sessionStorage.getItem("token")) return (window.location.href = "/home");

        const response = await fetch("/api/user/refreshToken", { method: "POST", credentials: "include" });
        if (!response.ok) return;

        const data = await response.json();
        if (!data.token) return;
        sessionStorage.setItem("token", data.token);
        window.location.href = "/home";
    };

    useEffect(() => {
        async function callToken() {
            await refreshAccessToken();
        }
        callToken();
    }, []);

    return (
        <div style={{
            minHeight: "90vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            background: "linear-gradient(135deg, #fafafa 0%, #f4f4f5 100%)",
        }}>
            {/* Login Card */}
            <div style={{
                maxWidth: "440px",
                width: "100%",
                background: "#fff",
                border: "1px solid #e4e4e7",
                borderRadius: "clamp(16px, 3vw, 24px)",
                padding: "clamp(24px, 5vw, 40px)",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
            }}>
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <img
                        src="/favicon.png"
                        alt="Knowle"
                        style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "14px",
                            marginBottom: "16px",
                        }}
                    />
                    <h1 style={{
                        fontSize: "1.6rem",
                        fontWeight: 700,
                        marginBottom: "8px",
                        color: "#18181b",
                    }}>
                        Selamat Datang Kembali
                    </h1>
                    <p style={{ color: "#71717a", fontSize: "0.95rem" }}>
                        Masuk untuk melanjutkan ke Knowle
                    </p>
                </div>

                {/* Error Message */}
                {errorMessage && (
                    <div style={{
                        background: "rgba(239, 68, 68, 0.1)",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                        borderRadius: "12px",
                        padding: "12px 16px",
                        marginBottom: "24px",
                        color: "#dc2626",
                        fontSize: "0.9rem",
                    }}>
                        {errorMessage}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Username */}
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{
                            display: "block",
                            color: "#52525b",
                            fontSize: "0.9rem",
                            fontWeight: 500,
                            marginBottom: "8px",
                        }}>
                            Username
                        </label>
                        <div style={{ position: "relative" }}>
                            <span style={{
                                position: "absolute",
                                left: "14px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#a1a1aa",
                            }}>
                                <FontAwesomeIcon icon={faUser} />
                            </span>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Masukkan username"
                                maxLength={16}
                                required
                                style={{
                                    width: "100%",
                                    background: "#fafafa",
                                    border: "1px solid #e4e4e7",
                                    borderRadius: "12px",
                                    padding: "12px 16px 12px 42px",
                                    color: "#18181b",
                                    fontSize: "0.95rem",
                                    outline: "none",
                                    transition: "all 0.2s ease",
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = "#6366f1";
                                    e.target.style.background = "#fff";
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = "#e4e4e7";
                                    e.target.style.background = "#fafafa";
                                }}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: "24px" }}>
                        <label style={{
                            display: "block",
                            color: "#52525b",
                            fontSize: "0.9rem",
                            fontWeight: 500,
                            marginBottom: "8px",
                        }}>
                            Password
                        </label>
                        <div style={{ position: "relative" }}>
                            <span style={{
                                position: "absolute",
                                left: "14px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#a1a1aa",
                            }}>
                                <FontAwesomeIcon icon={faLock} />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Masukkan password"
                                required
                                style={{
                                    width: "100%",
                                    background: "#fafafa",
                                    border: "1px solid #e4e4e7",
                                    borderRadius: "12px",
                                    padding: "12px 46px 12px 42px",
                                    color: "#18181b",
                                    fontSize: "0.95rem",
                                    outline: "none",
                                    transition: "all 0.2s ease",
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = "#6366f1";
                                    e.target.style.background = "#fff";
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = "#e4e4e7";
                                    e.target.style.background = "#fafafa";
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    right: "12px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "transparent",
                                    border: "none",
                                    color: "#a1a1aa",
                                    cursor: "pointer",
                                    padding: "4px 8px",
                                }}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            background: loading
                                ? "#a5b4fc"
                                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            border: "none",
                            borderRadius: "12px",
                            padding: "14px",
                            color: "#fff",
                            fontSize: "1rem",
                            fontWeight: 600,
                            cursor: loading ? "not-allowed" : "pointer",
                            transition: "all 0.3s ease",
                            boxShadow: "0 4px 14px rgba(99, 102, 241, 0.25)",
                        }}
                        onMouseOver={(e) => {
                            if (!loading) {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 8px 25px rgba(99, 102, 241, 0.35)";
                            }
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 14px rgba(99, 102, 241, 0.25)";
                        }}
                    >
                        {loading ? "Memproses..." : "Masuk"}
                    </button>
                </form>

                {/* Sign Up Link */}
                <div style={{
                    textAlign: "center",
                    marginTop: "24px",
                    color: "#71717a",
                    fontSize: "0.95rem",
                }}>
                    Belum punya akun?{" "}
                    <a
                        href="/signup"
                        style={{
                            color: "#6366f1",
                            fontWeight: 600,
                            textDecoration: "none",
                        }}
                    >
                        Daftar
                    </a>
                </div>
            </div>
        </div>
    );
}
