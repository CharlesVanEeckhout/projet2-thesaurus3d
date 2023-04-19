
function creerObj3DTeleTransporteur(objgl, intNoTexture) {
    var obj3DTeleTransporteur = new Object();
    obj3DTeleTransporteur.strType = 'TELETRANSPORTEUR';
    obj3DTeleTransporteur.fltLargeur = 1;
    obj3DTeleTransporteur.fltHauteur = 1.99;
    obj3DTeleTransporteur.fltProfondeur = 1;

    obj3DTeleTransporteur.vertex = creerVertexTeleTransporteur(objgl, obj3DTeleTransporteur.fltLargeur, obj3DTeleTransporteur.fltHauteur, obj3DTeleTransporteur.fltProfondeur);
    obj3DTeleTransporteur.couleurs = creerCouleursTeleTransporteur(objgl, [1, 1, 1, 1]);
    obj3DTeleTransporteur.texels = creerTexelsTeleTransporteur(objgl, obj3DTeleTransporteur.fltLargeur, obj3DTeleTransporteur.fltHauteur, obj3DTeleTransporteur.fltProfondeur, intNoTexture);
    obj3DTeleTransporteur.maillage = creerMaillageTeleTransporteur(objgl);
    
    obj3DTeleTransporteur.transformations = creerTransformations();

    obj3DTeleTransporteur.visible = true;
    obj3DTeleTransporteur.scrollTexture = 0;
    obj3DTeleTransporteur.animation = function(intDeltaMillis){
        obj3DTeleTransporteur.scrollTexture = (obj3DTeleTransporteur.scrollTexture + 0.0005*intDeltaMillis) % 1;
        
        objgl.bindBuffer(objgl.ARRAY_BUFFER, obj3DTeleTransporteur.texels);
        for(var i = 362*2; i < 362*3; i++){
            objgl.bufferSubData(objgl.ARRAY_BUFFER, 4*(i*2+1), new Float32Array([obj3DTeleTransporteur.scrollTexture]));
        }
        for(var i = 362*3; i < 362*4; i++){
            objgl.bufferSubData(objgl.ARRAY_BUFFER, 4*(i*2+1), new Float32Array([obj3DTeleTransporteur.scrollTexture+1.0]));
        }
    }
    return obj3DTeleTransporteur;
}

function creerVertexTeleTransporteur(objgl, fltLargeur, fltHauteur, fltProfondeur) {
    var tabVertex = [0, fltHauteur, 0] // Le centre du cercle (0)
    for (var i = 0; i <= 360; i++) { //1-361
        tabVertex = tabVertex.concat([Math.cos(i * Math.PI / 180) * fltLargeur / 2, fltHauteur, Math.sin(i * Math.PI / 180) * fltProfondeur / 2]);
    }

    tabVertex = tabVertex.concat([0, 0, 0]) // Le centre du cercle
    for (var i = 0; i <= 360; i++) {
        tabVertex = tabVertex.concat([Math.cos(i * Math.PI / 180) * fltLargeur / 2, 0, Math.sin(i * Math.PI / 180) * fltProfondeur / 2]);
    }

    tabVertex = tabVertex.concat([0, fltHauteur, 0]) // Le centre du cercle
    for (var i = 0; i <= 360; i++) {
        tabVertex = tabVertex.concat([Math.cos(i * Math.PI / 180) * fltLargeur / 3, fltHauteur, Math.sin(i * Math.PI / 180) * fltProfondeur / 3]);
    }

    tabVertex = tabVertex.concat([0, 0, 0]) // Le centre du cercle
    for (var i = 0; i <= 360; i++) {
        tabVertex = tabVertex.concat([Math.cos(i * Math.PI / 180) * fltLargeur / 3, 0, Math.sin(i * Math.PI / 180) * fltProfondeur / 3]);
    }

    var objTeleTransporteur = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objTeleTransporteur);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabVertex), objgl.STATIC_DRAW);

    return objTeleTransporteur;
}

function creerCouleursTeleTransporteur(objgl, tabCouleurs) {
    tabCouleurs = [];
    for (var i = 0; i < 1448; i++) {
        tabCouleurs = tabCouleurs.concat([0.0, 0.0, 0.0, 1.0]);
    }

    // for (var i = 0; i < 724; i++) {
    //     tabCouleurs = tabCouleurs.concat([0.0, 0.0, 0.0, 1.0]);
    // }

    var objCouleursTeleTransporteur = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objCouleursTeleTransporteur);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabCouleurs), objgl.STATIC_DRAW);

    return objCouleursTeleTransporteur;
}

function creerTexelsTeleTransporteur(objgl, fltLargeur, fltHauteur, fltProfondeur, intNoTexture) {
    var centre1 = 0.2;
    var centre2 = 0.25;
    var tabTexels = [centre1, 0.5] // Le centre de la texture
    for (var i = 0; i <= 360; i++) {
        tabTexels = tabTexels.concat([centre1 + centre1 * Math.cos(i * Math.PI / 180), 0.5 + 0.5 * Math.sin(i * Math.PI / 180)]);
    }

    tabTexels = tabTexels.concat([centre1, centre1])
    for (var i = 0; i <= 360; i++) {
        tabTexels = tabTexels.concat([centre1 + centre1 * Math.cos(i * Math.PI / 180), 0.5 + 0.5 * Math.sin(i * Math.PI / 180)]);
    }

    tabTexels = tabTexels.concat([0.5, 0.5])
    for (var i = 0; i <= 360; i++) {
        tabTexels = tabTexels.concat([(i/360)*0.5 + 0.5, 0.0]);
    }

    tabTexels = tabTexels.concat([0.5, 0.5])
    for (var i = 0; i <= 360; i++) {
        tabTexels = tabTexels.concat([(i/360)*0.5 + 0.5, 1.0]);
    }

    var objTexelsTeleTransporteur = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objTexelsTeleTransporteur);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabTexels), objgl.DYNAMIC_DRAW);

    objTexelsTeleTransporteur.intNoTexture = intNoTexture; objTexelsTeleTransporteur.pcCouleurTexel = 1.0;


    return objTexelsTeleTransporteur;
}

function creerMaillageTeleTransporteur(objgl) {
    var objMaillageCercle = objgl.createBuffer();
    var tabMaillageCercle = [];

    for (var i = 1; i <= 360; i++) //for 1-361
        tabMaillageCercle = tabMaillageCercle.concat([0, i, i + 1]);
        // tabMaillageCercle = tabMaillageCercle.concat([i, i+1, i + 361]);
        // tabMaillageCercle = tabMaillageCercle.concat([i + 1, i+ 361+ 1, i + 361]);

    for (var i = 363; i <= 722; i++)
        tabMaillageCercle = tabMaillageCercle.concat([362, i, i + 1]);

    for (var i = 725; i <= 1084; i++) {
        tabMaillageCercle = tabMaillageCercle.concat([i, i+362, i + 1]);
        tabMaillageCercle = tabMaillageCercle.concat([i + 362, i + 1, i + 1+ 362]);
    }

    // for (var i = 1087; i <= 1446; i++)
    //     tabMaillageCercle = tabMaillageCercle.concat([1086, i, i + 1]);


    objgl.bindBuffer(objgl.ELEMENT_ARRAY_BUFFER, objMaillageCercle);
    objgl.bufferData(objgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tabMaillageCercle), objgl.STATIC_DRAW);

    // Le nombre de triangles
    objMaillageCercle.intNbTriangles = 1440; // 1-360, 363-722.... j'additionne tout, cela me donne 1440
    // Le nombre de droites
    objMaillageCercle.intNbDroites = 0;

    return objMaillageCercle;
}


