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
import {COLORS, FONTS, SCENES} from '../theme';

// Deterministic snow/dust streak particles drifting across the frosted strip
const DUST_PARTICLES = Array.from({length: 44}, (_, i) => ({
  id: i,
  x: (i * 193) % 1920,
  y: 120 + ((i * 137) % 810),
  length: 8 + (i % 4) * 5,
  thickness: i % 3 === 0 ? 3 : 2,
  angle: -26 + (i % 5) * 9,
  vx: -1.4 - (i % 3) * 0.7,
  vy: 0.7 + (i % 4) * 0.4,
  opacity: 0.35 + (i % 4) * 0.16,
}));

const SLICE_START_Y = [95, -680, 560, -760];
const SLICE_DELAYS = [0, 3, 6, 9];

const SofaComposite: React.FC<{frame: number}> = ({frame}) => {
  const duration = SCENES.slicesSofa.duration;
  const imgScale = interpolate(frame, [0, duration], [1.0, 1.045], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'relative',
        width: 1920,
        height: 1080,
        overflow: 'hidden',
        backgroundColor: '#25211D',
      }}
    >
      <Img
        src={staticFile('assets/living-room-sofa.jpg')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${imgScale})`,
          transformOrigin: '50% 65%',
        }}
      />

      {/* Frosted central glass strip bounded by crisp white horizontal rules */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 112,
          height: 842,
          borderTop: '2.5px solid rgba(255, 255, 255, 0.92)',
          borderBottom: '2.5px solid rgba(255, 255, 255, 0.92)',
          backgroundColor: 'rgba(26, 22, 18, 0.44)',
          backdropFilter: 'blur(7px)',
          overflow: 'hidden',
        }}
      >
        {/* Drifting angled white dust specks */}
        {DUST_PARTICLES.map((p) => {
          const px = ((p.x + frame * p.vx) % 1920 + 1920) % 1920;
          const py = ((p.y - 112 + frame * p.vy) % 842 + 842) % 842;
          return (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                left: px,
                top: py,
                width: p.length,
                height: p.thickness,
                borderRadius: 2,
                backgroundColor: '#FFFFFF',
                opacity: p.opacity,
                transform: `rotate(${p.angle}deg)`,
              }}
            />
          );
        })}
      </div>

      {/* Bottom-left subtle white floor circle accent */}
      <div
        style={{
          position: 'absolute',
          left: 62,
          top: 992,
          width: 156,
          height: 156,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.85) 100%)',
        }}
      />

      {/* Full-width edge-to-edge kinetic statement */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '50%',
          transform: 'translateY(-52%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONTS.sans,
          fontSize: 102,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{color: 'rgba(255, 255, 255, 0.56)'}}>
          you don&apos;t even&nbsp;
        </span>
        <span style={{color: '#FFFFFF'}}>need</span>
        <span style={{color: 'rgba(255, 255, 255, 0.56)'}}>
          &nbsp;to make them from
        </span>
      </div>
    </div>
  );
};

export const VerticalSlicesSofaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  if (frame >= 40) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: COLORS.sliceBackdrop,
          overflow: 'hidden',
        }}
      >
        <SofaComposite frame={frame} />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.sliceBackdrop,
        overflow: 'hidden',
      }}
    >
      {[0, 1, 2, 3].map((colIdx) => {
        const localF = Math.max(0, frame - SLICE_DELAYS[colIdx]);
        const progress = spring({
          frame: localF,
          fps,
          config: {damping: 14, stiffness: 155, mass: 0.72},
        });
        const offsetY = interpolate(
          progress,
          [0, 1],
          [SLICE_START_Y[colIdx], 0],
        );
        const motionBlur = Math.min(4, Math.abs(offsetY) * 0.012);

        return (
          <div
            key={colIdx}
            style={{
              position: 'absolute',
              left: colIdx * 480,
              top: 0,
              width: 480,
              height: 1080,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: 1920,
                height: 1080,
                transform: `translate(${-colIdx * 480}px, ${offsetY}px)`,
                filter:
                  motionBlur > 0.35
                    ? `blur(${motionBlur.toFixed(2)}px)`
                    : undefined,
              }}
            >
              <SofaComposite frame={frame} />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
