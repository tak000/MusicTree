import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { Node } from './NodeElement.js';
import { BezierCurve } from './BezierCurveElement.js';
// import data from "";

let data;
let app, viewport;
const randomBetween = (min, max) => min + Math.floor(Math.random() * (max - min + 1))


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


    // creation du viewport 
    // qui sera le contenu déplacable de l'app
    viewport = new Viewport({ 
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: 1920,
        worldHeight: 1080,
        
        events: app.renderer.events
    });
    
    // ajout du viewport dans le stage de l'app
    app.stage.addChild(viewport);
    
    // active les plugins du viewport (zoom, mouvement etc...)
    viewport.drag()
    .pinch()
    .wheel()
    .decelerate()
    .clampZoom({ maxWidth: 12500, maxHeight: 12500 });

}

// loading du font
PIXI.Assets.addBundle('fonts', {
    'Roboto Light': '../public/font/Roboto-Light.ttf',
});



// point d'origine de l'arbre
let music;
let objects = [];
function createObjects(){
    // loading du font (roboto)
    PIXI.Assets.loadBundle('fonts').then(() => {
        // création des objets
        music = new Node(40, '0x000000', (viewport.screenWidth / 2), (viewport.screenHeight / 1.5), "Music");
        
        createChilds(data, music, 650, 1);

        objects.forEach((el) =>{
            viewport.addChild(el);
        });
        viewport.addChild(music);

    });
}














let depthCoordinates = {};

function createChilds(info, parent, spacing, depth){
    
    //! Initialize an array for the current depth
    if (!depthCoordinates[depth]) {
        depthCoordinates[depth] = []; 
    }

    Object.keys(info).forEach((key, i) => {
        // value: info[key]
        let length = Object.keys(info).length;

        let x = parent.x;
        x -= (spacing * (length-1)) / 2;
        x += i * spacing;
        let y = parent.y - randomBetween(550, 1500);

        let myNewParent = new Node(20, '0x000000', x, y, key);
        objects.push(myNewParent);

        let curve = new BezierCurve(parent, myNewParent, {x: 0.73, y: 0.73}, {x: 1, y: 0.55});
        viewport.addChild(curve);

        //! Store the coordinates for the current node in the depthCoordinates object
        depthCoordinates[depth].push({ x, y });

        
        if(info[key].subgenre != undefined){
            createChilds(info[key].subgenre, myNewParent, 650, depth+1);
        }

        

    });
}





function textScaling(){
    //autoscaling du texte (et de son espacement par rapport au point)
    viewport.on('zoomed', (event) => {
        [...objects, music].forEach((element) => {
            element.label.y = -element.radius - 15 / event.viewport.scale.y;
            let newScale = Math.min((1 / event.viewport.scale.x), 3.6);
            element.label.scale.set(newScale);
        });
    });
}


fetch("../public/categorized-subset.json")
  .then((response) => {
    return response.json();
  })
  .then((json) => {
    data = json;

    createApp();
    createObjects();
    textScaling();
  })
  .catch((error) => {
    console.error('Error fetching JSON:', error);
});





