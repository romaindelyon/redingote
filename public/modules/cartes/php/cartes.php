<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Pragma: no-cache");

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $stmt = $con -> prepare("SELECT * FROM cartes");

    $stmt -> execute();
    $stmt -> bind_result($id,$position,$pile,$nom,$categorie,$utilisation,$action,$objets,$main);

    $results = array();
    while($stmt->fetch()) {
            $result = array();
            $result["id"] = $id;
            $result["position"] = $position;
            $result["nom"] = utf8_encode($nom);
            $result["pile"] = $pile;
            $result["categorie"] = $categorie;
            $result["utilisation"] = json_decode($utilisation);
            $result["action"] = json_decode($action);
            $result["objets"] = json_decode($objets);
            $result["main"] = json_decode($main);
            array_push($results, $result);
        }
    mysqli_close($con); 

    echo json_encode($results);
?>