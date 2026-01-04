"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";

interface BookShortcutProps {
  book: bookType;
  isHomePage?: boolean;
  refreshAccessToken: () => Promise<string | null | undefined>;
}

export default function BookShortcut({ book, isHomePage = false, refreshAccessToken }: BookShortcutProps) {
  const coverPlaceholders = [
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=300&fit=crop",
  ];

  const randomCover = coverPlaceholders[Math.floor(Math.random() * coverPlaceholders.length)];

  const handleDelete = async () => {
    if (!confirm("Hapus publikasi ini?")) return;
    const token = await refreshAccessToken();
    if (!token) return;
    await fetch(`/api/book/delete/${book._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    window.location.reload();
  };

  return (
    <div style={{
      background: "#fff",
      borderRadius: "12px",
      overflow: "hidden",
      border: "1px solid #e2e8f0",
      transition: "all 0.3s ease",
      height: "100%",
      display: "flex",
      flexDirection: "column",
    }}
      onMouseOver={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 16px rgba(0,0,0,0.06)";
      }}
      onMouseOut={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* Cover Image */}
      <a href={`/book/${book._id}`} style={{ textDecoration: "none" }}>
        <div style={{
          position: "relative",
          paddingTop: "55%",
          overflow: "hidden",
          background: "#f1f5f9",
        }}>
          <img
            src={book.cover || randomCover}
            alt={book.title}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {/* Tag Badge */}
          {book.tag && (
            <span style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              background: book.tag === "Question" ? "#fef3c7" : "#eef2ff",
              color: book.tag === "Question" ? "#d97706" : "#6366f1",
              padding: "3px 8px",
              borderRadius: "4px",
              fontSize: "0.65rem",
              fontWeight: 600,
              textTransform: "uppercase",
            }}>
              {book.tag === "Question" ? "Tanya" : "Publik"}
            </span>
          )}
        </div>
      </a>

      {/* Content */}
      <div style={{
        padding: "10px 12px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}>
        {/* Title */}
        <a
          href={`/book/${book._id}`}
          style={{
            textDecoration: "none",
            color: "#1e293b",
            fontWeight: 600,
            fontSize: "0.85rem",
            lineHeight: 1.35,
            marginBottom: "8px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            wordBreak: "break-word",
          }}
        >
          {book.title}
        </a>

        {/* Author */}
        <a
          href={`/profile/${book.user.username}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            textDecoration: "none",
            marginTop: "auto",
          }}
        >
          <div style={{
            width: "22px",
            height: "22px",
            borderRadius: "6px",
            overflow: "hidden",
            background: "#f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            {book.user.pp ? (
              <img
                src={book.user.pp}
                alt={book.user.username}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <FontAwesomeIcon icon={faUser} style={{ color: "#94a3b8", fontSize: "0.6rem" }} />
            )}
          </div>
          <span style={{
            color: "#64748b",
            fontSize: "0.75rem",
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {book.user.name || book.user.username}
          </span>
        </a>
      </div>

      {/* Actions Footer */}
      <div style={{
        padding: "8px 10px",
        borderTop: "1px solid #f1f5f9",
        display: "flex",
        gap: "6px",
      }}>
        <a
          href={`/book/${book._id}`}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            background: "#6366f1",
            color: "#fff",
            padding: "8px 6px",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "0.75rem",
            textDecoration: "none",
          }}
        >
          <FontAwesomeIcon icon={faEye} style={{ fontSize: "0.7rem" }} />
          Baca
        </a>

        {isHomePage && (
          <button
            onClick={handleDelete}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              padding: "8px 10px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.7rem",
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        )}
      </div>
    </div>
  );
}
