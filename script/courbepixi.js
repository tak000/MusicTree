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

// Défini le viewport
const viewport = new Viewport({
    // Taille de l'écran
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    // Taille du monde
    worldWidth: 11000, 
    worldHeight: 3000, 
    // Si Interraction
    // events: app.renderer.plugins.interaction, 
    // Render les events
    events: app.renderer.events, 
});

// Met le viewport en front
app.stage.addChild(viewport);

viewport.drag({
    // Empêche over-zooming 
    clampWheel: true, 
    wheel: true,
});

// Défini les valeurs de zoom
viewport.clampZoom({
    minWidth: 500, // Minimum zoom width
    minHeight: 500, // Minimum zoom height
    maxWidth: 11000, // Maximum zoom width
    maxHeight: 3000, // Maximum zoom height
    minScale: 0.2, // Minimum scale
    maxScale: 3, // Maximum scale
});

// Clamp le viewport
viewport.clamp({
    // Clamp à gauche
    left: true, 
    // Clamp à droite
    right: true, 
    // Clamp à 1200 pixels au dessus du centre
    top: viewport.worldHeight - 1750, 
    // Clamp à 1200 pixels en dessous du centre
    bottom: viewport.worldHeight + 1150, 
    // Centre le viewport
    underflow: 'center', 
});


viewport.wheel({
    // Adoucir le zoom
    percent: 0.1, 
});

// Couleurs des genre de musique
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


// Défini des avriables
let infoVideo = null
let infoText = null;
let infoImage = null;
let fixedX = 1000;

// PIXI.Assets.addBundle('fonts', {
//     'Next': "/style/Next\ Bro.ttf",
// });
// await PIXI.Assets.loadBundle('fonts');  

// Tableau des genres disponible
const availableGenres = [];

