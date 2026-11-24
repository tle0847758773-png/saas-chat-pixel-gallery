import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {COLORS, FONTS, SCENES} from '../theme';

const PROMPT_TEXT =
  'Recreate this image exactly as it appears in the reference, preserving every object, texture, color, lighting detail, shadow, reflection, composition and overall visual style.';

// Deterministic botanical leaf stems along the bottom foreground
const VINE_STEMS = [
  {x: 105, height: 610, lean: -14, leaves: 6, phase: 0.2},
  {x: 270, height: 470, lean: 12, leaves: 5, phase: 1.1},
  {x: 425, height: 540, lean: -8, leaves: 5, phase: 2.0},
  {x: 560, height: 590, lean: 18, leaves: 6, phase: 0.7},
  {x: 825, height: 520, lean: -16, leaves: 5, phase: 1.8},
  {x: 1120, height: 560, lean: 15, leaves: 6, phase: 2.6},
  {x: 1320, height: 630, lean: -12, leaves: 6, phase: 0.4},
  {x: 1555, height: 580, lean: 10, leaves: 5, phase: 1.5},
  {x: 1790, height: 640, lean: -15, leaves: 6, phase: 2.2},
];

export const ChatGPTPromptScene: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = SCENES.chatgpt.duration;

  // Smooth typewriter reveal across frames 2..64
  const typedProgress = interpolate(frame, [2, 64], [0, PROMPT_TEXT.length], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const solidCount = Math.floor(typedProgress);
  const fadeTailStart = Math.max(0, solidCount - 5);
  const fadeChars = PROMPT_TEXT.slice(fadeTailStart, solidCount + 1);
  const solidChars = PROMPT_TEXT.slice(0, fadeTailStart);

  // Camera zoom-in toward prompt card during frames 68..123
  const zoomT = interpolate(frame, [68, duration], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const camScale = interpolate(zoomT, [0, 1], [1.0, 2.15]);
  const camX = interpolate(zoomT, [0, 1], [0, -108]);
  const camY = interpolate(zoomT, [0, 1], [0, -52]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(102deg, ${COLORS.chatgptBgLeft} 0%, #A9B584 48%, ${COLORS.chatgptBgRight} 100%)`,
        overflow: 'hidden',
      }}
    >
      {/* Subtle '+' cross grid texture on left and right margins */}
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{position: 'absolute', inset: 0, opacity: 0.28}}
      >
        <defs>
          <pattern
            id="plus-grid"
            width="34"
            height="34"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M17 11 V23 M11 17 H23"
              stroke="#FFFFFF"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </pattern>
          <linearGradient id="plus-mask-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="28%" stopColor="white" stopOpacity="0.1" />
            <stop offset="72%" stopColor="white" stopOpacity="0.1" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </linearGradient>
          <mask id="plus-mask">
            <rect width="1920" height="1080" fill="url(#plus-mask-grad)" />
          </mask>
        </defs>
        <rect
          width="1920"
          height="1080"
          fill="url(#plus-grid)"
          mask="url(#plus-mask)"
        />
      </svg>

      {/* Camera-transformed scene geometry & prompt card */}
      <AbsoluteFill
        style={{
          transform: `translate(${camX}px, ${camY}px) scale(${camScale})`,
          transformOrigin: '50% 50%',
        }}
      >
        {/* 3 Vertical terracotta structural poles */}
        {[370, 1044, 1752].map((poleX, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: poleX,
              top: -80,
              width: 106,
              height: 1240,
              background:
                'linear-gradient(90deg, #7C4429 0%, #D2875A 36%, #BA734E 68%, #63351F 100%)',
              boxShadow: '16px 0 36px rgba(0, 0, 0, 0.22)',
            }}
          />
        ))}

        {/* 2 Diagonal dark-teal crossbeams */}
        <div
          style={{
            position: 'absolute',
            left: -180,
            top: 138,
            width: 2300,
            height: 54,
            transform: 'rotate(-16deg)',
            background: `linear-gradient(180deg, #2D6158 0%, ${COLORS.chatgptTealBeam} 65%, #16332E 100%)`,
            boxShadow: '0 14px 28px rgba(0, 0, 0, 0.25)',
            filter: 'blur(1px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: -180,
            top: 842,
            width: 2300,
            height: 56,
            transform: 'rotate(-16deg)',
            background: `linear-gradient(180deg, #2D6158 0%, ${COLORS.chatgptTealBeam} 65%, #16332E 100%)`,
            boxShadow: '0 14px 28px rgba(0, 0, 0, 0.25)',
            filter: 'blur(1.2px)',
          }}
        />

        {/* Animated swaying foliage stems in the lower foreground */}
        <svg
          width="1920"
          height="1080"
          viewBox="0 0 1920 1080"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            filter: 'blur(1.4px)',
          }}
        >
          {VINE_STEMS.map((stem, sIdx) => {
            const sway = Math.sin(frame * 0.045 + stem.phase) * 14;
            const topY = 1080 - stem.height;
            const tipX = stem.x + stem.lean * 3 + sway;
            const midX = stem.x + stem.lean + sway * 0.45;
            const midY = 1080 - stem.height * 0.55;

            return (
              <g key={sIdx}>
                <path
                  d={`M ${stem.x} 1090 Q ${midX} ${midY} ${tipX} ${topY}`}
                  fill="none"
                  stroke="#53682B"
                  strokeWidth="4"
                  opacity="0.72"
                />
                {Array.from({length: stem.leaves}, (_, lIdx) => {
                  const t = (lIdx + 1) / (stem.leaves + 0.5);
                  const lx =
                    (1 - t) * (1 - t) * stem.x +
                    2 * (1 - t) * t * midX +
                    t * t * tipX;
                  const ly =
                    (1 - t) * (1 - t) * 1090 +
                    2 * (1 - t) * t * midY +
                    t * t * topY;
                  const side = lIdx % 2 === 0 ? -1 : 1;
                  const leafAngle = side * (36 + (lIdx % 3) * 10) + sway * 0.5;
                  const fill =
                    lIdx % 3 === 0
                      ? '#3A4D22'
                      : lIdx % 3 === 1
                        ? '#657C2F'
                        : '#7B9439';
                  return (
                    <ellipse
                      key={lIdx}
                      cx={lx + side * 26}
                      cy={ly}
                      rx={34}
                      ry={17}
                      fill={fill}
                      opacity={0.78}
                      transform={`rotate(${leafAngle} ${lx + side * 26} ${ly})`}
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>

        {/* Centered ChatGPT Hero Title + Prompt Composer Card */}
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 24,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.sans,
              fontSize: 68,
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.16)',
              lineHeight: 1.08,
            }}
          >
            ChatGPT
          </div>
          <div
            style={{
              fontFamily: FONTS.sans,
              fontSize: 30,
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.96)',
              marginTop: 10,
              marginBottom: 42,
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.14)',
            }}
          >
            Ready when you are.
          </div>

          {/* Rounded Off-white Prompt Card */}
          <div
            style={{
              position: 'relative',
              width: 840,
              minHeight: 282,
              borderRadius: 28,
              backgroundColor: COLORS.chatgptCard,
              boxShadow: '0 24px 62px rgba(0, 0, 0, 0.18)',
              padding: 26,
              boxSizing: 'border-box',
              display: 'flex',
              gap: 28,
            }}
          >
            {/* Reference Thumbnail with Stylized Screen Typography */}
            <div
              style={{
                position: 'relative',
                width: 218,
                height: 218,
                borderRadius: 16,
                overflow: 'hidden',
                flexShrink: 0,
                backgroundColor: '#CFC5EB',
              }}
            >
              <Img
                src={staticFile('assets/retro-tv.jpg')}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              {/* Clean text overlay inside the blank CRT screen */}
              <div
                style={{
                  position: 'absolute',
                  left: '26%',
                  top: '29%',
                  width: '48%',
                  height: '36%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotate(-2deg)',
                  fontFamily: FONTS.sans,
                  fontStyle: 'italic',
                  fontWeight: 800,
                  lineHeight: 1.12,
                  pointerEvents: 'none',
                }}
              >
                <span style={{fontSize: 16, color: '#1E1D24'}}>Выгореть</span>
                <span style={{fontSize: 16, color: '#ABA8CE', marginTop: 2}}>
                  Загореть
                </span>
              </div>
            </div>

            {/* Typewriter Prompt Content */}
            <div
              style={{
                flex: 1,
                paddingTop: 4,
                paddingRight: 22,
                fontFamily: FONTS.sans,
                fontSize: 23.5,
                lineHeight: 1.38,
                color: '#111111',
                fontWeight: 400,
              }}
            >
              <span>{solidChars}</span>
              {fadeChars.split('').map((ch, idx) => {
                const charOpacity = interpolate(
                  idx,
                  [0, Math.max(1, fadeChars.length - 1)],
                  [0.92, 0.25],
                );
                return (
                  <span key={idx} style={{opacity: charOpacity}}>
                    {ch}
                  </span>
                );
              })}
            </div>

            {/* Send Button Circle */}
            <div
              style={{
                position: 'absolute',
                right: 22,
                bottom: 22,
                width: 54,
                height: 54,
                borderRadius: '50%',
                backgroundColor: '#0A0A0A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 19V5M12 5L6 11M12 5L18 11"
                  stroke="#FFFFFF"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
