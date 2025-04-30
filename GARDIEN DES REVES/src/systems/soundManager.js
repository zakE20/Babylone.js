import { Sound } from '@babylonjs/core/Audio/sound';

export class SoundManager {
    constructor(scene) {
        this.scene = scene;
        this.bgMusic = new Sound('bgMusic', 'sounds/ambience.mp3', scene, null, { loop: true, autoplay: true, volume: 0.5 });
        this.attackSound = new Sound('attackSound', 'sounds/attack.mp3', scene, null, { autoplay: false, volume: 1 });
        this.leverSound = new Sound('leverSound', 'sounds/lever.mp3', scene, null, { autoplay: false, volume: 0.7 });
    }

    playAttack() { this.attackSound.play(); }
    playLever() { this.leverSound.play(); }
    playMusic(src) {
        if (this.bgMusic) this.bgMusic.stop();
        this.bgMusic = new Sound('bgMusic2', src, this.scene, null, { loop: true, autoplay: true, volume: 0.5 });
    }
}
