"use client";
import Loading from "@/components/Loading";
import Footer from "@/components/Footer";
import { useEffect, useState, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faBook, faUser, faEye, faCalendar } from "@fortawesome/free-solid-svg-icons";

export default function PublishPage() {
    const [posts, setPosts] = useState<bookType[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const { ref, inView } = useInView();
    const pageRef = useRef(1);

    async function fetchPosts(page: number, isInitial = false) {
        if (!isInitial && loadingMore) return;

        if (!isInitial) setLoadingMore(true);

        try {
            const response = await fetch(`/api/book/get/publish?page=${page}&limit=12`);
            const data = await response.json();

            if (data.books && data.books.length > 0) {
                if (page === 1) {
                    setPosts(data.books);
                } else {
                    setPosts((prev) => {
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
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }

    useEffect(() => {
        fetchPosts(1, true);
    }, []);

    useEffect(() => {
        if (inView && hasMore && !loading && !loadingMore) {
            fetchPosts(pageRef.current + 1);
        }
    }, [inView, hasMore, loading, loadingMore]);

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            {/* Clean Header */}
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
                        marginBottom: "8px",
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
                            <FontAwesomeIcon icon={faGlobe} style={{ color: "#6366f1", fontSize: "1rem" }} />
                        </div>
                        <div>
                            <h1 style={{
                                fontSize: "1.5rem",
                                fontWeight: 700,
                                color: "#0f172a",
                                margin: 0,
                            }}>
                                Jelajahi
                            </h1>
                            <p style={{ color: "#64748b", fontSize: "0.9rem", margin: 0 }}>
                                Temukan pengetahuan dari komunitas
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ background: "#f8fafc", minHeight: "60vh" }}>
                <div className="container py-4">
                    {posts.length > 0 ? (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))",
                            gap: "20px",
                        }}>
                            {posts.map((post) => (
                                <a
                                    key={post._id}
                                    href={`/book/${post._id}`}
                                    style={{
                                        textDecoration: "none",
                                        display: "block",
                                    }}
                                >
                                    <article style={{
                                        background: "#fff",
                                        borderRadius: "20px",
                                        overflow: "hidden",
                                        border: "1px solid rgba(0,0,0,0.06)",
                                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                        height: "100%",
                                        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                                    }}
                                        onMouseOver={(e) => {
                                            (e.currentTarget as HTMLElement).style.transform = "translateY(-6px) scale(1.01)";
                                            (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 40px rgba(99,102,241,0.15)";
                                        }}
                                        onMouseOut={(e) => {
                                            (e.currentTarget as HTMLElement).style.transform = "translateY(0) scale(1)";
                                            (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.04)";
                                        }}
                                    >
                                        {/* Cover with Gradient Overlay */}
                                        <div style={{
                                            position: "relative",
                                            height: post.cover ? "180px" : "120px",
                                            overflow: "hidden",
                                            background: post.cover ? "#f1f5f9" : "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
                                        }}>
                                            {post.cover && (
                                                <>
                                                    <img
                                                        src={post.cover}
                                                        alt={post.title}
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                            transition: "transform 0.4s ease",
                                                        }}
                                                    />
                                                    <div style={{
                                                        position: "absolute",
                                                        bottom: 0,
                                                        left: 0,
                                                        right: 0,
                                                        height: "60%",
                                                        background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)",
                                                    }} />
                                                </>
                                            )}

                                            {/* Floating Badge */}
                                            <div style={{
                                                position: "absolute",
                                                top: "12px",
                                                right: "12px",
                                                background: "rgba(255,255,255,0.95)",
                                                backdropFilter: "blur(10px)",
                                                padding: "6px 12px",
                                                borderRadius: "20px",
                                                fontSize: "0.75rem",
                                                fontWeight: 600,
                                                color: "#6366f1",
                                                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                                            }}>
                                                📖 Publikasi
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div style={{ padding: "20px" }}>
                                            {/* Title */}
                                            <h2 style={{
                                                fontSize: "1.1rem",
                                                fontWeight: 700,
                                                color: "#0f172a",
                                                lineHeight: 1.4,
                                                marginBottom: "16px",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                            }}>
                                                {post.title}
                                            </h2>

                                            {/* Author Row */}
                                            <div style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                gap: "12px",
                                            }}>
                                                <div style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                }}>
                                                    <div style={{
                                                        width: "36px",
                                                        height: "36px",
                                                        borderRadius: "12px",
                                                        overflow: "hidden",
                                                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        flexShrink: 0,
                                                        border: "2px solid #fff",
                                                        boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
                                                    }}>
                                                        {post.user?.pp ? (
                                                            <img
                                                                src={post.user.pp}
                                                                alt={post.user.username || "user"}
                                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                            />
                                                        ) : (
                                                            <FontAwesomeIcon icon={faUser} style={{ color: "#fff", fontSize: "0.85rem" }} />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span style={{
                                                            display: "block",
                                                            color: "#1e293b",
                                                            fontSize: "0.9rem",
                                                            fontWeight: 600,
                                                        }}>
                                                            {post.user?.name || post.user?.username || "Anonim"}
                                                        </span>
                                                        <span style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "4px",
                                                            color: "#94a3b8",
                                                            fontSize: "0.8rem",
                                                        }}>
                                                            <FontAwesomeIcon icon={faCalendar} />
                                                            {post.time}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Read Button */}
                                                <div style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                    color: "#fff",
                                                    padding: "8px 14px",
                                                    borderRadius: "10px",
                                                    fontSize: "0.8rem",
                                                    fontWeight: 600,
                                                }}>
                                                    <FontAwesomeIcon icon={faEye} />
                                                    Baca
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            textAlign: "center",
                            padding: "80px 20px",
                            background: "#fff",
                            borderRadius: "20px",
                            border: "1px solid #e2e8f0",
                        }}>
                            <div style={{
                                width: "64px",
                                height: "64px",
                                background: "#eef2ff",
                                borderRadius: "16px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 20px",
                            }}>
                                <FontAwesomeIcon icon={faBook} style={{ fontSize: "1.5rem", color: "#6366f1" }} />
                            </div>
                            <h3 style={{ fontWeight: 600, marginBottom: "8px", color: "#1e293b" }}>
                                Belum ada publikasi
                            </h3>
                            <p style={{ color: "#64748b", marginBottom: "20px" }}>
                                Jadilah yang pertama berbagi pengetahuan!
                            </p>
                            <a
                                href="/book/add"
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
                                Tulis Sekarang
                            </a>
                        </div>
                    )}

                    {/* Load More */}
                    {hasMore && posts.length > 0 && (
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
