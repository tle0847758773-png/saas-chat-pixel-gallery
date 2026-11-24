import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Sonic3Console} from '../components/Sonic3Console';
import {FONTS} from '../theme';

const LETTERS = ['T', 'H', 'R', 'E', 'E'];

export const ThreeBadgeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Miniature SONIC 3 badge pops in at frame 22 with playful bounce
  const badgeSpring = spring({
    frame: Math.max(0, frame - 22),
    fps,
    config: {damping: 10, stiffness: 210, mass: 0.65},
  });
  const badgeScale =
    frame < 22 ? 0 : interpolate(badgeSpring, [0, 1], [0.1, 0.255]);
  const badgeY =
    frame < 22 ? 40 : interpolate(badgeSpring, [0, 1], [-120, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Ultra-condensed bold "THREE" */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            fontFamily: FONTS.condensed,
            fontSize: 158,
            fontWeight: 400,
            color: '#000000',
            letterSpacing: '0.025em',
            lineHeight: 0.9,
          }}
        >
          {LETTERS.map((ch, idx) => {
            const letterF = Math.max(0, frame - idx * 2.5);
            const pop = spring({
              frame: letterF,
              fps,
              config: {damping: 13, stiffness: 220, mass: 0.6},
            });
            const sy = interpolate(pop, [0, 1], [0.22, 1]);
            const ty = interpolate(pop, [0, 1], [18, 0]);
            const opacity = interpolate(pop, [0, 0.3], [0, 1], {
              extrapolateRight: 'clamp',
            });

            return (
              <span
                key={idx}
                style={{
                  display: 'inline-block',
                  transformOrigin: 'center bottom',
                  transform: `translateY(${ty}px) scaleY(${sy})`,
                  opacity,
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>

        {/* Miniature tilted SONIC 3 badge perched over H and R */}
        {frame >= 22 && (
          <div
            style={{
              position: 'absolute',
              left: '41.5%',
              top: '-6%',
              transform: `translate(-50%, -50%) translateY(${badgeY}px)`,
              filter: 'drop-shadow(0 8px 18px rgba(0, 0, 0, 0.28))',
            }}
          >
            <Sonic3Console
              scale={badgeScale}
              rotateDeg={-11}
              flatMode={false}
            />
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
