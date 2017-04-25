<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $joueur_id = $_GET["joueurId"];

    $stmt = $con -> prepare("SELECT * FROM confrontations WHERE cible = ?");

    $stmt -> bind_param('i',$joueur_id);
    $stmt -> execute();
    $stmt -> bind_result($id,$categorie,$type,$carte,$cible,$source);

    $results = array();
    while($stmt->fetch()) {
            $result = array();
            $result["id"] = $id;
            $result["categorie"] = $categorie;
            $result["type"] = $type;
            $result["carte"] = $carte;
            $result["source"] = json_decode($source);
            array_push($results, $result);
        }
    mysqli_close($con); 

    echo json_encode($results);
?>