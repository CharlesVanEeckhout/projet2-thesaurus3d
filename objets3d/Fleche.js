
function creerObj3DFleche(objgl, intNoTexture) {
    var obj3DFleche = new Object();
    obj3DFleche.fltProfondeur = 1;
    obj3DFleche.fltLargeur = 1;
    obj3DFleche.fltHauteur = 0;

    obj3DFleche.vertex = creerVertexFleche(objgl, obj3DFleche.fltLargeur, obj3DFleche.fltProfondeur);
    obj3DFleche.couleurs = creerCouleursFleche(objgl, [1, 1, 1, 1]);
    obj3DFleche.texels = creerTexelsFleche(objgl, obj3DFleche.fltLargeur, obj3DFleche.fltProfondeur, intNoTexture);
    obj3DFleche.maillage = creerMaillageFleche(objgl);

    obj3DFleche.transformations = creerTransformations();
    return obj3DFleche;
}

function creerVertexFleche(objgl, fltLargeur, fltProfondeur) {
    var tabVertex = [
        -fltLargeur / 2, 0.0, -fltProfondeur / 2,
         fltLargeur / 2, 0.0, -fltProfondeur / 2,
        -fltLargeur / 2, 0.0,  fltProfondeur / 2,
         fltLargeur / 2, 0.0,  fltProfondeur / 2
    ];

    var objFleche = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objFleche);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabVertex), objgl.STATIC_DRAW);

    return objFleche;
}

function creerCouleursFleche(objgl, tabCouleur) {
    tabCouleurs = [];
    for (var i = 0; i < 4; i++)
        tabCouleurs = tabCouleurs.concat(tabCouleur);

    var objCouleursFleche = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objCouleursFleche);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabCouleurs), objgl.STATIC_DRAW);

    return objCouleursFleche;
}

function creerTexelsFleche(objgl, fltLargeur, fltProfondeur, intNoTexture) {
    var tabTexels = [
        0.0,        0.0,
        fltLargeur, 0.0,
        0.0,        fltProfondeur,
        fltLargeur, fltProfondeur
    ];

    var objTexelsFleche = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objTexelsFleche);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabTexels), objgl.STATIC_DRAW);

    objTexelsFleche.intNoTexture = intNoTexture; objTexelsFleche.pcCouleurTexel = 1.0;

    return objTexelsFleche;
}

function creerMaillageFleche(objgl) {
    var tabMaillage =
        [ // Les 2 triangles du Fleche
            0, 1, 2,
            1, 2, 3,
        ];

    var objMaillageFleche = objgl.createBuffer();
    objgl.bindBuffer(objgl.ELEMENT_ARRAY_BUFFER, objMaillageFleche);
    objgl.bufferData(objgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tabMaillage), objgl.STATIC_DRAW);

    // Le nombre de triangles
    objMaillageFleche.intNbTriangles = 2;
    // Le nombre de droites
    objMaillageFleche.intNbDroites = 0;

    return objMaillageFleche;
}


