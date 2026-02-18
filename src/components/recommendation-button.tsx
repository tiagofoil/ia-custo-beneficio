"use client";

import { useState } from "react";

interface RecommendationButtonProps {
  rank: number;
  modelName: string;
}

export function RecommendationButton({ rank, modelName }: RecommendationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now just show coming soon message
    setSubmitted(true);
  };

  const getRankStyle = () => {
    switch (rank) {
      case 1:
        return { bg: "#FFD700", text: "#000", label: "🥇 #1" }; // Gold
      case 2:
        return { bg: "#C0C0C0", text: "#000", label: "🥈 #2" }; // Silver
      case 3:
        return { bg: "#CD7F32", text: "#FFF", label: "🥉 #3" }; // Bronze
      default:
        return { bg: "var(--accent)", text: "#000", label: `#${rank}` };
    }
  };

  const rankStyle = getRankStyle();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          background: "linear-gradient(135deg, var(--accent) 0%, #00a8cc 100%)",
          color: "#000",
          border: "none",
          borderRadius: 8,
          padding: "10px 16px",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          gap: 6,
          boxShadow: "0 4px 12px rgba(0, 212, 255, 0.3)",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 212, 255, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 212, 255, 0.3)";
        }}
      >
        <span>⚡</span>
        <span>Setup Guide</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 20,
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #141414 0%, #1a1a1a 100%)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 16,
              padding: 40,
              maxWidth: 480,
              width: "100%",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "none",
                border: "none",
                color: "var(--text-dim)",
                fontSize: 24,
                cursor: "pointer",
                padding: 4,
              }}
            >
              ×
            </button>

            {!submitted ? (
              <>
                {/* Pro Badge */}
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                      color: "#000",
                      padding: "8px 16px",
                      borderRadius: 100,
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    <span>👑</span>
                    <span>PRO PLAN</span>
                  </div>
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    textAlign: "center",
                    marginBottom: 8,
                  }}
                >
                  Setup Guide for {modelName}
                </h3>

                <p
                  style={{
                    color: "var(--text-secondary)",
                    textAlign: "center",
                    marginBottom: 24,
                    fontSize: 15,
                  }}
                >
                  Get the complete optimized setup guide used by our team
                </p>

                {/* What's included */}
                <div
                  style={{
                    background: "rgba(0, 212, 255, 0.05)",
                    border: "1px solid rgba(0, 212, 255, 0.2)",
                    borderRadius: 12,
                    padding: 20,
                    marginBottom: 24,
                  }}
                >
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      marginBottom: 12,
                      color: "var(--accent)",
                    }}
                  >
                    📦 What's Included:
                  </p>
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                      fontSize: 14,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {[
                      "IDE configuration for optimal performance",
                      "Recommended extensions and plugins",
                      "Prompt templates for coding tasks",
                      "API integration examples",
                      "Cost optimization strategies",
                      "Monthly updated PDF guide",
                    ].map((item, i) => (
                      <li
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 8,
                        }}
                      >
                        <span style={{ color: "var(--accent)" }}>✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price */}
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: 24,
                  }}
                >
                  <div style={{ fontSize: 14, color: "var(--text-dim)", marginBottom: 4 }}>
                    One-time payment
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: "var(--accent)" }}>
                    $5
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: 16 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 14,
                        fontWeight: 500,
                        marginBottom: 8,
                      }}
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: 8,
                        color: "var(--text)",
                        fontSize: 15,
                        outline: "none",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      padding: "14px 24px",
                      background: "linear-gradient(135deg, var(--accent) 0%, #00a8cc 100%)",
                      color: "#000",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 16,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 24px rgba(0, 212, 255, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    Get Early Access — Coming Soon
                  </button>
                </form>

                <p
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    color: "var(--text-dim)",
                    marginTop: 16,
                  }}
                >
                  🔔 We'll notify you when the payment system is ready
                </p>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    background: "rgba(0, 212, 255, 0.1)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                    fontSize: 40,
                  }}
                >
                  🎉
                </div>

                <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
                  You're on the list!
                </h3>

                <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
                  We'll email you at {email} when the PRO Plan is ready.
                </p>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    setSubmitted(false);
                    setEmail("");
                  }}
                  style={{
                    padding: "12px 24px",
                    background: "rgba(255, 255, 255, 0.1)",
                    color: "var(--text)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 8,
                    fontSize: 15,
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
