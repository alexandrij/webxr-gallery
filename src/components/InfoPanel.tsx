import { FC, useCallback } from 'react';
import { observer } from 'mobx-react-lite';

import { appStore } from '../stores';

import styles from './InfoPanel.module.css';
import { createFeature } from '../utils';

export const InfoPanel: FC = observer(() => {
  const onAddObject = useCallback(() => {
    appStore.addObject(createFeature());
  }, []);

  const onVRToggle = useCallback(() => {
    appStore.toggleVrMode();
  }, []);

  return (
    <div className={styles.infoPanel}>
      <h2>WebXR Галерея</h2>

      <div className={styles.infoItem}>
        <strong>Выбранный объект:</strong> {appStore.selectedObject?.name || 'Нет'}
      </div>

      <div className={styles.infoItem}>
        <strong>Объектов на сцене:</strong> {appStore.objects.length}
      </div>

      <div className={styles.buttonGroup}>
        <button className={styles.vrButton} onClick={onVRToggle}>
          {appStore.isVRMode ? 'Выйти из VR' : 'VR Mode'}
        </button>

        <button className={styles.addObjectButton} onClick={onAddObject}>
          Добавить объект
        </button>
      </div>

      <div className={styles.infoItem}>
        <strong>Управление:</strong>
        <ul style={{ marginTop: '10px', marginLeft: '20px' }}>
          <li>Лазерный луч - наведение на объекты</li>
          <li>Курок - захват и перемещение</li>
          <li>Кнопка X - удаление объекта</li>
        </ul>
      </div>
    </div>
  );
});
