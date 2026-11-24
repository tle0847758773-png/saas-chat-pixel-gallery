import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {COLORS, FONTS} from '../theme';

export const KineticDomeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Phase 1: "And" (0..42), Phase 2: "pretty" (42..76), Phase 3: Lime dome + "Sure ->" (76..189)
  if (frame < 76) {
    const isPretty = frame >= 42;
    const localF = isPretty ? frame - 42 : frame;
    const dur = isPretty ? 34 : 42;
    const word = isPretty ? 'pretty' : 'And';
    const scale = interpolate(
      localF,
      [0, dur],
      isPretty ? [0.95, 1.04] : [0.88, 1.05],
      {
        easing: Easing.out(Easing.cubic),
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      },
    );

    return (
      <AbsoluteFill
        style={{
          backgroundColor: COLORS.creamBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize: 108,
            fontWeight: 700,
            color: COLORS.oliveText,
            letterSpacing: '-0.025em',
            transform: `scale(${scale})`,
          }}
        >
          {word}
        </div>
      </AbsoluteFill>
    );
  }

  // Phase 3: Giant neon-lime dome springs upward carrying bold white "Sure ->"
  const domeFrame = frame - 76;
  const domeProgress = spring({
    frame: domeFrame,
    fps,
    config: {damping: 15, stiffness: 105, mass: 0.9},
  });
  const domeTop = interpolate(domeProgress, [0, 1], [1080, 78]);
  const textY = Math.max(540, domeTop + 170);

  const arrowReveal = interpolate(domeFrame, [44, 62], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const arrowWidth = interpolate(arrowReveal, [0, 1], [0, 96]);
  const arrowMargin = interpolate(arrowReveal, [0, 1], [0, 26]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.creamBg,
        overflow: 'hidden',
      }}
    >
      {/* Massive circular neon-lime dome */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: domeTop,
          width: 3100,
          height: 3100,
          borderRadius: '50%',
          backgroundColor: COLORS.limeDome,
          transform: 'translateX(-50%)',
        }}
      />

      {/* Centered "Sure ->" text */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: textY,
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONTS.sans,
          fontSize: 112,
          fontWeight: 700,
          color: '#FFFFFF',
          letterSpacing: '-0.02em',
        }}
      >
        <span>Sure</span>
        <div
          style={{
            width: arrowWidth,
            marginLeft: arrowMargin,
            opacity: arrowReveal,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <svg
            width="92"
            height="48"
            viewBox="0 0 92 48"
            fill="none"
            style={{flexShrink: 0}}
          >
            <path
              d="M4 24 H84 M66 8 L86 24 L66 40"
              stroke="#FFFFFF"
              strokeWidth="6.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};
