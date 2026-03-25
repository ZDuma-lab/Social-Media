import React from "react";
import { Composition } from "remotion";
import { HowFaithWorks } from "./HowFaithWorks";

// Total frames: 5 × 192 - 4 × 15 = 900
const TOTAL_FRAMES = 900;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="HowFaithWorks"
      component={HowFaithWorks}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);
