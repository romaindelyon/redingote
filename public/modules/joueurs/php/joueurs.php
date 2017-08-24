<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $stmt = $con -> prepare("SELECT * FROM joueurs");

    $stmt -> execute();
    $stmt -> bind_result($id,$nom,$diable,$belette,$notes_titre,$notes,$backgroundColor,$escalier,$humeurs,$partie);

    $results = array();
    while($stmt->fetch()) {
            $result = array();
            $result["id"] = $id;
            $result["nom"] = $nom;
            $result["diable"] = $diable;
            $result["belette"] = $belette;
            $result["notes_titre"] = $notes_titre;
            $result["notes"] = $notes;
            $result["backgroundColor"] = $backgroundColor;
            $result["pions"] = json_decode($pions);
            $result["glutis"] = $glutis;
            $result["escalier"] = $escalier;
            $result["humeurs"] = json_decode($humeurs);
            $result["maison"] = $maison;
            $result["partie"] = $partie;
            array_push($results, $result);
        }
    mysqli_close($con); 

    echo json_encode($results);
?>