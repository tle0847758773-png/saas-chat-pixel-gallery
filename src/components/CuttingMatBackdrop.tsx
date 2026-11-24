import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COLORS, FONTS} from '../theme';

type CuttingMatBackdropProps = {
  showChalk?: boolean;
  darkVignette?: boolean;
};

export const CuttingMatBackdrop: React.FC<CuttingMatBackdropProps> = ({
  showChalk = false,
  darkVignette = false,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.deskWood,
        overflow: 'hidden',
      }}
    >
      {/* Subtle warm wood desk depth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 25% 20%, rgba(155, 130, 98, 0.35), rgba(65, 50, 35, 0.55))',
        }}
      />

      {/* Tilted dark-green cutting mat with beige outer trim and fine SVG grid */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 2380,
          height: 1120,
          transform: 'translate(-50%, -48%) rotate(-17.5deg)',
          backgroundColor: COLORS.matGreen,
          border: `18px solid ${COLORS.matTrim}`,
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.48)',
          overflow: 'hidden',
        }}
      >
        <svg
          width="2380"
          height="1120"
          viewBox="0 0 2380 1120"
          style={{display: 'block'}}
        >
          <defs>
            <pattern
              id="cutting-mat-grid"
              width="72"
              height="72"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 72 0 L 0 0 0 72"
                fill="none"
                stroke="rgba(166, 212, 196, 0.14)"
                strokeWidth="1.4"
              />
            </pattern>
            <radialGradient id="mat-sheen" cx="45%" cy="40%" r="65%">
              <stop offset="0%" stopColor="rgba(120, 170, 150, 0.08)" />
              <stop offset="100%" stopColor="rgba(8, 16, 13, 0.32)" />
            </radialGradient>
          </defs>
          <rect width="2380" height="1120" fill="url(#cutting-mat-grid)" />
          <rect width="2380" height="1120" fill="url(#mat-sheen)" />
        </svg>
      </div>

      {/* Optional neon-lime broken chalk sticks resting on the mat */}
      {showChalk && (
        <div
          style={{
            position: 'absolute',
            left: 765,
            top: 230,
            width: 150,
            height: 115,
            pointerEvents: 'none',
          }}
        >
          {/* Back chalk stick */}
          <div
            style={{
              position: 'absolute',
              left: 8,
              top: 16,
              width: 110,
              height: 28,
              borderRadius: 8,
              transform: 'rotate(-16deg)',
              background:
                'linear-gradient(180deg, #D5FF72 0%, #91D925 45%, #558C12 100%)',
              boxShadow: '3px 10px 14px rgba(0, 0, 0, 0.42)',
            }}
          />
          {/* Front shorter angled chalk piece */}
          <div
            style={{
              position: 'absolute',
              left: 40,
              top: 48,
              width: 82,
              height: 28,
              borderRadius: 8,
              transform: 'rotate(-43deg)',
              background:
                'linear-gradient(180deg, #DEFF85 0%, #9BE32B 45%, #548B11 100%)',
              boxShadow: '4px 12px 16px rgba(0, 0, 0, 0.46)',
            }}
          />
        </div>
      )}

      {/* Ivory round coaster ("MAD 33") */}
      <div
        style={{
          position: 'absolute',
          left: 1286,
          top: 382,
          width: 108,
          height: 108,
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 38% 34%, #EDE7DB 0%, #DFD6C7 70%, #BEB4A5 100%)',
          boxShadow: '4px 10px 18px rgba(0, 0, 0, 0.44)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'rotate(-14deg)',
          fontFamily: FONTS.sans,
          color: '#5B558A',
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: '0.02em',
        }}
      >
        <span style={{fontSize: 21}}>MAD</span>
        <span style={{fontSize: 20, marginTop: 2}}>33</span>
      </div>

      {/* Vertical wooden dowel stick on the right */}
      <div
        style={{
          position: 'absolute',
          left: 1592,
          top: 446,
          width: 15,
          height: 368,
          borderRadius: 8,
          transform: 'rotate(-2.4deg)',
          background:
            'linear-gradient(90deg, #62472C 0%, #B38D63 38%, #8F6B45 75%, #513820 100%)',
          boxShadow: '8px 12px 16px rgba(0, 0, 0, 0.45)',
        }}
      />

      {/* Atmospheric vignette used behind the scrolling list scenes */}
      {darkVignette && (
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(10, 16, 13, 0.36) 0%, rgba(7, 11, 9, 0.62) 100%)',
          }}
        />
      )}
    </AbsoluteFill>
  );
};
