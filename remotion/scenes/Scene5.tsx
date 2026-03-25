/**
 * Scene 5 — "Action Is the Language of Faith"
 * Duration: 192 frames
 * Visual: 12 rising particles + appearing footstep path + pulsing CTA
 */
import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Background, COLORS, SAFE } from "../components/Background";
import { spr, slideUp } from "../utils/springs";

const NUM_PARTICLES = 13;

export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tagS   = spr(frame, fps, 0);
  const headS  = spr(frame, fps, 8);
  const quoteS = spr(frame, fps, 30);
  const attribS= spr(frame, fps, 50);
  const ctaS   = spr(frame, fps, 162);

  // Pulsing scale for CTA (cycles every 30 frames)
  const pulse = 1 + 0.04 * Math.sin((frame * Math.PI * 2) / 30);

  // Particle definitions (deterministic)
  const particles = useMemo(
    () =>
      Array.from({ length: NUM_PARTICLES }, (_, i) => ({
        x: 80 + ((i * 73) % 860),      // spread across width
        baseY: 1200 + (i * 37) % 500,  // start below center
        speed: 1.8 + (i % 4) * 0.6,
        size: 10 + (i % 5) * 7,
        opacity: 0.12 + (i % 5) * 0.07,
        drift: ((i % 3) - 1) * 0.4,   // gentle horizontal drift
        delay: i * 6,
      })),
    []
  );

  // Footstep positions along a curving path
  const STEPS = [
    { x: 220, y: 1280 },
    { x: 340, y: 1240 },
    { x: 300, y: 1190 },
    { x: 430, y: 1155 },
    { x: 390, y: 1110 },
    { x: 520, y: 1080 },
    { x: 490, y: 1038 },
    { x: 620, y: 1010 },
    { x: 585, y: 968 },
    { x: 710, y: 945 },
  ];

  return (
    <Background>
      {/* ── Particles (full-scene, behind content) ─────────────────────────── */}
      {particles.map((p, i) => {
        const elapsed = Math.max(0, frame - p.delay);
        const y = p.baseY - p.speed * elapsed;
        const x = p.x + p.drift * elapsed;
        const oFade = interpolate(elapsed, [0, 15], [0, p.opacity], { extrapolateRight: "clamp" });
        const fadeOut = interpolate(elapsed, [130, 160], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - p.size / 2,
              top: y - p.size / 2 - SAFE.top,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${COLORS.accent}, transparent)`,
              opacity: oFade * fadeOut,
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* ── Footstep path ───────────────────────────────────────────────────── */}
      {STEPS.map((step, i) => {
        const appearFrame = 72 + i * 10;
        const stepS = spr(frame, fps, appearFrame);
        const isLeft = i % 2 === 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: step.x - 16,
              top: step.y - SAFE.top - 16,
              opacity: stepS,
              transform: `scale(${interpolate(stepS, [0, 1], [0.4, 1])})`,
              pointerEvents: "none",
            }}
          >
            <FootprintIcon isLeft={isLeft} />
          </div>
        );
      })}

      {/* ── Content (above particles) ──────────────────────────────────────── */}
      {/* Tag */}
      <div style={{ ...slideUp(tagS, 30), marginTop: 20, fontSize: 28, fontWeight: 600, color: COLORS.accent, letterSpacing: 3, textTransform: "uppercase" as const, zIndex: 2 }}>
        Activate Your Faith
      </div>

      {/* Headline */}
      <div
        style={{
          ...slideUp(headS, 50),
          marginTop: 24,
          fontSize: 68,
          fontWeight: 800,
          color: COLORS.white,
          lineHeight: 1.1,
          textAlign: "center" as const,
          zIndex: 2,
        }}
      >
        Action Is the{"\n"}
        <span style={{ color: COLORS.accent }}>Language of Faith</span>
      </div>

      {/* James quote block */}
      <div
        style={{
          ...slideUp(quoteS, 40),
          marginTop: 40,
          background: "rgba(99,102,241,0.12)",
          border: `2px solid rgba(99,102,241,0.4)`,
          borderLeft: `6px solid ${COLORS.accent}`,
          borderRadius: 16,
          padding: "28px 32px",
          maxWidth: 840,
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontSize: 40,
            fontWeight: 600,
            color: COLORS.white,
            lineHeight: 1.45,
            fontStyle: "italic",
          }}
        >
          "Faith without works is dead."
        </div>
        <div
          style={{
            ...slideUp(attribS, 20),
            marginTop: 14,
            fontSize: 30,
            color: COLORS.accent,
            fontWeight: 600,
          }}
        >
          — James 2:17
        </div>
      </div>

      {/* Description */}
      <div
        style={{
          ...slideUp(attribS, 40),
          marginTop: 28,
          fontSize: 36,
          fontWeight: 400,
          color: COLORS.muted,
          lineHeight: 1.5,
          textAlign: "center" as const,
          maxWidth: 820,
          zIndex: 2,
        }}
      >
        The path doesn't appear before you walk it. Every step of faith reveals the next one.
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* CTA */}
      <div
        style={{
          opacity: ctaS,
          transform: `scale(${interpolate(ctaS, [0, 1], [0.8, 1]) * pulse})`,
          background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.green})`,
          borderRadius: 24,
          padding: "30px 60px",
          marginBottom: 16,
          zIndex: 2,
          boxShadow: `0 0 40px rgba(99,102,241,0.5), 0 0 80px rgba(34,197,94,0.2)`,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: COLORS.white,
            textAlign: "center" as const,
            letterSpacing: 1,
          }}
        >
          Take the next step.
        </div>
      </div>
    </Background>
  );
};

const FootprintIcon: React.FC<{ isLeft: boolean }> = ({ isLeft }) => (
  <svg
    width={32}
    height={32}
    viewBox="0 0 32 32"
    style={{ transform: isLeft ? "scaleX(-1)" : "none" }}
  >
    <ellipse cx={16} cy={22} rx={8} ry={10} fill={COLORS.accent} opacity={0.7} />
    {/* Toes */}
    {[8, 11, 14, 18, 22].map((tx, i) => (
      <circle key={i} cx={tx} cy={10 - i * 0.5} r={2.8 - i * 0.3} fill={COLORS.accent} opacity={0.6} />
    ))}
  </svg>
);
