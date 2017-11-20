<?php
    // Rename to dbconnect.php and fill out the correct parameters for your database
    define("DB_USER","ENTER_DB_USER");
    define("DB_PASSWORD","ENTER_DB_USER_PWD");
    define("DB_HOST","ENTER_HOST");
    define("DB_NAME","ENTER_DB_NAME");
    $pdo = new PDO('mysql:dbname='.constant("DB_NAME").';host='.constant("DB_HOST"), constant("DB_USER"), constant("DB_PASSWORD"));
    // Uncomment if on development server
    //$pdo->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );
?>
