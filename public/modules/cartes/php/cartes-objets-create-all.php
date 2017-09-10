<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

    $nom = utf8_decode($_GET["nom"]);
    $code = $_GET["code"];
    $description = utf8_decode($_GET["description"]);
    $utilisation = $_GET["utilisation"];
    $types = $_GET["types"];
    $info = $_GET["info"];

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    // 1. Get all parties

    $stmt1 = $con -> prepare("SELECT * FROM parties");

    $stmt1 -> execute();
    $stmt1 -> bind_result($id,$nom,$tour_joueur,$tour_action,$tour_skip,$temps,$tonalite,$dispo,$positionCouronnes,$valiseNonMaterialisee);

    while($stmt1->fetch()) {
        // 2. Create cartes
        $partie = $id;
        echo($partie);
        $stmt2 = $con -> prepare("INSERT INTO objets (nom, code, types, description, utilisation, info, partie) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt2 -> bind_param('ssssssi',$nom,$code,$types,$description,$utilisation,$info,$partie);
        $stmt2 -> execute();
    }

    mysqli_close($con); 

?>