import { makeAutoObservable } from 'mobx';

import { Feature } from '../types';

import { xrStore } from './xrStore';

export class AppStore {
  isVRMode: boolean = false;

  objects: Feature[] = [];

  selectedObject: Feature | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  toggleVrMode() {
    !xrStore.getState().mode
      ? xrStore.enterXR('immersive-vr').then((session) => (this.isVRMode = !!session))
      : xrStore
          .getState()
          .session?.end()
          .then(() => (this.isVRMode = false));
  }

  selectObject(object: Feature | null) {
    this.selectedObject = object;
  }

  setObjects(objects: Feature[]) {
    this.objects = objects;
  }

  addObject(object: Feature) {
    this.objects.push(object);
  }

  deleteObject(object: Feature) {
    this.objects = this.objects.filter((obj) => obj !== object);

    if (this.selectedObject?.id === object.id) {
      this.selectedObject = null;
    }
  }
}

export const appStore = new AppStore();
