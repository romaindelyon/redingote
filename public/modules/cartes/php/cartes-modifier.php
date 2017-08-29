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
    $partie = 1;

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $stmt = $con -> prepare("UPDATE cartes SET nom = ?, position = ?, pile = ?, categorie = ?, utilisation = ?, info = ?, types = ?, statut = ? WHERE code = ? AND partie = ?");

    $stmt -> bind_param('sisssssssi',$nom,$position,$pile,$categorie,$utilisation,$info,$types,$statut,$code,$partie);
    $stmt -> execute();

    mysqli_close($con); 

?>