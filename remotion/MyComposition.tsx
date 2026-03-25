import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const MyComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(frame, [0, 30], [0.8, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1a1a2e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          color: "white",
          fontSize: 80,
          fontWeight: "bold",
          fontFamily: "sans-serif",
          textAlign: "center",
        }}
      >
        Social Media
        <div style={{ fontSize: 32, fontWeight: "normal", marginTop: 16, opacity: 0.7 }}>
          Frame {frame} / {durationInFrames}
        </div>
      </div>
    </AbsoluteFill>
  );
};
