import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { Node } from './NodeElement.js';
import { BezierCurve } from './BezierCurveElement.js';


const support = document.querySelector('div');
let theheight = window.innerHeight;
let thewidth = window.innerWidth;


let app = new PIXI.Application({
    backgroundColor:0xDDDDDD,
    antialias:true,
    width:thewidth,
    height:theheight
});
// implementation du canva
support.appendChild(app.view);

const viewport = new Viewport({ 
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: 1920,
    worldHeight: 1080,
    
    events: app.renderer.events,
});

// add the viewport to the stage
app.stage.addChild(viewport);

// activate plugins
viewport.drag().pinch().wheel().decelerate();


// let object = new Node(10, '0x000000', 0, 0, "wesh");
let object2 = new Node(10, '0x000000', 250, 250, "ehehe");

// viewport.addChild(object);
viewport.addChild(object2);




let testbez = new BezierCurve({x:0, y:0}, {x: 100, y:250}, {x: 0, y: 1}, {x: 1, y: 0});

viewport.addChild(testbez);



document.body.addEventListener("click", () => {
    console.log(viewport.scale);
})