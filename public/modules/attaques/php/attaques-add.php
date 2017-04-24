<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-cache");

    $categorie = $_GET["categorie"];
    $type = $_GET["type"];
    $carte = $_GET["carte"];
    $cible = $_GET["cible"];
    $source = $_GET["source"];

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $stmt = $con -> prepare("INSERT INTO attaques (categorie, type, carte, cible, source) VALUES (?, ?, ?, ?, ?)");

    $stmt -> bind_param('ssiii',$categorie,$type,$carte,$cible,$source);
    $stmt -> execute();

    mysqli_close($con);

?>