"use client";
import BookShortcut from "@/components/Bookshortcut";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSignOutAlt, faBook } from "@fortawesome/free-solid-svg-icons";

export default function ProfilePage() {
  const params = useParams();
  const username = params?.username;

  const [user, setUser] = useState<userType | null>(null);
  const [seeUser, setSeeUser] = useState<userType | null>(null);
  const [books, setBooks] = useState<bookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  const refreshAccessToken = async () => {
    try {
      if (sessionStorage.getItem("token")) return sessionStorage.getItem("token");
      const response = await fetch("/api/user/refreshToken", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) return (window.location.href = "/login");
      const data = await response.json();
      if (!data.token) window.location.href = "/login";
      sessionStorage.setItem("token", data.token);
      return data.token;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    async function fetchUserData() {
      try {
        const tokenTemp = await refreshAccessToken();
        if (!tokenTemp) return;

        const response = await fetch(`/api/user/check`, {
          method: "POST",
          headers: { Authorization: `Bearer ${tokenTemp}` },
        });
        if (!response.ok) return;

        const check = await response.json();
        setUser(check);

        const fetchUser = await fetch(`/api/user/get/${username}`);
        const userFetch = await fetchUser.json();
        setSeeUser(userFetch);

        fetchBooks(userFetch._id, tokenTemp, currentPage);
      } catch {
        setUser(null);
      }
    }

    if (user === null) fetchUserData();
  }, [user, currentPage]);

  async function fetchBooks(userId: string, token: string, page: number) {
    try {
      const res = await fetch(`/api/book/get/noPrivate/${userId}?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.books.length > 0) {
        setBooks((prev) => (page === 1 ? data.books : [...prev, ...data.books]));
      } else {
        setHasMore(false);
      }
    } catch {
      return;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (inView && hasMore && !loading && seeUser?._id) {
      const loadMore = async () => {
        const token = await refreshAccessToken();
        await fetchBooks(seeUser._id, token!, currentPage + 1);
        setCurrentPage((p) => p + 1);
      };
      loadMore();
    }
  }, [inView]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/user/logout", { method: "DELETE" });
      if (response.ok) {
        sessionStorage.clear();
        window.location.href = "/";
      }
    } catch { }
  };

  if (seeUser === null || loading) return <Loading />;

  const isOwnProfile = seeUser?._id === user?._id;

  return (
    <>
      <div className="container py-5">
        {/* Profile Header */}
        <section style={{
          background: "linear-gradient(135deg, #fafafa 0%, #f4f4f5 100%)",
          border: "1px solid #e4e4e7",
          borderRadius: "clamp(16px, 3vw, 24px)",
          padding: "clamp(20px, 4vw, 40px)",
          marginBottom: "clamp(24px, 4vw, 40px)",
        }}>
          <div className="d-flex flex-column flex-md-row align-items-center gap-4">
            {/* Profile Picture */}
            <div style={{
              width: "clamp(80px, 15vw, 110px)",
              height: "clamp(80px, 15vw, 110px)",
              borderRadius: "clamp(16px, 3vw, 22px)",
              overflow: "hidden",
              border: "3px solid #fff",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              flexShrink: 0,
            }}>
              <img
                src={seeUser?.pp || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"}
                alt={seeUser?.username}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* User Info */}
            <div className="flex-grow-1 text-center text-md-start">
              <h1 style={{
                fontWeight: 700,
                marginBottom: "8px",
                fontSize: "clamp(1.3rem, 4vw, 1.8rem)",
                color: "#18181b",
              }}>
                {seeUser?.name ||
                  (seeUser?.username.charAt(0).toUpperCase() +
                    seeUser?.username.slice(1))}
              </h1>
              <p style={{
                color: "#71717a",
                marginBottom: "12px",
                fontSize: "1rem",
              }}>
                @{seeUser?.username}
              </p>
              <div
                style={{
                  color: "#52525b",
                  fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
                  lineHeight: 1.6,
                }}
                dangerouslySetInnerHTML={{
                  __html: seeUser?.desc || "<em>Belum ada deskripsi.</em>",
                }}
              />
            </div>

            {/* Action Buttons */}
            {isOwnProfile && (
              <div className="d-flex gap-2 flex-wrap justify-content-center" style={{ marginTop: "8px" }}>
                <a
                  href="/edit"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "#fff",
                    padding: "10px 18px",
                    borderRadius: "10px",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 14px rgba(99, 102, 241, 0.25)",
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <FontAwesomeIcon icon={faEdit} />
                  Edit
                </a>
                <button
                  onClick={handleLogout}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#fff",
                    color: "#dc2626",
                    padding: "10px 18px",
                    borderRadius: "10px",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    border: "1px solid #fecaca",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = "#fef2f2"}
                  onMouseOut={(e) => e.currentTarget.style.background = "#fff"}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  Keluar
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Books Section */}
        <div style={{
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid #e4e4e7",
          padding: "clamp(16px, 3vw, 24px)",
        }}>
          {/* Section Header with Stats */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "20px",
            paddingBottom: "16px",
            borderBottom: "1px solid #f1f5f9",
          }}>
            <h3 style={{
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#18181b",
              fontSize: "clamp(1rem, 3vw, 1.2rem)",
              margin: 0,
            }}>
              <span style={{ fontSize: "1.3rem" }}>📚</span>
              {isOwnProfile ? "Ceritamu" : "Cerita Terbit"}
            </h3>
            <span style={{
              background: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)",
              color: "#6366f1",
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}>
              {books.length} Cerita
            </span>
          </div>

          {/* Books Grid */}
          {books.length > 0 ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
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
              <p style={{ color: "#71717a" }}>
                {isOwnProfile
                  ? "Mulai menulis cerita pertamamu!"
                  : "Pengguna ini belum menerbitkan cerita."}
              </p>
            </div>
          )}
        </div>

        <div ref={ref} className="my-4 text-center">
          {hasMore && !loading && <Loading />}
        </div>
      </div>

      <Footer />
    </>
  );
}
