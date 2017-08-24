<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-cache");

    $glutis = $_GET["glutis"];
    $joueurId = $_GET["joueurId"];
    $partieId = $_GET["partieId"];

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $stmt = $con -> prepare("UPDATE joueurs SET glutis = ? WHERE id = ? AND partie = ?");

    $stmt -> bind_param('iii',$glutis,$joueurId,$partieId);
    $stmt -> execute();

    mysqli_close($con);

?>