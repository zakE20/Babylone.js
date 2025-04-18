// src/characters/player.js
import {MeshBuilder} from '@babylonjs/core/Meshes/meshBuilder';
import {StandardMaterial} from '@babylonjs/core/Materials/standardMaterial';
import {Color3} from '@babylonjs/core/Maths/math.color';
import {Vector3} from '@babylonjs/core/Maths/math.vector';

export class Player {
    constructor(scene, inputManager) {
        this.scene = scene;
        // Référence à la carte des inputs (état des touches) fourni par InputManager
        this.input = inputManager.inputMap;
        this.speed = 0.15;  // Vitesse de déplacement du joueur

        // Création du mesh du joueur (un cube de taille 1)
        this.mesh = MeshBuilder.CreateBox('player', {size: 1}, scene);
        // Position initiale du joueur sur la scène (au centre, posé sur le sol)
        this.mesh.position = new Vector3(0, 0.5, 0);  // y=0.5 pour que le cube repose sur le sol (hauteur 1)

        // Matériau et couleur du joueur (bleu clair pour le distinguer)
        const mat = new StandardMaterial('playerMat', scene);
        mat.diffuseColor = new Color3(0.2, 0.6, 0.9);
        this.mesh.material = mat;
    }

    // Mise à jour du joueur à chaque frame (déplacement en fonction des touches directionnelles)
    update() {
        // Déplacement simple sur le plan XZ selon les touches appuyées
        if (this.input['ArrowUp'] || this.input['z']) this.mesh.position.z -= this.speed; // 'z' pour azerty (avant)
        if (this.input['ArrowDown'] || this.input['s']) this.mesh.position.z += this.speed; // 's' pour azerty (arrière)
        if (this.input['ArrowLeft'] || this.input['q']) this.mesh.position.x -= this.speed; // 'q' pour azerty (gauche)
        if (this.input['ArrowRight'] || this.input['d']) this.mesh.position.x += this.speed; // 'd' pour azerty (droite)
    }
}
