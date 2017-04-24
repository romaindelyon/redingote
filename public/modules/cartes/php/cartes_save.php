<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

    $user = 1;
    $default_value = 0;

    $con = mysqli_connect("localhost","redingot_romain","redingote778","redingot_database");
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    // Insert a new Playlist_control element
    // $sql1 = $con->prepare("SELECT * FROM cartes");
    $sql1 = $con->prepare("INSERT INTO " . $database .
                "(User, Playlist_update, Library_update, Playlists_update, Categories_update)
                VALUES (?,?,?,?,?)");
    // $sql1->bind_param('sssss', $user, $default_value, $default_value, $default_value, $default_value);
    // $sql1->execute();

    $stmt = $con -> prepare("SELECT * FROM cartes");
    //$fetched_result = mysqli_fetch_array($stmt);
    //$stmt -> bind_param('i',$user);
    $stmt -> execute();
    $stmt -> bind_result($id,$position,$pile,$nom,$categorie,$utilisation,$action,$objets,$main);
    // $result = $sql->get_result();
    // $fetched_result2 = mysqli_fetch_array($sql);
    //$output = $sql;
    $results = array();
    while($stmt->fetch()) {
            $result = array();
            $result["id"] = $id;
            $result["position"] = $position;
            $result["pile"] = $pile;
            $result["categorie"] = $categorie;
            $result["utilisation"] = $utilisation;
            $result["action"] = $action;
            $result["objets"] = $objets;
            $result["main"] = $main;
            array_push($results, $result);
        }
    mysqli_close($con); 

    echo json_encode($results);
?>