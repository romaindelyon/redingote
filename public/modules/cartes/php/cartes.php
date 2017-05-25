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
    $stmt -> bind_result($id,$code,$position,$pile,$nom,$categorie,$utilisation,$info,$types,$statut);

    $results = array();
    while($stmt->fetch()) {
            $result = array();
            $result["id"] = $id;
            $result["code"] = $code;
            $result["position"] = $position;
            $result["nom"] = utf8_encode($nom);
            $result["pile"] = $pile;
            $result["categorie"] = $categorie;
            $result["utilisation"] = json_decode($utilisation);
            $result["info"] = json_decode($info);
            $result["types"] = json_decode($types);
            $result["statut"] = json_decode($statut);
            array_push($results, $result);
        }
    mysqli_close($con); 

    echo json_encode($results);
?>