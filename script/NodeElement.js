import * as PIXI from 'pixi.js';

class Node extends PIXI.Graphics {
    constructor(radius, color, x, y, text){
        super(); // invoque des méthodes de la super class

        this.radius = radius;

        this.x = x;
        this.y = y;

        this.text = text;

        // couleur de remplissage
        this.beginFill(color);
        // cercle
        this.drawCircle(0,0, radius);

        // crée notre object enfant texte
        this.label = new PIXI.Text(this.text,  new PIXI.TextStyle({ fontFamily: 'Roboto Light', fontSize: 25 }));

        // position du texte par rapport au parent
        this.label.y = -this.radius - 15;

        // centre le texte
        this.label.anchor.set(0.5);
        this.addChild(this.label);

    }
}

export {
    Node
}