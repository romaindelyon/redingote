<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-cache");

    $tour_joueur = $_GET["tour_joueur"];
    $tour_action = $_GET["tour_action"];
    $tour_skip = $_GET["tour_skip"];
    $dispo = $_GET["dispo"];
    $partieId = $_GET["partieId"];

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $stmt = $con -> prepare("UPDATE parties SET tour_joueur = ?, tour_action = ?, tour_skip = ?, dispo = ? WHERE id = ?");

    $stmt -> bind_param('iissi',$tour_joueur,$tour_action,$tour_skip,$dispo,$partieId);
    $stmt -> execute();

    mysqli_close($con);

?>