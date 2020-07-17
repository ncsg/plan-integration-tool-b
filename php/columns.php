<?php

// connect to the database
require_once "./php/connect.php";

$table = $_POST["table"]; // the name attribute from the form gets the selected value

// 
$query = "SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '$table'";

?>