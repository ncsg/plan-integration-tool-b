<?php

// settings for the content
header('content-type: application/json; charset = utf-8');

// connect to the database
require_once "./connect.php";

$table = $_POST["table"]; // the 'name' attribute from the form gets the selected value
$column = $_POST["columnRadios"];
$operator = $_POST["operator"];
$value = $_POST["values"]; 


// need to do some validation of value type


// query statement to return the records specified by the user built query
// ST_AsGeoJson converts geom column to geojson format up to 5 decimal places
// source: https://www.youtube.com/watch?v=6HW7qenp-Yg
// source: https://gis.stackexchange.com/questions/185201/st-transform-doesnt-work-in-postgresql/185202

$full_query = "SELECT *, ST_AsGeoJSON(ST_Transform(ST_SetSRID(geom, 2248), 4326), 6) AS geojson FROM $table WHERE $column $operator '$value'";

// $full_query = "SELECT *, ST_AsGeoJSON(CAST(geom as geometry), 6) AS geojson FROM cchiment.$table WHERE $column $operator '$value'";


// send the query to the database
$result = pg_query($connection, $full_query); // DOES NOT RETURN AN ARRAY

// if there is no result, print error message and exit
if(!$result) {
    echo "An error occurred.\n";
    exit;
}

$features = array(); // initialize an empty array to hold the results of the query

// loop through each record in the result
// must read results into associative arrays in order to use key indexing (avoid undefined index error)
// source: https://www.php.net/manual/en/function.pg-fetch-assoc.php
// source: https://northlandia.wordpress.com/2015/04/20/connecting-postgis-to-leaflet-using-php/
while($row = pg_fetch_assoc($result)) { 
    unset($row['geom']); // get rid of the binary geom column from postgres
    // decode the converted geojson data (see query) to get rid of string escape characters
    $geometry = json_decode($row['geojson']);
    unset($row['geojson']); // get rid of the geojson column
    // build a single geojson feature
    $feature = ["type" => "Feature", "geometry" => $geometry, "properties" => $row]; 
    // add the feature to an array
    array_push($features, $feature);
};
// wrap the array of features as a geojson feature collection
$featureCollection = ["type" => "FeatureCollection", "features" => $features];

echo json_encode($featureCollection);

?>