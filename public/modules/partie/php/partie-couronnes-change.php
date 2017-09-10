<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-cache");

    $positionCouronnes = $_GET["positionCouronnes"];
    $partieId = $_GET["partieId"];

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $stmt = $con -> prepare("UPDATE parties SET positionCouronnes = ? WHERE id = ?");

    $stmt -> bind_param('si',$positionCouronnes,$partieId);
    $stmt -> execute();

    mysqli_close($con);

?>