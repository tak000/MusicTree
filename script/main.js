import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { Node } from './NodeElement.js';
import { BezierCurve } from './BezierCurveElement.js';

let app, viewport;

function createApp(){
    // creation de l'app
    app = new PIXI.Application({
        backgroundColor:0xDDDDDD,
        antialias:true,
        width: window.innerWidth,
        height: window.innerHeight
    });

    // implementation du canva sur la div
    document.querySelector('div').appendChild(app.view);
}

// loading du font
PIXI.Assets.addBundle('fonts', {
    'Roboto Light': '../public/font/Roboto-Light.ttf',
});

function createViewport(){
    // creation du viewport
    viewport = new Viewport({ 
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: 1920,
        worldHeight: 1080,
        
        events: app.renderer.events,
    });
    
    // ajout du viewport dans le stage de l'app
    app.stage.addChild(viewport);
    
    // active les plugins du viewport (zoom, mouvement etc...)
    viewport.drag().pinch().wheel().decelerate();
}


function createObjects(){
    // loading du font (roboto)
    PIXI.Assets.loadBundle('fonts').then(() => {
        // création des objets



        let object = new Node(10, '0x000000', 0, 0, "wesh");
        let object2 = new Node(10, '0x000000', 250, 250, "ehehe");

        viewport.addChild(object);
        viewport.addChild(object2);
    });


}


function createBezierCurve(){

    let testbez = new BezierCurve({x:0, y:0}, {x: 100, y:250}, {x: 0, y: 1}, {x: 1, y: 0});
    viewport.addChild(testbez);

}

document.body.addEventListener("click", () => {
    console.log(viewport.scale);
})

// Execution des processus
createApp();
createViewport();
createObjects();
createBezierCurve();