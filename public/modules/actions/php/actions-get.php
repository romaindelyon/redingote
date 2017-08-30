<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $joueur_id = $_GET["joueurId"];
    $partie = $_GET["partie"];

    $stmt = $con -> prepare("SELECT * FROM actions WHERE cible = ? AND partie = ?");

    $stmt -> bind_param('ii',$joueur_id,$partie);
    $stmt -> execute();
    $stmt -> bind_result($id,$categorie,$type,$info,$cible,$source,$partie);

    $results = array();
    while($stmt->fetch()) {
            $result = array();
            $result["id"] = $id;
            $result["categorie"] = $categorie;
            $result["type"] = $type;
            $result["info"] = json_decode($info);
            $result["source"] = $source;
            array_push($results, $result);
        }
    mysqli_close($con); 

    echo json_encode($results);
?>