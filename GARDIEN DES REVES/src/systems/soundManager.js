// src/systems/soundManager.js
import {Sound} from '@babylonjs/core/Audio/sound';

export class SoundManager {
    constructor(scene) {
        this.scene = scene;
        // Chargement et lancement de la musique d'ambiance en boucle
        this.bgMusic = new Sound("bgMusic", "sounds/ambience.mp3", scene, null, {
            loop: true,
            autoplay: true,
            volume: 0.5
        });
        // Chargement des effets sonores (sans lecture automatique)
        this.attackSound = new Sound("attackSound", "sounds/attack.mp3", scene, null, {
            volume: 1.0,
            autoplay: false
        });
        this.leverSound = new Sound("leverSound", "sounds/lever.mp3", scene, null, {
            volume: 0.7,
            autoplay: false
        });
    }

    // Joue le son de l'attaque lumineuse du joueur
    playAttack() {
        if (this.attackSound) {
            this.attackSound.play();
        }
    }

    // Joue le son du levier actionné
    playLever() {
        if (this.leverSound) {
            this.leverSound.play();
        }
    }
}
