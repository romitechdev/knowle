"use client";
import BookShortcut from "@/components/Bookshortcut";
import Loading from "@/components/Loading";
import Footer from "@/components/Footer";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBook } from "@fortawesome/free-solid-svg-icons";

export default function SearchPage() {
    const [books, setBooks] = useState<bookType[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const { ref, inView } = useInView();
    const params = useParams();
    const searchTerm = params.term as string;
    const pageRef = useRef(1);

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
            if (data.token) {
                sessionStorage.setItem("token", data.token);
                return data.token;
            }
            return null;
        } catch {
            return null;
        }
    };

    async function fetchBooks(page: number, isInitial = false) {
        if (!isInitial && loadingMore) return;

        if (!isInitial) setLoadingMore(true);

        try {
            const token = await refreshAccessToken();
            const headers: any = {};
            if (token) headers["Authorization"] = `Bearer ${token}`;

            const urlParams = new URLSearchParams(window.location.search);
            const tagParam = urlParams.get("tag") ? `?tag=${urlParams.get("tag")}` : "";

            const response = await fetch(`/api/book/search/${searchTerm}${tagParam}`, {
                headers,
            });

            if (!response.ok) throw new Error("Error fetching books");

            const data = await response.json();

            if (data.books && data.books.length > 0) {
                if (page === 1) {
                    setBooks(data.books);
                } else {
                    setBooks((prev) => {
                        // Deduplicate by _id
                        const existingIds = new Set(prev.map(p => p._id));
                        const newBooks = data.books.filter((b: bookType) => !existingIds.has(b._id));
                        return [...prev, ...newBooks];
                    });
                }
                pageRef.current = page;
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching books:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }

    useEffect(() => {
        if (searchTerm) {
            fetchBooks(1, true);
        }
    }, [searchTerm]);

    useEffect(() => {
        if (inView && hasMore && !loading && !loadingMore) {
            fetchBooks(pageRef.current + 1);
        }
    }, [inView, hasMore, loading, loadingMore]);

    if (loading) return <Loading />;

    return (
        <>
            {/* Header */}
            <div style={{
                background: "#fff",
                borderBottom: "1px solid #f1f5f9",
                padding: "clamp(24px, 4vw, 40px) 0",
            }}>
                <div className="container">
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}>
                        <div style={{
                            width: "40px",
                            height: "40px",
                            background: "#eef2ff",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <FontAwesomeIcon icon={faSearch} style={{ color: "#6366f1", fontSize: "1rem" }} />
                        </div>
                        <div>
                            <h1 style={{
                                fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
                                fontWeight: 700,
                                color: "#0f172a",
                                margin: 0,
                            }}>
                                Hasil Pencarian
                            </h1>
                            <p style={{ color: "#64748b", fontSize: "0.9rem", margin: 0 }}>
                                Menampilkan hasil untuk "{decodeURIComponent(searchTerm)}"
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div style={{ background: "#f8fafc", minHeight: "60vh" }}>
                <div className="container py-4">
                    {books.length > 0 ? (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(min(160px, 100%), 1fr))",
                            gap: "12px",
                        }}>
                            {books.map((book) => (
                                <BookShortcut
                                    key={book._id}
                                    book={book}
                                    refreshAccessToken={refreshAccessToken}
                                />
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            textAlign: "center",
                            padding: "60px 20px",
                            background: "#fff",
                            borderRadius: "20px",
                            border: "1px solid #e2e8f0",
                        }}>
                            <div style={{
                                width: "64px",
                                height: "64px",
                                background: "#f1f5f9",
                                borderRadius: "16px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 20px",
                            }}>
                                <FontAwesomeIcon icon={faBook} style={{ fontSize: "1.5rem", color: "#94a3b8" }} />
                            </div>
                            <h3 style={{ fontWeight: 600, marginBottom: "8px", color: "#1e293b" }}>
                                Tidak ditemukan
                            </h3>
                            <p style={{ color: "#64748b", marginBottom: "20px" }}>
                                Tidak ada hasil untuk "{decodeURIComponent(searchTerm)}"
                            </p>
                            <a
                                href="/book/publish"
                                style={{
                                    display: "inline-block",
                                    background: "#6366f1",
                                    color: "#fff",
                                    padding: "12px 24px",
                                    borderRadius: "10px",
                                    fontWeight: 600,
                                    textDecoration: "none",
                                }}
                            >
                                Jelajahi Publikasi
                            </a>
                        </div>
                    )}

                    {/* Load More */}
                    {hasMore && books.length > 0 && (
                        <div ref={ref} style={{ padding: "40px", textAlign: "center" }}>
                            <div style={{
                                width: "28px",
                                height: "28px",
                                border: "3px solid #e2e8f0",
                                borderTopColor: "#6366f1",
                                borderRadius: "50%",
                                animation: "spin 0.7s linear infinite",
                                margin: "0 auto",
                            }} />
                            <style jsx>{`
                                @keyframes spin {
                                    to { transform: rotate(360deg); }
                                }
                            `}</style>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}