
function creerObj3DTapis(objgl, intNoTexture) {
    var obj3DTapis = new Object();
    obj3DTapis.strType = "TAPIS";
    obj3DTapis.fltLargeur = 1;   // X
    //obj3DTapis.fltHauteur = 0; // Y
    obj3DTapis.fltProfondeur = 1;// Z

    obj3DTapis.vertex = creerVertexTapis(objgl, obj3DTapis.fltLargeur, obj3DTapis.fltProfondeur);
    obj3DTapis.couleurs = creerCouleursTapis(objgl, [1, 1, 1, 1]);
    obj3DTapis.texels = creerTexelsTapis(objgl, obj3DTapis.fltLargeur, obj3DTapis.fltProfondeur, intNoTexture);
    obj3DTapis.maillage = creerMaillageTapis(objgl);

    obj3DTapis.transformations = creerTransformations();

    obj3DTapis.visible = true;
    return obj3DTapis;
}

function creerVertexTapis(objgl, fltLargeur, fltProfondeur) {
    var tabVertex = [
        -fltLargeur / 2, 0.0, -fltProfondeur / 2,
         fltLargeur / 2, 0.0, -fltProfondeur / 2,
        -fltLargeur / 2, 0.0,  fltProfondeur / 2,
         fltLargeur / 2, 0.0,  fltProfondeur / 2
    ];

    var objTapis = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objTapis);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabVertex), objgl.STATIC_DRAW);

    return objTapis;
}

function creerCouleursTapis(objgl, tabCouleur) {
    tabCouleurs = [];
    for (var i = 0; i < 4; i++)
        tabCouleurs = tabCouleurs.concat(tabCouleur);

    var objCouleursTapis = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objCouleursTapis);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabCouleurs), objgl.STATIC_DRAW);

    return objCouleursTapis;
}

function creerTexelsTapis(objgl, fltLargeur, fltProfondeur, intNoTexture) {
    var tabTexels = [
        0.0,        0.0,
        fltLargeur, 0.0,
        0.0,        fltProfondeur,
        fltLargeur, fltProfondeur
    ];

    var objTexelsTapis = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objTexelsTapis);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabTexels), objgl.STATIC_DRAW);

    objTexelsTapis.intNoTexture = intNoTexture; objTexelsTapis.pcCouleurTexel = 1.0;

    return objTexelsTapis;
}

function creerMaillageTapis(objgl) {
    var tabMaillage =
        [ // Les 2 triangles du tapis
            0, 1, 2,
            1, 2, 3,
        ];

    var objMaillageTapis = objgl.createBuffer();
    objgl.bindBuffer(objgl.ELEMENT_ARRAY_BUFFER, objMaillageTapis);
    objgl.bufferData(objgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tabMaillage), objgl.STATIC_DRAW);

    // Le nombre de triangles
    objMaillageTapis.intNbTriangles = 2;
    // Le nombre de droites
    objMaillageTapis.intNbDroites = 0;

    return objMaillageTapis;
}


