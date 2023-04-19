const intTempsAuDebutDunNiveau = 60000;
var intDatePassee = 0;
var objClavier = null;

var objCameraJoueur = null;
var objCameraVueAerienne = null;
var intNiveau = 5; //devrait être 1 quand on remet le projet
var intScore = 300;
var intTemps = 0; //en millisecondes
var intOuvreursDeMurs = 0;
var binVueAerienne = false;
var intTempsVueAerienne = 0;
var binTricherVueAerienne = false;
var tObjNiveau = []; 
var objPositionTresor = null;



function initNiveau() {
    intTemps = intTempsAuDebutDunNiveau;
    intOuvreursDeMurs = Math.floor((10 - intNiveau) / 2);
    let intFleches = (10 - intNiveau) * 2;
    let intTeleTransporteurs = Math.floor(intNiveau / 2);
    let intTeleRecepteurs = intNiveau - 1;
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

    // trouve positions possibles pour objets aléatoires du niveau
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

    // Créer le dédale
    for (var i = 0; i < tStrDedale.length; i++) {
        for (var j = 0; j < tStrDedale[i].length; j++) {
            let obj3D = null;
            switch (tStrDedale[i][j]) {
                case '.':
                    break;
                case ',':
                    obj3D = creerObj3DTapis(objgl, TEX_TAPIS);
                    break;
                case '#':
                    obj3D = creerObj3DMur(objgl, TEX_MUR, false);
                    break;
                case 'B':
                    obj3D = creerObj3DMur(objgl, TEX_MURBETON, true);
                    break;
                case '=':
                    obj3D = creerObj3DCloture(objgl, TEX_CLOTURE);
                    break;
                default:
                    obj3D = creerObj3DFleche(objgl, TEX_FLECHE);
                    setEchelleZ(1 / 0.4, obj3D.transformations);
            }
            if (obj3D !== null) {
                setPositionX(j + 0.5, obj3D.transformations);
                setPositionZ(i + 0.5, obj3D.transformations);
                tObjNiveau[i][j] = obj3D;
            }
        }
    }

    // place le tresor
    objPositionTresor = tPositionsPossibles.splice(Math.floor(Math.random() * tPositionsPossibles.length), 1)[0];
    let obj3DTresor = creerObj3DCoffre(objgl, TEX_COFFRE); //objet 3d tresor
    setPositionsXYZ([objPositionTresor.x + 0.5, 0, objPositionTresor.z + 0.5], obj3DTresor.transformations);
    tObjNiveau[objPositionTresor.z][objPositionTresor.x] = obj3DTresor;

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
    for (var i = 0; i < intTeleTransporteurs; i++) {
        let objPosition = tPositionsPossibles.splice(Math.floor(Math.random() * tPositionsPossibles.length), 1)[0];
        let obj3DTeleTransporteur = creerObj3DTeleTransporteur(objgl, TEX_TELETRANSPORTEUR); //objet 3d tele-transporteur
        setPositionsXYZ([objPosition.x + 0.5, 0, objPosition.z + 0.5], obj3DTeleTransporteur.transformations);
        tObjNiveau[objPosition.z][objPosition.x] = obj3DTeleTransporteur;
    }

    // place les tele-recepteurs
    for (var i = 0; i < intTeleRecepteurs; i++) {
        let objPosition = tPositionsPossibles.splice(Math.floor(Math.random() * tPositionsPossibles.length), 1)[0];
        let obj3DTeleRecepteur = creerObj3DTeleRecepteur(objgl, TEX_TELERECEPTEUR); //objet 3d tele-recepteur
        setPositionsXYZ([objPosition.x + 0.5, 0, objPosition.z + 0.5], obj3DTeleRecepteur.transformations);
        tObjNiveau[objPosition.z][objPosition.x] = obj3DTeleRecepteur;
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
        collisionAutres("TELERECEPTEUR");
        collisionAutres("COFFRE");
        collisionTransporteur();
        //Test
        // console.log(collisionAutres("COFFRE"));
    }
}

