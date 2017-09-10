<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $partieId = $_GET["partieId"];

    $stmt = $con -> prepare("SELECT * FROM joueurs WHERE partie = ?");
    $stmt -> bind_param('i',$partieId);
    $stmt -> execute();
    $stmt -> bind_result($id,$nom,$diable,$belette,$marsouin,$notes_titre,$notes,$backgroundColor,$borderColor,$pions,$glutis,$escalier,$partie,$password);

    $results = array();
    while($stmt->fetch()) {
            $result = array();
            $result["id"] = $id;
            $result["nom"] = $nom;
            $result["diable"] = $diable;
            $result["belette"] = $belette;
            $result["marsouin"] = $marsouin;
            $result["notes_titre"] = $notes_titre;
            $result["notes"] = json_decode($notes);
            $result["backgroundColor"] = $backgroundColor;
            $result["borderColor"] = $borderColor;
            $result["pions"] = json_decode($pions);
            $result["glutis"] = $glutis;
            $result["escalier"] = $escalier;
            $result["partie"] = $partie;
            $result["password"] = $password;
            array_push($results, $result);
        }
    mysqli_close($con); 

    echo json_encode($results);
?>