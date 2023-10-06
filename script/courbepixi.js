import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';

const support = document.getElementById('support');
let theheight = window.innerHeight;
let thewidth = window.innerWidth;

let app = new PIXI.Application({
    backgroundColor: 0xDDDDDD,
    antialias: true,
    width: thewidth,
    height: theheight
});

support.appendChild(app.view);

const viewport = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: 1920,
    worldHeight: 1080,
    events: app.renderer.events,
});

app.stage.addChild(viewport);
viewport.drag().pinch().wheel().decelerate();

//I need to display each genre and their subgenre on different Yaxis, 
let infoText = null; // Variable to hold info text
let infoImage = null;
let fixedX = 1000;
fetch('Json/music.json')
    .then(response => response.json())
    .then(timelineData => {
        console.log(timelineData);

        const allEntries = Object.entries(timelineData).map(([genre, data]) => ({ genre, ...data }));

        const totalHeight = 100; 
        const totalWidth = allEntries.length * 100;

        const timelineContainer = new PIXI.Container();
        timelineContainer.width = totalWidth;
        timelineContainer.height = totalHeight;

        // let xPosition = -7250;
        let yPosition = 0;

        let date = 1;
        // Start from 0, go up to 10, increment by 2
        for (let i = 1000; i <= 2050; i += 10) {
            
        }
  
        for (let index = 0; index < allEntries.length; index++) {
            let subgenreEntries = []
            subgenreEntries.push(allEntries[index])
            console.log()
            let xPosition = 0;
            if (allEntries[index].subgenre) {
                for (const subgenre in allEntries[index].subgenre) {
                    const subgenreData = allEntries[index].subgenre[subgenre];
                    const subgenreEntry = { genre: subgenre, ...subgenreData };
                    subgenreEntries.push(subgenreEntry);
                }
            }
            subgenreEntries.sort((a, b) => a.date - b.date);
            console.log(subgenreEntries)
    
            yPosition += 200;

            let myGraph = new PIXI.Graphics();
            timelineContainer.addChild(myGraph);
            const lineLength = 4300; 

            if(subgenreEntries[0] != undefined){
                fixedX = (subgenreEntries[0].date - 1000) * 4;
            }
            
            myGraph.lineStyle(5, 0x000000);
            myGraph.moveTo(fixedX, yPosition);
            myGraph.lineTo(50 + lineLength, yPosition);

            for (const entry of subgenreEntries) {
                const x = parseInt(entry.date);

                const point = new PIXI.Graphics();
                point.beginFill(0x000000);
                point.drawCircle(0, 0, 10);
                point.interactive = true;
                point.buttonMode = true;

                const dateText = new PIXI.Text(entry.date, { fontSize: 12, fill: 0x000000 });
                dateText.anchor.set(0.5, 0);
                dateText.x = 0;
                dateText.y =  -30;
                point.addChild(dateText);

                const dateTitreText = new PIXI.Text(entry.genre, { fontSize: 16, fill: 0x000000 });
                dateTitreText.anchor.set(0.5, 0);
                dateTitreText.x = 0;
                dateTitreText.y = -60;
                point.addChild(dateTitreText);
                point.x = (entry.date - 1000) * 4;
                point.y = yPosition
                xPosition += 200;

                timelineContainer.addChild(point);
            }
            viewport.addChild(timelineContainer);
            timelineContainer.y = (viewport.worldHeight - totalHeight) / 2;
            timelineContainer.x = (viewport.worldWidth - totalWidth) / 2;
        }

        
    })
    .catch(error => {
        console.error('Error fetching JSON data:', error);
    });