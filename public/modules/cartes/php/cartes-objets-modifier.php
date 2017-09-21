<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

    $id = $_GET["id"];
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

    $stmt = $con -> prepare("UPDATE objets SET nom = ?, types = ?, description = ?, utilisation = ?, info = ? WHERE code = ?");

    $stmt -> bind_param('ssssss',$nom,$types,$description,$utilisation,$info,$code);
    $stmt -> execute();

    mysqli_close($con); 

?>