var objSons;

function initObjSons(){
    objSons = {
        //or : new Audio('sons/or.ogg'),
        nouveauNiveau : null,
        trouveTresor : null,
        tempsEcoulee : null,
        ouvreMur : null,
        teleTransport : null,
        gameOver : null,
        gameWin : null,
        fondJeu : new Audio('sons/fond de jeu.mp3'),
        clotureFerme : new Audio('sons/clotureFerme.ogg'),
    };
}

function joueSon(strSon){
    objSons[strSon].currentTime = 0;
    objSons[strSon].play();
}