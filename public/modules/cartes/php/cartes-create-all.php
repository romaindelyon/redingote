<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

    $nom = utf8_decode($_GET["nom"]);
    $code = $_GET["code"];
    $position = -1;
    $pile = $_GET["pile"];
    $categorie = $_GET["categorie"];
    $utilisation = $_GET["utilisation"];
    $types = $_GET["types"];
    $info = $_GET["info"];
    $statut = "{}";

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    // 1. Get all parties

    $stmt1 = $con -> prepare("SELECT * FROM parties");

    $stmt1 -> execute();
    $stmt1 -> bind_result($id,$nom,$tour_joueur,$tour_action,$tour_skip,$temps,$tonalite,$dispo,$positionCouronnes,$valiseNonMaterialisee);

    $results = array();
    while($stmt1->fetch()) {
        array_push($results,$id);
        $partie = $id;
        echo($id);
    }

    foreach($results as $id){
        // 2. Create cartes
        $stmt2 = $con -> prepare("INSERT INTO cartes (nom, code, position, pile, categorie, utilisation, info, types, statut, partie) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt2 -> bind_param('ssissssssi',$nom,$code,$position,$pile,$categorie,$utilisation,$info,$types,$statut,$id);
        $stmt2 -> execute();
    }

    $stmt1 -> close();

    mysqli_close($con); 

?>