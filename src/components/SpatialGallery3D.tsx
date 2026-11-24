import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {GALLERY_IMAGES} from '../theme';

type CardSpec = {
  id: number;
  src: string;
  angleDeg: number;
  radius: number;
  yOffset: number;
  width: number;
  height: number;
  tiltX: number;
  tiltZ: number;
};

// Deterministic 28-card 3D spatial cloud spanning 3 concentric rings and 3 vertical tiers
const CARDS: CardSpec[] = Array.from({length: 28}, (_, i) => {
  const ring = i % 3; // 0: inner, 1: mid, 2: outer
  const tier = Math.floor(i / 10) - 1; // -1, 0, +1
  const src = GALLERY_IMAGES[i % GALLERY_IMAGES.length];

  // Aspect ratios varied by image style
  const isWide = src.includes('warm-cafe');
  const isSquare = src.includes('bokeh');
  const baseScale = ring === 0 ? 1.06 : ring === 1 ? 0.94 : 0.84;
  const width = Math.round((isWide ? 340 : isSquare ? 275 : 265) * baseScale);
  const height = Math.round((isWide ? 245 : isSquare ? 265 : 345) * baseScale);

  const angleDeg = (i * 46.8 + ring * 23) % 360;
  const radius = ring === 0 ? 600 : ring === 1 ? 820 : 1040;
  const jitterY = ((i * 97) % 140) - 70;
  const yOffset = tier * 340 + jitterY;
  const tiltX = ((i * 29) % 10) - 5;
  const tiltZ = ((i * 17) % 6) - 3;

  return {
    id: i,
    src,
    angleDeg,
    radius,
    yOffset,
    width,
    height,
    tiltX,
    tiltZ,
  };
});

type SpatialGallery3DProps = {
  startAngle?: number;
  speed?: number;
  frameOffset?: number;
  cameraTiltX?: number;
  cameraZ?: number;
};

export const SpatialGallery3D: React.FC<SpatialGallery3DProps> = ({
  startAngle = 15,
  speed = 0.55,
  frameOffset = 0,
  cameraTiltX = -4,
  cameraZ = 210,
}) => {
  const frame = useCurrentFrame() + frameOffset;
  const orbitY = startAngle + frame * speed;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000000',
        overflow: 'hidden',
        perspective: 950,
        perspectiveOrigin: '50% 50%',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 0,
          height: 0,
          transformStyle: 'preserve-3d',
          transform: `translateZ(${cameraZ}px) rotateX(${cameraTiltX}deg) rotateY(${orbitY}deg)`,
        }}
      >
        {CARDS.map((card) => (
          <div
            key={card.id}
            style={{
              position: 'absolute',
              left: -card.width / 2,
              top: -card.height / 2,
              width: card.width,
              height: card.height,
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'visible',
              transform: `rotateY(${card.angleDeg}deg) translate3d(0px, ${card.yOffset}px, ${card.radius}px) rotateX(${card.tiltX}deg) rotateZ(${card.tiltZ}deg)`,
              boxShadow: '0 18px 42px rgba(0, 0, 0, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: '#090909',
              overflow: 'hidden',
            }}
          >
            <Img
              src={staticFile(card.src)}
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
