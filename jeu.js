const intTempsAuDebutDunNiveau = 60000;
var intDatePassee = 0;
var objClavier = null;

var objCameraJoueur = null;
var objCameraVueAerienne = null;
var intNiveau = 5; //devrait être 1 quand on remet le projet
var intScore = 300;
var intTemps = 0;
var intOuvreursDeMurs = 0;
var binVueAerienne = false;
var intTempsVueAerienne = 0;
var binTricherVueAerienne = false;
var tObjNiveau = [];


function initNiveau() {
    intTemps = intTempsAuDebutDunNiveau;
    intOuvreursDeMurs = Math.floor((10-intNiveau)/2);
    let intFleches = (10-intNiveau)*2;
    let intTeletransporteurs = Math.floor(intNiveau/2);
    let intTelerecepteurs = intNiveau-1;
    binVueAerienne = false;
    intTempsVueAerienne = 0;
    binTricherVueAerienne = false;

    setPositionsCameraXYZ([tStrDedale[0].length/2, 0.5, tStrDedale.length/2], objCameraJoueur);
    setCiblesCameraXYZ([tStrDedale[0].length/2, 0.8, tStrDedale.length/2-5], objCameraJoueur);
    setOrientationsXYZ([0, 1, 0], objCameraJoueur);

    // Vider les objets
    objScene3D.tabObjets3D = new Array();

    // Créer le sol
    var obj3DSol = creerObj3DSol(objgl, TEX_SOL);
    objScene3D.tabObjets3D.push(obj3DSol);

    // Créer le plafond
    var obj3DPlafond = creerObj3DPlafond(objgl, TEX_SOL);
    setPositionY(2, obj3DPlafond.transformations);
    objScene3D.tabObjets3D.push(obj3DPlafond);

    // Créer le dédale
    for(var i = 0; i < tStrDedale.length; i++){
        for(var j = 0; j < tStrDedale[i].length; j++){
            let obj3D = null;
            switch(tStrDedale[i][j]){
                case '.':
                    break;
                case '#':
                    obj3D = creerObj3DMur(objgl, TEX_MUR);
                    break;
                case 'B':
                    obj3D = creerObj3DMur(objgl, TEX_MURBETON);
                    break;
                default:
                    obj3D = creerObj3DFleche(objgl, TEX_FLECHE);
                    setEchelleZ(1/0.4, obj3D.transformations);
            }
            if(obj3D !== null){
                setPositionX(j+0.5, obj3D.transformations);
                setPositionZ(i+0.5, obj3D.transformations);
                objScene3D.tabObjets3D.push(obj3D);
            }
        }
    }
    
    // trouve positions possibles pour objets du niveau
    let tPositionsPossibles = [];
    for(var i = 0; i < tStrDedale.length; i++){
        tObjNiveau[i] = [];
        for(var j = 0; j < tStrDedale[i].length; j++){
            tObjNiveau[i][j] = null;
            if(tStrDedale[i][j] == '.'){
                tPositionsPossibles.push({x: j, z: i});
            }
        }
    }

    // place le tresor
    let objPositionTresor = tPositionsPossibles.splice(Math.floor(Math.random()*tPositionsPossibles.length), 1)[0];
    let obj3DTresor = creerObj3DFleche(objgl, TEX_FLECHE);
    setPositionsXYZ([objPositionTresor.x+0.5, 0, objPositionTresor.z+0.5], obj3DTresor.transformations);
    setEchellesXYZ([0.5, 2.5, 0.5], obj3DTresor.transformations);
    tObjNiveau[objPositionTresor.z][objPositionTresor.x] = obj3DTresor; //objet 3d tresor

    // place les fleches
    for(var i = 0; i < intFleches; i++){
        let objPosition = tPositionsPossibles.splice(Math.floor(Math.random()*tPositionsPossibles.length), 1)[0];
        let obj3DFleche = creerObj3DFleche(objgl, TEX_FLECHE); //objet 3d fleche
        setPositionsXYZ([objPosition.x+0.5, 1.25, objPosition.z+0.5], obj3DFleche.transformations);
        setAngleY(
            Math.atan2(-objPositionTresor.z+objPosition.z, objPositionTresor.x-objPosition.x) * 180 / Math.PI, 
            obj3DFleche.transformations); //rotation vers le tresor 
        console.log(Math.atan2(objPositionTresor.z-objPosition.z, objPositionTresor.x-objPosition.x));
        tObjNiveau[objPosition.z][objPosition.x] = obj3DFleche;
    }

    // place les tele-transporteurs
    for(var i = 0; i < intTeletransporteurs; i++){
        let objPosition = tPositionsPossibles.splice(Math.floor(Math.random()*tPositionsPossibles.length), 1)[0];
        let obj3DTeletransporteur = creerObj3DFleche(objgl, TEX_FLECHE); //objet 3d fleche
        setAngleZ(90, obj3DTeletransporteur.transformations);
        setPositionsXYZ([objPosition.x+0.5, 0, objPosition.z+0.5], obj3DTeletransporteur.transformations);
        tObjNiveau[objPosition.z][objPosition.x] = obj3DTeletransporteur;
    }

    // place les tele-recepteurs
    for(var i = 0; i < intTelerecepteurs; i++){
        let objPosition = tPositionsPossibles.splice(Math.floor(Math.random()*tPositionsPossibles.length), 1)[0];
        let obj3DTelerecepteur = creerObj3DFleche(objgl, TEX_FLECHE); //objet 3d fleche
        setAngleZ(-90, obj3DTelerecepteur.transformations);
        setPositionsXYZ([objPosition.x+0.5, 0, objPosition.z+0.5], obj3DTelerecepteur.transformations);
        tObjNiveau[objPosition.z][objPosition.x] = obj3DTelerecepteur;
    }

    // ajoute tous les objets du niveau à la scène
    tObjNiveau.map(i => i.map(o => {if(o !== null){objScene3D.tabObjets3D.push(o);}}));
}

