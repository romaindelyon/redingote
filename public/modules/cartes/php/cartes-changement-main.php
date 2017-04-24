<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

    $carteId = $_GET["carteId"];
    $main = $_GET["main"];

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $stmt = $con -> prepare("UPDATE cartes SET main = ? WHERE id = ?");

    $stmt -> bind_param('si',$main,$carteId);
    $stmt -> execute();

    mysqli_close($con); 

?>