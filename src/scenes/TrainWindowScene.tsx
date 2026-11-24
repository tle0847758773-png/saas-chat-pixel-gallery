import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {SCENES} from '../theme';

export const TrainWindowScene: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = SCENES.train.duration;

  const scale = interpolate(frame, [0, duration], [1.0, 1.24], {
    easing: Easing.inOut(Easing.quad),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const translateY = interpolate(frame, [0, duration], [0, -14], {
    easing: Easing.inOut(Easing.quad),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#1A1C20', overflow: 'hidden'}}>
      <Img
        src={staticFile('assets/train-window.jpg')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale}) translateY(${translateY}px)`,
          transformOrigin: '50% 46%',
        }}
      />
    </AbsoluteFill>
  );
};
