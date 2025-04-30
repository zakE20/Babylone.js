export class UIManager {
    constructor() {
        this.infoDiv = document.createElement('div');
        this.infoDiv.style.position = 'absolute';
        this.infoDiv.style.top = '20px';
        this.infoDiv.style.width = '100%';
        this.infoDiv.style.textAlign = 'center';
        this.infoDiv.style.color = 'white';
        this.infoDiv.style.fontFamily = 'Arial, sans-serif';
        this.infoDiv.style.fontSize = '20px';
        document.body.appendChild(this.infoDiv);
    }

    showMessage(text, duration = 3000) {
        this.infoDiv.innerText = text;
        if (duration > 0) setTimeout(() => { this.infoDiv.innerText = ''; }, duration);
    }
}