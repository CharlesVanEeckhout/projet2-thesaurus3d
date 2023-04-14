
function creerObj3DCoffre(objgl, intNoTexture) {
    var obj3DCoffre = new Object();
    obj3DCoffre.fltLargeur = 1.0;   // X
    obj3DCoffre.fltHauteur = 1.0;    // Y
    obj3DCoffre.fltProfondeur = 1.0;// Z

    obj3DCoffre.vertex = creerVertexCoffre(objgl,obj3DCoffre.fltHauteur ,obj3DCoffre.fltLargeur, obj3DCoffre.fltProfondeur);
    obj3DCoffre.couleurs = creerCouleursCoffre(objgl, [1, 1, 1, 1]);
    obj3DCoffre.texels = creerTexelsCoffre(objgl, obj3DCoffre.fltLargeur, obj3DCoffre.fltProfondeur, intNoTexture);
    obj3DCoffre.maillage = creerMaillageCoffre(objgl);

    obj3DCoffre.transformations = creerTransformations();
    return obj3DCoffre;
}

function creerVertexCoffre(objgl, fltLargeur, fltHauteur,fltProfondeur) {
    var tabVertex = [
        //Face d'au dessus
        -fltLargeur / 2, 0.0, -fltProfondeur / 4,
         fltLargeur / 2, 0.0, -fltProfondeur / 4,
        -fltLargeur / 2, 0.0,  fltProfondeur / 4,
         fltLargeur / 2, 0.0,  fltProfondeur / 4,

         //Face de arrière
        -fltLargeur / 2, 0.0, -fltProfondeur / 4, 
        fltLargeur / 2, 0.0, -fltProfondeur / 4, 
       -fltLargeur / 2, fltHauteur / 2, -fltProfondeur / 4,  
        fltLargeur / 2, fltHauteur / 2, -fltProfondeur / 4,

         //Face de avant
         -fltLargeur / 2, 0.0, fltProfondeur / 4, 
         fltLargeur / 2, 0.0, fltProfondeur / 4, 
        -fltLargeur / 2, fltHauteur / 2, fltProfondeur / 4,  
         fltLargeur / 2, fltHauteur / 2, fltProfondeur / 4,

          //Face de gauche
          -fltLargeur / 2, 0.0, -fltProfondeur / 4, 
          -fltLargeur / 2, 0.0, fltProfondeur / 4, 
         -fltLargeur / 2, fltHauteur / 2, -fltProfondeur / 4,  
          -fltLargeur / 2, fltHauteur / 2, fltProfondeur / 4,

         //Face de droite
        fltLargeur / 2, 0.0, -fltProfondeur / 4, 
        fltLargeur / 2, 0.0, fltProfondeur / 4, 
        fltLargeur / 2, fltHauteur / 2, -fltProfondeur / 4,  
        fltLargeur / 2, fltHauteur / 2, fltProfondeur / 4,

        -fltLargeur / 2, fltHauteur / 2, 0.0,

    ];

    for(var i = 0; i <= 180; i++){
        tabVertex.push(-fltLargeur / 2, fltHauteur / 4 *(2+Math.sin(i*Math.PI/180)), fltProfondeur / 4*(Math.cos(i*Math.PI/180)))
        }

    tabVertex.push(fltLargeur / 2, fltHauteur / 2, 0.0,);

    for(var i = 0; i <= 180; i++){
        tabVertex.push(fltLargeur / 2, fltHauteur / 4 *(2+Math.sin(i*Math.PI/180)), fltProfondeur / 4*(Math.cos(i*Math.PI/180)))
    }
    

    var objCoffre = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objCoffre);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabVertex), objgl.STATIC_DRAW);

    return objCoffre;
}

function creerCouleursCoffre(objgl, tabCouleur) {
    tabCouleurs = [];
    for (var i = 0; i < 24+360; i++)
        tabCouleurs = tabCouleurs.concat(tabCouleur);

    var objCouleursCoffre = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objCouleursCoffre);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabCouleurs), objgl.STATIC_DRAW);

    return objCouleursCoffre;
}

function creerTexelsCoffre(objgl, fltLargeur, fltProfondeur, intNoTexture) {
    var tabTexels = [
        0.0,        0.0,
        fltLargeur, 0.0,
        0.0,        fltProfondeur,
        fltLargeur, fltProfondeur,

        0.0,        0.0,
        fltLargeur, 0.0,
        0.0,        fltProfondeur,
        fltLargeur, fltProfondeur,

        0.0,        0.0,
        fltLargeur, 0.0,
        0.0,        fltProfondeur,
        fltLargeur, fltProfondeur,

        0.0,        0.0,
        fltLargeur, 0.0,
        0.0,        fltProfondeur,
        fltLargeur, fltProfondeur,

        0.0,        0.0,
        fltLargeur, 0.0,
        0.0,        fltProfondeur,
        fltLargeur, fltProfondeur
    ];

    for (var i = 0; i <= 181; i++) {
        tabTexels = tabTexels.concat(i/180,1);
    }
    
    var objTexelsCoffre = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objTexelsCoffre);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabTexels), objgl.STATIC_DRAW);

    objTexelsCoffre.intNoTexture = intNoTexture; objTexelsCoffre.pcCouleurTexel = 1.0;

    return objTexelsCoffre;
}

function creerMaillageCoffre(objgl) {
    var tabMaillage =
        [ // Les 2 triangles du Coffre
            0, 1, 2,
            1, 2, 3,

            4, 5, 6,
            5, 6, 7,

            8, 9, 10,
            9, 10, 11,
             12, 13, 14,
            13, 14, 15,

            16, 17, 18,
            17, 18, 19
        ];
        
    for(var i = 21; i <= 202; i++){
        tabMaillage.push(20, i, i+1);
        tabMaillage.push(201, i+180, i+181);
        tabMaillage.push(i, i+1, i+180);
        tabMaillage.push(i+1, i+180, i+181);
    }

    var objMaillageCoffre = objgl.createBuffer();
    objgl.bindBuffer(objgl.ELEMENT_ARRAY_BUFFER, objMaillageCoffre);
    objgl.bufferData(objgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tabMaillage), objgl.STATIC_DRAW);

    // Le nombre de triangles
    objMaillageCoffre.intNbTriangles = 10+180*4;
    // Le nombre de droites
    objMaillageCoffre.intNbDroites = 0;

    return objMaillageCoffre;
}


