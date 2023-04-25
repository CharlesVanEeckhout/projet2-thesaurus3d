var objSons;

function initObjSons(){
    objSons = {
        nouveauNiveau : null,
        trouveTresor : new Audio('sons/C_coffre.mp3'),
        tempsEcoulee : null,
        ouvreMur : new Audio('sons/C_mur_smash2.mp3'),
        teleTransport : new Audio('sons/C_teletransporteur3.mp3'),
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