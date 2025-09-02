import { useState, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { createXRStore, XR } from '@react-three/xr';

import { MODEL_URLS } from './constants';
import { createFeature } from './utils';
import { Feature } from './types';
import { ControlPanel, GalleryScene } from './components';
import styles from './App.module.css';

const store = createXRStore({
  hand: { right: true, left: true },
});

export const App = () => {
  const [isVRMode, setIsVRMode] = useState(!!store.getState().mode);
  const [objects, setObjects] = useState<Feature[]>([]);
  const [selectedObject, setSelectedObject] = useState<Feature | undefined>();

  // VR Режим
  const onVRToggle = useCallback(() => {
    !store.getState().mode
      ? store.enterVR().then((session) => setIsVRMode(!!session))
      : store.getState().session?.end().then(() => setIsVRMode(false));
  }, []);

  // Выбор объекта
  const onObjectSelect = useCallback((object: Feature) => {
    if (selectedObject?.id === object.id) {
      setSelectedObject(undefined);
    } else {
      setSelectedObject(object);
    }
  }, []);

  // Удаление объекта
  const onObjectDelete = useCallback((object: Feature) => {
    setObjects(prev => prev.filter(obj => obj.id !== object.id));

    if (selectedObject?.id === object.id) {
      setSelectedObject(undefined);
    }
  }, []);

  // Добавление случайного объекта
  const addRandomObject = useCallback(() => {
    const newObject = createFeature();

    setObjects(prev => [...prev, newObject]);
  }, [objects]);

  useEffect(() => {
    setObjects(new Array(MODEL_URLS.length).fill(null).map(() => createFeature()));
  }, []);

  return (
    <div className={styles.app}>
      <ControlPanel
        isVRMode={isVRMode}
        selectedObject={selectedObject}
        objectCount={objects.length}
        onVRToggle={onVRToggle}
        onAddObject={addRandomObject}
      />
      <Canvas
        shadows
        camera={{ position: [0, 1.6, 5], fov: 75 }}
        gl={{ antialias: true }}
      >
        <XR store={store}>
          <GalleryScene
            objects={objects}
            selectedObject={selectedObject}
            onObjectSelect={onObjectSelect}
            onObjectDelete={onObjectDelete}
          />
        </XR>

        {/* Освещение и окружение */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[0, 8, 0]} intensity={1} color="#4CAF50" />
      </Canvas>
    </div>
  );
};

