const intTempsAuDebutDunNiveau = 60000;
var intDatePassee = 0;
var objClavier = null;

var objCameraJoueur = null;
var objCameraVueAerienne = null;
var intNiveau = 8; //devrait être 1 quand on remet le projet
var intScore = 300;
var intTemps = 0; //en millisecondes
var intOuvreursDeMurs = 0;
var binVueAerienne = false;
var intTempsVueAerienne = 0;
var binTricherVueAerienne = false;
var tObjNiveau = null;
var objPositionTresor = null;
var strPhaseDuJeu = "recherche";
var intTempsDsPhaseDeJeu = 0;
var objRDestination = null;
var test = 0;


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
    tObjNiveau = new Array();

    // Créer le sol
    let obj3DSol = creerObj3DSol(objgl, TEX_SOL);
    objScene3D.tabObjets3D.push(obj3DSol);

    // Créer le plafond
    let obj3DPlafond = creerObj3DPlafond(objgl, TEX_PLAFOND);
    // setPositionY(2, obj3DPlafond.transformations);
    objScene3D.tabObjets3D.push(obj3DPlafond);

    // Créer l'indicateur
    let obj3DIndicateur = creerObj3DIndicateur(objgl, TEX_INDICATEUR);
    objScene3D.tabObjets3D.push(obj3DIndicateur);

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
                    setPositionY(1.7, obj3D.transformations);
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


function resetNiveau() {
    intTemps = intTempsAuDebutDunNiveau;
    intOuvreursDeMurs = Math.floor((10 - intNiveau) / 2);
    binVueAerienne = false;
    intTempsVueAerienne = 0;
    binTricherVueAerienne = false;

    setPositionsCameraXYZ([tStrDedale[0].length / 2, 0.5, tStrDedale.length / 2], objCameraJoueur);
    setCiblesCameraXYZ([tStrDedale[0].length / 2, 0.8, tStrDedale.length / 2 - 5], objCameraJoueur);
    setOrientationsXYZ([0, 1, 0], objCameraJoueur);

    // Vider les objets
    let tObjetsAEnlever = new Array();
    for (const obj of objScene3D.tabObjets3D) {
        if (obj.strType &&
            (obj.strType == "MUR" || obj.strType == "CLOTURE" || obj.strType == "TAPIS" ||
                obj.strType == "PLAFOND" || obj.strType == "SOL" || obj.strType == "INDICATEUR")) {
            tObjetsAEnlever.push(obj);
        }
    }
    for (var enl of tObjetsAEnlever) {
        objScene3D.tabObjets3D = objScene3D.tabObjets3D.filter(obj => obj !== enl);
    }

    // Créer le sol
    let obj3DSol = creerObj3DSol(objgl, TEX_SOL);
    objScene3D.tabObjets3D.push(obj3DSol);

    // Créer le plafond
    let obj3DPlafond = creerObj3DPlafond(objgl, TEX_PLAFOND);
    // setPositionY(2, obj3DPlafond.transformations);
    objScene3D.tabObjets3D.push(obj3DPlafond);

    // Créer l'indicateur
    let obj3DIndicateur = creerObj3DIndicateur(objgl, TEX_INDICATEUR);
    objScene3D.tabObjets3D.push(obj3DIndicateur);

    // Créer le dédale
    let tabDedale = new Array();
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
                    setPositionY(1.7, obj3D.transformations);
                    break;
                default:
                    obj3D = creerObj3DFleche(objgl, TEX_FLECHE);
                    setEchelleZ(1 / 0.4, obj3D.transformations);
            }
            if (obj3D !== null) {
                tObjNiveau[i][j] = obj3D;
                // ajoute tous les objets du niveau à la scène
                objScene3D.tabObjets3D.push(obj3D);
            }
        }
    }

    for (var i = 0; i < tObjNiveau.length; i++) {
        for (var j = 0; j < tObjNiveau[i].length; j++) {
            if (tObjNiveau[i][j] == null) { continue; }
            setPositionX(j + 0.5, tObjNiveau[i][j].transformations);
            setPositionZ(i + 0.5, tObjNiveau[i][j].transformations);
            if (tObjNiveau[i][j].strType == "FLECHE") {
                setPositionY(1.25, tObjNiveau[i][j].transformations);
            } else {
                setPositionY(0, tObjNiveau[i][j].transformations);
            }
        }
    }
}


