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
    intOuvreursDeMurs = Math.floor((10 - intNiveau) / 2);
    let intFleches = (10 - intNiveau) * 2;
    let intTeletransporteurs = Math.floor(intNiveau / 2);
    let intTelerecepteurs = intNiveau - 1;
    binVueAerienne = false;
    intTempsVueAerienne = 0;
    binTricherVueAerienne = false;

    setPositionsCameraXYZ([tStrDedale[0].length / 2, 0.5, tStrDedale.length / 2], objCameraJoueur);
    setCiblesCameraXYZ([tStrDedale[0].length / 2, 0.8, tStrDedale.length / 2 - 5], objCameraJoueur);
    setOrientationsXYZ([0, 1, 0], objCameraJoueur);

    // Vider les objets
    objScene3D.tabObjets3D = new Array();

    // Créer le sol
    let obj3DSol = creerObj3DSol(objgl, TEX_SOL);
    objScene3D.tabObjets3D.push(obj3DSol);

    // Créer le plafond
    let obj3DPlafond = creerObj3DPlafond(objgl, TEX_SOL);
    setPositionY(2, obj3DPlafond.transformations);
    objScene3D.tabObjets3D.push(obj3DPlafond);

    // Créer le dédale
    for (var i = 0; i < tStrDedale.length; i++) {
        for (var j = 0; j < tStrDedale[i].length; j++) {
            let obj3D = null;
            switch (tStrDedale[i][j]) {
                case '.':
                    break;
                case '#':
                    obj3D = creerObj3DMur(objgl, TEX_MUR, false);
                    break;
                case 'B':
                    obj3D = creerObj3DMur(objgl, TEX_MURBETON, true);
                    break;
                default:
                    obj3D = creerObj3DFleche(objgl, TEX_FLECHE);
                    setEchelleZ(1 / 0.4, obj3D.transformations);
            }
            if (obj3D !== null) {
                setPositionX(j + 0.5, obj3D.transformations);
                setPositionZ(i + 0.5, obj3D.transformations);
                objScene3D.tabObjets3D.push(obj3D);
            }
        }
    }

    // trouve positions possibles pour objets du niveau
    let tPositionsPossibles = [];
    for (var i = 0; i < tStrDedale.length; i++) {
        tObjNiveau[i] = [];
        for (var j = 0; j < tStrDedale[i].length; j++) {
            tObjNiveau[i][j] = null;
            if (tStrDedale[i][j] == '.') {
                tPositionsPossibles.push({ x: j, z: i });
            }
        }
    }

    // place le tresor
    let objPositionTresor = tPositionsPossibles.splice(Math.floor(Math.random() * tPositionsPossibles.length), 1)[0];
    let obj3DTresor = creerObj3DFleche(objgl, TEX_FLECHE);
    setPositionsXYZ([objPositionTresor.x + 0.5, 0, objPositionTresor.z + 0.5], obj3DTresor.transformations);
    setEchellesXYZ([0.5, 2.5, 0.5], obj3DTresor.transformations);
    tObjNiveau[objPositionTresor.z][objPositionTresor.x] = obj3DTresor; //objet 3d tresor

    // place les fleches
    for (var i = 0; i < intFleches; i++) {
        let objPosition = tPositionsPossibles.splice(Math.floor(Math.random() * tPositionsPossibles.length), 1)[0];
        let obj3DFleche = creerObj3DFleche(objgl, TEX_FLECHE); //objet 3d fleche
        setPositionsXYZ([objPosition.x + 0.5, 1.25, objPosition.z + 0.5], obj3DFleche.transformations);
        setAngleY(
            Math.atan2(-objPositionTresor.z + objPosition.z, objPositionTresor.x - objPosition.x) * 180 / Math.PI,
            obj3DFleche.transformations); //rotation vers le tresor 
        tObjNiveau[objPosition.z][objPosition.x] = obj3DFleche;
    }

    // place les tele-transporteurs
    for (var i = 0; i < intTeletransporteurs; i++) {
        let objPosition = tPositionsPossibles.splice(Math.floor(Math.random() * tPositionsPossibles.length), 1)[0];
        let obj3DTeletransporteur = creerObj3DFleche(objgl, TEX_FLECHE); //objet 3d fleche
        setAngleZ(90, obj3DTeletransporteur.transformations);
        setPositionsXYZ([objPosition.x + 0.5, 0, objPosition.z + 0.5], obj3DTeletransporteur.transformations);
        tObjNiveau[objPosition.z][objPosition.x] = obj3DTeletransporteur;
    }

    // place les tele-recepteurs
    for (var i = 0; i < intTelerecepteurs; i++) {
        let objPosition = tPositionsPossibles.splice(Math.floor(Math.random() * tPositionsPossibles.length), 1)[0];
        let obj3DTelerecepteur = creerObj3DFleche(objgl, TEX_FLECHE); //objet 3d fleche
        setAngleZ(-90, obj3DTelerecepteur.transformations);
        setPositionsXYZ([objPosition.x + 0.5, 0, objPosition.z + 0.5], obj3DTelerecepteur.transformations);
        tObjNiveau[objPosition.z][objPosition.x] = obj3DTelerecepteur;
    }

    // ajoute tous les objets du niveau à la scène
    tObjNiveau.map(i => i.map(o => { if (o !== null) { objScene3D.tabObjets3D.push(o); } }));
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
    const joueur = objCameraJoueur;

    if (objClavier['ArrowLeft'] || objClavier['ArrowRight']) {
        let fltX = getCibleCameraX(joueur) - getPositionCameraX(joueur);
        let fltZ = getCibleCameraZ(joueur) - getPositionCameraZ(joueur);
        let intDirection = (objClavier['ArrowLeft']) ? -1 : 1;
        let fltAngle = intDirection * 0.0015 * intDeltaMillis; // Tourner 15/10000 radians par milliseconde

        let fltXPrime = fltX * Math.cos(fltAngle) - fltZ * Math.sin(fltAngle);
        let fltZPrime = fltX * Math.sin(fltAngle) + fltZ * Math.cos(fltAngle);

        setCibleCameraX(getPositionCameraX(joueur) + fltXPrime, joueur);
        setCibleCameraZ(getPositionCameraZ(joueur) + fltZPrime, joueur);
    }
    if (objClavier['ArrowUp'] || objClavier['ArrowDown']) {
        let fltX = getCibleCameraX(joueur) - getPositionCameraX(joueur);
        let fltZ = getCibleCameraZ(joueur) - getPositionCameraZ(joueur);
        let fltRayon = Math.sqrt(fltX * fltX + fltZ * fltZ);
        let intDirection = (objClavier['ArrowUp']) ? 1 : -1;

        let fltXPrime = intDirection * 0.003 * intDeltaMillis * Math.cos(Math.acos(fltX / fltRayon)); // Avancer de 3/1000 unites par milliseconde
        let fltZPrime = intDirection * 0.003 * intDeltaMillis * Math.sin(Math.asin(fltZ / fltRayon));

        setCibleCameraX(getCibleCameraX(joueur) + fltXPrime, joueur);
        setCibleCameraZ(getCibleCameraZ(joueur) + fltZPrime, joueur);
        setPositionCameraX(getPositionCameraX(joueur) + fltXPrime, joueur);
        setPositionCameraZ(getPositionCameraZ(joueur) + fltZPrime, joueur);
        collisionJoueurMurs();
    }
}

