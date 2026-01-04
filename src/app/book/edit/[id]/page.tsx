"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import Loading from "@/components/Loading";
import Footer from "@/components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faImage, faSave } from "@fortawesome/free-solid-svg-icons";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function EditBook() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;
    const [title, setTitle] = useState("");
    const [notes, setNotes] = useState("");
    const [tag, setTag] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [token, setToken] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");

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
                return undefined;
            }

            const data = await response.json();
            sessionStorage.setItem("token", data.token);
            return data.token;
        } catch (error) {
            console.error("Error refreshing access token:", error);
            return undefined;
        }
    };

    useEffect(() => {
        if (!id) return;

        const fetchBook = async () => {
            try {
                setLoading(true);
                setError(null);

                const tokenAwal = await refreshAccessToken();
                if (!tokenAwal) throw new Error("Unable to retrieve access token");
                setToken(tokenAwal);

                const response = await fetch(`/api/book/get/${id}`, {
                    headers: {
                        Authorization: `Bearer ${tokenAwal}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch book details");
                }

                const data: bookType = await response.json();
                setTitle(data.title);
                setNotes(data.notes);
                setImagePreview(data.cover || "");
                //@ts-ignore
                setTag(data?.tag || "");
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSuccessMessage("");

        const formData = new FormData();
        formData.append("title", title);
        formData.append("notes", notes);
        if (image) {
            formData.append("image", image);
        }

        try {
            const response = await fetch(`/api/book/edit/${id}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            setSuccessMessage("Berhasil disimpan!");
            setTimeout(() => {
                router.push(`/book/${data.id || id}`);
            }, 1000);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
            setImagePreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleToggle = (selectedTag: string) => {
        setTag((prevTag) => (prevTag === selectedTag ? "" : selectedTag));
    };

    if (loading) return <Loading />;

    if (error) return (
        <div className="container py-5">
            <div style={{
                textAlign: "center",
                padding: "60px 20px",
                background: "#fef2f2",
                borderRadius: "20px",
                border: "1px solid #fecaca",
            }}>
                <p style={{ color: "#dc2626", fontWeight: 600 }}>Error: {error}</p>
                <a
                    href="/home"
                    style={{
                        display: "inline-block",
                        marginTop: "16px",
                        background: "#6366f1",
                        color: "#fff",
                        padding: "10px 20px",
                        borderRadius: "10px",
                        textDecoration: "none",
                        fontWeight: 600,
                    }}
                >
                    Kembali ke Home
                </a>
            </div>
        </div>
    );

    return (
        <>
            <div className="container py-4" style={{ maxWidth: "900px" }}>
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
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        color: "#1e293b",
                        margin: 0,
                    }}>
                        Edit Publikasi
                    </h1>
                </div>

                {/* Main Card */}
                <div style={{
                    background: "#fff",
                    borderRadius: "20px",
                    border: "1px solid #e2e8f0",
                    overflow: "hidden",
                }}>
                    {/* Cover Preview */}
                    {imagePreview && (
                        <div style={{
                            position: "relative",
                            width: "100%",
                            height: "200px",
                            background: "#f1f5f9",
                        }}>
                            <img
                                src={imagePreview}
                                alt="Cover preview"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
                        {/* Title */}
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{
                                display: "block",
                                fontWeight: 600,
                                color: "#374151",
                                marginBottom: "8px",
                                fontSize: "0.95rem",
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
                                    padding: "14px 16px",
                                    background: "#f8fafc",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "12px",
                                    fontSize: "1rem",
                                    color: "#1e293b",
                                    outline: "none",
                                    transition: "border-color 0.2s",
                                }}
                                onFocus={(e) => e.target.style.borderColor = "#6366f1"}
                                onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                            />
                        </div>

                        {/* Content */}
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{
                                display: "block",
                                fontWeight: 600,
                                color: "#374151",
                                marginBottom: "8px",
                                fontSize: "0.95rem",
                            }}>
                                Konten
                            </label>
                            <div style={{
                                background: "#f8fafc",
                                borderRadius: "12px",
                                border: "1px solid #e2e8f0",
                                overflow: "hidden",
                            }}>
                                <ReactQuill
                                    value={notes}
                                    onChange={setNotes}
                                    placeholder="Tulis konten di sini..."
                                    modules={{
                                        toolbar: [
                                            [{ header: [1, 2, 3, false] }],
                                            ["bold", "italic", "underline", "strike"],
                                            [{ list: "ordered" }, { list: "bullet" }],
                                            ["link", "image"],
                                            ["clean"],
                                        ],
                                    }}
                                    style={{ minHeight: "300px" }}
                                />
                            </div>
                        </div>

                        {/* Cover Upload */}
                        <div style={{ marginBottom: "24px" }}>
                            <label style={{
                                display: "block",
                                fontWeight: 600,
                                color: "#374151",
                                marginBottom: "8px",
                                fontSize: "0.95rem",
                            }}>
                                <FontAwesomeIcon icon={faImage} style={{ marginRight: "8px", color: "#6366f1" }} />
                                Gambar Cover (opsional)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    background: "#f8fafc",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "12px",
                                    fontSize: "0.9rem",
                                    color: "#64748b",
                                }}
                            />
                        </div>

                        {/* Tag Selection & Submit */}
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px",
                        }}>
                            {/* Tags */}
                            <div style={{
                                display: "flex",
                                gap: "10px",
                                flexWrap: "wrap",
                            }}>
                                <button
                                    type="button"
                                    onClick={() => handleToggle("Publish")}
                                    style={{
                                        padding: "10px 20px",
                                        borderRadius: "10px",
                                        fontWeight: 600,
                                        fontSize: "0.9rem",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        border: tag === "Publish" ? "2px solid #6366f1" : "1px solid #e2e8f0",
                                        background: tag === "Publish" ? "#eef2ff" : "#f8fafc",
                                        color: tag === "Publish" ? "#6366f1" : "#64748b",
                                    }}
                                >
                                    📢 Publikasi
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleToggle("Question")}
                                    style={{
                                        padding: "10px 20px",
                                        borderRadius: "10px",
                                        fontWeight: 600,
                                        fontSize: "0.9rem",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        border: tag === "Question" ? "2px solid #d97706" : "1px solid #e2e8f0",
                                        background: tag === "Question" ? "#fef3c7" : "#f8fafc",
                                        color: tag === "Question" ? "#d97706" : "#64748b",
                                    }}
                                >
                                    ❓ Tanya Jawab
                                </button>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={saving}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "10px",
                                    width: "100%",
                                    padding: "14px",
                                    background: saving ? "#a5b4fc" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    border: "none",
                                    borderRadius: "12px",
                                    color: "#fff",
                                    fontSize: "1rem",
                                    fontWeight: 600,
                                    cursor: saving ? "not-allowed" : "pointer",
                                    boxShadow: "0 4px 14px rgba(99, 102, 241, 0.25)",
                                    transition: "all 0.3s",
                                }}
                            >
                                <FontAwesomeIcon icon={faSave} />
                                {saving ? "Menyimpan..." : "Simpan Perubahan"}
                            </button>

                            {/* Success Message */}
                            {successMessage && (
                                <div style={{
                                    textAlign: "center",
                                    padding: "12px",
                                    background: "#ecfdf5",
                                    border: "1px solid #a7f3d0",
                                    borderRadius: "10px",
                                    color: "#059669",
                                    fontWeight: 600,
                                }}>
                                    ✓ {successMessage}
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <Footer />

            <style jsx global>{`
                .ql-container {
                    min-height: 250px;
                    font-size: 1rem;
                    border: none !important;
                }
                .ql-toolbar {
                    border: none !important;
                    border-bottom: 1px solid #e2e8f0 !important;
                    background: #fff;
                }
                .ql-editor {
                    min-height: 250px;
                    padding: 16px;
                }
                .ql-editor.ql-blank::before {
                    color: #94a3b8;
                    font-style: normal;
                }
            `}</style>
        </>
    );
}
