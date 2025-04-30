import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';

export class Enemy {
    constructor(scene) {
        this.scene = scene;
        this.active = true;
        this.speed = 0.05;
        this.direction = 1;

        this.mesh = MeshBuilder.CreateSphere('enemySphere',{ diameter:1 },scene);
        this.mesh.position = new Vector3(-5,1,5);
        const mat = new StandardMaterial('enemyMat',scene);
        mat.diffuseColor = new Color3(0.9,0.3,0.2);
        this.mesh.material = mat;
        this.mesh.receiveShadows = true;

        this.xMin = this.mesh.position.x;
        this.xMax = this.mesh.position.x + 10;
    }

    update() {
        if (!this.active) return;
        this.mesh.position.x += this.speed * this.direction;
        if (this.mesh.position.x>=this.xMax) this.direction=-1;
        else if (this.mesh.position.x<=this.xMin) this.direction=1;
    }

    neutralize() {
        this.active = false;
        this.mesh.material.diffuseColor = new Color3(0.5,0.5,0.5);
        this.mesh.setEnabled(false);
    }

    replaceMesh(newMesh) {
        this.mesh.dispose();
        this.mesh = newMesh;
        this.mesh.receiveShadows = true;
    }
}