//inspiré par https://www.jeffreythompson.org/collision-detection/line-circle.php
function collisionCercleLigneX(cX, cZ, cRayon, lX, lZ1, lZ2) {
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

        let objColl;
        if (Math.abs(fltDistX) > Math.abs(fltDistZ)) { //collision w ligne X, Math.sign détermine si c'est le mur positif ou le mur négatif
            objColl = collisionCercleLigneX(fltJoueurX, fltJoueurZ, fltJoueurRayon,
                fltObjX + (obj.fltLargeur / 2 * -Math.sign(fltDistX)), fltObjZ - obj.fltProfondeur / 2, fltObjZ + obj.fltProfondeur / 2);
        }
        else { //collision w ligne Z
            objColl = collisionCercleLigneZ(fltJoueurX, fltJoueurZ, fltJoueurRayon,
                fltObjX - obj.fltLargeur / 2, fltObjX + obj.fltLargeur / 2, fltObjZ + (obj.fltProfondeur / 2 * -Math.sign(fltDistZ)));
        }
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

function collisionAutres(strType) {
    let intPosXJoueur = Math.floor(getPositionCameraX(objCameraJoueur));
    let intPosZJoueur = Math.floor(getPositionCameraZ(objCameraJoueur));

    if (tObjNiveau[intPosZJoueur][intPosXJoueur] != null) {
        return tObjNiveau[intPosZJoueur][intPosXJoueur].strType == strType
    }
    return false;
}

function collisionTransporteur() {
    const joueur = objCameraJoueur;
    const tabObjTelerecepteur = new Array();

    for (let i = 0; i < tObjNiveau.length; i++) {
        for (let j = 0; j < tObjNiveau[i].length; j++) {
            if (tObjNiveau[i][j] != null && tObjNiveau[i][j].strType == "TELERECEPTEUR") {
                tabObjTelerecepteur.push(tObjNiveau[i][j]);
            }
        }
    }
    console.log(tabObjTelerecepteur);

    //fltXDelta = nouvelle position du joueur - poisition ancienne du joueur
    if (collisionAutres("TELETRANSPORTEUR")) {
        // setCibleCameraX(get + fltXDelta, joueur);
        // setCibleCameraZ(0, joueur);
        // setPositionCameraX(0, joueur);
        // setPositionCameraZ(0, joueur);
    }
}

function miseAJourHUD() {
    let objHUDOuvreursTxt = document.getElementById("HUDOuvreursTxt");
    let objHUDOuvreursImg = document.getElementById("HUDOuvreursImg");
    let objHUDTimerSec = document.getElementById("HUDTimerSec");
    let objHUDTimerMillis = document.getElementById("HUDTimerMillis");
    let objHUDNiveau = document.getElementById("HUDNiveau");
    let objHUDScore = document.getElementById("HUDScore");

    //ouvreurs
    if (intScore < 50) {
        objHUDOuvreursTxt.style.color = ['inherit', 'red'][Math.floor(intTemps / 500) % 2]; //couleur clignote rouge
    }
    else {
        objHUDOuvreursTxt.style.color = 'inherit';
    }

    var strOuvreursImg = "";
    for (var i = 0; i < intOuvreursDeMurs; i++) {
        strOuvreursImg += '<img src="./ouvreur.png" alt="X">';
    }
    if (objHUDOuvreursImg.innerHTML !== strOuvreursImg) {
        objHUDOuvreursImg.innerHTML = strOuvreursImg;
    }

    //timer
    objHUDTimerSec.innerHTML = Math.floor(intTemps / 1000).toString().padStart(2, '0');
    objHUDTimerMillis.innerHTML = Math.floor(intTemps % 1000).toString().padStart(3, '0');

    //niveau
    objHUDNiveau.innerHTML = "Niveau " + intNiveau.toString().padStart(2, '0');

    //score
    objHUDScore.innerHTML = intScore + " pts";
}