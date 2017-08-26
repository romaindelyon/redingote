<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Pragma: no-cache");

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $joueurId = $_GET["joueurId"];

    $stmt = $con -> prepare("SELECT * FROM questions WHERE joueur != ? AND reponsePartie = -1");
    $stmt -> bind_param('i',$joueurId);
    $stmt -> execute();
    $stmt -> bind_result($id,$joueur,$question,$options,$reponse,$indice,$succes,$reponseDonnee,$repondant,$reponseTime,$reponsePartie);

    $results = array();
    while($stmt->fetch()) {
            $result = array();
            $result["id"] = $id;
            $result["joueur"] = $joueur;
            $result["question"] = utf8_encode($question);
            $result["options"] = json_decode($options);
            $result["reponse"] = utf8_encode($reponse);
            $result["indice"] = utf8_encode($indice);
            $result["succes"] = $succes;
            $result["reponseDonnee"] = utf8_encode($reponseDonnee);
            $result["repondant"] = utf8_encode($repondant);
            $result["reponseTime"] = $reponseTime;
            $result["reponsePartie"] = $reponsePartie;
            array_push($results, $result);
        }
    mysqli_close($con); 

    echo json_encode($results);
?>