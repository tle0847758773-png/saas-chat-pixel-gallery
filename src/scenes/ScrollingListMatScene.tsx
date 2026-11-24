import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {CuttingMatBackdrop} from '../components/CuttingMatBackdrop';
import {COLORS, FONTS} from '../theme';

const ITEMS = [
  'Help',
  'Workable Idea',
  'Creative',
  'Build',
  'Article',
  'Solution',
  'Quick Help',
  'Recommendation',
  'Easy',
  'Game',
  'Generating Image',
  'Professional Tasks',
  'Friendly Talk',
  'Generating Video',
];

const LINE_HEIGHT = 80;

type ScrollingListMatSceneProps = {
  startIndex?: number;
  targetIndex?: number;
};

export const ScrollingListMatScene: React.FC<ScrollingListMatSceneProps> = ({
  startIndex = 4,
  targetIndex = 10,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Jumpy brisk scroll with soft spring settle
  const scrollEase = interpolate(frame, [4, 54], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const settleBump = spring({
    frame: Math.max(0, frame - 46),
    fps,
    config: {damping: 12, stiffness: 160, mass: 0.65},
  });
  const activeFloat =
    startIndex +
    (targetIndex - startIndex) * scrollEase +
    Math.sin(settleBump * Math.PI) * 0.08;

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <CuttingMatBackdrop darkVignette />

      {/* Center vertical scrolling capability wheel */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 1100,
            height: 920,
            overflow: 'hidden',
            WebkitMaskImage:
              'linear-gradient(90deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 46%, rgba(0, 0, 0, 0.42) 66%, rgba(0, 0, 0, 0.28) 100%)',
            maskImage:
              'linear-gradient(90deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 46%, rgba(0, 0, 0, 0.42) 66%, rgba(0, 0, 0, 0.28) 100%)',
          }}
        >
          {ITEMS.map((label, idx) => {
            const offset = idx - activeFloat;
            const absDist = Math.abs(offset);
            if (absDist > 5.2) {
              return null;
            }
            const y = 460 + offset * LINE_HEIGHT;
            const opacity = interpolate(
              absDist,
              [0, 0.8, 1.8, 3.0, 4.5],
              [1.0, 0.6, 0.28, 0.1, 0],
              {extrapolateRight: 'clamp'},
            );
            const blur = interpolate(absDist, [0, 0.6, 2.0, 4.0], [0, 0.8, 3.5, 6.5], {
              extrapolateRight: 'clamp',
            });

            return (
              <div
                key={label}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: y,
                  transform: 'translateY(-50%)',
                  textAlign: 'center',
                  fontFamily: FONTS.sans,
                  fontSize: 55,
                  fontWeight: 500,
                  color: '#FFFFFF',
                  opacity,
                  filter: blur > 0.2 ? `blur(${blur.toFixed(2)}px)` : undefined,
                  letterSpacing: '-0.01em',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* Left bright salmon marker dots */}
      {[504, 610].map((dotY, i) => (
        <div
          key={`l-${i}`}
          style={{
            position: 'absolute',
            left: 424,
            top: dotY,
            width: 15,
            height: 15,
            backgroundColor: COLORS.salmonDot,
            borderRadius: 2,
          }}
        />
      ))}

      {/* Right dimmer marker dots */}
      {[508, 612].map((dotY, i) => (
        <div
          key={`r-${i}`}
          style={{
            position: 'absolute',
            left: 1428,
            top: dotY,
            width: 11,
            height: 11,
            backgroundColor: COLORS.dimDot,
            borderRadius: 2,
            opacity: 0.72,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
