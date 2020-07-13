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

// style geojson features
function style(feature) {
    if (corridorFeature) {
        return {
            fillColor: '#800080',
            weight: 4,
            opacity: 1,
            color: '#800080',
            fillOpacity: 0.1
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

// add purple line stations to map
L.geoJson(purpleLineStations, {
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
}).addTo(mymap);


// add purple line and corridor boundary to map
L.geoJSON(purpleLine, { style: style }).addTo(mymap);
L.geoJSON(corridorFeature, { style: style }).addTo(mymap);


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
    };


    if (displayQuery.checked) {
        // set the form div display property
        queryDiv.style.display = "block";
        analysisDiv.style.display = "none";
        introDiv.style.display = "none";
        // set the active button
        displayQuery.setAttribute("active", "active");
        displayAnalysis.removeAttribute("active");
        displayIntro.removeAttribute("active");
    };

    if (displayAnalysis.checked) {
        // set the form div display property
        analysisDiv.style.display = "block";
        queryDiv.style.display = "none";
        introDiv.style.display = "none";
        // set the active button
        displayAnalysis.setAttribute("active", "active");
        displayQuery.removeAttribute("active");
        displayIntro.removeAttribute("active");

    };

}

var tableNames = ['plans'];
var plansColumns = ['id', 'title', 'plan_type', 'county', 'awc', 'year', 'link', 'plan_area'];
var visionColumns = ['id', 'vision', 'plan_id', 'boundary_id']

// displays checkboxes with column names based on the table the user picks
function displayColumns() {

    // get the select list
    var sel = document.getElementById("table-query");
    // if the value of the selection is plans, assign the plansColumns to the columnsList variable
    if (sel.value == 'plans') {
        columnsList = plansColumns;
    }

    if (sel.value == 'vision') {
        columnsList = visionColumns;
    }

    // need to find a way to limit the below behavior 


    // get the div where the columns checkboxes will go
    columnsElement = document.getElementById("columns");
    columnsElement.innerHTML = ''

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
        input.id = column
        input.setAttribute("type", "checkbox");
        input.setAttribute("value", column);
        // create a label element and set the correct attributes based on the column name
        var label = document.createElement("label");
        label.className = "form-check-label";
        label.setAttribute("for", column);
        label.innerHTML = column;
        // add the input and label elements as children of the wrapper
        formCheck.appendChild(input);
        formCheck.appendChild(label);
    }

}