import * as PIXI from 'pixi.js';

class BezierCurve extends PIXI.Graphics {
    constructor(origin, destination, firstPoint, secondPoint){
        super(); // invoque des méthodes de la super class

        this.origin = origin;
        this.destination = destination;
        
        // this.firstPoint = {
        //     x: this.origin.x + (this.destination.x - this.origin.x) * firstPoint.x,
        //     y: this.origin.y + (this.destination.y - this.origin.y) * firstPoint.y
        // };
        this.firstPoint = {
            x: this.origin.x ,
            y: this.origin.y - 400
        };

        this.secondPoint = {
            x:  this.origin.x + (this.destination.x - this.origin.x) * secondPoint.x,
            y:  this.origin.y + (this.destination.y - this.origin.y) * secondPoint.y
        };


        this.moveTo(this.origin.x, this.origin.y);
        this.lineStyle(3, 0xAAAAAA, 1);
        this.bezierCurveTo(this.firstPoint.x, this.firstPoint.y, this.secondPoint.x, this.secondPoint.y, this.destination.x, this.destination.y);

    }



    


}


export {
    BezierCurve
}