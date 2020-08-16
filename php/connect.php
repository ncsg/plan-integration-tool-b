<?php

// database connection information 
$host = "localhost"; 
$port = 5432;
$user = "postgres"; // user account name
$pwd = "XXXXX"; // user password: ALWAYS OBSCURE THIS BEFORE PUSHING TO GITHUB
$db = "sop"; // database name

$conn_string = "host=$host port=$port dbname=$db user=$user password=$pwd"; // parameter format for pg_connect

// connect
$connection = pg_pconnect($conn_string); // opens a non-persistent connection to the database

// display error message if connect does not work
if (! $connection) {
    die("Database connection error: " . pg_last_error($connection)); // returns only the last error, not all errors
}

?>