// src/systems/combatManager.js
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Animation } from '@babylonjs/core/Animations/animation';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';

export class CombatManager {
    constructor(scene, player, enemy, soundManager, uiManager, effectsManager) {
        this.scene   = scene;
        this.player  = player;
        this.enemy   = enemy;
        this.soundManager  = soundManager;
        this.uiManager     = uiManager;
        this.effectsManager= effectsManager;
        this.attackKeyDownLastFrame = false;
        this.attackRange = 4;
        this.chargeTime  = 0;
    }

    update() {
        const spacePressed = this.player.input[' '] || this.player.input['Space'];
        if (spacePressed) {
            this.chargeTime += this.scene.getEngine().getDeltaTime();
        } else if (this.attackKeyDownLastFrame) {
            if (this.chargeTime > 500) this.performStrongAttack();
            else this.performLightAttack();
            this.chargeTime = 0;
        }
        this.attackKeyDownLastFrame = !!spacePressed;
    }

    performLightAttack() {
        this.spawnLightFlash(1);
        this.soundManager.playAttack();
        this.effectsManager.createDust(this.player.mesh.position);
        this.checkEnemyHit();
    }

    performStrongAttack() {
        this.spawnLightFlash(2);
        this.soundManager.playAttack();
        this.effectsManager.createDust(this.player.mesh.position);
        this.checkEnemyHit();
        this.uiManager.showMessage('Attaque chargée !', 2000);
    }

    spawnLightFlash(scale) {
        // Création de la sphère flash
        const flash = MeshBuilder.CreateSphere('lightFlash', { diameter: 1 }, this.scene);
        flash.position = this.player.mesh.position.clone();

        // Matériau émissif
        const mat = new StandardMaterial('flashMat', this.scene);
        mat.emissiveColor = new Color3(1, 1, 1);
        flash.material = mat;

        // Animation d'expansion
        Animation.CreateAndStartAnimation(
            'flashExpand',
            flash,
            'scaling',
            60,
            10,
            new Vector3(1, 1, 1),
            new Vector3(5 * scale, 5 * scale, 5 * scale),
            0
        );

        setTimeout(() => flash.dispose(), 200);
    }

    checkEnemyHit() {
        if (!this.enemy.active) return;
        const dist = Vector3.Distance(this.player.mesh.position, this.enemy.mesh.position);
        if (dist <= this.attackRange) {
            this.enemy.neutralize();
            this.uiManager.showMessage('Ennemi neutralisé !', 3000);
        }
    }
}
