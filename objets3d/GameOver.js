
function creerObj3DGameOver(objgl, intNoTexture) {
    var obj3DGameOver = new Object();
    obj3DGameOver.strType = "GAMEOVER";
    obj3DGameOver.fltLargeur = 2.5;   // X
    //obj3DGameOver.fltHauteur = 0; // Y
    obj3DGameOver.fltProfondeur = 1;// Z

    obj3DGameOver.vertex = creerVertexGameOver(objgl, obj3DGameOver.fltLargeur, obj3DGameOver.fltProfondeur);
    obj3DGameOver.couleurs = creerCouleursGameOver(objgl, [1, 1, 1, 1]);
    obj3DGameOver.texels = creerTexelsGameOver(objgl, intNoTexture);
    obj3DGameOver.maillage = creerMaillageGameOver(objgl);

    obj3DGameOver.transformations = creerTransformations();

    obj3DGameOver.visible = true;
    return obj3DGameOver;
}

function creerVertexGameOver(objgl, fltLargeur, fltProfondeur) {
    var tabVertex = [
        -fltLargeur / 2, 0.0, -fltProfondeur / 2,
         fltLargeur / 2, 0.0, -fltProfondeur / 2,
        -fltLargeur / 2, 0.0,  fltProfondeur / 2,
         fltLargeur / 2, 0.0,  fltProfondeur / 2
    ];

    var objGameOver = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objGameOver);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabVertex), objgl.STATIC_DRAW);

    return objGameOver;
}

function creerCouleursGameOver(objgl, tabCouleur) {
    tabCouleurs = [];
    for (var i = 0; i < 4; i++)
        tabCouleurs = tabCouleurs.concat(tabCouleur);

    var objCouleursGameOver = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objCouleursGameOver);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabCouleurs), objgl.STATIC_DRAW);

    return objCouleursGameOver;
}

function creerTexelsGameOver(objgl, intNoTexture) {
    var tabTexels = [
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        1.0, 1.0
    ];

    var objTexelsGameOver = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objTexelsGameOver);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabTexels), objgl.STATIC_DRAW);

    objTexelsGameOver.intNoTexture = intNoTexture; objTexelsGameOver.pcCouleurTexel = 1.0;

    return objTexelsGameOver;
}

function creerMaillageGameOver(objgl) {
    var tabMaillage =
        [ // Les 2 triangles du GameOver
            0, 1, 2,
            1, 2, 3,
        ];

    var objMaillageGameOver = objgl.createBuffer();
    objgl.bindBuffer(objgl.ELEMENT_ARRAY_BUFFER, objMaillageGameOver);
    objgl.bufferData(objgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tabMaillage), objgl.STATIC_DRAW);

    // Le nombre de triangles
    objMaillageGameOver.intNbTriangles = 2;
    // Le nombre de droites
    objMaillageGameOver.intNbDroites = 0;

    return objMaillageGameOver;
}


