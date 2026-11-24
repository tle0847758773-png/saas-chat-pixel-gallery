import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {ChatGPTPromptScene} from './scenes/ChatGPTPromptScene';
import {EditorWorkspaceScene} from './scenes/EditorWorkspaceScene';
import {KineticDomeScene} from './scenes/KineticDomeScene';
import {LayerWritingScene} from './scenes/LayerWritingScene';
import {ScrollingListMatScene} from './scenes/ScrollingListMatScene';
import {Sonic3MatScene} from './scenes/Sonic3MatScene';
import {SpatialGalleryScene} from './scenes/SpatialGalleryScene';
import {SplitEyesOutroScene} from './scenes/SplitEyesOutroScene';
import {ThreeBadgeScene} from './scenes/ThreeBadgeScene';
import {TrainWindowScene} from './scenes/TrainWindowScene';
import {VerticalSlicesSofaScene} from './scenes/VerticalSlicesSofaScene';
import {SCENES} from './theme';

export const SaasChatPixelGallery: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000000'}}>
      <Audio src={staticFile('assets/soundtrack.wav')} />

      <Sequence
        from={SCENES.train.from}
        durationInFrames={SCENES.train.duration}
      >
        <TrainWindowScene />
      </Sequence>

      <Sequence
        from={SCENES.chatgpt.from}
        durationInFrames={SCENES.chatgpt.duration}
      >
        <ChatGPTPromptScene />
      </Sequence>

      <Sequence
        from={SCENES.scrollList1.from}
        durationInFrames={SCENES.scrollList1.duration}
      >
        <ScrollingListMatScene startIndex={4} targetIndex={10} />
      </Sequence>

      <Sequence
        from={SCENES.sonicMat1.from}
        durationInFrames={SCENES.sonicMat1.duration}
      >
        <Sonic3MatScene durationFrames={SCENES.sonicMat1.duration} />
      </Sequence>

      <Sequence
        from={SCENES.editor.from}
        durationInFrames={SCENES.editor.duration}
      >
        <EditorWorkspaceScene />
      </Sequence>

      <Sequence
        from={SCENES.kineticDome.from}
        durationInFrames={SCENES.kineticDome.duration}
      >
        <KineticDomeScene />
      </Sequence>

      <Sequence
        from={SCENES.gallery1.from}
        durationInFrames={SCENES.gallery1.duration}
      >
        <SpatialGalleryScene startAngle={22} speed={0.62} />
      </Sequence>

      <Sequence
        from={SCENES.slicesSofa.from}
        durationInFrames={SCENES.slicesSofa.duration}
      >
        <VerticalSlicesSofaScene />
      </Sequence>

      <Sequence
        from={SCENES.threeBadge.from}
        durationInFrames={SCENES.threeBadge.duration}
      >
        <ThreeBadgeScene />
      </Sequence>

      <Sequence
        from={SCENES.sonicMat2.from}
        durationInFrames={SCENES.sonicMat2.duration}
      >
        <Sonic3MatScene durationFrames={SCENES.sonicMat2.duration} />
      </Sequence>

      <Sequence
        from={SCENES.gallery2.from}
        durationInFrames={SCENES.gallery2.duration}
      >
        <SpatialGalleryScene startAngle={88} speed={0.68} />
      </Sequence>

      <Sequence
        from={SCENES.layerWriting.from}
        durationInFrames={SCENES.layerWriting.duration}
      >
        <LayerWritingScene />
      </Sequence>

      <Sequence
        from={SCENES.scrollList2.from}
        durationInFrames={SCENES.scrollList2.duration}
      >
        <ScrollingListMatScene startIndex={6} targetIndex={10} />
      </Sequence>

      <Sequence
        from={SCENES.sonicMat3.from}
        durationInFrames={SCENES.sonicMat3.duration}
      >
        <Sonic3MatScene durationFrames={SCENES.sonicMat3.duration} />
      </Sequence>

      <Sequence
        from={SCENES.splitEyes.from}
        durationInFrames={SCENES.splitEyes.duration}
      >
        <SplitEyesOutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
