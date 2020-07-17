<?php

// database connection information 
$host = "localhost"; 
$user = "xxxxxxx"; // user account name
$pwd = "xxxxxxx"; // user password: ALWAYS OBSCURE THIS BEFORE PUSHING TO GITHUB
$db = "sop"; // database name

// connect
$connection = mysqli_connect($host, $user, $pwd, $db);

// display error message if connect does not work
if (! $connection) {
    die("Database connection error: " . mysqli_connect_error());
}

?>