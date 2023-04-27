
function creerObj3DUVSphere(objgl, intNoTexture) {
    var obj3DUVSphere = new Object();
    obj3DUVSphere.strType = 'UVSPHERE';
    obj3DUVSphere.fltLargeur = 1;
    obj3DUVSphere.fltHauteur = 1;
    obj3DUVSphere.fltProfondeur = 1;

    obj3DUVSphere.vertex = creerVertexUVSphere(objgl, obj3DUVSphere.fltLargeur, obj3DUVSphere.fltHauteur, obj3DUVSphere.fltProfondeur);
    obj3DUVSphere.couleurs = creerCouleursUVSphere(objgl, [1, 1, 1, 1]);
    obj3DUVSphere.texels = creerTexelsUVSphere(objgl, obj3DUVSphere.fltLargeur, obj3DUVSphere.fltProfondeur, intNoTexture);
    obj3DUVSphere.maillage = creerMaillageUVSphere(objgl);

    obj3DUVSphere.transformations = creerTransformations();

    obj3DUVSphere.visible = true;
    obj3DUVSphere.collisionMur = false;
    obj3DUVSphere.binBeton = true;
    obj3DUVSphere.fermeTemps = 0;
    obj3DUVSphere.animation = function(intDeltaMillis){
        if(obj3DUVSphere.collisionMur){
            obj3DUVSphere.fermeTemps += intDeltaMillis;
        }
        else if(getPositionCameraZ(objCameraJoueur) < getPositionZ(obj3DUVSphere.transformations)-obj3DUVSphere.fltProfondeur/2-0.1){ //sort de la salle à tapis
            obj3DUVSphere.collisionMur = true;
            joueSon('UVSphereFerme');
            objSons.fondJeu.loop = true;
            if(objSons.fondJeu.paused){
                joueSon('fondJeu');
            }
        }
        //anime la chute
        let fltBond1 = 1.7-(obj3DUVSphere.fermeTemps/250)*(obj3DUVSphere.fermeTemps/250);
        let fltBond2 = 0.2-((obj3DUVSphere.fermeTemps-438)/250)*((obj3DUVSphere.fermeTemps-350)/250);
        setPositionY(Math.max(fltBond1, fltBond2, 0), obj3DUVSphere.transformations);
        
    }
    return obj3DUVSphere;
}

function creerVertexUVSphere(objgl, fltLargeur, fltHauteur, fltProfondeur) {
    function vertexCercle(y, r){
        let tCercle = new Array();
        for (var i = 0; i <= 360; i++) {
            tCercle = tCercle.concat([-Math.cos(i * Math.PI / 180) * r, y, Math.sin(i * Math.PI / 180) * r]);
        }
        return tCercle;
    }

    var tabVertex = [];
    for(var i = 0; i <= 180; i++){
        tabVertex.push(...vertexCercle(Math.cos(i * Math.PI / 180)*fltHauteur, Math.sin(i * Math.PI / 180)*fltLargeur));
    }

    var objUVSphere = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objUVSphere);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabVertex), objgl.STATIC_DRAW);

    return objUVSphere;
}

function creerCouleursUVSphere(objgl, tabCouleur) {
    tabCouleurs = [];
    for (var i = 0; i < 13*6; i++)
        tabCouleurs = tabCouleurs.concat(tabCouleur);

    var objCouleursUVSphere = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objCouleursUVSphere);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabCouleurs), objgl.STATIC_DRAW);

    return objCouleursUVSphere;
}

function creerTexelsUVSphere(objgl, fltLargeur, fltProfondeur, intNoTexture) {
    var tabTexels = [
    ];
    for(var i = 0; i <= 180; i++){
        for (var j = 0; j <= 360; j++) {
            tabTexels.push(j/360, i/180);
        }
    }

    var objTexelsUVSphere = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objTexelsUVSphere);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabTexels), objgl.STATIC_DRAW);

    objTexelsUVSphere.intNoTexture = intNoTexture; objTexelsUVSphere.pcCouleurTexel = 1.0;

    return objTexelsUVSphere;
}

function creerMaillageUVSphere(objgl) {
    var tabMaillage = [

    ];
    for(var i = 0; i < 180; i++){ //181 cercles ont fait 180 bandes
        for (var j = 0; j < 360; j++) { // 360 quartiers d'orange 
            let pt1 = i*361+j; // en haut, à gauche
            let pt2 = i*361+(j+1); //en haut à droite
            let pt3 = (i+1)*361+j; //en bas à gauche
            let pt4 = (i+1)*361+(j+1); //en bas, à droite
            tabMaillage.push(pt1, pt2, pt3);
            tabMaillage.push(pt2, pt3, pt4);
        }
    }

    var objMaillageUVSphere = objgl.createBuffer();
    objgl.bindBuffer(objgl.ELEMENT_ARRAY_BUFFER, objMaillageUVSphere);
    objgl.bufferData(objgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tabMaillage), objgl.STATIC_DRAW);

    // Le nombre de triangles
    objMaillageUVSphere.intNbTriangles = 360*180*2;
    // Le nombre de droites
    objMaillageUVSphere.intNbDroites = 0;

    return objMaillageUVSphere;
}