//inspiré par https://www.jeffreythompson.org/collision-detection/line-circle.php
function collisionCercleLigneX(cX, cZ, cRayon, lX, lZ1, lZ2) {
    console.log(arguments);
    if (Math.abs(cX - lX) > cRayon) {
        return false;
    }
    let lMinZ = Math.min(lZ1, lZ2);
    let lMaxZ = Math.max(lZ1, lZ2);
    let lZ = Math.min(Math.max(cZ, lMinZ), lMaxZ); //z le plus proche de cZ sur la ligne
    let distance = Math.sqrt((cX - lX) * (cX - lX) + (cZ - lZ) * (cZ - lZ));
    if (distance > cRayon) {
        return false;
    }
    let angle = Math.atan2(cZ - lZ, cX - lX);
    let nouvX = cX + (cRayon - distance) * Math.cos(angle);
    let nouvZ = cZ + (cRayon - distance) * Math.sin(angle);
    return { x: nouvX, z: nouvZ };
}

function collisionCercleLigneZ(cX, cZ, cRayon, lX1, lX2, lZ) {
    console.log(arguments);
    if (Math.abs(cZ - lZ) > cRayon) {
        return false;
    }
    let lMinX = Math.min(lX1, lX2);
    let lMaxX = Math.max(lX1, lX2);
    let lX = Math.min(Math.max(cX, lMinX), lMaxX); //x le plus proche de cX sur la ligne
    let distance = Math.sqrt((cX - lX) * (cX - lX) + (cZ - lZ) * (cZ - lZ));
    if (distance > cRayon) {
        return false;
    }
    let angle = Math.atan2(cZ - lZ, cX - lX);
    let nouvX = cX + (cRayon - distance) * Math.cos(angle);
    let nouvZ = cZ + (cRayon - distance) * Math.sin(angle);
    return { x: nouvX, z: nouvZ };
}


