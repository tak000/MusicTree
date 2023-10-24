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
    .clampZoom({ maxWidth: 12500, maxHeight: 12500 });
}




//? ------------------------------------------------------------------------
//? ------------------------------------------------------------------------
//? ------------------------------------------------------------------------
//? ------------------------------------------------------------------------





function render(list){
    for (let key in list) {
        const value = list[key];

        viewport.addChild(value.object);

        if(value.childs != undefined){
            render(value.childs);
        }
    }
}



async function createObjects(){
    await PIXI.Assets.loadBundle('fonts');

    createChilds(data, objects.music.object, 650, 1, objects.music.childs);
    render(objects);
}







//? ------------------------------------------------------------------------
//? ------------------------------------------------------------------------
//? ------------------------------------------------------------------------
//? ------------------------------------------------------------------------




function createChilds(info, parent, spacing, depth, storageLocation){
    Object.keys(info).forEach((key, i) => {
        // value: info[key]
        let length = Object.keys(info).length;

        let x = parent.x;
        x -= (spacing * (length-1)) / 2;
        x += i * spacing;
        let y = parent.y - randomBetween(550, 1500);

        let myNewParent = new Node(20, '0x000000', x, y, key);

        storageLocation[key] = {object: myNewParent, childs: {}}


        // let curve = new BezierCurve(parent, myNewParent, {x: 0.73, y: 0.73}, {x: 1, y: 0.55});
        // viewport.addChild(curve);

        if(info[key].subgenre != undefined){
            createChilds(info[key].subgenre, myNewParent, 650, depth+1, storageLocation[key].childs);
        }
    });
}





function textScaling(){
    // viewport.on('zoomed', (event) => {
    //     [...objects, music].forEach((element) => {
    //         element.label.y = -element.radius - 15 / event.viewport.scale.y;
    //         let newScale = Math.min((1 / event.viewport.scale.x), 3.6);
    //         element.label.scale.set(newScale);
    //     });
    // });
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
    textScaling();

    console.log(objects);

  } catch (error) {
    console.error('Error fetching JSON:', error);
  }