//Récupère le Json
fetch('Json/music.json')
    .then(response => response.json())
    .then(timelineData => {
        // Console log tout les infos
        console.log(timelineData);

        // Défini tout les entries 
        const allEntries = Object.entries(timelineData).map(([genre, data]) => ({
            genre,
            ...data
        }));

        // Défini la hauteur et la largeur
        const totalHeight = 100;
        const totalWidth = allEntries.length * 100;

        // Créer un timelineContainer et défini avec la largeur et hauteur
        const timelineContainer = new PIXI.Container();
        timelineContainer.width = totalWidth;
        timelineContainer.height = totalHeight;

        // Défini la posY à 0
        // let xPosition = -7250;
        let yPosition = 0;
        let xPosition = 0;

        let date = 1;

        const styleDate = new PIXI.TextStyle({
            fontFamily: 'Oswald, Roboto, sans-serif', // Use the font names you specified
            fontSize: 55,
            fill: 0x000000
        });

         // Inside your loop how do i make the line have more opacity ?
            for (let year = 1880; year <= 2023; year += 10) {
                const x1Position = (year - 1900) * 50;
                let line = new PIXI.Graphics();
                line.lineStyle(2, 0x000000, 0.2);
                line.moveTo(x1Position, 0);
                line.lineTo(x1Position, 5000);
                timelineContainer.addChild(line);
                let dateText = new PIXI.Text(year,styleDate);
                dateText.anchor.set(0.5, 0);
                dateText.x = x1Position;
                dateText.y = -80;
                line.addChild(dateText);
                console.log(x1Position)
            }
            
            for (let year = 1825; year <= 1865; year += 10) {
                const x2Position = (year - 1900) * 50;
                let line = new PIXI.Graphics();
                line.lineStyle(2, 0x000000, 0.2);
                line.moveTo(x2Position, 0);
                line.lineTo(x2Position, 5000);
                timelineContainer.addChild(line);
                let dateText = new PIXI.Text((year-65), styleDate);
                dateText.anchor.set(0.5, 0);
                dateText.x = x2Position;
                dateText.y = -80;
                line.addChild(dateText);
                console.log(x2Position)
            }


            const xPosition1 = -1000;
            const xPosition2 = -1750;

            const hatchTexture = PIXI.Texture.from('style/hatch.png');
    
            const hatchPatternWidth = xPosition2 - xPosition1;


            const hatchPattern = new PIXI.TilingSprite(hatchTexture, hatchPatternWidth, 5000);
            hatchPattern.alpha = 0.2;

            hatchPattern.x = xPosition1;
            hatchPattern.y = -1000;

            timelineContainer.addChild(hatchPattern);

            
            
        // Pour Chaque entrées
        for (let index = 0; index < allEntries.length; index++) {


            // Tabkeau des sous-genres 
            let subgenreEntries = []

            // Remplie le tableau des sous-genres 
            subgenreEntries.push(allEntries[index])
            
            // Met la position X à 0
            let xPosition = 0;

            // Si il y a un sous-genre
            if (allEntries[index].subgenre) {

                // Boucle pour chaque sous-genre d'un même genre
                for (const subgenre in allEntries[index].subgenre) {

                    // Défini les infos du sous-genre 
                    const subgenreData = allEntries[index].subgenre[subgenre];
                    const subgenreEntry = {
                        genre: subgenre,
                        ...subgenreData
                    };

                    // Remplie le tableau des sous-genre
                    subgenreEntries.push(subgenreEntry);
                }
            }

            // Tri par date
            subgenreEntries.sort((a, b) => a.date - b.date);

            // Concole log des sous-genres
            console.log(subgenreEntries)

            // Augement la positionY de la ligne de 200
            yPosition += 200;

            // Créer une ligne avec une lenght
            let myGraph = new PIXI.Graphics();
            timelineContainer.addChild(myGraph);
            const lineLength = 6300;

            // Défini le placement des points
            if (subgenreEntries[0] != undefined) {
                fixedX = (subgenreEntries[0].date - 1900) * 50;
            }

            // Défini le style de la ligne et la déplace au bonne endroit
            myGraph.lineStyle(2, 0x000000);
            myGraph.moveTo(fixedX, yPosition);
            myGraph.lineTo(50 + lineLength, yPosition);


            // Défini les couleurs pour chaque genre
            const genreColor = genreColors[allEntries[index].genre] || 0x000000;

            // let pointSize = 20;


            for (const entry of subgenreEntries) {

                const x = parseInt(entry.date);

                let pointSize;
                let dateText;
                let dateTitreText;
                if (entry === subgenreEntries[0]) {
                    // Check if it's the main genre
                    dateText = new PIXI.Text(entry.date, {fontSize: 33,fill: 0x000000,fontFamily: 'Oswald'});
                    dateTitreText = new PIXI.Text(entry.genre, {fontSize: 38,fill: 0x000000,fontFamily: 'Oswald'}); 
                    pointSize = 40; // Set the size for the main genre
                } else {
                    dateText = new PIXI.Text(entry.date, {fontSize: 13,fill: 0x000000,fontFamily: 'Next, sans-serif'});
                    dateTitreText = new PIXI.Text(entry.genre, {fontSize: 16,fill: 0x000000});
                    pointSize = 20; // Default size for other genres
                }

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

                // Place the text in the right x and y
                dateTitreText.anchor.set(0.5, 0);
                dateTitreText.x = 0;
                dateTitreText.y = (2.5*pointSize) * -1;
                point.addChild(dateTitreText);

                // Si la date avant 1710
                if (entry.date <= 1740) {
                    point.x = (entry.date - 2000) * 15;
                } 
                // Sinion si la date < 1880 et > 1710
                else if (entry.date < 1880 && entry.date > 1740) {
                    let moveXP = parseInt(entry.date) + 65;
                    point.x = (moveXP - 1900) * 50;
                    console.log(point.x, moveXP)
                } 
                // Sinion si la date > 1880        // How can i add vertical line for every 10 year
                else if (entry.date > 1880) {
                    point.x = (entry.date - 1900) * 50;
                } 
                else {
                    point.x = (entry.date - 1900) * 50;
                }
                
                point.y = yPosition

                if (entry.date <= 1740) {
                    entry.date = "Date inconnu"
                }

                
            
                dateText.anchor.set(0.5, 0);
                dateText.x = 0;
                dateText.y = pointSize*1.5;
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
        availableGenres.sort(); 

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
                scale: 0.4, // Zoom out to 80% of the original scale
                ease: "easeInOutSine",
                callbackOnComplete: () => {
                    // After zoom-out animation completes, perform zoom-in animation
                    viewport.animate({
                        time: zoomInDuration,
                        scale: 1, // Zoom back to the original scale
                        position: new PIXI.Point(x, y), // Move to the new center
                        ease: "easeInOutSine",
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

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

document.addEventListener("DOMContentLoaded", function () {
    const searchBar = document.getElementById("genre-search-dropdown");
    const searchIcon = document.getElementById("search-icon");
    const searchContent = document.getElementById("search-content");
  
    let timeoutId;
  
    const hideSearchBar = () => {
        searchContent.classList.add("active");
    };
  
    searchIcon.addEventListener("click", function () {
        searchContent.classList.toggle("active");
      clearTimeout(timeoutId);
      timeoutId = setTimeout(hideSearchBar, 15000);
    });
  
    searchBar.addEventListener("click", function () {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(hideSearchBar, 15000); // Set the timeout value (5 seconds in this example)
    });
    timeoutId = setTimeout(hideSearchBar, 15000);
});
  