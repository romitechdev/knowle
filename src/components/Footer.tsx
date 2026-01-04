import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const Footer: React.FC = () => {
  return (
    <footer style={{
      background: "#f8fafc",
      borderTop: "1px solid #e2e8f0",
      padding: "32px 0",
    }}>
      <div className="container">
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          textAlign: "center",
        }}>
          {/* Logo & Name */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}>
            <img
              src="/logo.png"
              alt="Knowle"
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
              }}
            />
            <span style={{
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "#6366f1",
            }}>
              Knowle
            </span>
          </div>

          {/* Links */}
          <div style={{
            display: "flex",
            gap: "24px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}>
            <a href="/book/publish" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.9rem" }}>
              Jelajahi
            </a>
            <a href="/book/questions" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.9rem" }}>
              Tanya Jawab
            </a>
            <a href="/book/add" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.9rem" }}>
              Tulis
            </a>
          </div>

          {/* Copyright */}
          <p style={{
            color: "#94a3b8",
            fontSize: "0.85rem",
            margin: 0,
          }}>
            Made with <FontAwesomeIcon icon={faHeart} style={{ color: "#f43f5e" }} /> by{" "}
            <span style={{ fontWeight: 600, color: "#6366f1" }}>Romi</span>
            {" "}• © {new Date().getFullYear()} Knowle
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
