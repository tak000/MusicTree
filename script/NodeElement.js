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

        // TODO this: https://www.html5gamedevs.com/topic/47005-bitmaptextbitmapfont/
        // crée notre object enfant texte
        this.label = new PIXI.BitmapText(text, );

        // position du texte par rapport au parent
        this.label.y = -radius - 10; 

        // centre le texte
        this.label.anchor.set(0.5);

        this.addChild(this.label);

    }

    
}


export {
    Node
}