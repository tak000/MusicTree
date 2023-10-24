import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { Node } from './NodeElement.js';
import { BezierCurve } from './BezierCurveElement.js';
const randomBetween = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
PIXI.Assets.addBundle('fonts', {
    'Roboto Light': '/font/Roboto-Light.ttf',
});


let data;
let app, viewport;
let objects;


function createApp(){
    app = new PIXI.Application({
        backgroundColor:0xDDDDDD,
        antialias:true,
        width: window.innerWidth,
        height: window.innerHeight
    });
    document.querySelector('div').appendChild(app.view);

    viewport = new Viewport({ 
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: 1920,
        worldHeight: 1080,
        
        events: app.renderer.events
    });
    
    app.stage.addChild(viewport);
    viewport.drag()
    .pinch()
    .wheel()
    .decelerate()
}

async function createObjects(){
    await PIXI.Assets.loadBundle('fonts');

    //* original recursive call and render
    createChilds(data, objects.music.object, 1, objects.music.childs);
    render(objects);
}

function render(list){
    //*rendering
    for (let key in list) {
        const value = list[key];

        viewport.addChild(value.object);

        if(value.childs != undefined){
            render(value.childs);
        }
    }

    //* scaling
    viewport.on('zoomed', (event) => {
        for (let key in list) {
            const value = list[key].object;
    
            value.label.y = -value.radius - 15 / event.viewport.scale.y;
            let newScale = Math.min((1 / event.viewport.scale.x), 3.6);
            value.label.scale.set(newScale);
        }
    });
}


let width = [];

function createChilds(info, parent, depth, storageLocation){
    //* coordinates management
    Object.keys(info).forEach((key, i) => {
        let xSpacing, ySpacing;
        let length = Object.keys(info).length;

        //* depth 1 specific case
        if(depth == 1){
            xSpacing = 1300;
            ySpacing = 1000;
        }else{
            xSpacing = 250;
            ySpacing = 650;
        }

        //* coordinates
        let x = parent.x;
        x -= (xSpacing * (length-1)) / 2;
        x += i * xSpacing;
        let y = parent.y - randomBetween(ySpacing, ySpacing*2);

        //* first depth specific case (^from)
        if(depth == 1){
            const maxElements = 11;
            // Quadratic function
            const heightModifier = (1 - Math.pow(((i - maxElements / 2) / maxElements * 0.5), 2) * 20) * ySpacing;
            console.log(heightModifier);
            y -= heightModifier;
        }

        //* node creation
        let myNewParent = new Node(20, '0x000000', x, y, key+" "+depth);

        //* structure orgenisation
        storageLocation[key] = {object: myNewParent, childs: {}}

        //* lines between parent and child
        let curve = new BezierCurve(parent, myNewParent, {x: 0.73, y: 0.73}, {x: 1, y: 0.55});
        viewport.addChild(curve);

        //* recursive call
        if(info[key].subgenre != undefined){
            createChilds(info[key].subgenre, myNewParent, depth+1, storageLocation[key].childs);
        }
    });
}






try {
    const response = await fetch("/categorized-subset.json");
    const json = await response.json();
    data = json;

    createApp();
    objects = {music : {
        object: new Node(40, '0x000000', (viewport.screenWidth / 2), (viewport.screenHeight / 1.5), "Music"),
        childs: {}
    }};
    createObjects();


  } catch (error) {
    console.error('Error fetching JSON:', error);
}





