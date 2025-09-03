import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Canvas } from '@react-three/fiber';
import { XR } from '@react-three/xr';

import { MODEL_URLS } from './constants';
import { createFeature } from './utils';
import { ControlPanel, GalleryScene } from './components';
import { xrStore, appStore } from './stores';
import styles from './App.module.css';

export const App = observer(() => {
  // Инициализация объектов
  useEffect(() => {
    appStore.setObjects(new Array(MODEL_URLS.length).fill(null).map(() => createFeature()));
  }, []);

  return (
    <div className={styles.app}>
      <ControlPanel />
      <Canvas shadows camera={{ position: [0, 1.6, 5], fov: 75 }} gl={{ antialias: true }}>
        <XR store={xrStore}>
          <GalleryScene />
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
});
