<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $id = $_GET["id"];

    $stmt = $con -> prepare("DELETE FROM attaques WHERE id = ?");

    $stmt -> bind_param('i',$id);
    $stmt -> execute();
    
    mysqli_close($con); 

    echo json_encode($results);
?>