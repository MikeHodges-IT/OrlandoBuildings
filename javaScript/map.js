/*
 Orlando Building Energy Dashboard App
 Created by Mike Hodges on 12/20/21.
*/
showMap = () => {
    geojsonLayer = getLayerTeplate();

    Lmap = L.map('map', { scrollWheelZoom: true, zoomControl: false }).setView([28.502071587907064, -81.36696171094961], 11);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(Lmap);

    zoomControl = L.control.zoom({ position: 'topleft' }).addTo(Lmap);

    Lmap.on('popupopen', () => {
        latlng = L.latLng(Lmap.getCenter()), L.latLng(Lmap.getCenter())
        zoom = Lmap.getZoom();
        zoomControl.remove()
        legend.remove()
    })

    Lmap.on('popupclose', () => {
        zoomControl.addTo(Lmap);
        Lmap.setView(latlng, zoom);
        legend.addTo(Lmap);
    })

    geojsonLayer.addTo(Lmap)

    const resizeObserver = new ResizeObserver(() => {
        Lmap.invalidateSize();
    });

    resizeObserver.observe(map_html_div);

    // Defines the legend for the map and adds the marker colors
    var legend = L.control({ position: 'bottomleft' });
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML = '<div><b>ENERGY STAR® Score<b></div>';
        div.innerHTML += '<i style="background: ' + marker_colors[0] + '"></i><span>SUPERIOR</span><br>';
        div.innerHTML += '<i style="background: ' + marker_colors[1] + '"></i><span>EXCELLENT</span><br>';
        div.innerHTML += '<i style="background: ' + marker_colors[2] + '"></i><span>GOOD</span><br>';
        div.innerHTML += '<i style="background: ' + marker_colors[3] + '"></i><span>POOR</span><br>';
        div.innerHTML += '<i style="background: ' + marker_colors[4] + '"></i><span>NON-COMPLIANT</span><br>';
        return div;
    };
    // Adds legend to map.
    legend.addTo(Lmap);
    filteredData = orlandoBuildingEnergyData
    updateMap(filteredData)
};
// update map
function updateMap(data) {
    index = 0
    geojsonLayer.clearLayers()
    geojsonLayer.addData(data)
    Lmap.setView([28.502071587907064, -81.36696171094961], 11);
};
function center_map(){ Lmap.setView([28.502071587907064, -81.36696171094961], 11);  }
function getLayerTeplate() {
    return L.geoJSON(null, {
        // OnEachFeature adds popups with data.
        onEachFeature: function (feature, layer) {
            // OnEachFeature adds popups with data.
            layer.bindPopup
                (
                    popHtml(index, filteredData), { closeButton: false }
                );
            layer.bindTooltip(`${feature.properties.property_n}<br>${feature.properties.property_a}<br>Click for More`);
        },
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: getEnergyStarRangesize(feature.properties.energy_sta),
                color: getMarkerColor(feature.properties.energy_sta),
                opacity: 1.8,
                fillOpacity: .61
            });
        },


    }
    );
};
popHtml = (i, data) => {
    if (typeof data[i].properties == 'undefined') {
        quearyData = data[i]
    }
    else {
        quearyData = data[i].properties
    }
    energyColor = getMarkerColor(quearyData.energy_sta)
    engStar = (quearyData.energy_sta == null) ? "N/A" : quearyData.energy_sta;
    siteEnerg = (quearyData.site_energ == null) ? "N/A" : quearyData.site_energ;
    totalAnnu = (quearyData.total_annu == null) ? "N/A" : quearyData.total_annu;
    let html = ''
    html =
        `
 <div class = "popUpContent">
    <div  class = "popHeader">
        <div>
            <div class = "popName" style ="height:1.5em; overflow: hidden;">
                ${quearyData.property_n}
            </div>
        </div>
        <div class = "popAddress" style ="height:1.51em; overflow: hidden;">
            ${quearyData.property_a}
        </div>
    </div>
    <div>
        <h2>ENERGY USE AND GAS EMMISIONS</h2>
    </div>
    <div class="dataDisplayPopUp" style ="height:4.2em;">
        <div class="dataDisplayPopUpDiscription">Status</div>
        <div class="dataDisplayPopUpData">${quearyData.compliance}</div>
    </div>
    
    <div class="dataEnergyStarScoreDiv" style=" border:5px solid  ${energyColor};">
            <div>ENERGY STAR® SCORE</div>
            <div class = "energyStarScoreNumber" style = "color:${energyColor}" >${engStar}</div>
        </dvi>    
    </div>
    
    <div class="dataDisplayPopUp">
        <div class="dataDisplayPopUpDiscription">Site Energy Use Intensity (ft²)</div>
        <div class="dataDisplayPopUpData">${siteEnerg.toLocaleString()}</div>
    </div>
    
    <div class="dataDisplayPopUp">
        <div class="dataDisplayPopUpDiscription">Total Annual Greenhouse Gas Emissions</div>
        <div class="dataDisplayPopUpData">${parseFloat(totalAnnu).toLocaleString()}</div>
    </div>
    
    <div>
        <h2>BUILDING USE SIZE AND YEAR</h2>
    </div>
    
    <div class="dataDisplayPopUp" style ="height:6em; flex-direction:column;">
        <div class="dataDisplayPopUpDiscription" style ="flex:1">Primary Use Type</div>
        <div class="dataDisplayPopUpData" style ="flex:2; overflow: hidden; ">${quearyData.primary_us}</div>
    </div>
    
    <div class="dataDisplayPopUp">
        <div class="dataDisplayPopUpDiscription">Size  (ft²)</div>
        <div class="dataDisplayPopUpData">${Math.floor(quearyData.building_s).toLocaleString()}</div>
    </div>
    
    <div class="dataDisplayPopUp">
        <div class="dataDisplayPopUpDiscription">Year Built</div>
        <div class="dataDisplayPopUpData">${quearyData.ayb}</div>
    </div>`

    if (typeof data[i].properties == 'undefined') {
        html += `
        <div class = "popUpCloseButton" onclick = "moreInfo(${quearyData.parcel})">MORE INFORMATION</div>
        <div class = "popUpCloseButton" onclick = "delete_compare(${i})">DELETE</div>`
    }
    else {
        html += `
        <div class = "popUpCloseButton" onclick = "add_compare(${i},'grid'),closePopUp(Lmap)">COMPARE</div>
        <div class = "popUpCloseButton" onclick = "moreInfo(${quearyData.parcel})">MORE INFORMATION</div>
        <div class = "popUpCloseButton" onclick = "closePopUp(Lmap)">CLOSE</div>`
    }
    html += `</div>`
    index++
    return html
};
