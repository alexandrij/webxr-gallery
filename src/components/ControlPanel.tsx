import { FC } from 'react';

import { Feature } from '../types';

import styles from './InfoPanel.module.css';

interface Props {
  selectedObject?: Feature;
  polygonCount?: number;
  objectCount?: number;
  isVRMode?: boolean;
  onVRToggle?: () => void;
  onAddObject?: () => void;
}

export const ControlPanel: FC<Props> = ({
  selectedObject,
  polygonCount,
  objectCount,
  isVRMode,
  onVRToggle,
  onAddObject,
}) => {
  return (
    <div className={styles.infoPanel}>
      <h2>WebXR Галерея</h2>

      <div className={styles.infoItem}>
        <strong>Выбранный объект:</strong> {selectedObject?.name || 'Нет'}
      </div>

      <div className={styles.infoItem}>
        <strong>Полигоны:</strong> {polygonCount}
      </div>

      <div className={styles.infoItem}>
        <strong>Объектов на сцене:</strong> {objectCount}
      </div>

      <div className={styles.buttonGroup}>
        <button
          className={styles.vrButton}
          onClick={onVRToggle}
        >
          {isVRMode ? 'Выйти из VR' : 'VR Mode'}
        </button>

        <button
          className={styles.addObjectButton}
          onClick={onAddObject}
        >
          Добавить объект
        </button>
      </div>

      <div className="info-item">
        <strong>Управление:</strong>
        <ul style={{ marginTop: '10px', marginLeft: '20px' }}>
          <li>Лазерный луч - наведение на объекты</li>
          <li>Курок - захват и перемещение</li>
          <li>Кнопка X - удаление объекта</li>
        </ul>
      </div>
    </div>
  );
};
