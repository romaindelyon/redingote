<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-cache");

    $pions = $_GET["pions"];
    $joueurId = $_GET["joueurId"];

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $stmt = $con -> prepare("UPDATE joueurs SET pions = ? WHERE id = ?");

    $stmt -> bind_param('si',$pions,$joueurId);
    $stmt -> execute();

    mysqli_close($con);

?>