<?php

// settings for the content
header('content-type: application/json; charset = utf-8');

// connect to the database
require_once "./connect.php";

$table = $_POST["table"]; // the 'name' attribute from the form gets the selected value

// query statement to get the names of the columns from the table specified by the user
$query_columns = "SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '$table'";

// send the query to the database
$result = pg_query($connection, $query_columns);

// if there is no result, print error message and exit
if(!$result) {
    echo "An error occurred.\n";
    exit;
}

$columns = array(); // initialize an empty array to hold the results of the query

// for each row in the results
while($row = pg_fetch_row($result)) {
    array_push($columns, $row); // add the name of the column to the array
}

echo json_encode($columns);

?>