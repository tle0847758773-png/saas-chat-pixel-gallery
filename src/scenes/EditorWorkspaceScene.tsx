import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {CursorPointer} from '../components/CursorPointer';
import {Sonic3Console} from '../components/Sonic3Console';
import {SpatialGallery3D} from '../components/SpatialGallery3D';
import {COLORS, FONTS} from '../theme';
import {Sonic3MatScene} from './Sonic3MatScene';

export const EditorWorkspaceScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Camera zooms into the embedded preview viewport between frames 54..108
  const zoomT = interpolate(frame, [54, 108], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const workspaceScale = interpolate(zoomT, [0, 1], [1.0, 1.88]);
  const workspaceX = interpolate(zoomT, [0, 1], [0, -85]);
  const workspaceY = interpolate(zoomT, [0, 1], [0, -140]);

  // Switch preview content to 3D Spatial Gallery on click at frame 108
  const showGallery = frame >= 108;

  // Cursor path: 00:34:587 -> Generate button -> slight hover drift inside gallery
  let cursorX = 432;
  let cursorY = 774;
  if (frame < 56) {
    const t = interpolate(frame, [8, 56], [0, 1], {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    cursorX = interpolate(t, [0, 1], [432, 995]);
    cursorY = interpolate(t, [0, 1], [774, 520]);
  } else if (frame < 108) {
    const t = interpolate(frame, [56, 104], [0, 1], {
      easing: Easing.out(Easing.quad),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    cursorX = interpolate(t, [0, 1], [995, 1005]);
    cursorY = interpolate(t, [0, 1], [520, 495]);
  } else {
    const t = interpolate(frame, [108, 170], [0, 1], {
      easing: Easing.out(Easing.quad),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    cursorX = interpolate(t, [0, 1], [1005, 895]);
    cursorY = interpolate(t, [0, 1], [495, 452]);
  }

  const clickPress = interpolate(frame, [104, 108, 113], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
      }}
    >
      {/* Subtle bottom-left lime glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 8% 92%, ${COLORS.editorLimeGlow} 0%, rgba(226, 254, 179, 0) 48%)`,
        }}
      />

      {/* Zoomable editor workspace stage */}
      <AbsoluteFill
        style={{
          transform: `translate(${workspaceX}px, ${workspaceY}px) scale(${workspaceScale})`,
          transformOrigin: '48% 58%',
        }}
      >
        {/* Floating vertical left toolbar pill */}
        <div
          style={{
            position: 'absolute',
            left: 256,
            top: 162,
            width: 78,
            height: 332,
            borderRadius: 22,
            backgroundColor: '#FFFFFF',
            boxShadow: '0 14px 36px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            padding: '12px 0',
            boxSizing: 'border-box',
          }}
        >
          {/* Club icon */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 5 C12.8 5 10.5 7.4 10.5 10.4 C10.5 11.4 10.8 12.2 11.2 13 C8.2 13 6 15.2 6 18.2 C6 21.1 8.4 23.2 11.2 23.2 C13 23.2 14.3 22.4 15 21.3 L13.5 27 H18.5 L17 21.3 C17.7 22.4 19 23.2 20.8 23.2 C23.6 23.2 26 21.1 26 18.2 C26 15.2 23.8 13 20.8 13 C21.2 12.2 21.5 11.4 21.5 10.4 C21.5 7.4 19.2 5 16 5 Z"
              stroke="#111111"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>

          {/* Scissors icon */}
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <circle cx="8" cy="9" r="3.5" stroke="#111" strokeWidth="2" />
            <circle cx="8" cy="21" r="3.5" stroke="#111" strokeWidth="2" />
            <path
              d="M11 11 L24 21 M11 19 L24 9"
              stroke="#111"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          {/* Circle tool icon */}
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <circle cx="15" cy="15" r="10.5" stroke="#111" strokeWidth="1.9" />
          </svg>

          {/* Magic wand spray icon */}
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path
              d="M7 23 L17 13"
              stroke="#111"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <circle cx="19" cy="10" r="1.4" fill="#111" />
            <circle cx="23" cy="7" r="1.2" fill="#111" />
            <circle cx="24" cy="13" r="1.2" fill="#111" />
            <circle cx="15" cy="7" r="1.2" fill="#111" />
          </svg>
        </div>

        {/* Main White Preview Window Card */}
        <div
          style={{
            position: 'absolute',
            left: 336,
            top: 112,
            width: 1248,
            height: 702,
            borderRadius: 16,
            backgroundColor: '#F7F7F7',
            boxShadow: '0 22px 60px rgba(0, 0, 0, 0.09)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Preview Viewport */}
          <div
            style={{
              position: 'relative',
              margin: '28px 64px 0',
              width: 1120,
              height: 604,
              backgroundColor: '#101412',
              overflow: 'hidden',
            }}
          >
            {!showGallery ? (
              <div
                style={{
                  width: 1920,
                  height: 1080,
                  transform: 'scale(0.583333)',
                  transformOrigin: 'top left',
                }}
              >
                <Sonic3MatScene frozen />
              </div>
            ) : (
              <div
                style={{
                  width: 1920,
                  height: 1080,
                  transform: 'scale(0.583333)',
                  transformOrigin: 'top left',
                }}
              >
                <SpatialGallery3D
                  startAngle={14}
                  speed={0.55}
                  frameOffset={frame - 108}
                />
              </div>
            )}

            {/* Yellow dashed safe-area overlay & center vertical guide */}
            <div
              style={{
                position: 'absolute',
                inset: 28,
                border: '2px dashed #E5E839',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                bottom: 0,
                borderLeft: '2px dashed #E5E839',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Bottom Transport Controls Bar */}
          <div
            style={{
              flex: 1,
              padding: '0 64px',
              display: 'flex',
              alignItems: 'center',
              gap: 42,
              fontFamily: FONTS.sans,
              fontSize: 18,
              color: '#111111',
            }}
          >
            <span style={{fontVariantNumeric: 'tabular-nums', fontWeight: 500}}>
              00:34:587
            </span>
            {/* Step back triangle */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 3 L4 8 L12 13 Z" stroke="#111" strokeWidth="1.6" />
            </svg>
            {/* Play triangle */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="#111">
              <path d="M4 2.5 L13 8 L4 13.5 Z" />
            </svg>
            {/* Skewed frame icon */}
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
              <polygon
                points="4,2 16,2 14,12 2,12"
                stroke="#111"
                strokeWidth="1.6"
              />
            </svg>
            {/* Record circle-dot */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="#111" strokeWidth="1.4" />
              <circle cx="8" cy="8" r="2.2" fill="#111" />
            </svg>
            <span style={{fontWeight: 500}}>Start animation</span>
          </div>
        </div>

        {/* Bottom 5-card Timeline Strip */}
        <div
          style={{
            position: 'absolute',
            left: 326,
            top: 846,
            display: 'flex',
            gap: 18,
          }}
        >
          {[0, 1, 2].map((idx) => (
            <div
              key={`sonic-thumb-${idx}`}
              style={{
                width: 238,
                height: 138,
                borderRadius: 16,
                backgroundColor: COLORS.matGreen,
                border: `4px solid ${COLORS.editorThumbBorder}`,
                boxSizing: 'border-box',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sonic3Console scale={0.31} flatMode />
            </div>
          ))}
          {[0, 1].map((idx) => (
            <div
              key={`cafe-thumb-${idx}`}
              style={{
                width: 238,
                height: 138,
                borderRadius: 16,
                border: '2px solid #D8D8D4',
                boxSizing: 'border-box',
                overflow: 'hidden',
                backgroundColor: '#1C1610',
              }}
            >
              <Img
                src={staticFile('assets/gallery-warm-cafe.jpg')}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          ))}
        </div>

        <CursorPointer
          x={cursorX}
          y={cursorY}
          scale={0.95}
          clickPress={clickPress}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
