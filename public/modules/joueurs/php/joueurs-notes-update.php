<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-cache");

    $notes = $_GET["notes"];
    $notes_titre = $_GET["notes_titre"];
    $joueurId = $_GET["joueurId"];
    $partieId = $_GET["partieId"];

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $stmt = $con -> prepare("UPDATE joueurs SET notes_titre = ?, notes = ? WHERE id = ? AND partie = ?");

    $stmt -> bind_param('ssii',$notes_titre,$notes,$joueurId,$partieId);
    $stmt -> execute();

    mysqli_close($con);

?>