function miseAJourIndicateur() {
    let objIndicateur = null;
    for (const obj of objScene3D.tabObjets3D) {
        if (obj.strType === "INDICATEUR") {
            objIndicateur = obj;
            break;
        }
    }
    if (objIndicateur === null) {
        return; /* triste :( */
    }
    //même procédé que pour les flèches
    let fltAngleJoueur = Math.atan2(-getCibleCameraZ(objCameraJoueur) + getPositionCameraZ(objCameraJoueur), getCibleCameraX(objCameraJoueur) - getPositionCameraX(objCameraJoueur));
    //console.log(fltAngleJoueur);
    // console.log(fltAngleJoueur);
    setAngleY(fltAngleJoueur / Math.PI * 180, objIndicateur.transformations);
    setPositionsXYZ(getPositionsCameraXYZ(objCameraJoueur), objIndicateur.transformations);
}


function changeDeVue() {
    if (objClavier['PageUp'] && binVueAerienne == false) {
        binVueAerienne = true;
        objScene3D.camera = objCameraVueAerienne;
    }
    if ((objClavier['PageDown'] && binVueAerienne == true) || intScore < 10 || intTemps <= 0) {
        binVueAerienne = false;
        binTricherVueAerienne = false;
        objScene3D.camera = objCameraJoueur;
    }

    for (const obj of objScene3D.tabObjets3D) {
        switch (obj.strType) {
            case "CLOTURE":
            case "COFFRE":
            case "FLECHE":
            case "TELERECEPTEUR":
            case "TELETRANSPORTEUR":
                obj.visible = !binVueAerienne || binTricherVueAerienne;
                break;
            case "PLAFOND":
                obj.visible = !binVueAerienne;
                break;
            case "INDICATEUR":
                obj.visible = binVueAerienne;
                break;
            default:
                obj.visible = true;
        }
    }
}


function deplacerJoueur(intDeltaMillis) {
    const joueur = objCameraJoueur;

    if (objClavier['ArrowLeft'] || objClavier['ArrowRight']) {
        let fltX = getCibleCameraX(joueur) - getPositionCameraX(joueur);
        let fltZ = getCibleCameraZ(joueur) - getPositionCameraZ(joueur);
        let intDirection = (objClavier['ArrowLeft']) ? -1 : 1;
        let fltAngle = intDirection * 0.0015 * intDeltaMillis; // Tourner 15/10000 radians par milliseconde

        let fltXDelta = fltX * Math.cos(fltAngle) - fltZ * Math.sin(fltAngle);
        let fltZDelta = fltX * Math.sin(fltAngle) + fltZ * Math.cos(fltAngle);

        setCibleCameraX(getPositionCameraX(joueur) + fltXDelta, joueur);
        setCibleCameraZ(getPositionCameraZ(joueur) + fltZDelta, joueur);
    }
    if (objClavier['ArrowUp'] || objClavier['ArrowDown']) {
        let fltX = getCibleCameraX(joueur) - getPositionCameraX(joueur);
        let fltZ = getCibleCameraZ(joueur) - getPositionCameraZ(joueur);
        let fltRayon = Math.sqrt(fltX * fltX + fltZ * fltZ);
        let intDirection = (objClavier['ArrowUp']) ? 1 : -1;

        let fltXDelta = intDirection * 0.003 * intDeltaMillis * Math.cos(Math.acos(fltX / fltRayon)); // Avancer de 3/1000 unites par milliseconde
        let fltZDelta = intDirection * 0.003 * intDeltaMillis * Math.sin(Math.asin(fltZ / fltRayon));

        setCibleCameraX(getCibleCameraX(joueur) + fltXDelta, joueur);
        setCibleCameraZ(getCibleCameraZ(joueur) + fltZDelta, joueur);
        setPositionCameraX(getPositionCameraX(joueur) + fltXDelta, joueur);
        setPositionCameraZ(getPositionCameraZ(joueur) + fltZDelta, joueur);
        collisionJoueurMurs();
        collisionTeletransporteur();
        collisionTelerecepteur();
    }
}

