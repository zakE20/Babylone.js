// src/systems/combatManager.js
import {MeshBuilder} from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import {Color3} from '@babylonjs/core/Maths/math.color';
import {Animation} from '@babylonjs/core/Animations/animation';
import {Vector3} from '@babylonjs/core/Maths/math.vector';

export class CombatManager {
    constructor(scene, player, enemy, soundManager, uiManager) {
        this.scene = scene;
        this.player = player;
        this.enemy = enemy;
        this.soundManager = soundManager;
        this.uiManager = uiManager;
        // Pour gérer l'attaque uniquement à l'appui et non en continu si la touche reste enfoncée
        this.attackKeyDownLastFrame = false;
        // Portée de l'attaque lumineuse (distance maximale à laquelle l'ennemi peut être touché)
        this.attackRange = 4;
    }

    // Fonction appelée à chaque frame pour gérer les entrées de combat (attaque du joueur)
    update() {
        // Vérifier l'état de la touche Espace (ou ' ' caractère espace)
        const spacePressed = this.player.input[' '] || this.player.input['Space'];
        if (spacePressed && !this.attackKeyDownLastFrame) {
            // La touche Espace vient d'être pressée (front montant)
            this.performLightAttack();
        }
        // Mémorise l'état de la touche pour détecter le front montant
        this.attackKeyDownLastFrame = !!spacePressed;
    }

    // Exécute l'attaque de lumière du joueur
    performLightAttack() {
        // 1. Effet visuel de l'attaque (flash lumineux autour du joueur)
        this.spawnLightFlash();

        // 2. Son de l'attaque
        this.soundManager.playAttack();

        // 3. Vérification de la portée de l'ennemi
        if (this.enemy.active) {
            const dist = Vector3.Distance(this.player.mesh.position, this.enemy.mesh.position);
            if (dist <= this.attackRange) {
                // L'ennemi est suffisamment proche pour être affecté par le flash -> neutralisation
                this.enemy.neutralize();
                // Afficher un message à l'écran pour indiquer que l'ennemi est neutralisé
                this.uiManager.showMessage("Ennemi neutralisé !", 3000);
            }
        }
    }

    // Crée une sphère de lumière éphémère autour du joueur pour représenter le flash d'attaque
    spawnLightFlash() {
        // Création d'une petite sphère au centre du joueur
        const flash = MeshBuilder.CreateSphere('lightFlash', {diameter: 1}, this.scene);
        flash.position = this.player.mesh.position.clone();
        // Matériau émissif (blanc lumineux) pour la sphère
        const mat = new StandardMaterial('flashMat', this.scene);
        mat.emissiveColor = new Color3(1, 1, 1);   // couleur émissive blanche (elle paraît lumineuse)
        mat.diffuseColor = new Color3(1, 1, 1);
        flash.material = mat;
        // On agrandit rapidement la sphère puis on la fait disparaître pour simuler un flash
        Animation.CreateAndStartAnimation('flashExpand', flash, 'scaling', 60, 10,
            new Vector3(1, 1, 1),    // taille initiale
            new Vector3(5, 5, 5),    // taille finale (la sphère s'agrandit 5x)
            0                        // pas de boucle (ANIMATIONLOOPMODE_CONSTANT)
        );
        // Planifier la suppression du flash après un court délai (0.2 sec, le temps du flash)
        setTimeout(() => {
            flash.dispose();
        }, 200);
    }
}
