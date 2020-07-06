// initialize the map, and remove the zoom control
var mymap = L.map('map', {
    zoomControl: false
}).setView([38.986036, -77.0332521], 12);

// display the coordinate system code on the console
console.log("map crs: " + mymap.options.crs.code);

// add tile layer with OSM tiles: https://switch2osm.org/using-tiles/getting-started-with-leaflet/
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    maxZoom: 19
}).addTo(mymap);

// for some reason, geojson features from a local external file are not working
var testFeature = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "Point",
            "coordinates": [-77.0357894897461, 38.89023115500578]
        }
    }]
};

// add layer for Purple Line corridor boundary
L.geoJSON(testFeature).addTo(mymap);

// add layer for Purple Line


// function to toggle between the query and insert forms
// could this be done more concisely with a for loop?
function toggleQueryInsert() {

    // assign variables for each form div
    queryDiv = document.getElementById("queryDiv");
    insertDiv = document.getElementById("insertDiv");
    analysisDiv = document.getElementById("analysisDiv");
    // assign variables for each button
    displayQuery = document.getElementById("displayQuery");
    displayInsert = document.getElementById("displayInsert");
    displayAnalysis = document.getElementById("displayAnalysis");

    // conditional checks which button button is checked
    if (displayQuery.checked) {
        // set the form div display property
        queryDiv.style.display = "block";
        insertDiv.style.display = "none";
        analysisDiv.style.display = "none";
        // set the active button
        displayQuery.setAttribute("active", "active");
        displayInsert.removeAttribute("active");
        displayAnalysis.removeAttribute("active");
    };

    if (displayInsert.checked) {
        // set the form div display property
        insertDiv.style.display = "block";
        queryDiv.style.display = "none";
        analysisDiv.style.display = "none";
        // set the active button
        displayInsert.setAttribute("active", "active");
        displayQuery.removeAttribute("active");
        displayAnalysis.removeAttribute("active");

    };

    if (displayAnalysis.checked) {
        // set the form div display property
        analysisDiv.style.display = "block";
        insertDiv.style.display = "none";
        queryDiv.style.display = "none";
        // set the active button
        displayAnalysis.setAttribute("active", "active");
        displayQuery.removeAttribute("active");
        displayInsert.removeAttribute("active");

    };

}