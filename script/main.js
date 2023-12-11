import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { Node } from './NodeElement.js';
import { BezierCurve } from './BezierCurveElement.js';
const randomBetween = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
PIXI.Assets.addBundle('fonts', {
    'Roboto Light': '/font/Roboto-Light.ttf',
});
//! 3840 2560

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
    document.getElementById('support').appendChild(app.view);

    viewport = new Viewport({ 
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: 20000,
        worldHeight: 10000,
        
        events: app.renderer.events
    });
    
    app.stage.addChild(viewport);
    viewport.drag()
    .moveCenter(viewport.worldWidth / 2, (viewport.worldHeight / 1.5 - 2000))
    .pinch()
    .wheel()
    .decelerate()
    .clampZoom({maxWidth: 17900})
    .setZoom(0.1072, true);
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

    //* text scaling
    viewport.on('zoomed', () => textScaling(list));
    textScaling(list);
}


function textScaling(list){
    for (let key in list) {
        const item = list[key].object;

        if(viewport.scale.x < item.label.visibleOnZoom){
            item.label.alpha = 0;
        }else{
            item.label.alpha = 1;
        }


        item.label.y = -item.radius - 15 / viewport.scale.y;
        let newScale = Math.min((1 / viewport.scale.x), item.label.maxScale);
        item.label.scale.set(newScale);
    }
}





function createChilds(info, parent, depth, storageLocation){
    //* coordinates management
    Object.keys(info).forEach((key, i) => {
        let xSpacing, ySpacing, maxScale, visibleOnZoom;
        let length = Object.keys(info).length;



        //* depth 1 specific case
        if(depth == 1){
            xSpacing = 1450;
            ySpacing = 1000;
            maxScale = 5;
            visibleOnZoom = 0;
        }else if(depth == 2){
            xSpacing = 250;
            ySpacing = 650;
            maxScale = 4;
            visibleOnZoom = 0.218;
        }else{
            xSpacing = 250;
            ySpacing = 650;
            maxScale = 3.6;
            visibleOnZoom = 0.318;
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
            y -= heightModifier;
        }




        //* node creation
        let myNewParent = new Node(30, '0x000000', x, y, key, maxScale, visibleOnZoom);

        // point.interactive = true;
        myNewParent.eventMode = 'static';
        myNewParent.buttonMode = true;



        
        //* value info[key]
        myNewParent.on("pointertap", () => {

            viewport.animate({
                time: 1000,
                scale: 0.65, // Zoom back to the original scale
                position: new PIXI.Point(x, y - 700), // Move to the new center
                ease: "easeInOutSine",
                callbackOnComplete: () => {
                    // Zoom-in animation completed callback
                },
            });

            let tempInfo = info[key];
            tempInfo.genre = key;
            openModal(tempInfo);
        });



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
        object: new Node(135, '0x000000', (viewport.worldWidth / 2), (viewport.worldHeight / 1.5), "Music", 8),
        childs: {}
    }};
    await createObjects();


  } catch (error) {
    console.error('Error fetching JSON:', error);
}




//* ----------------------------------------------------------------CODE MODAL----------------------------------------------------------------
//* ----------------------------------------------------------------CODE MODAL----------------------------------------------------------------
//* ----------------------------------------------------------------CODE MODAL----------------------------------------------------------------



let isDragging = false;
let modalOffsetX, modalOffsetY;

const modal = document.getElementById('modal');

modal.addEventListener('mousedown', (e) => {
    isDragging = true;
    const rect = modal.getBoundingClientRect();
    modalOffsetX = e.clientX - rect.left;
    modalOffsetY = e.clientY - rect.top;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        var newX = e.clientX - modalOffsetX;
        var newY = e.clientY - modalOffsetY;

        newY < 1 ? newY = 0 : "";
        newX < 1 ? newX = 0 : "";

        newX > window.innerWidth/2 ? newX = window.innerWidth/2 : "";
        newY > window.innerWidth/2 ? newY = window.innerWidth/2 : "";

        modal.style.left = newX + 'px';
        modal.style.top = newY + 'px';
    }
});

[document, modal].forEach((element) => {
    element.addEventListener('mouseup', () => {
        isDragging = false;
    });
});


function openModal(entry) {
    const modal = document.getElementById("modal");
    modal.style.display = "block";

    const genreName = document.getElementById("genre-name");
    const genreExtraitNom = document.getElementById("genre-extrait-nom");
    const genreDesc = document.getElementById("genre-description");
    const music = document.getElementById("music-video");
    const audio = document.getElementById("audio");

    genreName.textContent = entry.genre;
    genreExtraitNom.textContent = entry["extrait-nom"];
    genreDesc.textContent = entry.description;
    music.src = `/music/${entry["extrait"]}.mp3`;
    audio.load();

}



const closeButton = document.getElementById("close-modal");

closeButton.addEventListener("click", () => {
    const modal = document.getElementById("modal");
    modal.style.display = "none";

    const music = document.getElementById("music-video");
    const audio = document.getElementById("audio");
    music.src = "";
    audio.load();
});


const reduceButton = document.getElementById("reduce-modal");

reduceButton.addEventListener("click", () => {
    const modal = document.getElementById("modal");
    modal.classList.toggle('transition');
    const genreDesc = document.getElementById("genre-description");
    const extraitInto = document.getElementById("extrait-into");
    genreDesc.classList.toggle("hide");
    extraitInto.classList.toggle("hide");
    modal.classList.toggle("bottomleft");
});