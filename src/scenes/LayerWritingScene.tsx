import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {SpatialGallery3D} from '../components/SpatialGallery3D';
import {FONTS} from '../theme';

const LAYER_ITEMS = [
  'layout/Element',
  'layout/Object',
  'layout/Text',
  'Index',
  'layout/Element',
  'layout/Object',
  'layout/Text',
  'Index',
  'layout/Element',
  'layout/Object',
  'layout/Text',
  'Index',
];

const PREVIEW_THUMBS = [
  'assets/gallery-warm-cafe.jpg',
  'assets/gallery-cta-train.jpg',
  'assets/gallery-red-jacket.jpg',
  'assets/gallery-bokeh.jpg',
];

const ROW_PITCH = 144;
const STEP_FRAMES = 32;

export const LayerWritingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Compute smooth stepped scroll across 5 discrete spring transitions
  let steppedIndex = 1.6;
  for (let s = 0; s < 5; s++) {
    const stepStart = 12 + s * STEP_FRAMES;
    if (frame >= stepStart) {
      const p = spring({
        frame: frame - stepStart,
        fps,
        config: {damping: 14, stiffness: 175, mass: 0.72},
      });
      steppedIndex += p;
    }
  }

  // Subtle step pulse for right-hand thumbnails
  const localStepFrame = Math.max(0, (frame - 12) % STEP_FRAMES);
  const thumbPulse =
    frame >= 12
      ? Math.sin(
          interpolate(localStepFrame, [0, 12], [0, Math.PI], {
            extrapolateRight: 'clamp',
          }),
        ) * 0.04
      : 0;

  return (
    <AbsoluteFill style={{backgroundColor: '#000000', overflow: 'hidden'}}>
      {/* Dimmed 3D Spatial Gallery rotating behind the HUD */}
      <SpatialGallery3D startAngle={142} speed={0.28} />
      <AbsoluteFill
        style={{
          backgroundColor: 'rgba(12, 9, 6, 0.75)',
        }}
      />

      {/* Left-center stepped layer writing log */}
      <AbsoluteFill style={{pointerEvents: 'none'}}>
        {LAYER_ITEMS.map((tag, idx) => {
          const offset = idx - steppedIndex;
          const y = 540 + offset * ROW_PITCH;
          if (y < -120 || y > 1200) {
            return null;
          }

          const dist = Math.abs(y - 540);
          const opacity = interpolate(
            dist,
            [0, 145, 300, 480],
            [1.0, 0.76, 0.34, 0.08],
            {extrapolateRight: 'clamp'},
          );
          const isCompleted = idx < Math.floor(steppedIndex + 0.15);
          const verb = isCompleted ? 'Wrote' : 'Writing';

          return (
            <div
              key={`${idx}-${tag}`}
              style={{
                position: 'absolute',
                left: 440,
                top: y,
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
                opacity,
              }}
            >
              {/* Outlined Club Icon */}
              <svg
                width="38"
                height="38"
                viewBox="0 0 32 32"
                fill="none"
                style={{marginRight: 108}}
              >
                <path
                  d="M16 5 C12.8 5 10.5 7.4 10.5 10.4 C10.5 11.4 10.8 12.2 11.2 13 C8.2 13 6 15.2 6 18.2 C6 21.1 8.4 23.2 11.2 23.2 C13 23.2 14.3 22.4 15 21.3 L13.5 27 H18.5 L17 21.3 C17.7 22.4 19 23.2 20.8 23.2 C23.6 23.2 26 21.1 26 18.2 C26 15.2 23.8 13 20.8 13 C21.2 12.2 21.5 11.4 21.5 10.4 C21.5 7.4 19.2 5 16 5 Z"
                  stroke="#FFFFFF"
                  strokeWidth="2.1"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Status Verb */}
              <div
                style={{
                  width: 245,
                  fontFamily: FONTS.sans,
                  fontSize: 50,
                  fontWeight: 400,
                  color: '#FFFFFF',
                  letterSpacing: '-0.015em',
                }}
              >
                {verb}
              </div>

              {/* Tag Pill */}
              <div
                style={{
                  backgroundColor: '#E4E4E0',
                  color: '#111111',
                  fontFamily: FONTS.sans,
                  fontSize: 27,
                  fontWeight: 500,
                  padding: '5px 14px',
                  borderRadius: 6,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)',
                }}
              >
                {tag}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>

      {/* Right-hand stacked preview thumbnails */}
      <div
        style={{
          position: 'absolute',
          right: 162,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 38,
        }}
      >
        {PREVIEW_THUMBS.map((src, idx) => (
          <div
            key={src}
            style={{
              width: 168,
              height: 114,
              borderRadius: 14,
              overflow: 'hidden',
              boxShadow: '0 10px 26px rgba(0, 0, 0, 0.45)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              transform: `scale(${1 + (idx === 1 ? thumbPulse : thumbPulse * 0.4)})`,
            }}
          >
            <Img
              src={staticFile(src)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
