// Import de pixi
import * as PIXI from 'pixi.js';
import {
    Viewport
} from 'pixi-viewport';

document.fonts.ready.then(function () {
const support = document.getElementById('support');
let theheight = window.innerHeight;
let thewidth = window.innerWidth;

// Définition de l'application
let app = new PIXI.Application({
    backgroundColor: 0xEEEEEE,
    antialias: true,
    width: thewidth,
    height: theheight
});

support.appendChild(app.view);

// Définition du viewport
const viewport = new Viewport({
    // Taille de l'écran
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    // Taille du monde
    worldWidth: 11000, 
    worldHeight: 3000, 
    // Définitions des events
    events: app.renderer.events, 
});

// Ajouter le viewport sur l'app
app.stage.addChild(viewport);

viewport.drag({
    // Empêche over-zooming 
    clampWheel: true, 
    wheel: true,
})
.moveCenter(viewport.worldWidth / 2, -5000)
.pinch()
.wheel()
.decelerate();

// Défini les valeurs de zoom
viewport.clampZoom({
    minWidth: 500, // Minimum zoom width
    minHeight: 500, // Minimum zoom height
    maxWidth: 11000, // Maximum zoom width
    maxHeight: 3000, // Maximum zoom height
    minScale: 0.2, // Minimum scale
    maxScale: 3, // Maximum scale
});

// Limite du viewport
viewport.clamp({
    left: true, 
    right: true, 
    // Clamp à 1200 pixels au dessus du centre
    top: viewport.worldHeight - 1750, 
    // Clamp à 1200 pixels en dessous du centre
    bottom: viewport.worldHeight + 1150, 
    // Centre le viewport
    underflow: 'center', 
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


// Définition de divers vavriables
let infoVideo = null
let infoText = null;
let infoImage = null;
let fixedX = 1000;

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

        // Défini la pos Y et X à 0
        let yPosition = 0;
        let xPosition = 0;

        let date = 1;

        // Définition du style pour les dates
        const styleDate = new PIXI.TextStyle({
            fontFamily: 'Oswald, Roboto, sans-serif',
            fontSize: 55,
            fill: 0x000000
        });

        // Lignes vertical pour les années 1880 à 2023
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
        }
        
        // Lignes pour les dates de 1800 à 1760
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
        }

        // Position pour le hachurage
        const xPosition1 = -1000;
        const xPosition2 = -1750;

        // Pattern pour le hachurage
        const hatchTexture = PIXI.Texture.from('style/hatch.png');
            
        // Taille de la pattern
        const hatchPatternWidth = xPosition2 - xPosition1;

        // Création d'un TilingSprite pour afficher la pattern
        const hatchPattern = new PIXI.TilingSprite(hatchTexture, hatchPatternWidth, 5000);

        // Transparence de la pattern
        hatchPattern.alpha = 0.2;

        // Position X de la pattern
        hatchPattern.x = xPosition1;

        // Poistion Y de la pattern
        hatchPattern.y = -1000;

        // Ajout de la pattern sur notre Timeline
        timelineContainer.addChild(hatchPattern);

        // Boucle pour chaque entrées
        for (let index = 0; index < allEntries.length; index++) {

            // Définition du tableau des sous-genres 
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

            // Console log des sous-genres
            // console.log(subgenreEntries)

            // Augementation la positionY de la ligne du genre de 200
            yPosition += 200;

            // Création d'une ligne
            let myGraph = new PIXI.Graphics();

            // Ajout la ligne à la Timeline
            timelineContainer.addChild(myGraph);

            // Définition une longeur de ligne
            const lineLength = 6300;

            // Définition du placement de la ligne sur l'axe X pour qu'elle commence au premier point de la ligne
            if (subgenreEntries[0] != undefined) {
                fixedX = (subgenreEntries[0].date - 1900) * 50;
            }

            // Définition le style de la ligne et la déplace au bonne endroit
            myGraph.lineStyle(2, 0x000000);
            myGraph.moveTo(fixedX, yPosition);
            myGraph.lineTo(50 + lineLength, yPosition);


            // Défini les couleurs pour chaque genre
            const genreColor = genreColors[allEntries[index].genre] || 0x000000;
            
            // Pour chaque genre et sous-genre
            for (const entry of subgenreEntries) {

                // Définition de x avec la date du genre
                const x = parseInt(entry.date);

                // Définition des varibales pour la taille des points et tailles des textes 
                let pointSize;
                let dateText;
                let dateTitreText;

                // Si c'est un genre principale
                if (entry === subgenreEntries[0]) {

                    // Modificatiion la taille des textes et du point
                    dateText = new PIXI.Text(entry.date, {fontSize: 33,fill: 0x000000,fontFamily: 'Oswald'});
                    dateTitreText = new PIXI.Text(entry.genre, {fontSize: 38,fill: 0x000000,fontFamily: 'Oswald'});
                    pointSize = 40;
                } 
                // Si ce n'est pas un genre principale
                else {
                    // Modificatiion la taille des textes et du point
                    dateText = new PIXI.Text(entry.date, {fontSize: 13,fill: 0x000000,fontFamily: 'Next, sans-serif'});
                    dateTitreText = new PIXI.Text(entry.genre, {fontSize: 16,fill: 0x000000});
                    pointSize = 20;
                }

                // Définition du point
                const point = new PIXI.Graphics();

                // Remplisage du point avec la bonne couleur
                point.beginFill(genreColor);

                // Création du point
                point.drawCircle(0, 0, pointSize);

                // Définition des paramètres du point
                point.eventMode = 'static';
                point.buttonMode = true;

                // Ecoute du click sur le point
                point.on("pointertap", () => {
                    // Ouverture de la modal avec le genre en paramètre
                    openModal(entry);
                });

                // Placement du titre du genre
                dateTitreText.anchor.set(0.5, 0);
                dateTitreText.x = 0;
                dateTitreText.y = (2.5*pointSize) * -1;

                // Ajout le titre du genre au point
                point.addChild(dateTitreText);

                // Si la date du genre est avant 1710
                if (entry.date <= 1740) {

                    // Placement du point en X
                    point.x = (entry.date - 2000) * 15;
                    entry.date = "Date inconnu"
                } 
                // Sinion si la date du genre est < 1880 et > 1710
                else if (entry.date < 1880 && entry.date > 1740) {

                    // Placement du point en X
                    point.x = ((x + 65) - 1900) * 50;
                } 
                // Sinion si la date du genre est > 1880  
                else if (entry.date > 1880) {

                    // Placement du point en X
                    point.x = (entry.date - 1900) * 50;
                } 
                // Sinon
                else {

                    // Placement du point en X
                    point.x = (entry.date - 1900) * 50;
                }
                
                // Placement du point en Y
                point.y = yPosition
                
                //  Placement du de la date du genre
                dateText.anchor.set(0.5, 0);
                dateText.x = 0;
                dateText.y = pointSize*1.5;

                // Ajout de la date du genre au point
                point.addChild(dateText);

                // Ajout du genre dans u tableau avec son nom et ses coordonées
                const entryData = [entry.genre, point.x + timelineContainer.x, point.y + timelineContainer.y];
                availableGenres.push(entryData);

                // Augementation de la position X de 200
                xPosition += 200;

                // Ajout du point à la Timeline
                timelineContainer.addChild(point);
            }

            // Ajout de la Timeline au viewport
            viewport.addChild(timelineContainer);
            timelineContainer.y = (viewport.worldHeight - totalHeight) / 2;
            timelineContainer.x = (viewport.worldWidth - totalWidth) / 2;

        }

        // Définition de la barre de recherche
        const searchDropdown = document.getElementById('genre-search-dropdown');
        availableGenres.sort(); 

        // Boucle pour chaque genre
        for (const entry of availableGenres) {
            const genreName = entry[0];
            const option = document.createElement('option');
            option.value = genreName;
            option.text = genreName;
            searchDropdown.appendChild(option);
        }
    })
    .catch(error => {
        console.error('Error fetching JSON data:', error);
    });
