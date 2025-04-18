import {AssetsManager, Sound} from '@babylonjs/core';

export class AssetLoader {
    constructor(scene, rootUrl = '/public/') {
        this.scene = scene;
        this.rootUrl = rootUrl;
        this.assetsManager = new AssetsManager(scene);
    }

    addTexture(name, filepath) {
        this.assetsManager.addTextureTask(name, this.rootUrl + filepath);
    }

    addMesh(name, meshesNames, rootDir, filename) {
        this.assetsManager.addMeshTask(
            name, meshesNames, this.rootUrl + rootDir, filename
        );
    }

    addSound(name, filepath, options = {}) {
        const task = this.assetsManager.addBinaryFileTask(
            name, this.rootUrl + filepath
        );
        task.onSuccess = () => {
            task.sound = new Sound(name, this.rootUrl + filepath, this.scene, null, options);
        };
    }

    loadAll() {
        return new Promise((res, rej) => {
            this.assetsManager.onFinish = tasks => res(tasks);
            this.assetsManager.onTaskError = t => rej(t.errorObject);
            this.assetsManager.load();
        });
    }
}
