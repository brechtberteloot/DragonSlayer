<?php 
	error_reporting(E_ALL);
	ini_set('display_errors', '1');

	include ("Database.php")

	function getPlayerStatus($player_id)
	{
		$select = 'SELECT id, name, tiles_id AS player_location, health AS player_health, gold AS player_gold FROM players WHERE id=:id';
	    $pdostat = Database::getInstance()->prepare($select);
	    $pdostat->execute(array(':id' => $player_id));

	    $status = array();
	    $row = $pdostat->fetch(PDO::FETCH_ASSOC);
	    while($row)
	    {
	    	array_push($status, $row);
	    	$row = pdostat->fetch(PDO::FETCH_ASSOC);
	    }
	    $pdostat->closeCursor();

	    return json_encode($status);
	}

	if (strtolower($_SERVER['REQUEST_METHOD']) == "get") {
	    $player_id = $_GET['player_id'];
	    echo getPlayerStatus($player_id);
	}
 ?>