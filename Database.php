<?php
class Database
{
    private static $db = NULL;


	const DSN = "mysql:host=localhost;port=3306;dbname=dragonslayer";
	const USERNAME = "root";
	const PASSWORD = "";

    public static function getInstance()
    {
        if (self::$db) {
        	return self::$db;
        }
        
        try {
            self::$db = new PDO(self::DSN, self::USERNAME, self::PASSWORD);
            return self::$db;
        }
        catch (PDOException $e) {
            echo 'Connection failed: ' . $e->getMessage();
            exit();
        }        

        return self::$db;
    }
}
?>