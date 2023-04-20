
function creerObj3DIndicateur(objgl, intNoTexture) {
    var obj3DIndicateur = new Object();
    obj3DIndicateur.strType = 'INDICATEUR';
    obj3DIndicateur.fltLargeur = 0.9;
    //obj3DIndicateur.fltHauteur = 0;
    obj3DIndicateur.fltProfondeur = 0.6;

    obj3DIndicateur.vertex = creerVertexIndicateur(objgl, obj3DIndicateur.fltLargeur, obj3DIndicateur.fltProfondeur);
    obj3DIndicateur.couleurs = creerCouleursIndicateur(objgl, [1, 1, 1, 1]);
    obj3DIndicateur.texels = creerTexelsIndicateur(objgl, obj3DIndicateur.fltLargeur, obj3DIndicateur.fltProfondeur, intNoTexture);
    obj3DIndicateur.maillage = creerMaillageIndicateur(objgl);

    obj3DIndicateur.transformations = creerTransformations();

    obj3DIndicateur.visible = true;
    return obj3DIndicateur;
}

function creerVertexIndicateur(objgl, fltLargeur, fltProfondeur) {
    var tabVertex = [
        // triangle
         fltLargeur / 2,  0.0,  0.0,
        -fltLargeur / 2,  0.0, -fltProfondeur / 2, 
        -fltLargeur / 2,  0.0,  fltProfondeur / 2,
    ];

    var objIndicateur = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objIndicateur);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabVertex), objgl.STATIC_DRAW);

    return objIndicateur;
}

function creerCouleursIndicateur(objgl, tabCouleur) {
    tabCouleurs = [];
    for (var i = 0; i < 3; i++)
        tabCouleurs = tabCouleurs.concat(tabCouleur);

    var objCouleursIndicateur = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objCouleursIndicateur);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabCouleurs), objgl.STATIC_DRAW);

    return objCouleursIndicateur;
}

function creerTexelsIndicateur(objgl, fltLargeur, fltProfondeur, intNoTexture) {
    var tabTexels = [
        // pointe du triangle de la flèche
        1.00, 0.50,
        // haut du triangle de la flèche
        0.00, 0.00,
        // bas du triangle de la flèche
        0.00, 1.00,
    ];

    var objTexelsIndicateur = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objTexelsIndicateur);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabTexels), objgl.STATIC_DRAW);

    objTexelsIndicateur.intNoTexture = intNoTexture; objTexelsIndicateur.pcCouleurTexel = 1.0;

    return objTexelsIndicateur;
}

function creerMaillageIndicateur(objgl) {
    var tabMaillage = [
        // Triangle de la flèche proche
        0, 1, 2,
    ];

    var objMaillageIndicateur = objgl.createBuffer();
    objgl.bindBuffer(objgl.ELEMENT_ARRAY_BUFFER, objMaillageIndicateur);
    objgl.bufferData(objgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tabMaillage), objgl.STATIC_DRAW);

    // Le nombre de triangles
    objMaillageIndicateur.intNbTriangles = 1;
    // Le nombre de droites
    objMaillageIndicateur.intNbDroites = 0;

    return objMaillageIndicateur;
}


