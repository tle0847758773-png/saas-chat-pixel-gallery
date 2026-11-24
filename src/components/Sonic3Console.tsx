import React from 'react';
import {COLORS, FONTS} from '../theme';

type Sonic3ConsoleProps = {
  scale?: number;
  rotateDeg?: number;
  showGenerateOverlay?: boolean;
  generateOpacity?: number;
  generateScale?: number;
  showSelectionBox?: boolean;
  flatMode?: boolean;
};

export const Sonic3Console: React.FC<Sonic3ConsoleProps> = ({
  scale = 1,
  rotateDeg = 0,
  showGenerateOverlay = false,
  generateOpacity = 1,
  generateScale = 1,
  showSelectionBox = false,
  flatMode = false,
}) => {
  const width = 620;
  const height = 416;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        transform: `scale(${scale}) rotate(${rotateDeg}deg)`,
        transformOrigin: 'center center',
        userSelect: 'none',
      }}
    >
      {/* Cyan bounding selection frame with white corner handles */}
      {showSelectionBox && (
        <div
          style={{
            position: 'absolute',
            inset: -16,
            border: `2.5px solid ${COLORS.selectionCyan}`,
            pointerEvents: 'none',
            zIndex: 20,
          }}
        >
          {[
            {left: -7, top: -7},
            {right: -7, top: -7},
            {left: -7, bottom: -7},
            {right: -7, bottom: -7},
          ].map((pos, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                width: 13,
                height: 13,
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: `2px solid ${COLORS.selectionCyan}`,
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.35)',
                ...pos,
              }}
            />
          ))}
        </div>
      )}

      {/* 3D lower extrusion shell */}
      {!flatMode && (
        <div
          style={{
            position: 'absolute',
            left: 2,
            right: -2,
            top: 12,
            bottom: -12,
            borderRadius: 58,
            background: `linear-gradient(180deg, ${COLORS.sonicOrangeDeep}, ${COLORS.sonicOrangeShadow})`,
            boxShadow: '0 26px 46px rgba(0, 0, 0, 0.55)',
          }}
        />
      )}

      {/* Main glossy front body */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: 58,
          background:
            'linear-gradient(160deg, #FB8E35 0%, #F06E1E 54%, #DE5612 100%)',
          border: '3px solid rgba(255, 206, 152, 0.55)',
          boxShadow: flatMode
            ? '0 4px 12px rgba(0, 0, 0, 0.3)'
            : 'inset 0 4px 10px rgba(255, 224, 184, 0.45), inset 0 -6px 12px rgba(168, 52, 6, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '24px 36px 20px',
          boxSizing: 'border-box',
        }}
      >
        {/* Top sky-blue pill header */}
        <div
          style={{
            width: 492,
            height: 52,
            borderRadius: 16,
            background: 'linear-gradient(180deg, #5BC9F0 0%, #44B3DB 100%)',
            boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 22,
          }}
        >
          <span
            style={{
              fontFamily: FONTS.sans,
              fontSize: 31,
              fontWeight: 800,
              fontStyle: 'italic',
              letterSpacing: '0.04em',
              color: '#F7DA4E',
              textShadow: '0 2px 0 rgba(25, 82, 118, 0.55)',
            }}
          >
            SONIC 3
          </span>
        </div>

        {/* Middle control & screen row */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 4px',
            boxSizing: 'border-box',
          }}
        >
          {/* Left '+' circle button */}
          <div
            style={{
              width: 86,
              height: 86,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 30%, #284652, #172B34)',
              boxShadow:
                '0 4px 8px rgba(0, 0, 0, 0.25), inset 0 2px 3px rgba(255,255,255,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="36" height="36" viewBox="0 0 36 36">
              <path
                d="M18 6 V30 M6 18 H30"
                stroke={COLORS.sonicGold}
                strokeWidth="6.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Center gold-bezel landscape LCD screen */}
          <div
            style={{
              position: 'relative',
              width: 288,
              height: 196,
              borderRadius: 8,
              backgroundColor: COLORS.sonicGold,
              padding: 12,
              boxSizing: 'border-box',
              boxShadow:
                'inset 0 2px 5px rgba(150, 95, 10, 0.35), 0 3px 8px rgba(0, 0, 0, 0.16)',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                borderRadius: 4,
                overflow: 'hidden',
                backgroundColor: '#5DC7EF',
              }}
            >
              {/* Stylized green hills & golden ring SVG scene */}
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 264 172"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="screen-sky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4CB9E8" />
                    <stop offset="100%" stopColor="#8DE0F7" />
                  </linearGradient>
                </defs>
                <rect width="264" height="172" fill="url(#screen-sky)" />
                {/* Distant dark mountain peak */}
                <polygon points="88,125 148,30 212,125" fill="#2A7A58" />
                <polygon points="148,30 174,70 156,66 144,82 128,66" fill="#5CB567" />
                {/* Back light-green hill */}
                <path
                  d="M0,104 Q72,62 152,102 T264,96 L264,172 L0,172 Z"
                  fill="#78CA43"
                />
                {/* Foreground rich green hill */}
                <path
                  d="M0,136 Q84,96 168,128 T264,122 L264,172 L0,172 Z"
                  fill="#49A83B"
                />
                {/* Golden Sonic ring & curved path */}
                <circle
                  cx="132"
                  cy="128"
                  r="32"
                  fill="none"
                  stroke="#F7D554"
                  strokeWidth="12"
                />
                <path
                  d="M126,172 Q158,122 220,126"
                  fill="none"
                  stroke="#D9B75A"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
              </svg>

              {/* Frosted "Generate" action pill overlay */}
              {showGenerateOverlay && (
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) scale(${generateScale})`,
                    opacity: generateOpacity,
                    width: 196,
                    height: 62,
                    borderRadius: 14,
                    backgroundColor: 'rgba(22, 34, 28, 0.78)',
                    backdropFilter: 'blur(6px)',
                    border: '1.5px solid rgba(255, 255, 255, 0.22)',
                    boxShadow: '0 10px 26px rgba(0, 0, 0, 0.42)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONTS.sans,
                      fontSize: 28,
                      fontWeight: 500,
                      color: '#FFFFFF',
                      letterSpacing: '0.01em',
                    }}
                  >
                    Generate
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right '=' circle button */}
          <div
            style={{
              width: 86,
              height: 86,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 30%, #284652, #172B34)',
              boxShadow:
                '0 4px 8px rgba(0, 0, 0, 0.25), inset 0 2px 3px rgba(255,255,255,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="36" height="36" viewBox="0 0 36 36">
              <path
                d="M7 12.5 H29 M7 23.5 H29"
                stroke={COLORS.sonicGold}
                strokeWidth="6.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Bottom gold speaker grille slots */}
        <div
          style={{
            marginTop: 22,
            width: 168,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          {[0, 1, 2, 3, 4, 5].map((row) => (
            <div
              key={row}
              style={{
                width: '100%',
                height: 5.5,
                borderRadius: 4,
                backgroundColor: '#D69B38',
                boxShadow: 'inset 0 1px 2px rgba(95, 50, 8, 0.45)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