// Obtention du bouton de recherche par son ID
const searchButton = document.getElementById("search");

// Ajout d'un écouteur d'événement pour le clic sur le bouton de recherche
searchButton.addEventListener("click", () => {
    searchvalue();
});

// Fonction de recherche
function searchvalue() {
    // Obtention du genre sélectionné dans la barre de recherche
    const selectedGenre = document.getElementById("genre-search-dropdown").value;

    // Parcours des genres disponibles pour trouver celui sélectionné
    for (let i = 0; i < availableGenres.length; i++) {
        const genreEntry = availableGenres[i];

        // Vérification si le genre actuel correspond au genre sélectionné
        if (genreEntry[0] === selectedGenre) {
            const x = genreEntry[1];
            const y = genreEntry[2];

            // Durée des animations de zoom
            const zoomDuration = 1500; // Durée du zoom-out en millisecondes

            // Animation de zoom-out
            viewport.animate({
                time: zoomDuration,
                scale: 0.4, // Zoom-out à 80% de l'échelle d'origine
                ease: "easeInOutSine",
                callbackOnComplete: () => {
                    // Après l'animation de zoom-out, effectuer l'animation de zoom-in
                    viewport.animate({
                        time: zoomDuration,
                        scale: 1, // Zoom de retour à l'échelle d'origine
                        position: new PIXI.Point(x, y), // Déplacement vers le nouveau centre
                        ease: "easeInOutSine",
                        callbackOnComplete: () => {
                            // Callback après l'animation de zoom-in
                        },
                    });
                },
            });

            return;
        }
    }

    // Alerte si le genre n'est pas trouvé
    alert("Genre introuvable : " + selectedGenre);
}

