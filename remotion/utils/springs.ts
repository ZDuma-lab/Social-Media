import { interpolate, spring, SpringConfig } from "remotion";

export const SPRING_CFG: SpringConfig = {
  damping: 200,
  mass: 1,
  stiffness: 100,
  overshootClamping: false,
};

/** Spring value [0→1] with optional delay in frames */
export const spr = (
  frame: number,
  fps: number,
  delay = 0,
  from = 0,
  to = 1
) =>
  spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: SPRING_CFG,
    from,
    to,
  });

/** Slide-up + fade entrance */
export const slideUp = (s: number, distance = 60) => ({
  opacity: s,
  transform: `translateY(${interpolate(s, [0, 1], [distance, 0])}px)`,
});

/** Scale entrance */
export const scaleIn = (s: number) => ({
  opacity: s,
  transform: `scale(${interpolate(s, [0, 1], [0.85, 1])})`,
});

/** SVG draw progress [0→1] clamped */
export const drawProgress = (
  frame: number,
  start: number,
  end: number
) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** Count-up integer */
export const countUp = (frame: number, start: number, end: number, max: number) =>
  Math.round(
    interpolate(frame, [start, end], [0, max], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
