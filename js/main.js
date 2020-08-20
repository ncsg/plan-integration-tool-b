// initialize the map, and remove the zoom control
var mymap = L.map('map', {
    zoomControl: false
}).setView([38.9698612, -77.0876517], 12);

// display the coordinate system code on the console
console.log("map crs: " + mymap.options.crs.code);

// add tile layer with OSM tiles: https://switch2osm.org/using-tiles/getting-started-with-leaflet/
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    maxZoom: 19
}).addTo(mymap);

// Creating Feature group
// source: https://leafletjs.com/examples/layers-control/
var purpleGroup = L.featureGroup();

// style geojson features
function style(feature) {
    if (corridorFeature) {
        return {
            fillColor: '#800080',
            weight: 4,
            opacity: 1,
            color: '#800080',
            fillOpacity: 0.07
        };
    }
    if (purpleLine) {
        return {
            color: '#800080',
        };
    }
}

// style geojson marker features
var geojsonMarkerOptions = {
    radius: 6,
    fillColor: '#800080',
    color: '#800080',
    weight: 1,
    opacity: 1,
    fillOpacity: 1
};

// function binds popup to feature
function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.ST_NAME) {
        // add dynamic content and create a class name for styling
        layer.bindPopup("<strong>Station:</strong> " + feature.properties.ST_NAME, { className: "customPopup" });
    }
}

// drawing order matters!
// add purple line and corridor boundary to map
var corridor = L.geoJSON(corridorFeature, { style: style });
var row = L.geoJSON(purpleLine, { style: style, onEachFeature: onEachFeature });
// add purple line stations to map
var stations = L.geoJson(purpleLineStations, {
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    },
    onEachFeature: onEachFeature // bind the popup to each feature after it gets created
});

//Add layers to FeatureGroup
purpleGroup.addLayer(corridor);
purpleGroup.addLayer(row);
purpleGroup.addLayer(stations);
// Adding Feature group to map
purpleGroup.addTo(mymap);

// function to toggle between the query and insert forms
// could this be done more concisely with a for loop?
function toggleFunction() {

    // assign variables for each form div
    introDiv = document.getElementById("introDiv");
    queryDiv = document.getElementById("queryDiv");
    analysisDiv = document.getElementById("analysisDiv");


    // assign variables for each button
    displayIntro = document.getElementById("displayIntro");
    displayQuery = document.getElementById("displayQuery");
    displayAnalysis = document.getElementById("displayAnalysis");

    // conditional checks which button button is checked
    if (displayIntro.checked) {
        // set the form div display property
        introDiv.style.display = "block";
        analysisDiv.style.display = "none";
        queryDiv.style.display = "none";
        // set the active button
        displayIntro.setAttribute("active", "active");
        displayAnalysis.removeAttribute("active");
        displayQuery.removeAttribute("active");
    }

    if (displayQuery.checked) {
        // set the form div display property
        queryDiv.style.display = "block";
        analysisDiv.style.display = "none";
        introDiv.style.display = "none";
        // set the active button
        displayQuery.setAttribute("active", "active");
        displayAnalysis.removeAttribute("active");
        displayIntro.removeAttribute("active");
    }

    if (displayAnalysis.checked) {
        // set the form div display property
        analysisDiv.style.display = "block";
        queryDiv.style.display = "none";
        introDiv.style.display = "none";
        // set the active button
        displayAnalysis.setAttribute("active", "active");
        displayQuery.removeAttribute("active");
        displayIntro.removeAttribute("active");
    }
}

var server = 'https://geogws003.ad.umd.edu:8443/657/cchiment/geog657-final/';
// var server = 'http://localhost:8080/geog657-final/';

// when a user changes the table name in the select list, this function sends a request
// to the database to get the column names for the selected table and display them as
// checkboxes in the queryDiv
function columnRequest() {

    // clear the columns from the previous table selection
    columnsElement = document.getElementById("columns");
    columnsElement.innerHTML = '';

    // create the XMLHttpRequest object
    var xhttp = new XMLHttpRequest();

    // bind the FormData object to the table selection
    var formData = new FormData(document.getElementById("form"));

    // if the request is successful, process the results of the query into an array, 
    // and add the elements of the array as checkboxes to the queryDiv
    xhttp.addEventListener("load", function(event) {

        console.log("Response text: " + event.target.responseText);
        var columnsList = JSON.parse(event.target.responseText);

        console.log(columnsList);

        // initialize the variable for iterating through the column name array
        var column;

        // create a for-of loop to loop through the column names
        for (column of columnsList) {
            // create a wrapper div for the checkbox
            var formCheck = document.createElement("div");
            formCheck.className = "form-check";
            // add the wrapper into the correct div as a child element
            columnsElement.appendChild(formCheck);
            // create an input element and set the correct attributes based on the column name
            var input = document.createElement("input");
            input.className = "form-check-input";
            input.id = column[3];
            input.setAttribute("type", "radio");
            input.setAttribute("value", column[3]);
            input.setAttribute("name", "columnRadios"); // radios must share the same name attribute to only select one
            input.addEventListener("click", valuesRequest);
            // create a label element and set the correct attributes based on the column name
            var label = document.createElement("label");
            label.className = "form-check-label";
            label.setAttribute("for", column[3]);
            label.innerHTML = column[3];
            // add the input and label elements as children of the wrapper
            formCheck.appendChild(input);
            formCheck.appendChild(label);
        }
    });

    // if the request is unsuccessful, print error text to console, and an error message
    // to the queryDiv
    xhttp.addEventListener("error", function(event) {
        console.log("Error text: " + event.target.responseText);
        columnsElement.innerHTML = "<p><strong>Oops! Looks like something went wrong.</strong><br>You probably aren't connected to the database. Please contact us for help: cchiment@terpmail.umd.edu</p>";
    });

    // send the request to postgres
    xhttp.open("POST", server + "/php/columns.php");
    xhttp.send(formData);
}

