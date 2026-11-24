import React from 'react';
import {Composition} from 'remotion';
import {SaasChatPixelGallery} from './SaasChatPixelGallery';
import {
  VIDEO_DURATION,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from './theme';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="SaasChatPixelGallery"
      component={SaasChatPixelGallery}
      durationInFrames={VIDEO_DURATION}
      fps={VIDEO_FPS}
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
    />
  );
};