// Déclaration de variables pour le glisser-déposer de la modal
let isDragging = false;
let modalOffsetX, modalOffsetY;

// Récupération de l'élément modal par son ID
const modal = document.getElementById('modal');

// Écouteur d'événement pour le clic sur la modal
modal.addEventListener('mousedown', (e) => {
    isDragging = true;
    const rect = modal.getBoundingClientRect();
    modalOffsetX = e.clientX - rect.left;
    modalOffsetY = e.clientY - rect.top;
});

// Écouteur d'événement pour le mouvement de la souris
document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const rect = modal.getBoundingClientRect();

        // Calcul de la nouvelle position de la modal
        var newX = e.clientX - modalOffsetX;
        var newY = e.clientY - modalOffsetY;

        // Assurer que la modal reste dans le viewport
        newX = Math.max(0, Math.min(newX, window.innerWidth - rect.width));
        newY = Math.max(0, Math.min(newY, window.innerHeight - rect.height));

        // Mise à jour de la position de la modal
        modal.style.left = newX + 'px';
        modal.style.top = newY + 'px';
    }
});

// Écouteur d'événement pour le relâchement de la souris
document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Écouteur d'événement pour le relâchement de la souris sur la modal
modal.addEventListener('mouseup', () => {
    isDragging = false;
});

// Fonction pour ouvrir la modal avec les informations de l'entrée
function openModal(entry) {
    const modal = document.getElementById("modal");
    modal.style.display = "block";

    // Obtention des éléments de la modal par leurs IDs
    const genreName = document.getElementById("genre-name");
    const genreExtraitNom = document.getElementById("genre-extrait-nom");
    const genreDesc = document.getElementById("genre-description");
    const genreImage = document.getElementById("genre-image");
    const music = document.getElementById("music-video");
    const audio = document.getElementById("audio");

    // Mise à jour du contenu de la modal avec les informations de l'entrée
    genreName.textContent = entry.genre;
    genreExtraitNom.textContent = entry["extrait-nom"];
    genreDesc.textContent = entry.description;
    genreImage.src = entry.image;
    music.src = `/music/${entry["extrait"]}.mp3`;
    audio.load();
}

const closeButton = document.getElementById("close-modal");
// Écouteur d'événement pour fermer la modal
closeButton.addEventListener("click", () => {
    const modal = document.getElementById("modal");
    modal.style.display = "none";

    const music = document.getElementById("music-video");
    const audio = document.getElementById("audio")

    music.src = "";
    audio.load();
});


const reduceButton = document.getElementById("reduce-modal");
// Écouteur d'événement pour réduire la modal
reduceButton.addEventListener("click", () => {
    const modal = document.getElementById("modal");
    modal.classList.toggle('transition');
    modal.classList.toggle("bottomleft");
    const genreImage = document.getElementById("genre-image");
    const genreDesc = document.getElementById("genre-description");
    const extraitInto = document.getElementById("extrait-into");
    genreDesc.classList.toggle("hide");
    genreImage.classList.toggle("hide");
    extraitInto.classList.toggle("hide");
    
});
})