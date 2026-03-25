import React from "react";
import { fontFamily } from "../utils/fonts";

export const SAFE = {
  top: 150,
  bottom: 170,
  side: 60,
  width: 1080,
  height: 1920,
} as const;

export const COLORS = {
  bg: "#0a0a0a",
  white: "#ffffff",
  accent: "#6366f1",
  green: "#22c55e",
  red: "#ef4444",
  muted: "rgba(255,255,255,0.55)",
  accentMuted: "rgba(99,102,241,0.18)",
} as const;

export const Background: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    style={{
      width: SAFE.width,
      height: SAFE.height,
      background: COLORS.bg,
      position: "relative",
      overflow: "hidden",
      fontFamily,
    }}
  >
    {/* Subtle grid overlay */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "radial-gradient(circle at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 60%)",
        pointerEvents: "none",
      }}
    />
    {/* Safe zone content */}
    <div
      style={{
        position: "absolute",
        top: SAFE.top,
        left: SAFE.side,
        right: SAFE.side,
        bottom: SAFE.bottom,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {children}
    </div>
  </div>
);
