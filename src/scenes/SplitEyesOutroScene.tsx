import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {FONTS, SCENES} from '../theme';

export const SplitEyesOutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = SCENES.splitEyes.duration;

  const zoom = interpolate(frame, [0, duration], [1.0, 1.07], {
    easing: Easing.out(Easing.quad),
    extrapolateRight: 'clamp',
  });

  const ringExpand = interpolate(frame, [0, duration], [1.0, 1.045], {
    extrapolateRight: 'clamp',
  });

  const showFullPhrase = frame >= 28;
  const phraseSpring = spring({
    frame: Math.max(0, frame - 28),
    fps,
    config: {damping: 15, stiffness: 200, mass: 0.7},
  });
  const textScale = showFullPhrase
    ? interpolate(phraseSpring, [0, 1], [0.92, 1.0])
    : interpolate(frame, [0, 28], [0.95, 1.0]);

  return (
    <AbsoluteFill style={{backgroundColor: '#9C5C3E', overflow: 'hidden'}}>
      {/* Left half: macro eye positioned lower-left */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 960,
          height: 1080,
          overflow: 'hidden',
        }}
      >
        <Img
          src={staticFile('assets/macro-eye.jpg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${1.22 * zoom}) translate(-2%, 8%) rotate(-4deg)`,
            transformOrigin: '45% 58%',
            filter: 'blur(4px) saturate(1.1)',
          }}
        />
      </div>

      {/* Right half: macro eye zoomed & framed upper-right */}
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 0,
          width: 960,
          height: 1080,
          overflow: 'hidden',
        }}
      >
        <Img
          src={staticFile('assets/macro-eye.jpg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${1.86 * zoom}) translate(8%, -15%) rotate(-8deg)`,
            transformOrigin: '55% 42%',
            filter: 'blur(5px) saturate(1.05) brightness(1.06)',
          }}
        />
      </div>

      {/* Concentric thin white orbital ring geometry */}
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          transform: `scale(${ringExpand})`,
          transformOrigin: 'center center',
        }}
      >
        <circle
          cx="-28"
          cy="540"
          r="345"
          fill="none"
          stroke="rgba(255, 255, 255, 0.56)"
          strokeWidth="2"
        />
        <circle
          cx="-28"
          cy="540"
          r="945"
          fill="none"
          stroke="rgba(255, 255, 255, 0.62)"
          strokeWidth="2.5"
        />
        <circle
          cx="1948"
          cy="540"
          r="345"
          fill="none"
          stroke="rgba(255, 255, 255, 0.56)"
          strokeWidth="2"
        />
        <circle
          cx="1948"
          cy="540"
          r="945"
          fill="none"
          stroke="rgba(255, 255, 255, 0.62)"
          strokeWidth="2.5"
        />
        <circle
          cx="960"
          cy="540"
          r="1180"
          fill="none"
          stroke="rgba(255, 255, 255, 0.72)"
          strokeWidth="3.5"
        />
      </svg>

      {/* Centered kinetic outro caption */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize: 64,
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '-0.015em',
            textShadow: '0 4px 26px rgba(0, 0, 0, 0.38)',
            transform: `scale(${textScale})`,
            whiteSpace: 'nowrap',
          }}
        >
          {showFullPhrase ? 'All you need to do' : 'All'}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
