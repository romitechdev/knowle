"use client";
import { faSearch, faBars, faTimes, faPenNib, faUser, faGlobe, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState("");
    const [username, setUsername] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const router = useRouter();
    const pathname = usePathname();
    const isLanding = pathname === "/";
    const isAuthPage = pathname === "/login" || pathname === "/signup";

    // Hide navbar on auth pages
    if (isAuthPage) return null;

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
        } catch {
            return null;
        }
    };

    async function fetchUserData() {
        const tokenTemp = await refreshAccessToken();
        if (!tokenTemp) return;
        const res = await fetch(`/api/user/check`, {
            method: "POST",
            headers: { Authorization: `Bearer ${tokenTemp}` },
        });
        if (!res.ok) return;
        const check = await res.json();
        setUsername(check.username);
    }

    useEffect(() => {
        setCurrentPage(pathname || "");
        fetchUserData();

        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [pathname]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) router.push(`/search/${encodeURIComponent(search)}`);
    };

    return (
        <nav style={{
            background: scrolled ? "rgba(255, 255, 255, 0.98)" : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderBottom: scrolled ? "1px solid #e2e8f0" : "1px solid transparent",
            padding: "12px 0",
            position: "sticky",
            top: 0,
            zIndex: 1000,
            transition: "all 0.3s ease",
            boxShadow: scrolled ? "0 1px 3px rgba(0,0,0,0.04)" : "none",
        }}>
            <div className="container">
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "24px",
                }}>
                    {/* Brand with Logo */}
                    <a href={isLanding ? "/" : "/home"} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        textDecoration: "none",
                    }}>
                        <img
                            src="/logo.png"
                            alt="Knowle"
                            style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "10px",
                            }}
                        />
                        <span style={{
                            fontWeight: 700,
                            fontSize: "1.3rem",
                            color: "#6366f1",
                        }}>
                            Knowle
                        </span>
                    </a>

                    {/* Desktop Navigation - Always visible */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }} className="d-none d-md-flex">
                        <a
                            href="/book/publish"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "8px 16px",
                                borderRadius: "8px",
                                color: currentPage === "/book/publish" ? "#6366f1" : "#64748b",
                                background: currentPage === "/book/publish" ? "#eef2ff" : "transparent",
                                fontWeight: 500,
                                textDecoration: "none",
                                transition: "all 0.2s ease",
                            }}
                        >
                            <FontAwesomeIcon icon={faGlobe} />
                            Jelajahi
                        </a>
                        <a
                            href="/book/questions"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "8px 16px",
                                borderRadius: "8px",
                                color: currentPage === "/book/questions" ? "#6366f1" : "#64748b",
                                background: currentPage === "/book/questions" ? "#eef2ff" : "transparent",
                                fontWeight: 500,
                                textDecoration: "none",
                                transition: "all 0.2s ease",
                            }}
                        >
                            <FontAwesomeIcon icon={faQuestionCircle} />
                            Tanya Jawab
                        </a>
                        <a
                            href="/book/add"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "8px 16px",
                                borderRadius: "8px",
                                color: currentPage === "/book/add" ? "#6366f1" : "#64748b",
                                background: currentPage === "/book/add" ? "#eef2ff" : "transparent",
                                fontWeight: 500,
                                textDecoration: "none",
                                transition: "all 0.2s ease",
                            }}
                        >
                            <FontAwesomeIcon icon={faPenNib} />
                            Tulis
                        </a>
                    </div>

                    {/* Search Bar - only on non-landing */}
                    {!isLanding && (
                        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: "300px" }} className="d-none d-lg-block">
                            <div style={{ position: "relative" }}>
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    style={{
                                        position: "absolute",
                                        left: "14px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#94a3b8",
                                    }}
                                />
                                <input
                                    type="text"
                                    placeholder="Cari..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "10px 16px 10px 42px",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "10px",
                                        fontSize: "0.9rem",
                                        background: "#f8fafc",
                                        color: "#1e293b",
                                        outline: "none",
                                    }}
                                />
                            </div>
                        </form>
                    )}

                    {/* Right Actions */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        {username ? (
                            <a
                                href={`/profile/${username}`}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    padding: "8px 16px",
                                    borderRadius: "8px",
                                    color: "#64748b",
                                    textDecoration: "none",
                                    fontWeight: 500,
                                }}
                                className="d-none d-md-flex"
                            >
                                <FontAwesomeIcon icon={faUser} />
                                Profil
                            </a>
                        ) : (
                            <a
                                href="/login"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    background: "#6366f1",
                                    color: "#fff",
                                    padding: "10px 20px",
                                    borderRadius: "10px",
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                    textDecoration: "none",
                                }}
                                className="d-none d-md-flex"
                            >
                                Masuk
                            </a>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            className="d-md-none"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            style={{
                                background: "transparent",
                                border: "none",
                                padding: "8px",
                                color: "#64748b",
                                cursor: "pointer",
                            }}
                        >
                            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} style={{ fontSize: "1.2rem" }} />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div style={{
                        padding: "16px 0",
                        borderTop: "1px solid #e2e8f0",
                        marginTop: "12px",
                    }} className="d-md-none">
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <a href="/book/publish" style={{ padding: "12px", borderRadius: "8px", color: "#64748b", textDecoration: "none", fontWeight: 500 }}>
                                <FontAwesomeIcon icon={faGlobe} style={{ marginRight: "10px" }} />
                                Jelajahi
                            </a>
                            <a href="/book/questions" style={{ padding: "12px", borderRadius: "8px", color: "#64748b", textDecoration: "none", fontWeight: 500 }}>
                                <FontAwesomeIcon icon={faQuestionCircle} style={{ marginRight: "10px" }} />
                                Tanya Jawab
                            </a>
                            <a href="/book/add" style={{ padding: "12px", borderRadius: "8px", color: "#64748b", textDecoration: "none", fontWeight: 500 }}>
                                <FontAwesomeIcon icon={faPenNib} style={{ marginRight: "10px" }} />
                                Tulis
                            </a>
                            {username ? (
                                <a href={`/profile/${username}`} style={{ padding: "12px", borderRadius: "8px", color: "#64748b", textDecoration: "none", fontWeight: 500 }}>
                                    <FontAwesomeIcon icon={faUser} style={{ marginRight: "10px" }} />
                                    Profil
                                </a>
                            ) : (
                                <a href="/login" style={{ padding: "12px", borderRadius: "8px", color: "#6366f1", textDecoration: "none", fontWeight: 600 }}>
                                    Masuk
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