function ouvrirMur() {
    const joueur = objCameraJoueur;
    let fltJoueurX = getPositionCameraX(joueur);
    let fltJoueurZ = getPositionCameraZ(joueur);
    let fltAngleJoueur = Math.atan2(-getCibleCameraZ(objCameraJoueur) + getPositionCameraZ(objCameraJoueur), getCibleCameraX(objCameraJoueur) - getPositionCameraX(objCameraJoueur));
    //let fltJoueurRayon = 0.2;
    const tabBriques = [
        tObjNiveau[Math.floor(fltJoueurZ)][Math.floor(fltJoueurX) - 1],
        tObjNiveau[Math.floor(fltJoueurZ) + 1][Math.floor(fltJoueurX)],
        tObjNiveau[Math.floor(fltJoueurZ)][Math.floor(fltJoueurX) + 1],
        tObjNiveau[Math.floor(fltJoueurZ) - 1][Math.floor(fltJoueurX)],
    ];

    const objBlocADetruire = tabBriques[Math.floor((fltAngleJoueur / Math.PI * 2 + 2.5) % 4)];
    //console.log(fltJoueurX, fltJoueurZ);
    //console.log(getPositionsXYZ(objBlocADetruire.transformations));
    if (objBlocADetruire === null) {
        //console.log('wohhoo1');
        return;
    }
    if (objBlocADetruire.strType !== 'MUR') {
        //console.log('wohhoo2');
        return;
    }
    if (objBlocADetruire.binBeton !== false) {
        //console.log('wohhoo3');
        return;
    }
    if (intOuvreursDeMurs <= 0) {
        //console.log('wohhoo3');
        return;
    }
    if (intScore < 50) {
        //console.log('wohhoo3');
        return;
    }
    //console.log('wohhoo');
    objScene3D.tabObjets3D = objScene3D.tabObjets3D.filter(obj => obj !== objBlocADetruire);
    tObjNiveau = tObjNiveau.map(i => i.map(obj => (obj === objBlocADetruire) ? null : obj));
    intOuvreursDeMurs--;
    intScore -= 50;
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

    for (const obj of objScene3D.tabObjets3D) {
        if (!obj.collisionMur) {
            continue; //n'est pas un objet solide
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
            let fltXDelta = objColl.x - fltJoueurX;
            let fltZDelta = objColl.z - fltJoueurZ;
            setCibleCameraX(getCibleCameraX(joueur) + fltXDelta, joueur);
            setCibleCameraZ(getCibleCameraZ(joueur) + fltZDelta, joueur);
            setPositionCameraX(getPositionCameraX(joueur) + fltXDelta, joueur);
            setPositionCameraZ(getPositionCameraZ(joueur) + fltZDelta, joueur);
        }
    }
}

function collisionAutres(strType) {
    let intPosXJoueur = Math.floor(getPositionCameraX(objCameraJoueur));
    let intPosZJoueur = Math.floor(getPositionCameraZ(objCameraJoueur));

    if (tObjNiveau[intPosZJoueur][intPosXJoueur] != null) {
        return tObjNiveau[intPosZJoueur][intPosXJoueur].strType == strType;
    }
    return false;
}

