export class Counter {
    constructor(elementId) {
        this.value = 0;
        this.el = document.getElementById(elementId)
            || this._createElement(elementId);
    }

    _createElement(id) {
        const div = document.createElement('div');
        div.id = id;
        div.style.position = 'absolute';
        div.style.top = '10px';
        div.style.left = '10px';
        div.style.color = '#fff';
        document.body.appendChild(div);
        return div;
    }

    increment(amount = 1) {
        this.value += amount;
    }

    update() {
        this.el.innerText = `Score : ${this.value}`;
    }
}
