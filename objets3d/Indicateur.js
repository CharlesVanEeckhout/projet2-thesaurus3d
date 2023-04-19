
function creerObj3DIndicateur(objgl, intNoTexture) {
    var obj3DIndicateur = new Object();
    obj3DIndicateur.strType = 'INDICATEUR'; //todo: remplacer par un triangle isocèle ou qqch
    obj3DIndicateur.fltLargeur = 1;
    obj3DIndicateur.fltHauteur = 4.8;
    obj3DIndicateur.fltProfondeur = 0.4;

    obj3DIndicateur.vertex = creerVertexIndicateur(objgl, obj3DIndicateur.fltLargeur, obj3DIndicateur.fltHauteur, obj3DIndicateur.fltProfondeur);
    obj3DIndicateur.couleurs = creerCouleursIndicateur(objgl, [1, 1, 1, 1]);
    obj3DIndicateur.texels = creerTexelsIndicateur(objgl, obj3DIndicateur.fltLargeur, obj3DIndicateur.fltProfondeur, intNoTexture);
    obj3DIndicateur.maillage = creerMaillageIndicateur(objgl);

    obj3DIndicateur.transformations = creerTransformations();

    obj3DIndicateur.visible = true;
    return obj3DIndicateur;
}

function creerVertexIndicateur(objgl, fltLargeur, fltHauteur, fltProfondeur) {
    var tabVertex = [
        // pointe du triangle de la flèche
         fltLargeur / 2,  0.0,            -fltProfondeur / 2, 
         fltLargeur / 2,  0.0,             fltProfondeur / 2,
        // haut du triangle de la flèche
         0.0,             fltHauteur / 2, -fltProfondeur / 2, 
         0.0,             fltHauteur / 2,  fltProfondeur / 2,
        // bas du triangle de la flèche
         0.0,            -fltHauteur / 2, -fltProfondeur / 2, 
         0.0,            -fltHauteur / 2,  fltProfondeur / 2,
        // intersection triangle/rectangle haut de la flèche
         0.0,             fltHauteur / 4, -fltProfondeur / 2, 
         0.0,             fltHauteur / 4,  fltProfondeur / 2,
        // intersection triangle/rectangle bas de la flèche
         0.0,            -fltHauteur / 4, -fltProfondeur / 2, 
         0.0,            -fltHauteur / 4,  fltProfondeur / 2,
        // fin haute du rectangle de la flèche
        -fltLargeur / 2,  fltHauteur / 4, -fltProfondeur / 2, 
        -fltLargeur / 2,  fltHauteur / 4,  fltProfondeur / 2,
        // fin basse du rectangle de la flèche
        -fltLargeur / 2, -fltHauteur / 4, -fltProfondeur / 2, 
        -fltLargeur / 2, -fltHauteur / 4,  fltProfondeur / 2,
    ];

    var objIndicateur = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objIndicateur);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabVertex), objgl.STATIC_DRAW);

    return objIndicateur;
}

function creerCouleursIndicateur(objgl, tabCouleur) {
    tabCouleurs = [];
    for (var i = 0; i < 4; i++)
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
        0.50, 0.00,
        // bas du triangle de la flèche
        0.50, 1.00,
        // intersection triangle/rectangle haut de la flèche
        0.50, 0.25,
        // intersection triangle/rectangle bas de la flèche
        0.50, 0.75,
        // fin haute du rectangle de la flèche
        0.00, 0.25,
        // fin basse du rectangle de la flèche
        0.00, 0.75,
    ];
    // dupliquer tous les points proches pour les points loin
    for(var i = 0; i < tabTexels.length; i+=4){
        tabTexels.splice(i+2, 0, tabTexels[i], tabTexels[i+1]);
    }

    var objTexelsIndicateur = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objTexelsIndicateur);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabTexels), objgl.STATIC_DRAW);

    objTexelsIndicateur.intNoTexture = intNoTexture; objTexelsIndicateur.pcCouleurTexel = 1.0;

    return objTexelsIndicateur;
}

function creerMaillageIndicateur(objgl) {
    var tabMaillage = [
        // Triangle de la flèche proche
        0, 2, 6,
        0, 6, 8,
        0, 8, 4,
        // Rectangle de la flèche proche
        10, 12, 6,
        12, 6, 8,
        // Triangle de la flèche loin
        1, 3, 7,
        1, 7, 9,
        1, 9, 5,
        // Rectangle de la flèche loin
        11, 13, 7,
        13, 7, 9,
        // Bordure triangle haut
        0, 1, 2,
        1, 2, 3,
        2, 3, 6,
        3, 6, 7,
        // Bordure triangle bas
        0, 1, 4,
        1, 4, 5,
        4, 5, 8,
        5, 8, 9,
        // Bordure rectangle
        6, 7, 10,
        7, 10, 11,
        10, 11, 12,
        11, 12, 13,
        12, 13, 8,
        13, 8, 9 
    ];

    var objMaillageIndicateur = objgl.createBuffer();
    objgl.bindBuffer(objgl.ELEMENT_ARRAY_BUFFER, objMaillageIndicateur);
    objgl.bufferData(objgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tabMaillage), objgl.STATIC_DRAW);

    // Le nombre de triangles
    objMaillageIndicateur.intNbTriangles = 24;
    // Le nombre de droites
    objMaillageIndicateur.intNbDroites = 0;

    return objMaillageIndicateur;
}


