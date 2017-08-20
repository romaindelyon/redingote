<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Pragma: no-cache");

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $stmt = $con -> prepare("SELECT * FROM parties WHERE id = 1");

    $stmt -> execute();
    $stmt -> bind_result($id,$tour_joueur,$tour_action,$tour_skip,$temps,$tonalite,$dispo,$positionCouronnes,$valiseNonMaterialisee);

    $results = array();
    while($stmt->fetch()) {
            $result = array();
            $result["id"] = $id;
            $result["tour_joueur"] = $tour_joueur;
            $result["tour_action"] = $tour_action;
            $result["tour_skip"] = json_decode($tour_skip);
            $result["temps"] = $temps;
            $result["tonalite"] = $tonalite;
            $result["dispo"] = json_decode($dispo);
            $result["positionCouronnes"] = json_decode($positionCouronnes);
            $result["valiseNonMaterialisee"] = json_decode($valiseNonMaterialisee);
            array_push($results, $result);
        }
    mysqli_close($con); 

    echo json_encode($results);
?>