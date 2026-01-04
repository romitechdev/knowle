"use client";
import BookShortcut from "@/components/Bookshortcut";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faBook } from "@fortawesome/free-solid-svg-icons";

export default function Homepage() {
    const [user, setUser] = useState<userType | null>(null);
    const [books, setBooks] = useState<bookType[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const { ref, inView } = useInView();

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/user/logout", { method: "DELETE" });
            if (response.ok) {
                sessionStorage.clear();
                window.location.href = "/login";
            }
        } catch { }
    };

    const refreshAccessToken = async () => {
        try {
            const existing = sessionStorage.getItem("token");
            if (existing) return existing;

            const response = await fetch("/api/user/refreshToken", {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) return handleLogout();

            const data = await response.json();
            if (!data.token) return handleLogout();
            sessionStorage.setItem("token", data.token);
            return data.token;
        } catch {
            handleLogout();
            return null;
        }
    };

    async function fetchBooks(userId: string, token: string, page: number) {
        try {
            const res = await fetch(`/api/book/get/userId/${userId}?page=${page}&limit=10`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (data.books.length > 0) {
                setBooks((prev) => (page === 1 ? data.books : [...prev, ...data.books]));
            } else {
                setHasMore(false);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        async function load() {
            const token = await refreshAccessToken();
            if (!token) return;
            const userRes = await fetch(`/api/user/check`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });

            const userData = await userRes.json();
            setUser(userData);
            fetchBooks(userData._id, token, currentPage);
        }

        if (!user) load();
    }, [user]);

    useEffect(() => {
        if (inView && hasMore && !loading && user?._id) {
            const loadMore = async () => {
                const token = await refreshAccessToken();
                await fetchBooks(user._id, token!, currentPage + 1);
                setCurrentPage((p) => p + 1);
            };
            loadMore();
        }
    }, [inView]);

    if (user === null || loading) return <Loading />;

    return (
        <>
            <div className="container py-5">
                {/* Profile Header Section */}
                <section style={{
                    background: "#fff",
                    border: "1px solid #e4e4e7",
                    borderRadius: "20px",
                    padding: "clamp(20px, 4vw, 32px)",
                    marginBottom: "32px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}>
                    <div className="d-flex flex-column flex-md-row align-items-center gap-4">
                        {/* Profile Picture */}
                        <a href={`/profile/${user.username}`}>
                            <div style={{
                                width: "90px",
                                height: "90px",
                                borderRadius: "18px",
                                overflow: "hidden",
                                border: "3px solid #e4e4e7",
                            }}>
                                <img
                                    src={user?.pp || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"}
                                    alt={user.username}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            </div>
                        </a>

                        {/* User Info */}
                        <div className="flex-grow-1 text-center text-md-start">
                            <h2 style={{
                                fontWeight: 700,
                                marginBottom: "8px",
                                fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
                                color: "#18181b",
                            }}>
                                Selamat datang,{" "}
                                <span style={{
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}>
                                    {user.username ? user.username.charAt(0).toUpperCase() + user.username.slice(1) : "Penulis"}
                                </span>
                            </h2>
                            <p style={{ color: "#71717a", margin: 0 }}>
                                Pustaka pribadi cerita dan imajinasimu.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="d-flex gap-2 flex-wrap justify-content-center">
                            <a
                                href="/book/add"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    color: "#fff",
                                    padding: "10px 20px",
                                    borderRadius: "12px",
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                    textDecoration: "none",
                                    transition: "all 0.3s ease",
                                    boxShadow: "0 4px 14px rgba(99, 102, 241, 0.25)",
                                }}
                                onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                                onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                            >
                                <FontAwesomeIcon icon={faPlus} />
                                Cerita Baru
                            </a>
                        </div>
                    </div>
                </section>

                {/* Quick Stats */}
                <div className="row g-3 mb-4">
                    <div className="col-6 col-sm-4 col-md-3">
                        <div style={{
                            background: "#fff",
                            border: "1px solid #e4e4e7",
                            borderRadius: "16px",
                            padding: "16px",
                            textAlign: "center",
                        }}>
                            <div style={{
                                fontSize: "clamp(1.5rem, 4vw, 2rem)",
                                fontWeight: 700,
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}>
                                {books.length}
                            </div>
                            <div style={{ color: "#71717a", fontSize: "0.85rem" }}>Cerita</div>
                        </div>
                    </div>
                </div>

                {/* Books Section */}
                <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 style={{
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            color: "#18181b",
                        }}>
                            <span style={{ fontSize: "1.5rem" }}>📚</span>
                            Ceritamu
                        </h3>
                    </div>

                    {books.length > 0 ? (
                        <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3">
                            {books.map((book) => (
                                <div key={book._id} className="col">
                                    <BookShortcut book={book} isHomePage={true} refreshAccessToken={refreshAccessToken} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            textAlign: "center",
                            padding: "60px 20px",
                            background: "#fafafa",
                            borderRadius: "20px",
                            border: "1px dashed #e4e4e7",
                        }}>
                            <div style={{
                                width: "80px",
                                height: "80px",
                                background: "rgba(99, 102, 241, 0.1)",
                                borderRadius: "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 20px",
                            }}>
                                <FontAwesomeIcon icon={faBook} style={{ fontSize: "2rem", color: "#6366f1" }} />
                            </div>
                            <h4 style={{ marginBottom: "12px", color: "#18181b" }}>Belum ada cerita</h4>
                            <p style={{ color: "#71717a", marginBottom: "24px" }}>
                                Mulai menulis cerita pertamamu!
                            </p>
                            <a
                                href="/book/add"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    color: "#fff",
                                    padding: "12px 24px",
                                    borderRadius: "12px",
                                    fontWeight: 600,
                                    textDecoration: "none",
                                }}
                            >
                                <FontAwesomeIcon icon={faPlus} />
                                Buat Cerita
                            </a>
                        </div>
                    )}
                </div >

                <div ref={ref} className="my-4 text-center">
                    {hasMore && !loading && <Loading />}
                </div>
            </div >

            <Footer />
        </>
    );
}
