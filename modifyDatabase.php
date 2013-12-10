<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'Database.php';

RemoveAllData();

ModifyTilesTable();     // First insert tiles because monsters point to tiles
ModifyMonstersTable();
ModifyItemsTable();

/*
    Remove all data of a table
*/
function RemoveTableData($tablename)
{
    // We can't use prepare with tablename parameterized !
    $delete = "DELETE FROM $tablename WHERE id >= 0";
    $numberofrows = Database::getInstance()->exec($delete);
    return $numberofrows;
}

function RemoveAllData()
{
    $tables = array(
        'monsters',     // First remove monsters because they point to tiles
        'items',
        'tiles'
    );

    // Remove all data of tables
    foreach ($tables as $table) {
        echo "<p>Removed " . RemoveTableData($table) . " rows from $table</p>";
    }
}

function ModifyMonstersTable()
{
	$records = array(
		array(
				":id" => 102,
                ":description" => "A huge flaming dog of hell of at least 2 centimetres",
                ":tiles_id" => 2,
                ":monster_image" => NULL
		),
		array(
				":id" => 103,
                ":description" => "A small yellow rat.",
                ":tiles_id" => 3,
                ":monster_image" => NULL
		)
	);

	$insert = "INSERT INTO monsters (id, description, tiles_id, monster_image )
	                  VALUES (:id, :description, :tiles_id, :monster_image )";

	$pdostat = Database::getInstance()->prepare($insert);

	$success = true;
	foreach ($records as $newvalues)
	{
		$success = $success && $pdostat->execute($newvalues);
	}

	if ($success)
	{
		echo "<p>Monsters table modified.</p>";
	}
	else
	{
		echo "<p>Could not modify Monsters table.</p>";
	}
}

function ModifyItemsTable()
{
	$records = array(
		array(
				":id" => 1,
                ":description" => "Knife"
		)
	);

	$insert = "INSERT INTO items (id, description )
	                  VALUES (:id, :description )";

	$pdostat = Database::getInstance()->prepare($insert);

	$success = true;
	foreach ($records as $newvalues)
	{
		$success = $success && $pdostat->execute($newvalues);
	}

	if ($success)
	{
		echo "<p>Items table modified.</p>";
	}
	else
	{
		echo "<p>Could not modify Items table.</p>";
	}
}

function ModifyTilesTable()
{
	$records = array(
		array(
				":id" => 1,
                ":description" => "You are in a green field with flowers.",
                ":tiles_id_north" => 20,
                ":tiles_id_east" => 2,
                ":tiles_id_south" => 21,
                ":tiles_id_west" => 22,
                ":tile_image" => NULL
		),
		array(
				":id" => 2,
                ":description" => "You have entered the black forest of Dankeo.",
                ":tiles_id_north" => NULL,
                ":tiles_id_east" => 3,
                ":tiles_id_south" => NULL,
                ":tiles_id_west" => 1,
                ":tile_image" => NULL
		),
		array(
				":id" => 3,
                ":description" => "You are in the centre of a black forest. A very ...",
                ":tiles_id_north" => NULL,
                ":tiles_id_east" => NULL,
                ":tiles_id_south" => NULL,
                ":tiles_id_west" => 2,
                ":tile_image" => NULL
		),
		array(
				":id" => 20,
                ":description" => "A beautiful hill with view on the beach",
                ":tiles_id_north" => NULL,
                ":tiles_id_east" => NULL,
                ":tiles_id_south" => 1,
                ":tiles_id_west" => NULL,
                ":tile_image" => NULL
		),
		array(
				":id" => 21,
                ":description" => "You are standing on the brink of an abyss. Nothing...",
                ":tiles_id_north" => 1,
                ":tiles_id_east" => NULL,
                ":tiles_id_south" => NULL,
                ":tiles_id_west" => NULL,
                ":tile_image" => NULL
		),
		array(
				":id" => 22,
                ":description" => "You face a wall of rock no man can climb.",
                ":tiles_id_north" => NULL,
                ":tiles_id_east" => 1,
                ":tiles_id_south" => NULL,
                ":tiles_id_west" => NULL,
                ":tile_image" => NULL
		)
	);

	$insert = "INSERT INTO tiles (id, description, tiles_id_north, tiles_id_east, tiles_id_south, tiles_id_west, tile_image )
	                  VALUES (:id, :description, :tiles_id_north, :tiles_id_east, :tiles_id_south, :tiles_id_west, :tile_image )";

	$pdostat = Database::getInstance()->prepare($insert);

	$success = true;
	foreach ($records as $newvalues)
	{
		$success = $success && $pdostat->execute($newvalues);
	}

	if ($success)
	{
		echo "<p>Tiles table modified.</p>";
	}
	else
	{
		echo "<p>Could not modify Tiles table.</p>";
	}
}

?>