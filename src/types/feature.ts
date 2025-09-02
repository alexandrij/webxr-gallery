import { GeometryType } from './geometryType.ts';

export interface Feature {
  id: number;
  name: string;
  url: string;
  geometryType: GeometryType;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}
