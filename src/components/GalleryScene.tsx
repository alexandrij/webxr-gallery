import { FC, useCallback, useState } from 'react';
import * as THREE from 'three';
import { XRInputSourceStateMap } from '@pmndrs/xr/internals';

import { Feature } from '../types';

import { Model } from './Model';
import { useXRControllerButtonEvent, useXRInputSourceState } from '@react-three/xr';
import { useFrame } from '@react-three/fiber';
import { appStore } from '../stores';
import { observer } from 'mobx-react-lite';

export const GalleryScene: FC = observer(() => {
  // Выбор объекта
  const onObjectSelect = useCallback((object: Feature) => {
    if (appStore.selectedObject?.id === object.id) {
      appStore.selectObject(null);
    } else {
      appStore.selectObject(object);
    }
  }, []);

  // Наведение объекта
  const onObjectHover = useCallback((object: Feature | null) => {
    appStore.hoverObject(object);

    if (object) {
      console.debug(`onObjectHover: Объект: ${object?.name}; Тип: ${object?.geometryType}`);
    }
  }, []);

  // Удаление объекта
  const onObjectDelete = useCallback((object: Feature) => {
    appStore.deleteObject(object);
  }, []);

  const [grabbedObject, setGrabbedObject] = useState<{
    object: Feature;
    offset: THREE.Vector3;
  } | null>(null);

  const leftController = useXRInputSourceState('controller', 'left');
  const rightController = useXRInputSourceState('controller', 'right');

  // Обработчик захвата объекта
  const handleGrab = useCallback(
    (controller: XRInputSourceStateMap['controller'], object: Feature) => {
      if (!controller) return;

      const controllerPosition = new THREE.Vector3();
      controller.object?.getWorldPosition(controllerPosition);

      const objectPosition = new THREE.Vector3(...object.position);
      const offset = objectPosition.clone().sub(controllerPosition);

      setGrabbedObject({ object, offset });
      onObjectSelect(object);
    },
    [onObjectSelect],
  );

  // Обработчик отпускания объекта
  const handleRelease = useCallback(() => {
    setGrabbedObject(null);
  }, []);

  // События захвата для кнопок
  useXRControllerButtonEvent(leftController, 'squeeze', () => {
    if (appStore.selectedObject && !grabbedObject && leftController) {
      handleGrab(leftController, appStore.selectedObject);
    }
  });

  useXRControllerButtonEvent(rightController, 'squeeze', () => {
    if (appStore.selectedObject && !grabbedObject && rightController) {
      handleGrab(rightController, appStore.selectedObject);
    }
  });

  // События отпускания
  useXRControllerButtonEvent(leftController, 'squeeze-end', handleRelease);
  useXRControllerButtonEvent(rightController, 'squeeze-end', handleRelease);

  // Удаление объекта через кнопку X
  useXRControllerButtonEvent(leftController, 'x-button', () => {
    if (appStore.selectedObject && !grabbedObject) {
      onObjectDelete(appStore.selectedObject);
    }
  });

  useXRControllerButtonEvent(rightController, 'x-button', () => {
    if (appStore.selectedObject && !grabbedObject) {
      onObjectDelete(appStore.selectedObject);
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
      {appStore.objects.map((object) => (
        <Model
          key={object.id}
          object={object}
          isSelected={appStore.selectedObject?.id === object.id}
          isHovered={appStore.hoveredObject?.id === object.id}
          onSelect={() => onObjectSelect(object)}
          onHover={() => onObjectHover(object)}
          onUnhover={() => onObjectHover(null)}
        />
      ))}
    </>
  );
});
