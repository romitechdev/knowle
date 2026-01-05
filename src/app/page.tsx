"use client";

import Footer from "@/components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenNib, faBookOpen, faUsers, faLightbulb, faArrowRight, faCheck,
  faQuoteLeft, faGlobe, faComments, faHeart, faStar, faRocket
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export default function Homepage() {
  const [stats, setStats] = useState({ books: 0, users: 0, questions: 0 });

  // Animate stats on load
  useEffect(() => {
    const animateValue = (start: number, end: number, duration: number, setter: (v: number) => void) => {
      const increment = end / (duration / 16);
      let current = start;
      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setter(end);
          clearInterval(timer);
        } else {
          setter(Math.floor(current));
        }
      }, 16);
    };

    setTimeout(() => {
      animateValue(0, 500, 2000, (v) => setStats(s => ({ ...s, books: v })));
      animateValue(0, 1200, 2000, (v) => setStats(s => ({ ...s, users: v })));
      animateValue(0, 250, 2000, (v) => setStats(s => ({ ...s, questions: v })));
    }, 500);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(180deg, #fff 0%, #f8fafc 100%)",
        paddingTop: "clamp(40px, 8vw, 80px)",
        paddingBottom: "clamp(40px, 8vw, 80px)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative Elements */}
        <div style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
          top: "-100px",
          right: "-100px",
          borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)",
          bottom: "100px",
          left: "-50px",
          borderRadius: "50%",
        }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            maxWidth: "800px",
            margin: "0 auto",
            textAlign: "center",
          }}>
            {/* Badge */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "linear-gradient(135deg, #eef2ff 0%, #faf5ff 100%)",
              padding: "10px 20px",
              borderRadius: "50px",
              marginBottom: "28px",
              border: "1px solid rgba(99,102,241,0.2)",
            }}>
              <FontAwesomeIcon icon={faRocket} style={{ color: "#6366f1", fontSize: "0.9rem" }} />
              <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#6366f1" }}>
                Platform Berbagi Pengetahuan #1 Indonesia
              </span>
            </div>

            {/* Heading */}
            <h1 style={{
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: "28px",
              color: "#0f172a",
              letterSpacing: "-0.03em",
            }}>
              Tulis, Bagikan,{" "}
              <span style={{
                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
              }}>
                Inspirasi Dunia
              </span>
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
              color: "#64748b",
              lineHeight: 1.7,
              marginBottom: "40px",
              maxWidth: "600px",
              margin: "0 auto 40px",
            }}>
              Knowle adalah rumah bagi para penulis, pemikir, dan pembelajar.
              Bagikan pengetahuanmu secara gratis dan temukan insight baru setiap hari.
            </p>

            {/* CTA Buttons */}
            <div style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: "60px",
            }}>
              <a
                href="/signup"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "#fff",
                  padding: "18px 36px",
                  borderRadius: "16px",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  textDecoration: "none",
                  boxShadow: "0 8px 30px rgba(99,102,241,0.3)",
                  transition: "all 0.3s ease",
                }}
              >
                <FontAwesomeIcon icon={faPenNib} />
                Mulai Menulis Gratis
                <FontAwesomeIcon icon={faArrowRight} />
              </a>
              <a
                href="/book/publish"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "#fff",
                  color: "#475569",
                  padding: "18px 36px",
                  borderRadius: "16px",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  textDecoration: "none",
                  border: "2px solid #e2e8f0",
                  transition: "all 0.3s ease",
                }}
              >
                <FontAwesomeIcon icon={faGlobe} />
                Jelajahi Konten
              </a>
            </div>

            {/* Stats */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "clamp(32px, 6vw, 64px)",
              flexWrap: "wrap",
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{
                  fontSize: "clamp(2rem, 4vw, 2.5rem)",
                  fontWeight: 800,
                  color: "#6366f1",
                  lineHeight: 1,
                }}>
                  {stats.books}+
                </div>
                <div style={{ color: "#64748b", fontSize: "0.95rem", marginTop: "4px" }}>
                  Artikel Dipublikasi
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{
                  fontSize: "clamp(2rem, 4vw, 2.5rem)",
                  fontWeight: 800,
                  color: "#a855f7",
                  lineHeight: 1,
                }}>
                  {stats.users}+
                </div>
                <div style={{ color: "#64748b", fontSize: "0.95rem", marginTop: "4px" }}>
                  Penulis Aktif
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{
                  fontSize: "clamp(2rem, 4vw, 2.5rem)",
                  fontWeight: 800,
                  color: "#f59e0b",
                  lineHeight: 1,
                }}>
                  {stats.questions}+
                </div>
                <div style={{ color: "#64748b", fontSize: "0.95rem", marginTop: "4px" }}>
                  Diskusi Aktif
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Can You Do Section */}
      <section style={{
        padding: "clamp(48px, 8vw, 100px) 0",
        background: "#fff",
      }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <span style={{
              display: "inline-block",
              background: "#eef2ff",
              color: "#6366f1",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: 600,
              marginBottom: "16px",
            }}>
              FITUR UNGGULAN
            </span>
            <h2 style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: "16px",
            }}>
              Apa yang Bisa Kamu Lakukan?
            </h2>
            <p style={{
              color: "#64748b",
              fontSize: "1.15rem",
              maxWidth: "550px",
              margin: "0 auto",
            }}>
              Knowle memberikan ruang untuk berbagi dan belajar bersama
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}>
            {/* Feature Card 1 */}
            <div style={{
              background: "linear-gradient(135deg, #f8fafc 0%, #fff 100%)",
              borderRadius: "24px",
              padding: "36px",
              border: "1px solid #e2e8f0",
              transition: "all 0.3s ease",
            }}>
              <div style={{
                width: "72px",
                height: "72px",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "24px",
                boxShadow: "0 8px 24px rgba(99,102,241,0.25)",
              }}>
                <FontAwesomeIcon icon={faPenNib} style={{ color: "#fff", fontSize: "1.8rem" }} />
              </div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#0f172a", marginBottom: "12px" }}>
                📝 Tulis Artikel
              </h3>
              <p style={{ color: "#64748b", fontSize: "1rem", lineHeight: 1.7, margin: 0 }}>
                Tuangkan pengetahuan dan pengalamanmu. Editor kami mudah digunakan dengan formatting lengkap.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div style={{
              background: "linear-gradient(135deg, #f8fafc 0%, #fff 100%)",
              borderRadius: "24px",
              padding: "36px",
              border: "1px solid #e2e8f0",
              transition: "all 0.3s ease",
            }}>
              <div style={{
                width: "72px",
                height: "72px",
                background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "24px",
                boxShadow: "0 8px 24px rgba(245,158,11,0.25)",
              }}>
                <FontAwesomeIcon icon={faComments} style={{ color: "#fff", fontSize: "1.8rem" }} />
              </div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#0f172a", marginBottom: "12px" }}>
                💬 Tanya Jawab
              </h3>
              <p style={{ color: "#64748b", fontSize: "1rem", lineHeight: 1.7, margin: 0 }}>
                Ajukan pertanyaan dan dapatkan jawaban dari komunitas. Diskusi produktif setiap hari.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div style={{
              background: "linear-gradient(135deg, #f8fafc 0%, #fff 100%)",
              borderRadius: "24px",
              padding: "36px",
              border: "1px solid #e2e8f0",
              transition: "all 0.3s ease",
            }}>
              <div style={{
                width: "72px",
                height: "72px",
                background: "linear-gradient(135deg, #22c55e 0%, #4ade80 100%)",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "24px",
                boxShadow: "0 8px 24px rgba(34,197,94,0.25)",
              }}>
                <FontAwesomeIcon icon={faBookOpen} style={{ color: "#fff", fontSize: "1.8rem" }} />
              </div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#0f172a", marginBottom: "12px" }}>
                📚 Baca & Belajar
              </h3>
              <p style={{ color: "#64748b", fontSize: "1rem", lineHeight: 1.7, margin: 0 }}>
                Jelajahi ratusan artikel berkualitas. Temukan ide baru dan tingkatkan pengetahuanmu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Knowle Section */}
      <section style={{
        padding: "clamp(48px, 8vw, 100px) 0",
        background: "linear-gradient(180deg, #f8fafc 0%, #fff 100%)",
      }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "48px",
            alignItems: "center",
          }}>
            {/* Left Content */}
            <div>
              <span style={{
                display: "inline-block",
                background: "#dcfce7",
                color: "#16a34a",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: 600,
                marginBottom: "16px",
              }}>
                KENAPA KAMI?
              </span>
              <h2 style={{
                fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: "24px",
                lineHeight: 1.2,
              }}>
                Platform yang Dibuat untuk{" "}
                <span style={{ color: "#6366f1" }}>Penulis Indonesia</span>
              </h2>
              <p style={{
                color: "#64748b",
                fontSize: "1.1rem",
                lineHeight: 1.8,
                marginBottom: "32px",
              }}>
                Knowle bukan sekadar platform blogging biasa. Kami fokus membangun
                komunitas pembelajar yang saling berbagi dan mendukung satu sama lain.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {[
                  { icon: faCheck, text: "100% Gratis tanpa biaya tersembunyi" },
                  { icon: faCheck, text: "Tanpa iklan yang mengganggu" },
                  { icon: faCheck, text: "Komunitas supportif dan ramah" },
                  { icon: faCheck, text: "Editor modern dan mudah digunakan" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "28px",
                      height: "28px",
                      background: "#dcfce7",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <FontAwesomeIcon icon={item.icon} style={{ color: "#22c55e", fontSize: "0.8rem" }} />
                    </div>
                    <span style={{ color: "#475569", fontSize: "1.05rem" }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Testimonial */}
            <div style={{
              background: "#fff",
              borderRadius: "clamp(16px, 3vw, 24px)",
              padding: "clamp(24px, 4vw, 40px)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
              border: "1px solid #f1f5f9",
            }}>
              <FontAwesomeIcon icon={faQuoteLeft} style={{ color: "#e2e8f0", fontSize: "2rem", marginBottom: "20px" }} />
              <p style={{
                fontSize: "1.2rem",
                color: "#334155",
                lineHeight: 1.8,
                fontStyle: "italic",
                marginBottom: "28px",
              }}>
                "Knowle membantu saya berbagi pengetahuan programming ke lebih banyak orang.
                Platformnya simpel tapi powerful, dan komunitasnya sangat supportif!"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{
                  width: "50px",
                  height: "50px",
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1.2rem",
                }}>
                  A
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: "#0f172a" }}>Ahmad Developer</div>
                  <div style={{ color: "#64748b", fontSize: "0.9rem" }}>Software Engineer</div>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", gap: "4px" }}>
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} style={{ color: "#fbbf24", fontSize: "0.9rem" }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: "clamp(48px, 8vw, 100px) 0",
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative */}
        <div style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
          top: "-50px",
          right: "-50px",
        }} />
        <div style={{
          position: "absolute",
          width: "200px",
          height: "200px",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "50%",
          bottom: "-30px",
          left: "10%",
        }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            maxWidth: "700px",
            margin: "0 auto",
            textAlign: "center",
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 32px",
            }}>
              <FontAwesomeIcon icon={faHeart} style={{ color: "#fff", fontSize: "2rem" }} />
            </div>
            <h2 style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 800,
              color: "#fff",
              marginBottom: "20px",
              lineHeight: 1.2,
            }}>
              Siap Berbagi Pengetahuanmu?
            </h2>
            <p style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: "1.2rem",
              lineHeight: 1.7,
              marginBottom: "40px",
            }}>
              Bergabung dengan ribuan penulis Indonesia. Tulisanmu bisa menginspirasi orang lain.
              Daftar sekarang, 100% gratis!
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href="/signup"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "#fff",
                  color: "#6366f1",
                  padding: "18px 40px",
                  borderRadius: "16px",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  textDecoration: "none",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                }}
              >
                Daftar Sekarang
                <FontAwesomeIcon icon={faArrowRight} />
              </a>
              <a
                href="/login"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "rgba(255,255,255,0.15)",
                  color: "#fff",
                  padding: "18px 40px",
                  borderRadius: "16px",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  textDecoration: "none",
                  border: "2px solid rgba(255,255,255,0.3)",
                }}
              >
                Sudah Punya Akun?
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
