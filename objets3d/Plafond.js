
function creerObj3DPlafond(objgl, intNoTexture) {
    var obj3DPlafond = new Object();
    obj3DPlafond.strType = "PLAFOND";
    obj3DPlafond.fltLargeur = 31;   // X
    //obj3DPlafond.fltHauteur = 0;    // Y
    obj3DPlafond.fltProfondeur = 31;// Z

    obj3DPlafond.vertex = creerVertexPlafond(objgl, obj3DPlafond.fltLargeur, obj3DPlafond.fltProfondeur);
    obj3DPlafond.couleurs = creerCouleursPlafond(objgl, [1, 1, 1, 1]);
    obj3DPlafond.texels = creerTexelsPlafond(objgl, obj3DPlafond.fltLargeur, obj3DPlafond.fltProfondeur, intNoTexture);
    obj3DPlafond.maillage = creerMaillagePlafond(objgl);

    obj3DPlafond.transformations = creerTransformations();

    obj3DPlafond.visible = true;
    return obj3DPlafond;
}

function creerVertexPlafond(objgl, fltLargeur, fltProfondeur) {
    var tabVertex = [
        0.0,        0.0, 0.0,
        fltLargeur, 0.0, 0.0,
        0.0,        0.0, fltProfondeur,
        fltLargeur, 0.0, fltProfondeur
    ];

    var objPlafond = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objPlafond);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabVertex), objgl.STATIC_DRAW);

    return objPlafond;
}

function creerCouleursPlafond(objgl, tabCouleur) {
    tabCouleurs = [];
    for (var i = 0; i < 4; i++)
        tabCouleurs = tabCouleurs.concat(tabCouleur);

    var objCouleursPlafond = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objCouleursPlafond);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabCouleurs), objgl.STATIC_DRAW);

    return objCouleursPlafond;
}

function creerTexelsPlafond(objgl, fltLargeur, fltProfondeur, intNoTexture) {
    var tabTexels = [
        0.0,        0.0,
        fltLargeur, 0.0,
        0.0,        fltProfondeur,
        fltLargeur, fltProfondeur
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
            0, 1, 2,
            1, 2, 3,
        ];

    var objMaillagePlafond = objgl.createBuffer();
    objgl.bindBuffer(objgl.ELEMENT_ARRAY_BUFFER, objMaillagePlafond);
    objgl.bufferData(objgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tabMaillage), objgl.STATIC_DRAW);

    // Le nombre de triangles
    objMaillagePlafond.intNbTriangles = 2;
    // Le nombre de droites
    objMaillagePlafond.intNbDroites = 0;

    return objMaillagePlafond;
}


