"use client";
import Loading from "@/components/Loading";
import Footer from "@/components/Footer";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCamera, faSave } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function EditProfile() {
    const router = useRouter();
    const [user, setUser] = useState<any | null>(null);
    const [formData, setFormData] = useState({
        _id: "",
        name: "",
        username: "",
        desc: "",
    });
    const [preview, setPreview] = useState<string | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const refreshAccessToken = async () => {
        try {
            if (sessionStorage.getItem("token")) {
                return sessionStorage.getItem("token");
            }

            const response = await fetch("/api/user/refreshToken", {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) return null;

            const data = await response.json();
            sessionStorage.setItem("token", data.token);
            return data.token;
        } catch (error) {
            console.error("Error refreshing access token:", error);
            return null;
        }
    };

    useEffect(() => {
        async function fetchUserData() {
            try {
                const tokenTemp = await refreshAccessToken();
                if (!tokenTemp) {
                    router.push("/login");
                    return;
                }

                const response = await fetch(`/api/user/check`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${tokenTemp}` },
                });

                if (!response.ok) throw new Error("Unauthorized");

                const check = await response.json();
                setUser(check);
                setFormData({
                    _id: check._id,
                    name: check.name || "",
                    username: check.username,
                    desc: check.desc || "",
                });
                setPreview(check.pp);
            } catch (error) {
                console.error("Error fetching user data:", error);
                router.push("/login");
            }
        }

        if (user === null) {
            fetchUserData();
        }
    }, [user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const tokenTemp = await refreshAccessToken();
            if (!tokenTemp) return;

            const formDataToSend = new FormData();
            formDataToSend.append("_id", formData._id);
            formDataToSend.append("name", formData.name);
            formDataToSend.append("username", formData.username);
            formDataToSend.append("desc", formData.desc);

            if (image) {
                formDataToSend.append("image", image);
            }

            const response = await fetch("/api/user/update", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${tokenTemp}`,
                },
                body: formDataToSend,
            });

            if (!response.ok) {
                alert("Gagal menyimpan profil");
                return;
            }

            alert("Profil berhasil diperbarui!");
            router.push(`/profile/${formData.username}`);
        } catch (error) {
            console.error("Error saving profile:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleProfileClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleQuillChange = (value: string) => {
        setFormData({ ...formData, desc: value });
    };

    if (user === null) {
        return <Loading />;
    }

    return (
        <>
            <div className="container py-4" style={{ maxWidth: "600px" }}>
                {/* Header */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    marginBottom: "24px",
                }}>
                    <button
                        onClick={() => router.back()}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "40px",
                            height: "40px",
                            background: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            borderRadius: "10px",
                            color: "#64748b",
                            cursor: "pointer",
                        }}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <h1 style={{
                        fontSize: "clamp(1.2rem, 4vw, 1.5rem)",
                        fontWeight: 700,
                        color: "#1e293b",
                        margin: 0,
                    }}>
                        Edit Profil
                    </h1>
                </div>

                {/* Main Card */}
                <div style={{
                    background: "#fff",
                    borderRadius: "20px",
                    border: "1px solid #e2e8f0",
                    padding: "clamp(20px, 4vw, 32px)",
                }}>
                    {/* Profile Picture */}
                    <div style={{ textAlign: "center", marginBottom: "28px" }}>
                        <div
                            onClick={handleProfileClick}
                            style={{
                                position: "relative",
                                width: "120px",
                                height: "120px",
                                margin: "0 auto",
                                cursor: "pointer",
                            }}
                        >
                            <div style={{
                                width: "120px",
                                height: "120px",
                                borderRadius: "24px",
                                overflow: "hidden",
                                border: "3px solid #e2e8f0",
                                background: "#f1f5f9",
                            }}>
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt={user.username}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#94a3b8",
                                        fontSize: "2rem",
                                    }}>
                                        👤
                                    </div>
                                )}
                            </div>
                            {/* Camera overlay */}
                            <div style={{
                                position: "absolute",
                                bottom: "-4px",
                                right: "-4px",
                                width: "36px",
                                height: "36px",
                                background: "#6366f1",
                                borderRadius: "10px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                border: "3px solid #fff",
                            }}>
                                <FontAwesomeIcon icon={faCamera} style={{ fontSize: "0.85rem" }} />
                            </div>
                        </div>
                        <p style={{
                            color: "#64748b",
                            fontSize: "0.85rem",
                            marginTop: "12px",
                            marginBottom: 0,
                        }}>
                            Klik untuk ubah foto
                        </p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* Form */}
                    <form onSubmit={(e) => e.preventDefault()}>
                        <input type="hidden" name="_id" value={formData._id} readOnly />

                        {/* Name Field */}
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{
                                display: "block",
                                fontWeight: 600,
                                color: "#374151",
                                marginBottom: "8px",
                                fontSize: "0.9rem",
                            }}>
                                Nama Lengkap
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Masukkan nama..."
                                style={{
                                    width: "100%",
                                    padding: "14px 16px",
                                    background: "#f8fafc",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "12px",
                                    fontSize: "1rem",
                                    color: "#1e293b",
                                    outline: "none",
                                }}
                                onFocus={(e) => e.target.style.borderColor = "#6366f1"}
                                onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                            />
                        </div>

                        {/* Bio Field */}
                        <div style={{ marginBottom: "24px" }}>
                            <label style={{
                                display: "block",
                                fontWeight: 600,
                                color: "#374151",
                                marginBottom: "8px",
                                fontSize: "0.9rem",
                            }}>
                                Bio / Deskripsi
                            </label>
                            <div style={{
                                background: "#f8fafc",
                                borderRadius: "12px",
                                border: "1px solid #e2e8f0",
                                overflow: "hidden",
                            }}>
                                <ReactQuill
                                    theme="snow"
                                    value={formData.desc}
                                    onChange={handleQuillChange}
                                    placeholder="Tulis tentang dirimu..."
                                    modules={{
                                        toolbar: [
                                            ["bold", "italic", "underline"],
                                            [{ list: "ordered" }, { list: "bullet" }],
                                            ["link"],
                                            ["clean"],
                                        ],
                                    }}
                                />
                            </div>
                        </div>

                        {/* Save Button */}
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "10px",
                                width: "100%",
                                padding: "14px",
                                background: isSaving ? "#a5b4fc" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                border: "none",
                                borderRadius: "12px",
                                color: "#fff",
                                fontSize: "1rem",
                                fontWeight: 600,
                                cursor: isSaving ? "not-allowed" : "pointer",
                                boxShadow: "0 4px 14px rgba(99, 102, 241, 0.25)",
                            }}
                        >
                            <FontAwesomeIcon icon={faSave} />
                            {isSaving ? "Menyimpan..." : "Simpan Profil"}
                        </button>
                    </form>
                </div>
            </div>

            <Footer />

            <style jsx global>{`
                .ql-container {
                    min-height: 120px;
                    font-size: 0.95rem;
                    border: none !important;
                }
                .ql-toolbar {
                    border: none !important;
                    border-bottom: 1px solid #e2e8f0 !important;
                    background: #fff;
                }
                .ql-editor {
                    min-height: 120px;
                    padding: 14px;
                }
                .ql-editor.ql-blank::before {
                    color: #94a3b8;
                    font-style: normal;
                }
            `}</style>
        </>
    );
}
