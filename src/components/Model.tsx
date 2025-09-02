import { FC, useMemo } from 'react';

import { Feature } from '../types';
import { GEOMETRY_COLORS } from '../constants';

interface Props {
  object: Feature;
  isSelected?: boolean;
  onSelect?: (object: Feature) => void;
}

export const Model: FC<Props> = ({
  object,
  isSelected,
  onSelect,
}) => {
  const color = GEOMETRY_COLORS[object.geometryType];

  const geometryEl = useMemo(() => {
    switch (object.geometryType) {
      case 'box':
        return <boxGeometry args={[1, 1, 1]} />;
      case 'sphere':
        return <sphereGeometry args={[0.5, 32, 32]} />;
      case 'cone':
        return <coneGeometry args={[0.5, 1, 32]} />;
      case 'torus':
        return <torusGeometry args={[0.5, 0.2, 16, 100]} />;
      case 'octahedron':
        return <octahedronGeometry args={[0.5]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  }, [object.geometryType]);

  return (
    <group>
      <mesh
        position={object.position}
        rotation={object.rotation}
        scale={object.scale}
        onClick={() => onSelect?.(object)}
        castShadow
        receiveShadow
      >
        {geometryEl}
        <meshLambertMaterial
          color={isSelected ? '#ffff00' : color}
          emissive={isSelected ? '#444400' : '#000000'}
        />
      </mesh>
    </group>
  );
};
