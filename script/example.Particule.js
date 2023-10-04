
class Particule extends PIXI.Graphics {
    constructor(radius, color, x, y, speed, type){
        super(); // invoque des méthodes de la super class


        this.bbox = {x: 0, y: 0, w:800, h:600};

        this.radius = radius;
        this.speed = speed;

        this.x = x;
        this.y = y;

        // couleur de remplissage
        this.beginFill(color);
        // cercle
        this.drawCircle(0,0, radius);


        // définition du vecteur 
        const angle = Math.random() * Math.PI * 2; // crée un angle aléatoire
        this.vec = {x: Math.cos(angle), y: Math.sin(angle)};
    }


    move(){

        if (this.x + this.radius > this.bbox.w || this.x - this.radius < this.bbox.x) {
            this.vec.x *= -1;
        }
        if(this.y + this.radius > this.bbox.h || this.y - this.radius < this.bbox.y){
            this.vec.y *= -1;
        }

        this.x += this.vec.x * this.speed;
        this.y += this.vec.y * this.speed;
    }

    distParticules(particules, idx){

        this.clear();

        // redraw le cercle 
        this.beginFill(0);
        this.drawCircle(0, 0, this.radius);

        const distanceMin = 180; // * customisable distance minimale entre les points pour avoir un trait

        // calcul de la distance avec voisin
        for(let j = idx; j < particules.length ; j++){
            const voisin = particules[j];
            const a = this.x - voisin.x;
            const b = this.y - voisin.y;
            const d = Math.sqrt(a * a + b * b); 

            // si distance inférieure
            if(d < distanceMin){
                const v = 1 - (d / distanceMin);
                this.lineStyle(1, 0, v);
                this.moveTo(0, 0);
                this.lineTo(voisin.x - this.x, voisin.y - this.y);
            }
        }
    }
}


export {
    Particule
}


// -------------------------------------------------------------------------------------------------
// -------------------Partie script.js--------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------


// let object1 = new Particule(50 ,'0xFF0000', 100, 100, 5);
// object1.bbox.w = thewidth;
// object1.bbox.h = theheight;

// app.stage.addChild(object1);

// let tParticlules = [];
// for(let i = 0 ; i < 100 ; i++){ // * customisable (nombre de points)
//   const p = new Particule( Math.random() * 5, '0xFF0000', Math.random() * thewidth, Math.random() * theheight, Math.random() * 0.5);
//   p.bbox.w = thewidth;
//   p.bbox.h = theheight;
//   app.stage.addChild(p);
//   tParticlules.push(p);
// }


// // gestion de l'animation
// app.ticker.add(() => {
//   object1.move();
//   // for(let p of tParticlules){
//   //   p.move();
//   // }

//   for(let i = 0, p ; i < tParticlules.length ; i++){
//     p = tParticlules[i];
//     p.move();
//     p.distParticules(tParticlules, i + 1);
//   }
// })