<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-cache");

    $nom = utf8_decode($_GET["nom"]);
    $tour_joueur = $_GET["tour_joueur"];
    $tour_action = 0;
    $tour_skip = '[0,0,0]';
    $temps = 0;
    $tonalite = 'aucune';
    $dispo = $_GET["dispo"];
    $positionCouronnes = '[0,0,0,0,0]';
    $valiseNonMaterialisee = '[]';

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $stmt = $con -> prepare("INSERT INTO parties (nom, tour_joueur, tour_action, tour_skip, temps, tonalite, dispo, positionCouronnes, valiseNonMaterialisee) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $stmt -> bind_param('siisissss',$nom,$tour_joueur,$tour_action,$tour_skip,$temps,$tonalite,$dispo,$positionCouronnes,$valiseNonMaterialisee);
    $stmt -> execute();

    $id = $con -> insert_id;

    mysqli_close($con); 

    echo $id;

?>