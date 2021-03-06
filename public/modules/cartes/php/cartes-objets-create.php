<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

    $nom = utf8_decode($_GET["nom"]);
    $code = $_GET["code"];
    $description = utf8_decode($_GET["description"]);
    $utilisation = $_GET["utilisation"];
    $types = $_GET["types"];
    $info = $_GET["info"];
    $partie = $_GET["partie"];

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $stmt = $con -> prepare("INSERT INTO objets (nom, code, types, description, utilisation, info, partie) VALUES (?, ?, ?, ?, ?, ?, ?)");

    $stmt -> bind_param('ssssssi',$nom,$code,$types,$description,$utilisation,$info,$partie);
    $stmt -> execute();

    mysqli_close($con); 

?>