<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

    $nom = utf8_decode($_GET["nom"]);
    $code = $_GET["code"];
    $pile = $_GET["pile"];
    $categorie = $_GET["categorie"];
    $ouverture = $_GET["ouverture"];
    $action = $_GET["action"];
    $utilisation = $_GET["utilisation"];
    $types = $_GET["types"];
    $info = $_GET["info"];

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $stmt = $con -> prepare("UPDATE cartes SET nom = ?, pile = ?, categorie = ?, ouverture = ?, action = ?, utilisation = ?, info = ?, types = ? WHERE code = ?");

    $stmt -> bind_param('sssiissss',$nom,$pile,$categorie,$ouverture,$action,$utilisation,$info,$types,$code);
    $stmt -> execute();

    mysqli_close($con); 

?>