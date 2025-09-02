import { FC, useCallback, useState } from 'react';
import * as THREE from 'three';

import { Feature } from '../types';

import { Model } from './Model';
import { useXRControllerButtonEvent, useXRInputSourceState } from '@react-three/xr';
import { useFrame } from '@react-three/fiber';
import { XRInputSourceStateMap } from '@pmndrs/xr/internals';

interface Props {
  objects: Feature[];
  selectedObject?: Feature | null;
  onObjectSelect: (object: Feature) => void;
  onObjectDelete: (object: Feature) => void;
}

export const GalleryScene: FC<Props> = ({
  objects,
  selectedObject,
  onObjectSelect,
  onObjectDelete,
}) => {
  const [grabbedObject, setGrabbedObject] = useState<{
    object: Feature;
    offset: THREE.Vector3
  } | null>(null);

  const leftController = useXRInputSourceState('controller', 'left');
  const rightController = useXRInputSourceState('controller', 'right');

  // Обработчик захвата объекта
  const handleGrab = useCallback((controller: XRInputSourceStateMap['controller'], object: Feature) => {
    if (!controller) return;

    const controllerPosition = new THREE.Vector3();
    controller.object?.getWorldPosition(controllerPosition);

    const objectPosition = new THREE.Vector3(...object.position);
    const offset = objectPosition.clone().sub(controllerPosition);

    setGrabbedObject({ object, offset });
    onObjectSelect(object);
  }, [onObjectSelect]);

  // Обработчик отпускания объекта
  const handleRelease = useCallback(() => {
    setGrabbedObject(null);
  }, []);

  // События захвата для кнопок
  useXRControllerButtonEvent(leftController, 'squeeze', () => {
    if (selectedObject && !grabbedObject && leftController) {
      handleGrab(leftController, selectedObject);
    }
  });

  useXRControllerButtonEvent(rightController, 'squeeze', () => {
    if (selectedObject && !grabbedObject && rightController) {
      handleGrab(rightController, selectedObject);
    }
  });

  // События отпускания
  useXRControllerButtonEvent(leftController, 'squeeze-end', handleRelease);
  useXRControllerButtonEvent(rightController, 'squeeze-end', handleRelease);

  // Удаление объекта через кнопку X
  useXRControllerButtonEvent(leftController, 'x-button', () => {
    if (selectedObject && !grabbedObject) {
      onObjectDelete(selectedObject);
    }
  });

  useXRControllerButtonEvent(rightController, 'x-button', () => {
    if (selectedObject && !grabbedObject) {
      onObjectDelete(selectedObject);
    }
  });

  // Обновление позиции захваченного объекта
  useFrame(() => {
    if (grabbedObject && (leftController || rightController)) {
      const controller = grabbedObject.object.position[0] < 0 ? leftController : rightController;
      if (!controller) return;

      const controllerPosition = new THREE.Vector3();
      controller.object?.getWorldPosition(controllerPosition);

      const newPosition = controllerPosition.clone().add(grabbedObject.offset);
      grabbedObject.object.position = [newPosition.x, newPosition.y, newPosition.z];
    }
  });

  return (
    <>
      {/* Пол */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshLambertMaterial color="#444444" transparent opacity={0.8} />
      </mesh>

      {/* Стены */}
      <mesh position={[0, 5, -10]} castShadow receiveShadow>
        <boxGeometry args={[20, 10, 0.1]} />
        <meshLambertMaterial color="#666666" transparent opacity={0.6} />
      </mesh>

      <mesh position={[-10, 5, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[20, 10, 0.1]} />
        <meshLambertMaterial color="#666666" transparent opacity={0.6} />
      </mesh>

      <mesh position={[10, 5, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[20, 10, 0.1]} />
        <meshLambertMaterial color="#666666" transparent opacity={0.6} />
      </mesh>

      {/* 3D модели */}
      {objects.map((object) => (
        <Model
          key={object.id}
          object={object}
          isSelected={selectedObject?.id === object.id}
          onSelect={() => onObjectSelect(object)}
        />
      ))}
    </>
  );
};