function collisionJoueurMurs() {
    const joueur = objCameraJoueur;
    let fltJoueurX = getPositionCameraX(joueur);
    let fltJoueurZ = getPositionCameraZ(joueur);
    let fltJoueurRayon = 0.2;

    const tabObjets3D = objScene3D.tabObjets3D;
    for (const obj of tabObjets3D) {
        if (!obj.collisionMur) {
            continue; //n'est pas un mur
        }
        let fltObjX = getPositionX(obj.transformations);
        let fltObjZ = getPositionZ(obj.transformations);
        let fltDistX = fltObjX - fltJoueurX;
        let fltDistZ = fltObjZ - fltJoueurZ;
        if (Math.abs(fltDistX) > 1 || Math.abs(fltDistZ) > 1) {
            continue; //mur est trop loin pour une collision
        }
        console.log('murProche' + (new Date()).getMilliseconds());

        let objColl;
        if (Math.abs(fltDistX) > Math.abs(fltDistZ)) { //collision w ligne X, Math.sign détermine si c'est le mur positif ou le mur négatif
            console.log('x');
            objColl = collisionCercleLigneX(fltJoueurX, fltJoueurZ, fltJoueurRayon,
                fltObjX + (obj.fltLargeur / 2 * -Math.sign(fltDistX)), fltObjZ - obj.fltProfondeur / 2, fltObjZ + obj.fltProfondeur / 2);
        }
        else { //collision w ligne Z
            console.log('z');
            objColl = collisionCercleLigneZ(fltJoueurX, fltJoueurZ, fltJoueurRayon,
                fltObjX - obj.fltLargeur / 2, fltObjX + obj.fltLargeur / 2, fltObjZ + (obj.fltProfondeur / 2 * -Math.sign(fltDistZ)));
        }
        console.log(objColl);
        if (objColl !== false) {
            let fltXPrime = objColl.x - fltJoueurX;
            let fltZPrime = objColl.z - fltJoueurZ;
            setCibleCameraX(getCibleCameraX(joueur) + fltXPrime, joueur);
            setCibleCameraZ(getCibleCameraZ(joueur) + fltZPrime, joueur);
            setPositionCameraX(getPositionCameraX(joueur) + fltXPrime, joueur);
            setPositionCameraZ(getPositionCameraZ(joueur) + fltZPrime, joueur);
        }
    }
}