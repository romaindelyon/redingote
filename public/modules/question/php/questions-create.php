<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

    $joueur = $_GET["joueur"];
    $question = utf8_decode($_GET["question"]);
    $options = $_GET["options"];
    $reponse = utf8_decode($_GET["reponse"]);
    $indice = utf8_decode($_GET["indice"]);
    $reponsePartie = -1;
    $partie = $_GET["partieId"];

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $stmt = $con -> prepare("INSERT INTO questions (joueur, question, options, reponse, indice, reponsePartie, partie) VALUES (?, ?, ?, ?, ?, ?, ?)");

    $stmt -> bind_param('issssii',$joueur,$question,$options,$reponse,$indice,$reponsePartie,$partie);
    $stmt -> execute();

    mysqli_close($con); 

?>