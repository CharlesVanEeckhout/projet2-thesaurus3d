
function creerObj3DMur(objgl, intNoTexture) {
    var obj3DMur = new Object();
    obj3DMur.fltLargeur = 1;
    obj3DMur.fltHauteur = 2;
    obj3DMur.fltProfondeur = 1;

    obj3DMur.vertex = creerVertexMur(objgl, obj3DMur.fltLargeur, obj3DMur.fltHauteur, obj3DMur.fltProfondeur);
    obj3DMur.couleurs = creerCouleursMur(objgl, [1, 1, 1, 1]);
    obj3DMur.texels = creerTexelsMur(objgl, obj3DMur.fltLargeur, obj3DMur.fltHauteur, obj3DMur.fltProfondeur, intNoTexture);

    obj3DMur.maillage = creerMaillageMur(objgl);
    
    obj3DMur.transformations = creerTransformations();
    return obj3DMur;
}

function creerVertexMur(objgl, fltLargeur, fltHauteur, fltProfondeur) {
    var tabVertex = [
        //surface en avant
        -fltLargeur / 2, fltHauteur,  fltProfondeur / 2, //en haut, à gauche
         fltLargeur / 2, fltHauteur,  fltProfondeur / 2, //en haut, à droite
        -fltLargeur / 2, 0,           fltProfondeur / 2, //en bas, à gauche
         fltLargeur / 2, 0,           fltProfondeur / 2, //en bas, à droite,

        //surface en arrière
        -fltLargeur / 2, fltHauteur, -fltProfondeur / 2,
         fltLargeur / 2, fltHauteur, -fltProfondeur / 2,
        -fltLargeur / 2, 0,          -fltProfondeur / 2,
         fltLargeur / 2, 0,          -fltProfondeur / 2,

        //surface à droite
         fltLargeur / 2, fltHauteur,  fltProfondeur / 2,
         fltLargeur / 2, fltHauteur, -fltProfondeur / 2,
         fltLargeur / 2, 0,           fltProfondeur / 2,
         fltLargeur / 2, 0,          -fltProfondeur / 2,

        //surface à gauche
        -fltLargeur / 2, fltHauteur,  fltProfondeur / 2,
        -fltLargeur / 2, fltHauteur, -fltProfondeur / 2,
        -fltLargeur / 2, 0,           fltProfondeur / 2,
        -fltLargeur / 2, 0,          -fltProfondeur / 2,

        //surface en haut
        -fltLargeur / 2, fltHauteur, -fltProfondeur / 2,
         fltLargeur / 2, fltHauteur, -fltProfondeur / 2,
        -fltLargeur / 2, fltHauteur,  fltProfondeur / 2,
         fltLargeur / 2, fltHauteur,  fltProfondeur / 2,
    ];

    var objMur = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objMur);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabVertex), objgl.STATIC_DRAW);

    return objMur;
}

function creerCouleursMur(objgl, tabCouleur) {
    tabCouleurs = [];
    for (var i = 0; i < 20; i++)
        tabCouleurs = tabCouleurs.concat(tabCouleur);

    var objCouleursMur = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objCouleursMur);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabCouleurs), objgl.STATIC_DRAW);

    return objCouleursMur;
}

function creerTexelsMur(objgl, fltLargeur, fltHauteur, fltProfondeur, intNoTexture) {
    // const tabTexels = new Array();

    var tabTexels = [
        // en avant
        0.0, 0.0,
        fltLargeur, 0.0,
        0.0, fltHauteur,
        fltLargeur, fltHauteur,


        // en arrière			 
        0.0, 0.0,
        fltLargeur, 0.0,
        0.0, fltHauteur,
        fltLargeur, fltHauteur,

        // à droite		 
        0.0, 0.0,
        fltProfondeur, 0.0,
        0.0, fltHauteur,
        fltProfondeur, fltHauteur,

        // à gauche			 
        0.0, 0.0,
        fltProfondeur, 0.0,
        0.0, fltHauteur,
        fltProfondeur, fltHauteur,

        //  au-dessus			 
        0.0, 0.0,
        fltProfondeur, 0.0,
        0.0, fltHauteur,
        fltProfondeur, fltHauteur,
    ];

    var objTexelsMur = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objTexelsMur);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabTexels), objgl.STATIC_DRAW);

    objTexelsMur.intNoTexture = intNoTexture; objTexelsMur.pcCouleurTexel = 1.0;
    

    return objTexelsMur;
}

function creerMaillageMur(objgl) {
    var tabMaillage =
        [ // Les 2 triangles de la surface avant
            0, 1, 2, //partir de la droite, en haut
            1, 2, 3,
            // Les 2 triangles de la surface arrière
            4, 5, 6,
            5, 6, 7,
            // Les 2 triangles de la surface à droite
            8, 9, 10,
            9, 10, 11,
            // Les 2 triangles de la surface à gauche
            12, 13, 14,
            13, 14, 15,
            //  Les 2 triangles de la surface en haut
            16, 17, 18,
            17, 18, 19
        ];
    var objMaillageMur = objgl.createBuffer();
    objgl.bindBuffer(objgl.ELEMENT_ARRAY_BUFFER, objMaillageMur);
    objgl.bufferData(objgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tabMaillage), objgl.STATIC_DRAW);

    // Le nombre de triangles
    objMaillageMur.intNbTriangles = 10;
    // Le nombre de droites
    objMaillageMur.intNbDroites = 0;

    return objMaillageMur;
}


