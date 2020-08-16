<?php 

// settings for the content
header('content-type: application/json; charset = utf-8');

// connect to the database
require_once "./connect.php";

$table = $_POST["table"]; // the 'name' attribute from the form gets the selected value
$column = $_POST["columnRadios"]; // the 'name' attribute from the form gets the selected value

// query statement to get the unique values in the column and table specified by the user
// source: https://stackoverflow.com/questions/5391564/how-to-use-distinct-and-order-by-in-same-select-statement
$query_values = "SELECT DISTINCT $column FROM $table GROUP BY $column ORDER BY $column ASC";

// send the query to the database
$result = pg_query($connection, $query_values);

// if there is no result, print error message and exit
if(!$result) {
    echo "An error occurred.\n";
    exit;
}

$values = array(); // initialize an empty array to hold the results of the query

// for each row in the results
while($row = pg_fetch_row($result)) {
    array_push($values, $row); // add the name of the column to the array
}

echo json_encode($values);

?>