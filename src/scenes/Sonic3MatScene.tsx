import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {CursorPointer} from '../components/CursorPointer';
import {CuttingMatBackdrop} from '../components/CuttingMatBackdrop';
import {Sonic3Console} from '../components/Sonic3Console';

type Sonic3MatSceneProps = {
  frozen?: boolean;
  durationFrames?: number;
};

export const Sonic3MatScene: React.FC<Sonic3MatSceneProps> = ({
  frozen = false,
  durationFrames = 69,
}) => {
  const rawFrame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const frame = frozen ? 42 : rawFrame;

  const slideSpring = spring({
    frame,
    fps,
    config: {damping: 14, stiffness: 165, mass: 0.75},
  });
  const translateY = frozen ? 0 : interpolate(slideSpring, [0, 1], [520, 0]);

  const genOpacity = frozen
    ? 1
    : interpolate(frame, [14, 24], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
  const genScale = frozen
    ? 1
    : interpolate(frame, [14, 24], [0.88, 1], {
        easing: Easing.out(Easing.quad),
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });

  // Cursor glides from lower-right edge onto the "Generate" button and clicks
  const moveEnd = Math.min(34, durationFrames - 8);
  const cursorT = frozen
    ? 1
    : interpolate(frame, [4, moveEnd], [0, 1], {
        easing: Easing.out(Easing.cubic),
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });

  const cursorX = interpolate(cursorT, [0, 1], [1280, 1054]);
  const cursorY = interpolate(cursorT, [0, 1], [1005, 694]);

  const clickTime = Math.min(36, durationFrames - 5);
  const clickPress = frozen
    ? 0
    : interpolate(
        frame,
        [clickTime - 3, clickTime, clickTime + 4],
        [0, 1, 0],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        },
      );

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <CuttingMatBackdrop showChalk />

      {/* Centered-low angled SONIC 3 console */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-46%, -12%) translateY(${translateY}px)`,
        }}
      >
        <Sonic3Console
          scale={0.98}
          rotateDeg={12.5}
          showSelectionBox
          showGenerateOverlay
          generateOpacity={genOpacity}
          generateScale={genScale}
        />
      </div>

      <CursorPointer
        x={cursorX}
        y={cursorY}
        scale={1.08}
        clickPress={clickPress}
      />
    </AbsoluteFill>
  );
};
