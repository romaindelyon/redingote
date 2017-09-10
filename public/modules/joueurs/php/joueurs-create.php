<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

    $id = $_GET["id"];
    $nom = utf8_decode($_GET["nom"]);
    $diable = $_GET["diable"];
    $belette = $_GET["belette"];
    $marsouin = $_GET["marsouin"];
    $notes_titre = $_GET["notes_titre"];
    $notes = $_GET["notes"];
    $backgroundColor = $_GET["backgroundColor"];
    $borderColor = $_GET["borderColor"];
    $pions = $_GET["pions"];
    $glutis = $_GET["glutis"];
    $escalier = $_GET["escalier"];
    $password = "not_set";
    $partie = $_GET["partie"];

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $stmt = $con -> prepare("INSERT INTO joueurs (id, nom, diable, belette, marsouin, notes_titre, notes, backgroundColor, borderColor, pions, glutis, escalier, partie, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $stmt -> bind_param('isiiisssssiiis',$id,$nom,$diable,$belette,$marsouin,$notes_titre,$notes,$backgroundColor,$borderColor,$pions,$glutis,$escalier,$partie,$password);
    $stmt -> execute();

    mysqli_close($con); 

?>