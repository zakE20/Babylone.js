// src/systems/uiManager.js
export class UIManager {
    constructor() {
        // Création d'un élément div HTML pour afficher les textes d'information
        this.infoDiv = document.createElement('div');
        // Style de base : texte blanc centré en haut de l'écran
        this.infoDiv.style.position = 'absolute';
        this.infoDiv.style.top = '20px';
        this.infoDiv.style.width = '100%';
        this.infoDiv.style.textAlign = 'center';
        this.infoDiv.style.color = 'white';
        this.infoDiv.style.fontFamily = 'Arial, sans-serif';
        this.infoDiv.style.fontSize = '20px';
        document.body.appendChild(this.infoDiv);
    }

    /**
     * Affiche un message textuel à l'écran pendant une durée spécifiée.
     * @param {string} text - Le message à afficher.
     * @param {number} duration - Durée en millisecondes pendant laquelle afficher le message (par défaut 3000ms).
     */
    showMessage(text, duration = 3000) {
        this.infoDiv.innerText = text;
        if (duration > 0) {
            // Efface le message après la durée indiquée
            setTimeout(() => {
                this.infoDiv.innerText = '';
            }, duration);
        }
    }
}
