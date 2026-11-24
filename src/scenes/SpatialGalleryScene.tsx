import React from 'react';
import {SpatialGallery3D} from '../components/SpatialGallery3D';

type SpatialGallerySceneProps = {
  startAngle?: number;
  speed?: number;
};

export const SpatialGalleryScene: React.FC<SpatialGallerySceneProps> = ({
  startAngle = 22,
  speed = 0.62,
}) => {
  return <SpatialGallery3D startAngle={startAngle} speed={speed} />;
};
