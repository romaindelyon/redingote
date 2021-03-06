<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

    $nom = utf8_decode($_GET["nom"]);
    $code = $_GET["code"];
    $position = $_GET["position"];
    $pile = $_GET["pile"];
    $categorie = $_GET["categorie"];
    $ouverture = $_GET["ouverture"];
    $action = $_GET["action"];
    $utilisation = $_GET["utilisation"];
    $types = $_GET["types"];
    $info = $_GET["info"];
    $statut = $_GET["statut"];
    $partie = $_GET["partie"];

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $stmt = $con -> prepare("INSERT INTO cartes (nom, code, position, pile, categorie, ouverture, action, utilisation, info, types, statut, partie) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $stmt -> bind_param('ssissssssssi',$nom,$code,$position,$pile,$categorie,$ouverture,$action,$utilisation,$info,$types,$statut,$partie);
    $stmt -> execute();

    mysqli_close($con); 

?>