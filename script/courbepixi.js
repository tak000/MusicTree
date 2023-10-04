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

let infoText = null; // Variable to hold info text
let infoImage = null;
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

        let xPosition = -1000;

        let myGraph = new PIXI.Graphics();
        timelineContainer.addChild(myGraph);
        
        const lineWidth = 2000; // Adjust as needed for the line's width
        const centerX = (timelineContainer.width - lineWidth) / 2; // Calculate the center X position
        
        myGraph.lineStyle(3, 0x000000);
        myGraph.moveTo(centerX, 0);
        myGraph.lineTo(centerX + lineWidth, 0);

        for (const entry of allEntries) {
            if (entry.subgenre) {
                for (const subgenre in entry.subgenre) {
                    const subgenreData = entry.subgenre[subgenre];
                    const subgenreEntry = { genre: subgenre, ...subgenreData };
                    allEntries.push(subgenreEntry);
                }
            }
        }
        allEntries.sort((a, b) => a.date - b.date);

        for (const entry of allEntries) {
            const x = parseInt(entry.date);

            const point = new PIXI.Graphics();
            point.beginFill(0xFF0000);
            point.drawCircle(0, 0, 5);

            point.interactive = true;
            point.buttonMode = true;

            point.on("click", () => {

                timelineContainer.removeChild(infoText);
                timelineContainer.removeChild(infoImage);
                // Create new info text and add it to the timeline container
                infoText = new PIXI.Text(entry.description, {
                    fontFamily: 'Arial',
                    fontSize: 16,
                    fill: 0x000000,
                    wordWrap: true,         // Enable word wrapping
                    wordWrapWidth: 300,     // Set the maximum width in pixels
                    lineHeight: 24,         // Adjust line height as needed
                });
                infoText.anchor.set(0.5, 0);
                infoText.x = point.x;
                infoText.y = 60; // Adjust vertical position as needed

                const texture = PIXI.Texture.from(entry.image);
                infoImage = new PIXI.Sprite(texture);
                const targetWidth = 20;
                const targetHeight = 20;
                const scale = Math.min(targetWidth, targetHeight);

                // Apply the calculated scale to the image
               
                // Create a PIXI.Sprite using the texture
                
                infoImage.scale.set(0.5, 0.5);
                infoImage.anchor.set(0.5, 0);
                infoImage.x = point.x;
                infoImage.y = 30;

                timelineContainer.addChild(infoImage);
                timelineContainer.addChild(infoText);
            });
            
            const dateText = new PIXI.Text(entry.date, { fontSize: 12, fill: 0x000000 });
            dateText.anchor.set(0.5, 0);
            dateText.x = 0;
            dateText.y = -30;

            point.addChild(dateText);
            const dateTitreText = new PIXI.Text(entry.genre, { fontSize: 16, fill: 0x000000 });
            dateTitreText.anchor.set(0.5, 0);
            dateTitreText.x = 0;
            dateTitreText.y = -60;
            point.addChild(dateTitreText);

            point.x = xPosition;
            xPosition += 200;

            timelineContainer.addChild(point);
        }

        // Add the timeline container to the viewport and center it horizontally
        viewport.addChild(timelineContainer);
        timelineContainer.y = (viewport.worldHeight - totalHeight) / 2;
        timelineContainer.x = (viewport.worldWidth - totalWidth) / 2;

        // Center the timeline
    })
    .catch(error => {
        console.error('Error fetching JSON data:', error);
    });