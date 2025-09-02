import { Feature } from '../types';
import { GEOMETRY_TYPES, MODEL_URLS } from '../constants.ts';

let genId = 0;
export const createFeature = (): Feature => {
  const i = genId++;
  const radius = 3;
  const angle = i < MODEL_URLS.length ? (i / MODEL_URLS.length) * Math.PI * 2 : Math.random() * Math.PI * 2;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  return {
    id: i,
    name: `Model_${i}`,
    url: MODEL_URLS[i],
    geometryType: GEOMETRY_TYPES[i % GEOMETRY_TYPES.length],
    position: [x, 1, z],
    rotation: [0, angle + Math.PI, 0],
    scale: 0.4,
  };
};