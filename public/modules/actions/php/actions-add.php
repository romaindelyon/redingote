<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-cache");

    $categorie = $_GET["categorie"];
    $type = $_GET["type"];
    $info = $_GET["info"];
    $cible = $_GET["cible"];
    $source = $_GET["source"];
    $partie = $_GET["partie"];

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");

    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $stmt = $con -> prepare("INSERT INTO actions (categorie, type, info, cible, source, partie) VALUES (?, ?, ?, ?, ? ,?)");

    $stmt -> bind_param('sssiii',$categorie,$type,$info,$cible,$source,$partie);
    $stmt -> execute();


    $id = $con -> insert_id;

    mysqli_close($con); 

    echo $id;

?>