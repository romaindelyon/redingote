<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-cache");

    $valiseNonMaterialisee = $_GET["valiseNonMaterialisee"];

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $stmt = $con -> prepare("UPDATE parties SET valiseNonMaterialisee = ? WHERE id = 1");

    $stmt -> bind_param('s',$valiseNonMaterialisee);
    $stmt -> execute();

    mysqli_close($con);

?>