function collisionTeletransporteur() {
    const joueur = objCameraJoueur;
    const tabObjTelerecepteur = new Array();
    let intPosXJoueur = Math.floor(getPositionCameraX(joueur));
    let intPosZJoueur = Math.floor(getPositionCameraZ(joueur));
    
    if (collisionAutres("TELETRANSPORTEUR")) {
        
        for (let i = 0; i < tObjNiveau.length; i++) {
            for (let j = 0; j < tObjNiveau[i].length; j++) {
                if (tObjNiveau[i][j] != null && tObjNiveau[i][j].strType == "TELERECEPTEUR") {
                    tabObjTelerecepteur.push(tObjNiveau[i][j]);
                }
            }
        }

        //if (tableau.length > 2)
        var item = tabObjTelerecepteur[Math.floor(Math.random()*tabObjTelerecepteur.length)];
        objRDestination = item;
        let intPosXItem = Math.floor(getPositionX(item.transformations));
        let intPosZItem = Math.floor(getPositionZ(item.transformations));

        var fltXDelta = Math.floor(intPosXItem - intPosXJoueur);
        var fltZDelta = Math.floor(intPosZItem - intPosZJoueur);
        //console.log(" Position du joueur    : " +  intPosXJoueur + ", " + intPosZJoueur);
        //console.log(" Position du tele    : " +  fltXDelta + ", " + fltZDelta);
        //fltXDelta = nouvelle position du joueur - poisition ancienne du joueur
        
        setCibleCameraX(getCibleCameraX(joueur) + fltXDelta, joueur);
        setCibleCameraZ(getCibleCameraZ(joueur) + fltZDelta, joueur);
        setPositionCameraX(getPositionCameraX(joueur) + fltXDelta, joueur);
        setPositionCameraZ(getPositionCameraZ(joueur) + fltZDelta, joueur);
        
      
        
    }
}


function collisionTelerecepteur() {
    const joueur = objCameraJoueur;
    const tabObjTelerecepteur = new Array();
    let intPosXJoueur = Math.floor(getPositionCameraX(joueur));
    let intPosZJoueur = Math.floor(getPositionCameraZ(joueur));

    if (objRDestination != null && (intPosXJoueur != Math.floor(getPositionX(objRDestination.transformations)) || intPosZJoueur != Math.floor(getPositionZ(objRDestination.transformations)))) {
        console.log("X : " + Math.floor(getPositionX(objRDestination.transformations)) + "Z : " + Math.floor(getPositionZ(objRDestination.transformations)))
        console.log("X : " + intPosXJoueur + "\nZ : " + intPosZJoueur)
        objRDestination = null;
    }

    if (collisionAutres("TELERECEPTEUR") && objRDestination == null) {

        // let objRDepart = tObjNiveau[intPosZJoueur][intPosXJoueur];

        for (let i = 0; i < tObjNiveau.length; i++) {
            for (let j = 0; j < tObjNiveau[i].length; j++) {
                if (tObjNiveau[i][j] != null && tObjNiveau[i][j].strType == "TELERECEPTEUR" && tObjNiveau[i][j] != objRDestination) {
                    tabObjTelerecepteur.push(tObjNiveau[i][j]);
                }
            }
        }
        var item = tabObjTelerecepteur[Math.floor(Math.random() * tabObjTelerecepteur.length)];
        let intPosXItem = Math.floor(getPositionX(item.transformations));
        let intPosZItem = Math.floor(getPositionZ(item.transformations));

        objRDestination = item;
        // console.log("X : " + intPosXJoueur + "\nZ : " + intPosZJoueur)

        var fltXDelta = Math.floor(intPosXItem - intPosXJoueur);
        var fltZDelta = Math.floor(intPosZItem - intPosZJoueur);

        setCibleCameraX(getCibleCameraX(joueur) + fltXDelta, joueur);
        setCibleCameraZ(getCibleCameraZ(joueur) + fltZDelta, joueur);
        setPositionCameraX(getPositionCameraX(joueur) + fltXDelta, joueur);
        setPositionCameraZ(getPositionCameraZ(joueur) + fltZDelta, joueur);

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
