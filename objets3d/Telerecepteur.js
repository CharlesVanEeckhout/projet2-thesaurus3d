
function creerObj3DTelerecepteur(objgl, intNoTexture) {
    var obj3DTelerecepteur = new Object();
    obj3DTelerecepteur.fltLargeur = 1;
    obj3DTelerecepteur.fltHauteur = 1.5;
    obj3DTelerecepteur.fltProfondeur = 1;

    obj3DTelerecepteur.vertex = creerVertexTelerecepteur(objgl, obj3DTelerecepteur.fltLargeur, obj3DTelerecepteur.fltHauteur, obj3DTelerecepteur.fltProfondeur);
    obj3DTelerecepteur.couleurs = creerCouleursTelerecepteur(objgl, [1, 1, 1, 1]);
    obj3DTelerecepteur.texels = creerTexelsTelerecepteur(objgl, obj3DTelerecepteur.fltLargeur, obj3DTelerecepteur.fltHauteur, obj3DTelerecepteur.fltProfondeur, intNoTexture);
    obj3DTelerecepteur.maillage = creerMaillageTelerecepteur(objgl);
    obj3DTelerecepteur.transformations = creerTransformations();

    obj3DTelerecepteur.scrollTexture = 0;
    obj3DTelerecepteur.animation = function(intDeltaMillis){
        obj3DTelerecepteur.scrollTexture = (obj3DTelerecepteur.scrollTexture - 0.0005*intDeltaMillis) % 1;
        
        objgl.bindBuffer(objgl.ARRAY_BUFFER, obj3DTelerecepteur.texels);
        for(var i = 362*2; i < 362*3; i++){
            objgl.bufferSubData(objgl.ARRAY_BUFFER, 4*(i*2+1), new Float32Array([obj3DTelerecepteur.scrollTexture]));
        }
        for(var i = 362*3; i < 362*4; i++){
            objgl.bufferSubData(objgl.ARRAY_BUFFER, 4*(i*2+1), new Float32Array([obj3DTelerecepteur.scrollTexture+1.0]));
        }
    }
    return obj3DTelerecepteur;
}

function creerVertexTelerecepteur(objgl, fltLargeur, fltHauteur, fltProfondeur) {
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

    var objTelerecepteur = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objTelerecepteur);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabVertex), objgl.STATIC_DRAW);

    return objTelerecepteur;
}

function creerCouleursTelerecepteur(objgl, tabCouleurs) {
    tabCouleurs = [];
    for (var i = 0; i < 1448; i++) {
        tabCouleurs = tabCouleurs.concat([0.0, 0.0, 0.0, 1.0]);
    }

    // for (var i = 0; i < 724; i++) {
    //     tabCouleurs = tabCouleurs.concat([0.0, 0.0, 0.0, 1.0]);
    // }

    var objCouleursTelerecepteur = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objCouleursTelerecepteur);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabCouleurs), objgl.STATIC_DRAW);

    return objCouleursTelerecepteur;
}

function creerTexelsTelerecepteur(objgl, fltLargeur, fltHauteur, fltProfondeur, intNoTexture) {
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

    var objTexelsTelerecepteur = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objTexelsTelerecepteur);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabTexels), objgl.DYNAMIC_DRAW);

    objTexelsTelerecepteur.intNoTexture = intNoTexture; objTexelsTelerecepteur.pcCouleurTexel = 1.0;


    return objTexelsTelerecepteur;
}

function creerMaillageTelerecepteur(objgl) {
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


