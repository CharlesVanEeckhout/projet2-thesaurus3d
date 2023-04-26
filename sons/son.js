var objSons;

function initObjSons(){
    objSons = {
        nouveauNiveau : new Audio('sons/C_start.mp3'),
        trouveTresor : new Audio('sons/C_coffre.mp3'),
        tempsEcoulee : new Audio('sons/C_seism.mp3'),
        recommenceNiveau : new Audio('sons/C_restart.mp3'),
        ouvreMur : new Audio('sons/C_mur_smash2.mp3'),
        teleTransport : new Audio('sons/C_teletransporteur3.mp3'),
        gameOver : null,
        gameWin : new Audio('sons/C_win.mp3'),
        fondJeu : new Audio('sons/fond de jeu.mp3'),
        clotureFerme : new Audio('sons/clotureFerme.ogg'),
    };
}

function joueSon(strSon){
    objSons[strSon].currentTime = 0;
    objSons[strSon].play();
}

function pauseSon(strSon){
    objSons[strSon].pause();
}