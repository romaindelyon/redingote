<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

    $questionId = $_GET["questionId"];
    $repondant = utf8_decode($_GET["repondant"]);
    $succes = $_GET["succes"];
    $reponseDonnee = utf8_decode($_GET["reponseDonnee"]);
    $reponsePartie = $_GET["reponsePartie"];
    $reponseTime = $_GET["reponseTime"];

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $stmt = $con -> prepare("UPDATE questions SET repondant = ?, succes = ?, reponseDonnee = ?, reponsePartie = ?, reponseTime = ? WHERE id = ?");

    $stmt -> bind_param('sssisi',$repondant,$succes,$reponseDonnee,$reponsePartie,$reponseTime,$questionId);
    $stmt -> execute();

    mysqli_close($con); 

?>