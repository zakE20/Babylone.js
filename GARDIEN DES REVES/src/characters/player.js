// src/characters/player.js
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';

export class Player {
    constructor(scene, inputManager) {
        this.scene = scene;
        this.input = inputManager.inputMap;
        this.speed = 0.15;
        this.isJumping = false;
        this.verticalSpeed = 0;
        this.gravity = -0.01;

        this.mesh = MeshBuilder.CreateBox('player', { size: 1 }, scene);
        this.mesh.position = new Vector3(0, 0.5, 0);
        const mat = new StandardMaterial('playerMat', scene);
        mat.diffuseColor = new Color3(0.2, 0.6, 0.9);
        mat.emissiveColor = new Color3(0.1, 0.2, 0.3);
        this.mesh.material = mat;
        this.mesh.checkCollisions = true;
        this.mesh.receiveShadows = true;
    }

    // Mise à jour du joueur : inversion des axes pour correspondre à l'orientation Babylon
    update() {
        // Déplacement sur l'axe Z (avant/arrière)
        if (this.input['ArrowUp'] || this.input['z']) this.mesh.position.z += this.speed;      // AVANT (positif)
        if (this.input['ArrowDown'] || this.input['s']) this.mesh.position.z -= this.speed;    // ARRIÈRE (négatif)

        // Déplacement sur l'axe X (gauche/droite)
        if (this.input['ArrowLeft'] || this.input['q']) this.mesh.position.x += this.speed;    // GAUCHE (positif X inverse?)
        if (this.input['ArrowRight'] || this.input['d']) this.mesh.position.x -= this.speed;   // DROITE (négatif)

        // Saut
        if ((this.input[' '] || this.input['Space']) && !this.isJumping) {
            this.isJumping = true;
            this.verticalSpeed = 0.25;
        }
        if (this.isJumping) {
            this.mesh.position.y += this.verticalSpeed;
            this.verticalSpeed += this.gravity;
            if (this.mesh.position.y <= 0.5) {
                this.mesh.position.y = 0.5;
                this.isJumping = false;
            }
        }
    }

    replaceMesh(newMesh) {
        const position = this.mesh.position.clone();
        const rotation = this.mesh.rotation.clone();
        this.mesh.dispose();
        this.mesh = newMesh;
        this.mesh.position = position;
        this.mesh.rotation = rotation;
        this.mesh.checkCollisions = true;
        this.mesh.receiveShadows = true;
    }
}
