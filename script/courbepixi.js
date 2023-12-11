import * as PIXI from 'pixi.js';
import {
    Viewport
} from 'pixi-viewport';

const support = document.getElementById('support');
let theheight = window.innerHeight;
let thewidth = window.innerWidth;

let app = new PIXI.Application({
    backgroundColor: 0xEEEEEE,
    antialias: true,
    width: thewidth,
    height: theheight
});

support.appendChild(app.view);


const viewport = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: 5900, // Change this to your desired world width
    worldHeight: 3000, // Change this to your desired world height
    // events: app.renderer.plugins.interaction, // Use the interaction plugin
    events: app.renderer.events, // Use the interaction plugin
});

app.stage.addChild(viewport);

viewport.drag({
    clampWheel: true, // Prevent over-zooming with the wheel
    wheel: true,
});

viewport.clampZoom({
    minWidth: 500, // Minimum zoom width
    minHeight: 500, // Minimum zoom height
    maxWidth: 5900, // Maximum zoom width
    maxHeight: 3000, // Maximum zoom height
    minScale: 0.2, // Minimum scale
    maxScale: 3, // Maximum scale
});

viewport.clamp({
    left: true, // clamp to the left
    right: true, // clamp to the right
    top: viewport.worldHeight - 1750, // clamp to 1200 pixels above the center
    bottom: viewport.worldHeight + 1150, // clamp to 1200 pixels below the center
    underflow: 'center', // where to place the world if too small for the screen (centered)
});


viewport.wheel({
    percent: 0.1, // Smooth the zooming
});

const genreColors = {
    "War songs": 0x6C853E,
    "Punk": 0xF39C12,
    "Metal": 0x34495E,
    "Pop": 0xD35400,
    "Jazz": 0x1E8449,
    "Hip Hop": 0x3498DB,
    "Folk": 0xc47a95,
    "Electronique": 0x9B59B6,
    "Blues": 0x154360,
    "Classique": 0xded55f,
    "Country": 0x96754b,
    "Rock": 0xC0392B,
};
//
let infoVideo = null
let infoText = null; // Variable to hold info text
let infoImage = null;
let fixedX = 1000;

PIXI.Assets.addBundle('fonts', {
    'Next': "/style/Next\ Bro.ttf",
});
await PIXI.Assets.loadBundle('fonts');

const availableGenres = [];

