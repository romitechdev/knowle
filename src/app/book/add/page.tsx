"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenNib, faImage, faTag, faLock, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function AddBooks() {
    const [title, setTitle] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagee, setImagee] = useState<File | null | string | any>("");
    const [tag, setTag] = useState<string>("");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
            setImagee(URL.createObjectURL(e.target.files[0]));
        }
    };

    const refreshAccessToken = async () => {
        try {
            if (sessionStorage.getItem("token")) {
                return sessionStorage.getItem("token");
            }

            const response = await fetch("/api/user/refreshToken", {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) {
                return null;
            }

            const data = await response.json();
            if (data.token) {
                sessionStorage.setItem("token", data.token);
                return data.token;
            }
            return null;
        } catch (error) {
            return null;
        }
    };

    // Check authentication on mount
    useEffect(() => {
        async function checkAuth() {
            const token = await refreshAccessToken();
            setIsLoggedIn(!!token);
            setCheckingAuth(false);
        }
        checkAuth();
    }, []);

    const handleToggle = (selectedTag: string) => {
        setTag((prevTag) => (prevTag === selectedTag ? "" : selectedTag));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage("");

        const formData = new FormData();
        formData.append("title", title);
        formData.append("notes", notes);
        formData.append("tag", tag);
        if (image) {
            formData.append("image", image);
        }

        try {
            const token = await refreshAccessToken();
            if (!token) {
                throw new Error("Silakan login terlebih dahulu");
            }

            const response = await fetch("/api/book/post", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Terjadi kesalahan");
            }

            setSuccessMessage("Berhasil dipublikasikan!");
            setTitle("");
            setNotes("");
            setTag("");
            setImage(null);
            setImagee("");
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Show loading while checking auth
    if (checkingAuth) {
        return (
            <div style={{
                minHeight: "60vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <div style={{
                    width: "40px",
                    height: "40px",
                    border: "3px solid #e2e8f0",
                    borderTopColor: "#6366f1",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                }} />
                <style jsx>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    // Show login prompt if not logged in
    if (!isLoggedIn) {
        return (
            <div style={{
                minHeight: "80vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
            }}>
                <div style={{
                    maxWidth: "420px",
                    width: "100%",
                    textAlign: "center",
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "24px",
                    padding: "48px 32px",
                }}>
                    <div style={{
                        width: "72px",
                        height: "72px",
                        background: "#eef2ff",
                        borderRadius: "18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 24px",
                    }}>
                        <FontAwesomeIcon icon={faLock} style={{ fontSize: "1.8rem", color: "#6366f1" }} />
                    </div>
                    <h2 style={{
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        color: "#1e293b",
                        marginBottom: "12px",
                    }}>
                        Login Diperlukan
                    </h2>
                    <p style={{
                        color: "#64748b",
                        fontSize: "1rem",
                        lineHeight: 1.6,
                        marginBottom: "32px",
                    }}>
                        Untuk menulis dan berbagi pengetahuan, kamu perlu masuk ke akunmu terlebih dahulu.
                    </p>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                    }}>
                        <a
                            href="/login"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                background: "#6366f1",
                                color: "#fff",
                                padding: "14px 28px",
                                borderRadius: "12px",
                                fontWeight: 600,
                                fontSize: "1rem",
                                textDecoration: "none",
                            }}
                        >
                            Masuk
                            <FontAwesomeIcon icon={faArrowRight} />
                        </a>
                        <p style={{
                            color: "#94a3b8",
                            fontSize: "0.9rem",
                            margin: 0,
                        }}>
                            Belum punya akun?{" "}
                            <a href="/signup" style={{ color: "#6366f1", fontWeight: 600, textDecoration: "none" }}>
                                Daftar
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                {/* Header */}
                <div style={{ marginBottom: "24px" }}>
                    <h1 style={{
                        fontSize: "clamp(1.4rem, 4vw, 2rem)",
                        fontWeight: 700,
                        marginBottom: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        color: "#1e293b",
                    }}>
                        <FontAwesomeIcon icon={faPenNib} style={{ color: "#6366f1" }} />
                        Tulis Baru
                    </h1>
                    <p style={{ color: "#64748b", margin: 0 }}>
                        Bagikan pengetahuanmu dengan komunitas
                    </p>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div style={{
                        background: "#dcfce7",
                        border: "1px solid #86efac",
                        borderRadius: "12px",
                        padding: "16px",
                        marginBottom: "24px",
                        color: "#166534",
                    }}>
                        {successMessage}
                    </div>
                )}

                {/* Cover Preview */}
                {imagee && (
                    <div style={{
                        marginBottom: "24px",
                        borderRadius: "16px",
                        overflow: "hidden",
                        border: "1px solid #e2e8f0",
                        maxWidth: "300px",
                    }}>
                        <img
                            src={imagee}
                            alt="Cover"
                            style={{ width: "100%", height: "auto" }}
                        />
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Title */}
                    <div style={{ marginBottom: "24px" }}>
                        <label style={{
                            display: "block",
                            color: "#475569",
                            fontSize: "0.9rem",
                            fontWeight: 600,
                            marginBottom: "10px",
                        }}>
                            Judul
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Masukkan judul..."
                            required
                            style={{
                                width: "100%",
                                background: "#f8fafc",
                                border: "1px solid #e2e8f0",
                                borderRadius: "12px",
                                padding: "14px 18px",
                                color: "#1e293b",
                                fontSize: "1rem",
                                outline: "none",
                            }}
                        />
                    </div>

                    {/* Content Editor */}
                    <div style={{ marginBottom: "24px" }}>
                        <label style={{
                            display: "block",
                            color: "#475569",
                            fontSize: "0.9rem",
                            fontWeight: 600,
                            marginBottom: "10px",
                        }}>
                            Konten
                        </label>
                        <div style={{
                            background: "#fff",
                            borderRadius: "12px",
                            border: "1px solid #e2e8f0",
                            overflow: "hidden",
                        }}>
                            <ReactQuill
                                value={notes}
                                onChange={setNotes}
                                placeholder="Mulai menulis..."
                            />
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div style={{ marginBottom: "24px" }}>
                        <label style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            color: "#475569",
                            fontSize: "0.9rem",
                            fontWeight: 600,
                            marginBottom: "10px",
                        }}>
                            <FontAwesomeIcon icon={faImage} />
                            Gambar Cover (opsional)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{
                                width: "100%",
                                background: "#f8fafc",
                                border: "1px solid #e2e8f0",
                                borderRadius: "12px",
                                padding: "12px 18px",
                                color: "#475569",
                                fontSize: "0.9rem",
                            }}
                        />
                    </div>

                    {/* Tags and Submit */}
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                        padding: "16px",
                        background: "#f8fafc",
                        borderRadius: "16px",
                        border: "1px solid #e2e8f0",
                    }}>
                        <div>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: "12px",
                            }}>
                                <FontAwesomeIcon icon={faTag} style={{ color: "#64748b" }} />
                                <span style={{ color: "#64748b", fontSize: "0.85rem" }}>
                                    Kategori (opsional)
                                </span>
                            </div>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <button
                                    type="button"
                                    onClick={() => handleToggle("Publish")}
                                    style={{
                                        background: tag === "Publish" ? "#6366f1" : "#fff",
                                        border: tag === "Publish" ? "none" : "1px solid #e2e8f0",
                                        color: tag === "Publish" ? "#fff" : "#64748b",
                                        padding: "8px 18px",
                                        borderRadius: "10px",
                                        fontWeight: 600,
                                        fontSize: "0.85rem",
                                        cursor: "pointer",
                                    }}
                                >
                                    Publikasi
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleToggle("Question")}
                                    style={{
                                        background: tag === "Question" ? "#f59e0b" : "#fff",
                                        border: tag === "Question" ? "none" : "1px solid #e2e8f0",
                                        color: tag === "Question" ? "#fff" : "#64748b",
                                        padding: "8px 18px",
                                        borderRadius: "10px",
                                        fontWeight: 600,
                                        fontSize: "0.85rem",
                                        cursor: "pointer",
                                    }}
                                >
                                    Tanya Jawab
                                </button>
                            </div>
                            <p style={{
                                color: "#94a3b8",
                                fontSize: "0.8rem",
                                marginTop: "8px",
                                marginBottom: 0,
                            }}>
                                Tidak memilih = privat
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                background: loading ? "#a5b4fc" : "#6366f1",
                                border: "none",
                                color: "#fff",
                                padding: "12px 28px",
                                borderRadius: "12px",
                                fontWeight: 600,
                                fontSize: "0.95rem",
                                cursor: loading ? "not-allowed" : "pointer",
                            }}
                        >
                            <FontAwesomeIcon icon={faPenNib} />
                            {loading ? "Menyimpan..." : "Publikasi"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
