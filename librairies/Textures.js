// Textures.js

function creerTextures(objgl, tabImages) {
    const tabObjTextures = new Array();

    for (let i = 0; i < tabImages.length; i++) {
        // L'image de la texture
        const objImage = new Image();
        
		//Créer la texture
        const objTexture = objgl.createTexture();

		//La sélectionner
        objgl.bindTexture(objgl.TEXTURE_2D, objTexture);
  
        //Étant donné que les images peuvent prendre un certain temps avant d'être disponible,
		//on place un pixel blanc dans la texture pour qu'elle soit disponible immédiatement.
		//Une vois l'image disponible, la texture sera mise à jour avec le contenu de l'image 
        const objPixel = new Uint8Array([255, 255, 255, 255]); // couleur blanche opaque
        
		// Insérer le pixel blanc objPixel à l'intérieur de la texture
		objgl.texImage2D(
            objgl.TEXTURE_2D,
            0,
            objgl.RGBA,
            1,
            1,
            0,
            objgl.RGBA,
            objgl.UNSIGNED_BYTE,
            objPixel
        )
        
        objImage.onload = () => {
			//La sélectionner
            objgl.bindTexture(objgl.TEXTURE_2D, objTexture);
            
            try {
                //Insérer l'image à l'intérieur de la texture
                objgl.texImage2D(objgl.TEXTURE_2D, 0, objgl.RGBA, objgl.RGBA,
                    objgl.UNSIGNED_BYTE, objImage);
            }
			catch (e){
                alert('Texture "'+tabImages[i]+'" n\'a pas pu être chargée. Assurez-vous d\'utiliser Live Server.\n', e.message);
            }

            // La paramétrer
            objgl.texParameteri(objgl.TEXTURE_2D, objgl.TEXTURE_MAG_FILTER, objgl.LINEAR);
            objgl.texParameteri(objgl.TEXTURE_2D, objgl.TEXTURE_MIN_FILTER, objgl.NEAREST_MIPMAP_NEAREST);
            objgl.generateMipmap(objgl.TEXTURE_2D); // Pour créer le mipmap
            objgl.texParameteri(objgl.TEXTURE_2D, objgl.TEXTURE_WRAP_S, objgl.REPEAT);
            objgl.texParameteri(objgl.TEXTURE_2D, objgl.TEXTURE_WRAP_T, objgl.REPEAT);

        };
        objImage.src = tabImages[i];

        // Insérer cette texture dans un tableau de textures
        tabObjTextures.push(objTexture);
    }

    return tabObjTextures;
}