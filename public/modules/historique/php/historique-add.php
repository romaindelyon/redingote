<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

    $joueur = $_GET["joueur"];
    $categorie = $_GET["categorie"];
    $type = $_GET["type"];
    $info = $_GET["info"];
    $partie = $_GET["partie"];
    $stamp = $_GET["stamp"];

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $stmt = $con -> prepare("INSERT INTO historique (joueur, categorie, type, info, partie, stamp) VALUES (?, ?, ?, ?, ?, ?)");

    $stmt -> bind_param('isssis',$joueur,$categorie,$type,$info,$partie,$stamp);
    $stmt -> execute();

    mysqli_close($con); 

?>