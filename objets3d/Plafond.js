
function creerObj3DPlafond(objgl, intNoTexture) {
    var obj3DPlafond = new Object();
    obj3DPlafond.strType = "PLAFOND";
    obj3DPlafond.fltLargeur = 31;   // X
    obj3DPlafond.fltHauteur = 2;    // Y
    obj3DPlafond.fltProfondeur = 31;// Z

    obj3DPlafond.vertex = creerVertexPlafond(objgl, obj3DPlafond.fltLargeur, obj3DPlafond.fltHauteur, obj3DPlafond.fltProfondeur);
    obj3DPlafond.couleurs = creerCouleursPlafond(objgl, [1, 1, 1, 1]);
    obj3DPlafond.texels = creerTexelsPlafond(objgl, obj3DPlafond.fltLargeur, obj3DPlafond.fltHauteur, obj3DPlafond.fltProfondeur, intNoTexture);
    obj3DPlafond.maillage = creerMaillagePlafond(objgl);

    obj3DPlafond.transformations = creerTransformations();

    obj3DPlafond.visible = true;
    return obj3DPlafond;
}

function creerVertexPlafond(objgl, fltLargeur, fltHauteur, fltProfondeur) {
    var tabVertex = [
        //surface en avant
        -fltLargeur, fltHauteur,  fltProfondeur, //en haut, à gauche
         fltLargeur, fltHauteur,  fltProfondeur, //en haut, à droite
        -fltLargeur, 0,           fltProfondeur, //en bas, à gauche
         fltLargeur, 0,           fltProfondeur, //en bas, à droite,

        //surface en arrière
        -fltLargeur, fltHauteur, -fltProfondeur,
         fltLargeur, fltHauteur, -fltProfondeur,
        -fltLargeur, 0,          -fltProfondeur,
         fltLargeur, 0,          -fltProfondeur,

        //surface à droite
         fltLargeur, fltHauteur,  fltProfondeur,
         fltLargeur, fltHauteur, -fltProfondeur,
         fltLargeur, 0,           fltProfondeur,
         fltLargeur, 0,          -fltProfondeur,

        //surface à gauche
        -fltLargeur, fltHauteur,  fltProfondeur,
        -fltLargeur, fltHauteur, -fltProfondeur,
        -fltLargeur, 0,           fltProfondeur,
        -fltLargeur, 0,          -fltProfondeur,

        //surface en haut
        -fltLargeur, fltHauteur, -fltProfondeur,
         fltLargeur, fltHauteur, -fltProfondeur,
        -fltLargeur, fltHauteur,  fltProfondeur,
         fltLargeur, fltHauteur,  fltProfondeur,		 
  ];
  
    var objPlafond = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objPlafond);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabVertex), objgl.STATIC_DRAW);

    return objPlafond;
}

function creerCouleursPlafond(objgl, tabCouleurs) {
    tabCouleurs = [];
    for (var i = 0; i < 10; i++)
        tabCouleurs = tabCouleurs.concat(tabCouleurs);

    var objCouleursPlafond = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objCouleursPlafond);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabCouleurs), objgl.STATIC_DRAW);

    return objCouleursPlafond;
}

function creerTexelsPlafond(objgl, fltLargeur, fltHauteur, fltProfondeur, intNoTexture) {
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

    var objTexelsPlafond = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objTexelsPlafond);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabTexels), objgl.STATIC_DRAW);

    objTexelsPlafond.intNoTexture = intNoTexture; objTexelsPlafond.pcCouleurTexel = 1.0;

    return objTexelsPlafond;
}

function creerMaillagePlafond(objgl) {
    var tabMaillage =
        [ // Les 2 triangles du Plafond
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

    var objMaillagePlafond = objgl.createBuffer();
    objgl.bindBuffer(objgl.ELEMENT_ARRAY_BUFFER, objMaillagePlafond);
    objgl.bufferData(objgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tabMaillage), objgl.STATIC_DRAW);

    // Le nombre de triangles
    objMaillagePlafond.intNbTriangles = 10;
    // Le nombre de droites
    objMaillagePlafond.intNbDroites = 0;

    return objMaillagePlafond;
}


