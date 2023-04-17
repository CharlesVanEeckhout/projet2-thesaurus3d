
function creerObj3DCloture(objgl, intNoTexture) {
    var obj3DCloture = new Object();
    obj3DCloture.fltLargeur = 1;
    obj3DCloture.fltHauteur = 2;
    obj3DCloture.fltProfondeur = 1;

    obj3DCloture.vertex = creerVertexCloture(objgl, obj3DCloture.fltLargeur, obj3DCloture.fltHauteur, obj3DCloture.fltProfondeur);
    obj3DCloture.couleurs = creerCouleursCloture(objgl, [1, 1, 1, 1]);
    obj3DCloture.texels = creerTexelsCloture(objgl, obj3DCloture.fltLargeur, obj3DCloture.fltProfondeur, intNoTexture);
    obj3DCloture.maillage = creerMaillageCloture(objgl);

    obj3DCloture.transformations = creerTransformations();

    obj3DCloture.collisionMur = false;
    obj3DCloture.binBeton = true;
    obj3DCloture.fermeTemps = 0;
    obj3DCloture.animation = function(intDeltaMillis){
        if(obj3DCloture.collisionMur){
            obj3DCloture.fermeTemps += intDeltaMillis;
        }
        else if(getPositionCameraZ(objCameraJoueur) < getPositionZ(obj3DCloture.transformations)-obj3DCloture.fltProfondeur){ //sort de la salle à tapis
            obj3DCloture.collisionMur = true;
            //todo: joue son de cloture qui ferme
        }
        //anime la chute
        let fltBond1 = 1.7-(obj3DCloture.fermeTemps/200)*(obj3DCloture.fermeTemps/200);
        let fltBond2 = 0.2-((obj3DCloture.fermeTemps-350)/200)*((obj3DCloture.fermeTemps-350)/200);
        setPositionY(Math.max(fltBond1, fltBond2, 0), obj3DCloture.transformations);
    }
    return obj3DCloture;
}

function creerVertexCloture(objgl, fltLargeur, fltHauteur, fltProfondeur) {
    function vertexPic(x, z, sx, sz){
        return [
            //pointe pyramide
            x, 0, z, 

            //base pyramide
            x-sx/2, 0.2, z,
            x,      0.2, z-sz/2,
            x+sx/2, 0.2, z,
            x,      0.2, z+sz/2,

            //début poteau
            x-sx/4, 0.2, z,
            x,      0.2, z-sz/4,
            x+sx/4, 0.2, z,
            x,      0.2, z+sz/4,

            //fin poteau
            x-sx/4, fltHauteur, z,
            x,      fltHauteur, z-sz/4,
            x+sx/4, fltHauteur, z,
            x,      fltHauteur, z+sz/4,
        ];
    }

    var tabVertex = [];
    for(var i = 0; i < 6; i++){
        var p = (1+i)/7-0.5;
        tabVertex.push(...vertexPic(p*fltLargeur, -0.4*fltProfondeur, 0.1*fltLargeur, 0.1*fltLargeur));
    }

    var objCloture = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objCloture);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabVertex), objgl.STATIC_DRAW);

    return objCloture;
}

function creerCouleursCloture(objgl, tabCouleur) {
    tabCouleurs = [];
    for (var i = 0; i < 13*6; i++)
        tabCouleurs = tabCouleurs.concat(tabCouleur);

    var objCouleursCloture = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objCouleursCloture);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabCouleurs), objgl.STATIC_DRAW);

    return objCouleursCloture;
}

function creerTexelsCloture(objgl, fltLargeur, fltProfondeur, intNoTexture) {
    var tabTexels = [
        //pointe pyramide
        0.50, 0.50,

        //dummy
        0.25, 0.50,
        0.50, 0.25,
        0.75, 0.50,
        0.50, 0.75,

        0.25, 0.50,
        0.50, 0.25,
        0.75, 0.50,
        0.50, 0.75,

        0.25, 0.50,
        0.50, 0.25,
        0.75, 0.50,
        0.50, 0.75,
    ];
    // dupliquer tous les points pour les autres pics
    for(var i = 13*2*1; i < 13*2*6; i++){
        tabTexels.push(tabTexels[i-13*2]);
    }

    var objTexelsCloture = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objTexelsCloture);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabTexels), objgl.STATIC_DRAW);

    objTexelsCloture.intNoTexture = intNoTexture; objTexelsCloture.pcCouleurTexel = 1.0;

    return objTexelsCloture;
}

function creerMaillageCloture(objgl) {
    var tabMaillage = [
        // Pyramide pointe
        0, 1, 2, 
        0, 2, 3, 
        0, 3, 4, 
        0, 4, 1,

        // relie pyramide à poteau
        1, 2, 5,
        2, 5, 6,
        2, 3, 6,
        3, 6, 7,
        3, 4, 7,
        4, 7, 8,
        4, 1, 8,
        1, 8, 5,

        // poteau
        5, 6, 9,
        6, 9, 10,
        6, 7, 10,
        7, 10, 11,
        7, 8, 11,
        8, 11, 12,
        8, 5, 12,
        5, 12, 9,
    ];
    // dupliquer tous les triangles pour les autres pics
    for(var i = 1; i < 6; i++){
        for(var j = 0; j < 60; j++){
            tabMaillage.push(tabMaillage[j]+i*13);
        }
    }
    for(var i = 20*1; i < 20*6; i++){
        tabMaillage.push(tabMaillage[i-20]);
    }

    var objMaillageCloture = objgl.createBuffer();
    objgl.bindBuffer(objgl.ELEMENT_ARRAY_BUFFER, objMaillageCloture);
    objgl.bufferData(objgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tabMaillage), objgl.STATIC_DRAW);

    // Le nombre de triangles
    objMaillageCloture.intNbTriangles = 20*6;
    // Le nombre de droites
    objMaillageCloture.intNbDroites = 0;

    return objMaillageCloture;
}


