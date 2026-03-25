/**
 * "How Faith Works" — 30-second vertical explainer video
 * 1080×1920 | 30fps | 900 frames
 *
 * TransitionSeries layout (5 × 192 - 4 × 15 = 900 frames):
 *   Scene 1:  0 – 192
 *   Fade  :  177 – 192 / 0 – 15
 *   Scene 2:  177 – 369
 *   ...etc
 */
import React from "react";
import { Audio, staticFile } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";
import { Scene4 } from "./scenes/Scene4";
import { Scene5 } from "./scenes/Scene5";

const SCENE_FRAMES = 192;
const TRANSITION_FRAMES = 15;

const transitionTiming = springTiming({
  config: { damping: 200 },
  durationInFrames: TRANSITION_FRAMES,
});

export const HowFaithWorks: React.FC = () => (
  <>
    {/* Background music — loops for full duration */}
    <Audio
      src={staticFile("music.wav")}
      volume={0.3}
      loop
    />

    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}>
        <Scene1 />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        timing={transitionTiming}
        presentation={fade()}
      />

      <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}>
        <Scene2 />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        timing={transitionTiming}
        presentation={fade()}
      />

      <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}>
        <Scene3 />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        timing={transitionTiming}
        presentation={fade()}
      />

      <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}>
        <Scene4 />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        timing={transitionTiming}
        presentation={fade()}
      />

      <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}>
        <Scene5 />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </>
);
