/**
 * Scene 3 — "Two Forces, One Future"
 * Duration: 192 frames
 * Visual: Split-panel FEAR vs FAITH, glowing dot moves from center to FAITH side
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Background, COLORS } from "../components/Background";
import { spr, slideUp } from "../utils/springs";

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tagS  = spr(frame, fps, 0);
  const headS = spr(frame, fps, 8);
  const subS  = spr(frame, fps, 22);

  // Panels enter
  const fearS  = spr(frame, fps, 40);
  const faithS = spr(frame, fps, 52);

  // Icon entrances (staggered 8 frames)
  const fearIconS  = spr(frame, fps, 70);
  const faithIconS = spr(frame, fps, 82);
  const fearLabelS = spr(frame, fps, 85);
  const faithLabelS= spr(frame, fps, 95);
  const fearDescS  = spr(frame, fps, 100);
  const faithDescS = spr(frame, fps, 110);

  // Dot travels center → right (frames 130 → 170)
  const dotX = interpolate(frame, [130, 170], [460, 780], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dotOpacity = spr(frame, fps, 128);

  // "You chose" label
  const chooseS = spr(frame, fps, 172);

  return (
    <Background>
      {/* Tag */}
      <div style={{ ...slideUp(tagS, 30), marginTop: 20, fontSize: 28, fontWeight: 600, color: COLORS.accent, letterSpacing: 3, textTransform: "uppercase" as const }}>
        Faith vs Fear
      </div>

      {/* Headline */}
      <div style={{ ...slideUp(headS, 50), marginTop: 24, fontSize: 68, fontWeight: 800, color: COLORS.white, lineHeight: 1.1, textAlign: "center" as const }}>
        Two Forces,{"\n"}
        <span style={{ color: COLORS.accent }}>One Future</span>
      </div>

      {/* Subtitle */}
      <div style={{ ...slideUp(subS, 40), marginTop: 24, fontSize: 36, fontWeight: 400, color: COLORS.muted, lineHeight: 1.5, textAlign: "center" as const }}>
        Both ask you to believe in an outcome you can&apos;t see yet.
      </div>

      {/* Split panels */}
      <div style={{ display: "flex", width: "100%", gap: 12, marginTop: 48, flex: 1 }}>
        {/* FEAR panel */}
        <div
          style={{
            flex: 1,
            opacity: fearS,
            transform: `translateX(${interpolate(fearS, [0, 1], [-50, 0])}px)`,
            background: "linear-gradient(180deg, rgba(239,68,68,0.18) 0%, rgba(239,68,68,0.05) 100%)",
            border: "2px solid rgba(239,68,68,0.45)",
            borderRadius: 24,
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
            gap: 20,
          }}
        >
          {/* Storm cloud SVG */}
          <div style={{ opacity: fearIconS, transform: `scale(${interpolate(fearIconS, [0,1],[0.7,1])})` }}>
            <StormCloud />
          </div>
          <div style={{ ...slideUp(fearLabelS, 20), fontSize: 48, fontWeight: 800, color: COLORS.red, letterSpacing: 2 }}>
            FEAR
          </div>
          <div style={{ ...slideUp(fearDescS, 20), fontSize: 30, fontWeight: 400, color: "rgba(255,255,255,0.65)", textAlign: "center" as const, lineHeight: 1.5 }}>
            &ldquo;Something bad is coming.&rdquo;
          </div>
          <div style={{ ...slideUp(fearDescS, 30), marginTop: 8, fontSize: 28, color: "rgba(239,68,68,0.8)", textAlign: "center" as const, lineHeight: 1.5 }}>
            Focus on worst-case outcomes
          </div>
        </div>

        {/* FAITH panel */}
        <div
          style={{
            flex: 1,
            opacity: faithS,
            transform: `translateX(${interpolate(faithS, [0, 1], [50, 0])}px)`,
            background: "linear-gradient(180deg, rgba(99,102,241,0.22) 0%, rgba(34,197,94,0.08) 100%)",
            border: "2px solid rgba(99,102,241,0.55)",
            borderRadius: 24,
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
            gap: 20,
          }}
        >
          {/* Sun SVG */}
          <div style={{ opacity: faithIconS, transform: `scale(${interpolate(faithIconS, [0,1],[0.7,1])})` }}>
            <SunIcon />
          </div>
          <div style={{ ...slideUp(faithLabelS, 20), fontSize: 48, fontWeight: 800, color: COLORS.accent, letterSpacing: 2 }}>
            FAITH
          </div>
          <div style={{ ...slideUp(faithDescS, 20), fontSize: 30, fontWeight: 400, color: "rgba(255,255,255,0.65)", textAlign: "center" as const, lineHeight: 1.5 }}>
            &ldquo;Something good is possible.&rdquo;
          </div>
          <div style={{ ...slideUp(faithDescS, 30), marginTop: 8, fontSize: 28, color: COLORS.green, textAlign: "center" as const, lineHeight: 1.5 }}>
            Focus on best-case potential
          </div>
        </div>
      </div>

      {/* Dot tracker + label */}
      <div style={{ position: "relative", width: "100%", height: 80, marginTop: 12 }}>
        {/* Track line */}
        <div style={{
          position: "absolute",
          top: 32,
          left: 20,
          right: 20,
          height: 4,
          background: "rgba(255,255,255,0.12)",
          borderRadius: 4,
        }} />
        {/* Left label */}
        <div style={{ position: "absolute", top: 44, left: 20, fontSize: 28, color: "rgba(239,68,68,0.7)", transform: "translateY(-50%)" }}>Fear</div>
        {/* Right label */}
        <div style={{ position: "absolute", top: 44, right: 20, fontSize: 28, color: "rgba(99,102,241,0.9)", transform: "translateY(-50%)" }}>Faith</div>
        {/* Glowing dot */}
        <div
          style={{
            position: "absolute",
            top: 18,
            left: dotX - 18,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: COLORS.accent,
            opacity: dotOpacity,
            boxShadow: `0 0 24px ${COLORS.accent}, 0 0 48px ${COLORS.accent}`,
          }}
        />
        <div style={{ ...slideUp(chooseS, 10), position: "absolute", top: 56, left: "50%", transform: "translateX(-50%)", fontSize: 28, fontWeight: 600, color: COLORS.green, whiteSpace: "nowrap" as const }}>
          ↗ You chose Faith
        </div>
      </div>
    </Background>
  );
};

