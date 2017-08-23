<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

    $carteId = $_GET["carteId"];
    $statut = $_GET["statut"];

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $stmt = $con -> prepare("UPDATE cartes SET statut = ? WHERE id = ?");

    $stmt -> bind_param('si',$statut,$carteId);
    $stmt -> execute();

    mysqli_close($con); 

?>