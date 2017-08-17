<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-cache");

    $positionCouronnes = $_GET["positionCouronnes"];

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $stmt = $con -> prepare("UPDATE parties SET positionCouronnes = ? WHERE id = 1");

    $stmt -> bind_param('s',$positionCouronnes);
    $stmt -> execute();

    mysqli_close($con);

?>