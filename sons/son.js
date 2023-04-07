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
    };
}

function joueSon(strSon){
    objSons[strSon].currentTime = 0;
    objSons[strSon].play();
}