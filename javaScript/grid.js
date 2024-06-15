/*
 Orlando Building Energy Dashboard App
 Created by Mike Hodges on 12/20/21.
*/
showGrid = () => {
    filteredData = orlandoBuildingEnergyData
    gridDiv = document.getElementById('grid');
    updateGrid(filteredData)
}


function updateGrid(data){
    gridDiv.innerHTML = createGrid(data,'grid')
}
// update grid
function createGrid(data, p) {
    if( typeof data === 'undefined'){
        return
    }
  
    html = `<table>
         <thead>
             <tr>          
                <th style = "width:18%" >NAME</th>
                <th style = "width:14%" >ADDRESS</th>
                <th style = "width:10%" >COMPLIANCE</th>
                <th style = "width:2%" >ESR</th>
                <th style = "width:2%" >EUI</th>
                <th style = "width:2%" >GHG</th>
                <th style = "width:18%" >PRIMARY USE</th>
                <th style = "width:5%" >SIZE</th>
                <th style = "width:5%" >YEAR</th>
                <th style = "width:8% ">COMP</th>
                <th style = "width:10% ">MORE</th>
            <tr>
      </thead>`

    for (let i = 0; i < data.length; i++) {
        quearyData = data[i].properties
        energyColor = getMarkerColor(quearyData.energy_sta)
        engStar = (quearyData.energy_sta == null) ? "N/A" : quearyData.energy_sta;
        siteEnerg = (quearyData.site_energ == null) ? "N/A" : quearyData.site_energ;
        totalAnnu = (quearyData.total_annu == null) ? "N/A" : quearyData.total_annu;
        html += ` <tr>
                   <td style = "width:18%">${quearyData.property_n}</td>
                   <td style = "width:14%" >${quearyData.property_a}</td>
                   <td style = "width:10%">${quearyData.compliance}</td>
                   <td style="width:2%; color:${energyColor}">${engStar}</td>
                   <td style="width:2%">${siteEnerg}</td>
                   <td style="width:2%">${totalAnnu}</td>
                   <td style="width:18%">${quearyData.primary_us}</td>
                   <td style="width:5%">${Math.floor(quearyData.building_s)}</td>
                   <td style="width:5%">${quearyData.ayb}</td>
                   <td style="width:8%"><div class = "popUpGrid" onclick = "add_compare(${i},'${p}')">COMPARE</div></td>
                   <td style="width:10%"><div class = "popUpGrid" onclick = "moreInfo(${quearyData.parcel})">INFORMATION</div></td>
                </tr>`
    }
    html += '</table>'
    

    index = 0;
    return html
}
