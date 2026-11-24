import React from 'react';

type CursorPointerProps = {
  x: number;
  y: number;
  scale?: number;
  clickPress?: number;
};

export const CursorPointer: React.FC<CursorPointerProps> = ({
  x,
  y,
  scale = 1,
  clickPress = 0,
}) => {
  const pressScale = 1 - clickPress * 0.14;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-6px, -4px) scale(${scale * pressScale})`,
        transformOrigin: '6px 4px',
        pointerEvents: 'none',
        zIndex: 50,
        filter: 'drop-shadow(0 6px 10px rgba(0, 0, 0, 0.35))',
      }}
    >
      <svg width="48" height="58" viewBox="0 0 48 58" fill="none">
        <path
          d="M6 4 L40 31 L24 34 L31 50 L24 53 L17 37 L6 46 Z"
          fill="#111111"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