fetch('Json/music.json')
    .then(response => response.json())
    .then(timelineData => {
        console.log(timelineData);

        const allEntries = Object.entries(timelineData).map(([genre, data]) => ({
            genre,
            ...data
        }));

        const totalHeight = 100;
        const totalWidth = allEntries.length * 100;

        const timelineContainer = new PIXI.Container();
        timelineContainer.width = totalWidth;
        timelineContainer.height = totalHeight;

        // let xPosition = -7250;
        let yPosition = 0;

        let date = 1;

        for (let index = 0; index < allEntries.length; index++) {


            let subgenreEntries = []


            subgenreEntries.push(allEntries[index])


            console.log()
            let xPosition = 0;
            if (allEntries[index].subgenre) {
                for (const subgenre in allEntries[index].subgenre) {
                    const subgenreData = allEntries[index].subgenre[subgenre];
                    const subgenreEntry = {
                        genre: subgenre,
                        ...subgenreData
                    };

                    subgenreEntries.push(subgenreEntry);

                }

            }
            subgenreEntries.sort((a, b) => a.date - b.date);
            console.log(subgenreEntries)

            yPosition += 200;

            let myGraph = new PIXI.Graphics();
            timelineContainer.addChild(myGraph);
            const lineLength = 4300;

            if (subgenreEntries[0] != undefined) {
                fixedX = (subgenreEntries[0].date - 1950) * 50;
            }

            myGraph.lineStyle(2, 0x000000);
            myGraph.moveTo(fixedX, yPosition);
            myGraph.lineTo(50 + lineLength, yPosition);

            const genreColor = genreColors[allEntries[index].genre] || 0x000000;

            let pointSize = 20;


            for (const entry of subgenreEntries) {

                const x = parseInt(entry.date);

                const point = new PIXI.Graphics();
                point.beginFill(genreColor);
                point.drawCircle(0, 0, pointSize);
                // point.interactive = true;
                point.eventMode = 'static';
                point.buttonMode = true;

                // Open and close modal code
                point.on("pointertap", () => {
                    openModal(entry);
                });

                const dateTitreText = new PIXI.Text(entry.genre, {
                    fontSize: 16,
                    fill: 0x000000
                });
                dateTitreText.anchor.set(0.5, 0);
                dateTitreText.x = 0;
                dateTitreText.y = -80;
                point.addChild(dateTitreText);

                if (entry.date < 1720) {
                    entry.date = 1730
                    point.x = (entry.date - 1950) * 10;
                } else if (entry.date == 1730) {
                    entry.date = 1750
                    point.x = (entry.date - 2000) * 8;
                } else if (entry.date < 1920 && entry.date > 1740) {
                    point.x = (entry.date - 2000) * 8;
                } else {
                    point.x = (entry.date - 1950) * 50;
                }
                point.y = yPosition

                if (entry.date < 1760) {
                    entry.date = "Antérieur à 1700"
                }

                const dateText = new PIXI.Text(entry.date, {
                    fontSize: 16,
                    fill: 0x000000,
                    fontFamily: 'Next, sans-serif'
                });
                dateText.anchor.set(0.5, 0);
                dateText.x = 0;
                dateText.y = -50;
                point.addChild(dateText);

                const entryData = [entry.genre, point.x + timelineContainer.x, point.y + timelineContainer.y];
                availableGenres.push(entryData);


                xPosition += 200;

                timelineContainer.addChild(point);

            }
            viewport.addChild(timelineContainer);
            timelineContainer.y = (viewport.worldHeight - totalHeight) / 2;
            timelineContainer.x = (viewport.worldWidth - totalWidth) / 2;

        }
        const searchDropdown = document.getElementById('genre-search-dropdown');
        availableGenres.sort(); // If availableGenres is an array of arrays, sort it by the genre name.

        for (const entry of availableGenres) {
            const genreName = entry[0]; // The genre name is the first element in the entry array

            const option = document.createElement('option');
            option.value = genreName;
            option.text = genreName;
            searchDropdown.appendChild(option);
        }
    })
    .catch(error => {
        console.error('Error fetching JSON data:', error);
    });
//const searchButton = document.getElementById("search");


const searchButton = document.getElementById("search");

searchButton.addEventListener("click", () => {
    searchvalue();
});

function searchvalue() {
    const selectedGenre = document.getElementById("genre-search-dropdown").value;

    for (let i = 0; i < availableGenres.length; i++) {
        const genreEntry = availableGenres[i];

        if (genreEntry[0] === selectedGenre) {
            const x = genreEntry[1];
            const y = genreEntry[2];

            // Animation durations
            const zoomOutDuration = 1500; // Zoom-out duration in milliseconds
            const zoomInDuration = 1500; // Zoom-in duration in milliseconds

            // Zoom out animation
            viewport.animate({
                time: zoomOutDuration,
                scale: 0.3, // Zoom out to 80% of the original scale
                ease: "easeOutSine",
                callbackOnComplete: () => {
                    // After zoom-out animation completes, perform zoom-in animation
                    viewport.animate({
                        time: zoomInDuration,
                        scale: 1, // Zoom back to the original scale
                        position: new PIXI.Point(x, y), // Move to the new center
                        ease: "easeOutSine",
                        callbackOnComplete: () => {
                            // Zoom-in animation completed callback
                        },
                    });
                },
            });

            return;
        }
    }

    alert("Genre not found: " + selectedGenre);
}








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
        if (newY < 1) {
            newY = 0;
        }
        if (newX < 1) {
            newX = 0;
        }
        if (newX > thewidth / 2) {
            newX = thewidth / 2;
        }
        if (newY > theheight / 2) {
            newY = theheight / 2;
        }
        modal.style.left = newX + 'px';
        modal.style.top = newY + 'px';
        console.log(thewidth)
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

modal.addEventListener('mouseup', () => {
    isDragging = false;
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