import { FC, useMemo } from 'react';

import { Feature } from '../types';
import { GEOMETRY_COLORS } from '../constants';

interface Props {
  object: Feature;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: (object: Feature) => void;
  onHover?: (object: Feature) => void;
  onUnhover?: (object: Feature) => void;
}

export const Model: FC<Props> = ({ object, isSelected, isHovered, onSelect, onHover, onUnhover }) => {
  const color = GEOMETRY_COLORS[object.geometryType];

  const geometryEl = useMemo(() => {
    const name = `${object.name}-geometry`;

    switch (object.geometryType) {
      case 'box':
        return <boxGeometry args={[1, 1, 1]} name={name} />;
      case 'sphere':
        return <sphereGeometry args={[0.5, 32, 32]} name={name} />;
      case 'cone':
        return <coneGeometry args={[0.5, 1, 32]} name={name} />;
      case 'torus':
        return <torusGeometry args={[0.5, 0.2, 16, 100]} name={name} />;
      case 'octahedron':
        return <octahedronGeometry args={[0.5]} name={name} />;
      default:
        return <boxGeometry args={[1, 1, 1]} name={name} />;
    }
  }, [object.geometryType]);

  return (
    <group>
      <mesh
        position={object.position}
        rotation={object.rotation}
        scale={object.scale}
        onClick={() => onSelect?.(object)}
        onPointerOver={() => onHover?.(object)}
        onPointerOut={() => onUnhover?.(object)}
        castShadow
        receiveShadow
        name={`${object.name}-mesh`}
      >
        {geometryEl}
        <meshLambertMaterial color={isSelected ? '#ffff00' : isHovered ? `#ff3000` : color}
                             emissive={isSelected ? '#444400' : isHovered ? '#444000' : '#000000'}
                             name={`${object.name}-meshLambertMaterial`}
        />
      </mesh>
    </group>
  );
};
