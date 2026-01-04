"use client";

export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
        gap: "20px",
      }}
    >
      {/* Spinner */}
      <div style={{
        position: "relative",
        width: "50px",
        height: "50px",
      }}>
        {/* Outer ring */}
        <div style={{
          position: "absolute",
          inset: 0,
          border: "3px solid #e4e4e7",
          borderTopColor: "#6366f1",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
      </div>

      {/* Loading text */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}>
        <span style={{
          color: "#71717a",
          fontSize: "0.9rem",
          fontWeight: 500,
        }}>
          Memuat
        </span>
        <span style={{ display: "flex", gap: "4px" }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: "4px",
                height: "4px",
                backgroundColor: "#6366f1",
                borderRadius: "50%",
                animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite both`,
              }}
            />
          ))}
        </span>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
                
                @keyframes bounce {
                    0%, 80%, 100% {
                        transform: scale(0);
                    }
                    40% {
                        transform: scale(1);
                    }
                }
            `}</style>
    </div>
  );
}
