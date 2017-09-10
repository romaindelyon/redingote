<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Pragma: no-cache");

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $partieId = $_GET["partieId"];

    $stmt = $con -> prepare("SELECT * FROM objets WHERE partie = ?");
    $stmt -> bind_param('i',$partieId);
    $stmt -> execute();
    $stmt -> bind_result($id,$code,$types,$utilisation,$info,$nom,$description,$partie);

    $results = array();
    while($stmt->fetch()) {
            $result = array();
            $result["id"] = $id;
            $result["code"] = $code;
            $result["description"] = utf8_encode($description);
            $result["nom"] = utf8_encode($nom);
            $result["utilisation"] = $utilisation;
            $result["info"] = json_decode($info);
            $result["types"] = json_decode($types);
            $result["partie"] = $partie;
            array_push($results, $result);
        }
    mysqli_close($con); 

    echo json_encode($results);
?>