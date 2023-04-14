
function creerObj3DSol(objgl, intNoTexture) {
    var obj3DSol = new Object();
    obj3DSol.fltLargeur = 31;   // X
    //obj3DSol.fltHauteur = 0;    // Y
    obj3DSol.fltProfondeur = 31;// Z

    obj3DSol.vertex = creerVertexSol(objgl, obj3DSol.fltLargeur, obj3DSol.fltProfondeur);
    obj3DSol.couleurs = creerCouleursSol(objgl, [1, 1, 1, 1]);
    obj3DSol.texels = creerTexelsSol(objgl, obj3DSol.fltLargeur, obj3DSol.fltProfondeur, intNoTexture);
    obj3DSol.maillage = creerMaillageSol(objgl);

    obj3DSol.transformations = creerTransformations();
    return obj3DSol;
}

function creerVertexSol(objgl, fltLargeur, fltProfondeur) {
    var tabVertex = [
        0.0,        -0.01, 0.0,
        fltLargeur, -0.01, 0.0,
        0.0,        -0.01, fltProfondeur,
        fltLargeur, -0.01, fltProfondeur
    ];

    var objSol = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objSol);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabVertex), objgl.STATIC_DRAW);

    return objSol;
}

function creerCouleursSol(objgl, tabCouleur) {
    tabCouleurs = [];
    for (var i = 0; i < 4; i++)
        tabCouleurs = tabCouleurs.concat(tabCouleur);

    var objCouleursSol = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objCouleursSol);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabCouleurs), objgl.STATIC_DRAW);

    return objCouleursSol;
}

function creerTexelsSol(objgl, fltLargeur, fltProfondeur, intNoTexture) {
    var tabTexels = [
        0.0,        0.0,
        fltLargeur, 0.0,
        0.0,        fltProfondeur,
        fltLargeur, fltProfondeur
    ];

    var objTexelsSol = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objTexelsSol);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabTexels), objgl.STATIC_DRAW);

    objTexelsSol.intNoTexture = intNoTexture; objTexelsSol.pcCouleurTexel = 1.0;

    return objTexelsSol;
}

function creerMaillageSol(objgl) {
    var tabMaillage =
        [ // Les 2 triangles du sol
            0, 1, 2,
            1, 2, 3,
        ];

    var objMaillageSol = objgl.createBuffer();
    objgl.bindBuffer(objgl.ELEMENT_ARRAY_BUFFER, objMaillageSol);
    objgl.bufferData(objgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tabMaillage), objgl.STATIC_DRAW);

    // Le nombre de triangles
    objMaillageSol.intNbTriangles = 2;
    // Le nombre de droites
    objMaillageSol.intNbDroites = 0;

    return objMaillageSol;
}


