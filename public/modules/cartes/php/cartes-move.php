<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

    $carteIds = $_GET["carteId"];
    $position = $_GET["position"];

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    foreach ($carteIds as $carteId){
        if ($position != -2){
            $stmt = $con -> prepare("UPDATE cartes SET position = ? WHERE id = ?");
        }
        else {
            $stmt = $con -> prepare("UPDATE cartes SET position = ?, main = '{}' WHERE id = ?");
        }

        $stmt -> bind_param('ii',$position,$carteId);
        $stmt -> execute();
    }

    mysqli_close($con); 

?>