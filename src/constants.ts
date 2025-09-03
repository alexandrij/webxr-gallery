import { GeometryType } from './types/geometryType.ts';

export const MODEL_URLS = [
  'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
  'https://threejs.org/examples/models/gltf/Flamingo/glTF/Flamingo.gltf',
  'https://threejs.org/examples/models/gltf/Parrot/glTF/Parrot.gltf',
  'https://threejs.org/examples/models/gltf/Stork/glTF/Stork.gltf',
  'https://threejs.org/examples/models/gltf/CesiumAir/glTF/CesiumAir.gltf',
];

export const GEOMETRY_TYPES: GeometryType[] = ['box', 'sphere', 'cone', 'torus', 'octahedron'];

export const GEOMETRY_COLORS: Record<GeometryType, string> = {
  box: '#ff0000',
  sphere: '#00ff00',
  cone: '#0000ff',
  torus: '#ffff00',
  octahedron: '#ff00ff',
};

// export const MODEL_PATHS = [
//   '/models/model1.glb',
//   '/models/model2.glb',
//   '/models/model3.glb',
//   '/models/model4.glb',
//   '/models/model5.glb',
// ];
