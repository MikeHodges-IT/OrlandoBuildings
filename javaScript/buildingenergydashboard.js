/*
 Orlando Building Energy Dashboard App
 Created by Mike Hodges on 12/20/21.
*/
//global variables
var orlandoBuildingEnergyData //geojason
var obdJson
var filteredData
/**
* marker_colors is an array of 5 color values that represent energy star status. The first
* four represents the color value for 1 through 100 in increments of 25, and the last value holds
* the color for null values.
 */
let marker_colors = ["#004B8D", "#00883C", "#712D90", "#FBB92F", "#E21B23"]
let index = 0;
let chart_html = '';
let map_html = '';
let grid_html = '';
let compare_html = '';
let top_performers_html = '';
let filter_html = '';

const chart_html_div = document.getElementById('chart_html_div');
const map_html_div = document.getElementById('map_html_div');
const grid_html_div = document.getElementById('grid_html_div');
const compare_html_div = document.getElementById('compare_html_div');
const top_performers_html_div = document.getElementById('top_performers_html_div');
const filter_html_div = document.getElementById('filter_html_div');

const loadPage = async (page) => {
    const response = await fetch(page);
    const resHtml = await response.text();
    return resHtml;
};

const loadAllPages = async () => {
    chart_html = await loadPage('html/charts.html');
    map_html = await loadPage('html/map.html');
    grid_html = await loadPage('html/grid.html');
    compare_html = await loadPage('html/compare.html');
    top_performers_html = await loadPage('html/top_performers.html');
    filter_html = await loadPage('html/filter.html');
};

const main = async () => {
    await loadAllPages();
    chart_html_div.innerHTML = chart_html;
    map_html_div.innerHTML = map_html;
    grid_html_div.innerHTML = grid_html;
    compare_html_div.innerHTML = compare_html;
    top_performers_html_div.innerHTML = top_performers_html;
    filter_html_div.innerHTML = filter_html;
    gotoPage('map_html_div')
    //gotoPage('grid_html_div')
    //gotoPage('chart_html_div')
    //gotoPage('compare_html_div');
    //gotoPage('top_performers_html_div');
};

const gotoPage = (pathname) => {
    var x = document.getElementsByClassName("pages");
    for (var i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    switch (pathname) {
        case 'grid_html_div':
        case 'map_html_div':
            document.getElementById('filter_html_div').style.display = "block";
            break;
        default:
            document.getElementById('filter_html_div').style.display = "none";
            break;
    }
    document.getElementById(pathname).style.display = "block";
};

//init
/**
* Function takes a URL and returns a JSON file.
* Puts initial data on the Map.
* @param    {url}   Url of the data API.
* @var orlandoBuildingEnergyData    geoJSON file.
*/
async function init_Data(url) {
    try {
        fetch(url).then(
            function (u) { return u.json(); }
        ).then(
            function (json) {
                orlandoBuildingEnergyData = json.features.filter((x) => {
                    //clean up bad data this entry has no geo info.
                    return (x.properties.property_n != 'HILTON HOME2 SUITES ORLANDO'
                        && x.properties.property_n != 'Conserv II'
                    )
                });
                convertToJsonData(orlandoBuildingEnergyData);
                main();
            }
        )
    }
    catch (error) {
        console.log(error);
    }
}

/**
* Function takes a URL and returns a JSON file.
* @param    {url}      x   Url of the data.
* @return   {json}         JSON file.
*/
async function getJson(url) {
    try {
        let response = await fetch(url);
        let data = await response.json();
        return data;
    }
    catch (error) {
        console.log(error);
    }
}
function convertToJsonData(arr) {
    obdJson = arr.reduce((acc, curr) => {
        acc.push(curr.properties)
        return acc
    }, [])
}

init_Data("/data/BEWES_Building_Data.geojson");
//init_Data("https://data.cityoforlando.net/resource/f63n-kp6t.geojson");
accordion = () => {
    var acc = document.getElementsByClassName("accordion");
    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
            this.classList.toggle("active");
            panelsToCLose = document.getElementsByClassName("panel")
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                for (let i = 0; i < panelsToCLose.length; i++) {
                    panelsToCLose[i].style.maxHeight = null
                }
                 panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    }
}
init_Accordion = () => {
    console.log("Building Energy Dashboard App Loaded");
    var acc = document.getElementsByClassName("accordion")[1].nextElementSibling;
    if( window.innerHeight > 800)  { 
        acc.style.maxHeight = acc.scrollHeight + "px";
    } 
    
    console.log(acc);
}   
      




/**
* Function that returns a color based on Energy Star Ratings
* @param    {int}      x   Energy Star Rating
* @return   {String}       Color from arker_colors array
* 
* ["#1a9641", "#a6d96a", "#ffffbf", "#fdae61", "#d7191c"]
*/
function getMarkerColor(x) {
    if (x > 0 && x <= 25)
        return marker_colors[3];
    else if (x > 25 && x <= 50)
        return marker_colors[2];
    else if (x > 50 && x <= 75)
        return marker_colors[1];
    else if (x > 75 && x <= 100)
        return marker_colors[0];
    else
        return marker_colors[4];
}
/**
* Function that returns a number for circle marker size based on Energy Star Ratings
* @param    {int}      x   Energy Star Rating
* @return   {String}       Returns a number between 6 and 12.
*/
function getEnergyStarRangesize(x) {
    if (x > 0 && x <= 25)
        return "6";
    else if (x > 25 && x <= 50)
        return "10";
    else if (x > 50 && x <= 75)
        return "11";
    else if (x > 75 && x <= 100)
        return "12";
    else
        return 5;
}

const closePopUp = (map) => {
    map.closePopup();
}

const moreInfo = (p_id) => {
    //link = `https://prc.ocpafl.org/Searches/vabparcel.aspx/PDF/false/PID/${p_id}` // property card
    //link = `https://ocpaimages.ocpafl.org/api/Image/GetPIDImage?pid=${p_id}` // image link
    //"https://ocpaservices.ocpafl.org/Searches/ParcelPhotoPrinterFriendly.aspx/PDF/True/PID/292308566500014"  //pdf
    link = `https://ocpaweb.ocpafl.org/parcelsearch/Parcel%20ID/${p_id}`   // porperty page
    window.open(link, '_blank');
    console.log("more info => ", p_id);
}





   
