// systems/effectsManager.js
import { ParticleSystem } from '@babylonjs/core';
import { Texture }        from '@babylonjs/core/Materials/Textures/texture';

export class EffectsManager {
    constructor(scene) { this.scene = scene; }

    createDust(position) {
        const ps = new ParticleSystem('dust', 200, this.scene);
        ps.particleTexture = new Texture('textures/particle.png', this.scene);
        ps.emitter = position.clone();
        ps.createSphereEmitter(1);
        ps.minSize = 0.1; ps.maxSize = 0.5;
        ps.minLifeTime = 2; ps.maxLifeTime = 4;
        ps.start();
        setTimeout(() => ps.stop(), 3000);
    }
}
