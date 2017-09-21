<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

    $questionId = $_GET["questionId"];
    $repondant = utf8_decode($_GET["repondant"]);
    $succes = $_GET["succes"];
    $reponseDonnee = utf8_decode($_GET["reponseDonnee"]);
    $reponsePartie = $_GET["reponsePartie"];
    $reponseTime = $_GET["reponseTime"];
    $partie = $_GET["partieId"];

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $stmt = $con -> prepare("UPDATE questions SET repondant = ?, succes = ?, reponseDonnee = ?, reponsePartie = ?, reponseTime = ? WHERE id = ? AND partie = ?");

    $stmt -> bind_param('sssisii',$repondant,$succes,$reponseDonnee,$reponsePartie,$reponseTime,$questionId,$reponsePartie,$partie);
    $stmt -> execute();

    mysqli_close($con); 

?>