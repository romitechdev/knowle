"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import Footer from "@/components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShare, faCodeBranch, faCalendar, faComment, faUser, faArrowLeft, faEdit, faTrash, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useInView } from "react-intersection-observer";

export default function GetBook() {
  const params = useParams();
  const id = params?.id;

  const [book, setBook] = useState<bookType | any>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<commentType[] | any>([]);
  const [newComment, setNewComment] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const { ref, inView } = useInView();
  const [hasMore, setHasMore] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState("");

  const refreshAccessToken = async () => {
    try {
      const existing = sessionStorage.getItem("token");
      if (existing) return existing;

      const res = await fetch("/api/user/refreshToken", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data.token) {
        sessionStorage.setItem("token", data.token);
        return data.token;
      }
      return null;
    } catch {
      return null;
    }
  };

  const fetchBookAndComments = async (page = 1) => {
    try {
      const token = await refreshAccessToken();
      setIsLoggedIn(!!token);

      if (page === 1) {
        setLoading(true);
        const headers: any = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
          // Fetch current user
          const userRes = await fetch("/api/user/check", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (userRes.ok) {
            const userData = await userRes.json();
            setCurrentUser(userData);
          }
        }

        const res = await fetch(`/api/book/get/${id}`, { headers });
        const data = await res.json();
        setBook(data);
      }

      const commentRes = await fetch(`/api/comment/${id}?page=${page}`);
      const commentData = await commentRes.json();

      if (page === 1) setComments(commentData.comments || []);
      else if (commentData.comments) setComments((prev: any) => [...prev, ...commentData.comments]);

      if (!commentData.comments || commentData.comments.length === 0) setHasMore(false);
    } catch (err) {
      console.error(err);
    } finally {
      setCurrentPage(page);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchBookAndComments(1);
  }, [id]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchBookAndComments(currentPage + 1);
    }
  }, [inView, hasMore, loading]);

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }
    const token = await refreshAccessToken();
    const res = await fetch(`/api/comment/post/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comment: newComment }),
    });
    const data = await res.json();
    setComments((prev: any) => [data.comment, ...prev]);
    setNewComment("");
  };

  const handleUpvote = async (commentId: string) => {
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }
    const token = await refreshAccessToken();
    const res = await fetch(`/api/comment/upvote/${commentId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setComments((prev: any) =>
      prev.map((c: any) =>
        c._id === commentId ? { ...c, upvote: data.total } : c
      )
    );
  };

  const handleDeleteBook = async () => {
    if (!confirm("Hapus publikasi ini?")) return;
    const token = await refreshAccessToken();
    const res = await fetch(`/api/book/delete/${book._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      window.location.href = "/book/publish";
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editCommentText.trim()) return;
    const token = await refreshAccessToken();
    const res = await fetch(`/api/comment/edit/${commentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comment: editCommentText }),
    });
    if (res.ok) {
      setComments((prev: any) =>
        prev.map((c: any) =>
          c._id === commentId ? { ...c, comment: editCommentText } : c
        )
      );
      setEditingCommentId(null);
      setEditCommentText("");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Hapus komentar ini?")) return;
    const token = await refreshAccessToken();
    const res = await fetch(`/api/comment/delete/${commentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setComments((prev: any) => prev.filter((c: any) => c._id !== commentId));
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: book?.title, url });
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      alert("Link disalin ke clipboard!");
    }
  };

  function formatTanggal(t: string) {
    if (!t) return "";
    const [bulan, tanggal, tahun] = t.split("/");
    const namaBulan = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember",
    ];
    return `${tanggal} ${namaBulan[parseInt(bulan) - 1]} ${tahun}`;
  }

  if (loading) return <Loading />;
  if (!book) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#64748b" }}>Tidak ditemukan.</p>
    </div>
  );

  const authorUsername = book.user?.username || "unknown";
  const authorName = book.user?.name || book.user?.username || "Anonim";
  const authorPP = book.user?.pp;

  return (
    <>
      {/* Hero Cover */}
      {book.cover && (
        <div style={{
          position: "relative",
          height: "320px",
          background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%), url(${book.cover})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
          <div className="container" style={{ height: "100%", position: "relative" }}>
            <a
              href="/book/publish"
              style={{
                position: "absolute",
                top: "24px",
                left: "0",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(10px)",
                color: "#1e293b",
                padding: "10px 16px",
                borderRadius: "10px",
                fontWeight: 500,
                fontSize: "0.9rem",
                textDecoration: "none",
              }}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Kembali
            </a>
          </div>
        </div>
      )}

      <div className="container" style={{ paddingTop: book.cover ? "0" : "40px", paddingBottom: "40px" }}>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            {/* Article Card */}
            <div style={{
              background: "#fff",
              borderRadius: "24px",
              marginTop: book.cover ? "-80px" : "0",
              position: "relative",
              zIndex: 10,
              border: "1px solid #e2e8f0",
              overflow: "hidden",
            }}>
              {/* Header */}
              <div style={{ padding: "32px 32px 24px" }}>
                {/* Meta */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                }}>
                  {book.tag && (
                    <span style={{
                      background: book.tag === "Question" ? "#fef3c7" : "#eef2ff",
                      color: book.tag === "Question" ? "#d97706" : "#6366f1",
                      padding: "6px 14px",
                      borderRadius: "8px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}>
                      {book.tag === "Question" ? "Tanya Jawab" : "Publikasi"}
                    </span>
                  )}
                  <span style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#94a3b8",
                    fontSize: "0.85rem",
                  }}>
                    <FontAwesomeIcon icon={faCalendar} />
                    {formatTanggal(book.time)}
                  </span>
                </div>

                {/* Title */}
                <h1 style={{
                  fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                  fontWeight: 800,
                  lineHeight: 1.3,
                  marginBottom: "24px",
                  color: "#0f172a",
                }}>
                  {book.title}
                </h1>

                {/* Author Row */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "16px",
                  paddingBottom: "24px",
                  borderBottom: "1px solid #f1f5f9",
                }}>
                  <a
                    href={`/profile/${authorUsername}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      textDecoration: "none",
                    }}
                  >
                    <div style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "14px",
                      overflow: "hidden",
                      background: "#f1f5f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      {authorPP ? (
                        <img
                          src={authorPP}
                          alt={authorName}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <FontAwesomeIcon icon={faUser} style={{ color: "#94a3b8", fontSize: "1.2rem" }} />
                      )}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: "#1e293b", margin: 0, fontSize: "1rem" }}>
                        {authorName}
                      </p>
                      <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.85rem" }}>
                        @{authorUsername}
                      </p>
                    </div>
                  </a>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {/* Owner actions: Edit & Delete */}
                    {isLoggedIn && currentUser && book.user?._id === currentUser._id && (
                      <>
                        <a
                          href={`/book/edit/${book._id}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            background: "#6366f1",
                            color: "#fff",
                            padding: "10px 18px",
                            borderRadius: "10px",
                            fontWeight: 600,
                            fontSize: "0.85rem",
                            textDecoration: "none",
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                          Edit
                        </a>
                        <button
                          onClick={handleDeleteBook}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            background: "#fef2f2",
                            border: "1px solid #fecaca",
                            color: "#dc2626",
                            padding: "10px 18px",
                            borderRadius: "10px",
                            fontWeight: 600,
                            fontSize: "0.85rem",
                            cursor: "pointer",
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                          Hapus
                        </button>
                      </>
                    )}
                    {/* Fork for non-owners */}
                    {isLoggedIn && currentUser && book.user?._id !== currentUser._id && (
                      <a
                        href={`/book/edit/${book._id}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          background: "#6366f1",
                          color: "#fff",
                          padding: "10px 18px",
                          borderRadius: "10px",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          textDecoration: "none",
                        }}
                      >
                        <FontAwesomeIcon icon={faCodeBranch} />
                        Fork
                      </a>
                    )}
                    <button
                      onClick={handleShare}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        color: "#64748b",
                        padding: "10px 18px",
                        borderRadius: "10px",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        cursor: "pointer",
                      }}
                    >
                      <FontAwesomeIcon icon={faShare} />
                      Bagikan
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: "0 32px 32px" }}>
                <article
                  style={{
                    fontSize: "1.1rem",
                    lineHeight: 1.85,
                    color: "#334155",
                  }}
                  className="article-content"
                  dangerouslySetInnerHTML={{ __html: book.notes }}
                />
              </div>
            </div>

            {/* Comments Section */}
            <div style={{
              background: "#fff",
              borderRadius: "24px",
              border: "1px solid #e2e8f0",
              marginTop: "24px",
              overflow: "hidden",
            }}>
              <div style={{
                padding: "24px 32px",
                borderBottom: "1px solid #f1f5f9",
              }}>
                <h3 style={{
                  fontWeight: 700,
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "#1e293b",
                  fontSize: "1.1rem",
                }}>
                  <FontAwesomeIcon icon={faComment} style={{ color: "#6366f1" }} />
                  Komentar ({comments?.length || 0})
                </h3>
              </div>

              <div style={{ padding: "24px 32px" }}>
                {/* Comment Input */}
                {isLoggedIn ? (
                  <div style={{ marginBottom: "24px" }}>
                    <textarea
                      placeholder="Tulis komentar..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      style={{
                        width: "100%",
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "14px",
                        padding: "16px",
                        color: "#1e293b",
                        fontSize: "0.95rem",
                        resize: "none",
                        height: "100px",
                        outline: "none",
                      }}
                    />
                    <div style={{ textAlign: "right", marginTop: "12px" }}>
                      <button
                        onClick={handlePostComment}
                        style={{
                          background: "#6366f1",
                          border: "none",
                          color: "#fff",
                          padding: "12px 28px",
                          borderRadius: "10px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Kirim
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    textAlign: "center",
                    padding: "32px",
                    background: "#f8fafc",
                    borderRadius: "16px",
                    marginBottom: "24px",
                  }}>
                    <p style={{ color: "#64748b", marginBottom: "16px" }}>
                      Masuk untuk berkomentar
                    </p>
                    <a
                      href="/login"
                      style={{
                        display: "inline-block",
                        background: "#6366f1",
                        color: "#fff",
                        padding: "12px 28px",
                        borderRadius: "10px",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Masuk
                    </a>
                  </div>
                )}

                {/* Comment List */}
                {comments?.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {comments.map((c: any) => (
                      <div
                        key={c._id}
                        style={{
                          background: "#f8fafc",
                          borderRadius: "16px",
                          padding: "20px",
                        }}
                      >
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "16px",
                        }}>
                          <div style={{ display: "flex", gap: "12px", flex: 1 }}>
                            <div style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "12px",
                              overflow: "hidden",
                              background: "#e2e8f0",
                              flexShrink: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}>
                              {c.user?.pp ? (
                                <img
                                  src={c.user.pp}
                                  alt={c.user?.username || "user"}
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                              ) : (
                                <FontAwesomeIcon icon={faUser} style={{ color: "#94a3b8" }} />
                              )}
                            </div>
                            <div style={{ flex: 1 }}>
                              <a
                                href={`/profile/${c.user?.username || "unknown"}`}
                                style={{
                                  fontWeight: 600,
                                  color: "#1e293b",
                                  textDecoration: "none",
                                  fontSize: "0.95rem",
                                }}
                              >
                                {c.user?.name || c.user?.username || "Anonim"}
                              </a>
                              {editingCommentId === c._id ? (
                                <div style={{ marginTop: "8px" }}>
                                  <textarea
                                    value={editCommentText}
                                    onChange={(e) => setEditCommentText(e.target.value)}
                                    style={{
                                      width: "100%",
                                      background: "#fff",
                                      border: "1px solid #e2e8f0",
                                      borderRadius: "8px",
                                      padding: "10px",
                                      fontSize: "0.95rem",
                                      resize: "none",
                                      minHeight: "60px",
                                      outline: "none",
                                    }}
                                  />
                                  <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                                    <button
                                      onClick={() => handleEditComment(c._id)}
                                      style={{
                                        background: "#10b981",
                                        border: "none",
                                        color: "#fff",
                                        padding: "6px 12px",
                                        borderRadius: "6px",
                                        fontSize: "0.8rem",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faCheck} />
                                      Simpan
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingCommentId(null);
                                        setEditCommentText("");
                                      }}
                                      style={{
                                        background: "#f1f5f9",
                                        border: "1px solid #e2e8f0",
                                        color: "#64748b",
                                        padding: "6px 12px",
                                        borderRadius: "6px",
                                        fontSize: "0.8rem",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faTimes} />
                                      Batal
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <p style={{
                                  color: "#475569",
                                  marginTop: "8px",
                                  marginBottom: 0,
                                  fontSize: "0.95rem",
                                  lineHeight: 1.6,
                                }}>
                                  {c.comment}
                                </p>
                              )}
                            </div>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
                            <button
                              onClick={() => handleUpvote(c._id)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                background: "#fff",
                                border: "1px solid #fecaca",
                                color: "#ef4444",
                                padding: "8px 14px",
                                borderRadius: "10px",
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              <FontAwesomeIcon icon={faHeart} />
                              {c.upvote?.length || 0}
                            </button>
                            {/* Comment owner actions */}
                            {currentUser && c.user?._id === currentUser._id && editingCommentId !== c._id && (
                              <div style={{ display: "flex", gap: "4px" }}>
                                <button
                                  onClick={() => {
                                    setEditingCommentId(c._id);
                                    setEditCommentText(c.comment);
                                  }}
                                  style={{
                                    background: "#f1f5f9",
                                    border: "1px solid #e2e8f0",
                                    color: "#6366f1",
                                    padding: "6px 10px",
                                    borderRadius: "6px",
                                    fontSize: "0.75rem",
                                    cursor: "pointer",
                                  }}
                                  title="Edit"
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button
                                  onClick={() => handleDeleteComment(c._id)}
                                  style={{
                                    background: "#fef2f2",
                                    border: "1px solid #fecaca",
                                    color: "#dc2626",
                                    padding: "6px 10px",
                                    borderRadius: "6px",
                                    fontSize: "0.75rem",
                                    cursor: "pointer",
                                  }}
                                  title="Hapus"
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "#94a3b8", textAlign: "center", padding: "20px" }}>
                    Belum ada komentar.
                  </p>
                )}
                <div ref={ref}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
                .article-content h1,
                .article-content h2,
                .article-content h3,
                .article-content h4 {
                    color: #0f172a;
                    margin-top: 1.5em;
                    margin-bottom: 0.5em;
                    font-weight: 700;
                }
                .article-content p {
                    margin-bottom: 1.25em;
                }
                .article-content img {
                    max-width: 100%;
                    width: auto;
                    height: auto;
                    display: block;
                    border-radius: 12px;
                    margin: 1.5em auto;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                .article-content p img {
                    display: inline-block;
                    margin: 0.5em 0;
                }
                .article-content a {
                    color: #6366f1;
                }
                .article-content blockquote {
                    border-left: 4px solid #6366f1;
                    padding-left: 1em;
                    margin-left: 0;
                    color: #64748b;
                    font-style: italic;
                }
                .article-content pre {
                    background: #1e293b;
                    color: #e2e8f0;
                    padding: 1em;
                    border-radius: 12px;
                    overflow-x: auto;
                }
                .article-content code {
                    background: #f1f5f9;
                    padding: 0.2em 0.4em;
                    border-radius: 4px;
                    font-size: 0.9em;
                }
                .article-content ul,
                .article-content ol {
                    padding-left: 1.5em;
                    margin-bottom: 1.25em;
                }
                .article-content li {
                    margin-bottom: 0.5em;
                }
                .article-content iframe,
                .article-content video {
                    max-width: 100%;
                    border-radius: 12px;
                    margin: 1em 0;
                }
            `}</style>

      <Footer />
    </>
  );
}
