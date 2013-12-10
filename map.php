<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

include("Database.php");

function getPartialMapInfo($tile_id, $level)
{
    $select = "SELECT id, description, tiles_id_north AS north_id, tiles_id_east AS east_id, tiles_id_south AS south_id, tiles_id_west AS west_id, tile_image AS image FROM tiles WHERE id=:id OR tiles_id_north=:id OR tiles_id_east=:id OR tiles_id_south=:id OR tiles_id_west=:id";
    $pdostat = Database::getInstance()->prepare($select);
    $pdostat->execute(array(':id' => $tile_id));

    $tiles = array();
    $monster_ids = array();
    $row = $pdostat->fetch(PDO::FETCH_ASSOC);
    while ($row) {
        array_push($tiles, $row);
        array_push($monster_ids, $row['id']);
        $row = $pdostat->fetch(PDO::FETCH_ASSOC);
    }
    $pdostat->closeCursor();

    // Create a string for the parameter placeholders filled to the number of monster_ids
    $place_holders = implode(',', array_fill(0, count($monster_ids), '?'));

    /*
        This prepares the statement with enough unnamed placeholders for every value
        in our $monster_ids array.
    */
    $pdostat = Database::getInstance()->prepare("SELECT id, description, tiles_id AS location_id, monster_image FROM monsters WHERE tiles_id IN ($place_holders)");
    $pdostat->execute($monster_ids);

    $monsters = array();
    $row = $pdostat->fetch(PDO::FETCH_ASSOC);
    while ($row) {
        array_push($monsters, $row);
        $row = $pdostat->fetch(PDO::FETCH_ASSOC);
    }
    $pdostat->closeCursor();

    $result = array(
        'tiles' => $tiles,
        'monsters' => $monsters
    );

    return json_encode($result);
}

if (strtolower($_SERVER['REQUEST_METHOD']) == "get") {
    $tile_id = $_GET['tile_id'];
    $level = $_GET['level'];
    echo getPartialMapInfo($tile_id, $level);
}