function changeDeVue() {
    if (objClavier['PageUp'] && binVueAerienne == false) {
        binVueAerienne = true;
        objScene3D.camera = objCameraVueAerienne;
    }
    if (objClavier['PageDown'] && binVueAerienne == true) {
        binVueAerienne = false;
        objScene3D.camera = objCameraJoueur;
    }
}

function deplacerJoueur(intDeltaMillis) {
    var camera = objCameraJoueur;
    
    if (objClavier['ArrowLeft'] || objClavier['ArrowRight']) {
        var fltX = getCibleCameraX(camera) - getPositionCameraX(camera);
        var fltZ = getCibleCameraZ(camera) - getPositionCameraZ(camera);
        var intDirection = (objClavier['ArrowLeft']) ? -1 : 1;
        var fltAngle = intDirection * 0.0015 * intDeltaMillis; // Tourner 15/10000 radians par milliseconde

        var fltXPrime = fltX * Math.cos(fltAngle) - fltZ * Math.sin(fltAngle);
        var fltZPrime = fltX * Math.sin(fltAngle) + fltZ * Math.cos(fltAngle);

        setCibleCameraX(getPositionCameraX(camera) + fltXPrime, camera);
        setCibleCameraZ(getPositionCameraZ(camera) + fltZPrime, camera);
    }
    if (objClavier['ArrowUp'] || objClavier['ArrowDown']) {
        var fltX = getCibleCameraX(camera) - getPositionCameraX(camera);
        var fltZ = getCibleCameraZ(camera) - getPositionCameraZ(camera);
        var fltRayon = Math.sqrt(fltX * fltX + fltZ * fltZ);
        var intDirection = (objClavier['ArrowUp']) ? 1 : -1;

        var fltXPrime = intDirection * 0.003 * intDeltaMillis * Math.cos(Math.acos(fltX / fltRayon)); // Avancer de 3/1000 unites par milliseconde
        var fltZPrime = intDirection * 0.003 * intDeltaMillis * Math.sin(Math.asin(fltZ / fltRayon));

        setCibleCameraX(getCibleCameraX(camera) + fltXPrime, camera);
        setCibleCameraZ(getCibleCameraZ(camera) + fltZPrime, camera);
        setPositionCameraX(getPositionCameraX(camera) + fltXPrime, camera);
        setPositionCameraZ(getPositionCameraZ(camera) + fltZPrime, camera);
    }
}

//inspiré par https://www.jeffreythompson.org/collision-detection/line-circle.php
function collisionCercleLigneX(cx, cz, r, x, z1, z2){
    if(Math.abs(cx - x) > r){
        return false;
    }
    var minZ = Math.min(z1, z2);
    var maxZ = Math.max(z1, z2);
    var lZ = Math.min(Math.max(cz, minZ), maxZ);
    var distance = Math.sqrt((cx-x)*(cx-x) + (cz-lZ)*(cz-lZ));
    if(distance > r){
        return false;
    }
    var angle = Math.atan2(cz-lZ, cx-x);
    var newX = cx + (radius-distance)*Math.cos(angle);
    var newZ = cz + (radius-distance)*Math.sin(angle);
    return {x: newX, z: newZ};
};

function collisionCercleLigneZ(cx, cz, r, x1, x2, z){
    if(Math.abs(cz - z) > r){
        return false;
    }
    var minX = Math.min(x1, x2);
    var maxX = Math.max(x1, x2);
    var lX = Math.min(Math.max(cx, minX), maxX);
    var distance = Math.sqrt((cx-lX)*(cx-lX) + (cz-z)*(cz-z));
    if(distance > r){
        return false;
    }
    var angle = Math.atan2(cz-z, cx-lX);
    var newX = cx + (radius-distance)*Math.cos(angle);
    var newZ = cz + (radius-distance)*Math.sin(angle);
    return {x: newX, z: newZ};
};

function collisionJoueurMur(){
    //todo
};