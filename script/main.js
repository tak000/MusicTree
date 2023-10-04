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


fetch('Json/music.json')
    .then(response => response.json())
    .then(timelineData => {
        console.log(timelineData);

        // Calculate the total width for the timeline based on the number of points
        const totalWidth = Object.keys(timelineData).length * 100; // Adjust as needed

        const timelineContainer = new PIXI.Container();
        timelineContainer.width = totalWidth;
        timelineContainer.height = 100;
        
        let xPosition = 0;

        for (const genre in timelineData) {
            const data = timelineData[genre];
            const x = parseInt(data.date);

            const point = new PIXI.Graphics();
            point.beginFill(0xFF0000);
            point.drawCircle(0, 0, 5);

            point.interactive = true;
            point.buttonMode = true;

            // point.on("click", () => {
            //     showDescription(genre, data.description);
            // });

            const dateText = new PIXI.Text(data.date, { fontSize: 12, fill: 0x000000 });
            dateText.anchor.set(0.5, 0);
            dateText.x = 0;
            dateText.y = 10;

            point.addChild(dateText);
            point.x = xPosition;
            xPosition += 100; // Adjust the horizontal spacing as needed

            timelineContainer.addChild(point);
        }

        // Create a horizontal line
        const line = new PIXI.Graphics();
        line.lineStyle(2, 0x000000); // Line thickness and color
        line.moveTo(0, 50); // Adjust the y position as needed
        line.lineTo(totalWidth, 50); // Adjust the y position as needed

        timelineContainer.addChild(line);

        // Add the timeline container to the viewport
        viewport.addChild(timelineContainer);
        timelineContainer.x = (viewport.worldWidth - totalWidth) / 2; // Center the timeline
    })
    .catch(error => {
        console.error('Error fetching JSON data:', error);
    });

function showDescription(genre, description) {
    alert(`Genre: ${genre}\nDescription: ${description}`);
}

document.body.addEventListener("click", () => {
    console.log(viewport.scale);
});