const StormCloud: React.FC = () => (
  <svg width={120} height={90} viewBox="0 0 120 90">
    <ellipse cx={60} cy={35} rx={45} ry={28} fill="rgba(239,68,68,0.4)" stroke={COLORS.red} strokeWidth={2} />
    <ellipse cx={38} cy={42} rx={30} ry={22} fill="rgba(239,68,68,0.35)" />
    <ellipse cx={82} cy={44} rx={28} ry={20} fill="rgba(239,68,68,0.3)" />
    <ellipse cx={60} cy={52} rx={48} ry={22} fill="rgba(30,10,10,0.6)" stroke={COLORS.red} strokeWidth={1.5} />
    {/* Lightning bolts */}
    <polyline points="48,56 42,72 50,72 44,88" stroke="#fbbf24" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="72,56 66,70 74,70 68,84" stroke="#fbbf24" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SunIcon: React.FC = () => (
  <svg width={120} height={120} viewBox="-60 -60 120 120">
    <circle cx={0} cy={0} r={28} fill={COLORS.accent} />
    <circle cx={0} cy={0} r={22} fill={COLORS.accent} opacity={0.7} />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
      const rad = (deg * Math.PI) / 180;
      return (
        <line
          key={deg}
          x1={Math.cos(rad) * 34}
          y1={Math.sin(rad) * 34}
          x2={Math.cos(rad) * 50}
          y2={Math.sin(rad) * 50}
          stroke={COLORS.accent}
          strokeWidth={3.5}
          strokeLinecap="round"
        />
      );
    })}
    <circle cx={0} cy={0} r={10} fill="white" opacity={0.4} />
  </svg>
);