// when a user clicks a column name radio button, this function sends a request
// to the database to get the unique value names for the selected column and table 
// and display them as items in a select list in the queryDiv
function valuesRequest() {

    // clear the columns from the previous table selection
    valuesElement = document.getElementById("values");
    valuesElement.innerHTML = '<option value="select">Select a value after picking a column</option>';

    // create the XMLHttpRequest object
    var xhttp = new XMLHttpRequest();

    // bind the FormData object to the table selection
    var formData = new FormData(document.getElementById("form"));

    // if the request is successful, process the results of the query into an array, 
    // and add the elements of the array as options in a select list
    xhttp.addEventListener("load", function(event) {

        console.log("Response text: " + event.target.responseText);
        var valuesList = JSON.parse(event.target.responseText);

        console.log(valuesList);

        // initialize the variable for iterating through the column name array
        var value;

        // create a for-of loop to loop through the column names
        for (value of valuesList) {
            // create an option element and set the correct attributes based on the value
            var option = document.createElement("option");
            option.setAttribute("value", value);
            option.innerHTML = value;

            // add the input and label elements as children of the wrapper
            valuesElement.appendChild(option);
        }
    });

    // if the request is unsuccessful, print error text to console
    xhttp.addEventListener("error", function(event) {
        console.log("Error text: " + event.target.responseText);
    });

    // send the request to postgres
    xhttp.open("POST", server + "/php/values.php");
    xhttp.send(formData);
}

// when the form is submitted, execute the queryRequest function
document.getElementById("form").onsubmit = queryRequest;

// Creating Feature group for the new data layer
var requestGroup = L.featureGroup();
var overlay; // initializing the variable for the individual layer

function queryRequest(event) {

    event.preventDefault();

    // create the XMLHttpRequest object
    var xhttp = new XMLHttpRequest();

    // bind the FormData object to the table selection
    var formData = new FormData(document.getElementById("form"));

    // if the request is successful, process the results of the query into geojson
    // and add them to the map
    xhttp.addEventListener("load", function(event) {

        console.log("Response text: " + event.target.responseText);
        var results = JSON.parse(event.target.responseText); // turn the response from string into json object

        console.log(results);

        overlay = L.geoJSON(results, {
            onEachFeature: function(feature, layer) {
                // source: https://gis.stackexchange.com/questions/329499/add-popup-with-geojson-data
                var popupContent = '';
                for (var key in feature.properties) {
                    if (key !== 'url') {
                        popupContent = popupContent + '<strong>' + key + ':</strong>  ' + feature.properties[key] + '</br>';
                    } else {
                        popupContent = popupContent + '<strong>' + key + ':</strong>  ' + '<a href="' + feature.properties[key] + '" target="blank">View link</a></br>';
                    }
                }
                layer.bindPopup(popupContent, { className: "customPopup" });
            }
        });
        //Add layer to FeatureGroup
        requestGroup.addLayer(overlay);
    });

    // if the request is unsuccessful, print error text to console
    xhttp.addEventListener("error", function(event) {
        console.log("Error text: " + event.target.responseText);
        alert("There was an error: " + event.target.responseText);
    });

    // send the request to postgres
    xhttp.open("POST", server + "/php/query.php", true);
    xhttp.send(formData);
}


// Adding Feature group to map
requestGroup.addTo(mymap);


// when the user clicks the Clear Data button, reload the window
function clearData() {
    // remove a layer from FeatureGroup
    // requestGroup.removeLayers(overlay); // is not working; the data just reloads as soon as it clears
    // source: https://www.w3schools.com/jsref/met_loc_reload.asp
    location.reload();
}


// add UI elements to add another portion to the query
// function addQuery() {
//     var queryBuiler = document.getElementById("query-builder");

//     var newQuerySection = document.createElement("div");
//     var newTable = document.createElement("div");
//     newTable.className = "form-group";
//     var newLabel = document.createElement("label");
//     newLabel.setAttribute("for", "table");
//     var newSelect = document.createElement("select");
//     newSelect.className = "form-control";
//     // this is going to cause issues with post - two elements with name "table"
//     newSelect.setAttribute("name", "table");
//     newSelect.setAttribute("onchange", "db_request()");


//     newTable.appendChild(newLabel);
//     newTable.appendChild(newSelect);
//     newQuerySection.appendChild(newTable);

//     var options = ["option1", "option2"];
//     var option = ""
//     for (option of options) {
//         newSelect.innerHTML = "<option value='" + option + "'>" + option + "</option>";
//     }
// }