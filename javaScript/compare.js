/*
 Orlando Building Energy Dashboard App
 Created by Mike Hodges on 12/20/21.
*/
let compareList = [];
display_compare = () =>{
    if (compareList.length === 0 ) {
        compareDiv.innerHTML = `
        <h1>BUILDINGS COMPARE PAGE</h1>
        <h2>There are currently no buildings added to the compare list.</h2> 
        <h2>Use the map and grid tabs above.</h2> 
        <h2>These pages contain COMPARE buttons.</h2> 
        <h2>Click the COMPARE buttons and the buildings will display here.</h2> 
        <h2>A number indicating the number of buildings added will apear on the compare tab.</h2> 
        
        `
      compare_btn.innerHTML = `COMPARE` 
     return;
     }
     
html = `<table id ="compare_table_wrapper">`
    compareList.forEach((e,i) => {

        html +=`
        <td>
         ${popHtml(i,compareList)}
        </td>`
    });
html += `</table>`
compare_btn.innerHTML = `COMPARE (${compareList.length})`
compareDiv.innerHTML = html;
}
const delete_compare = (i)=>{
    compareList.splice(i,1);
    display_compare(); 
}
const add_compare = (i,p) => {
    if (p == 'grid') {
        data = filteredData
    } else {
        data = top_performers_data
    }
    if (compareList.filter(e=>e.property_n === data[i].properties.property_n).length>0) {
        //alert("( "+filteredData[i].properties.property_n+" )\n\n IS ALREADY ADDED TO THE COMPARE LIST")
        return;
    } 
    let  building = {
        "property_n": data[i].properties.property_n,   // add name to building Obj
        "property_a": data[i].properties.property_a,
        "compliance": data[i].properties.compliance,
        "energy_sta": data[i].properties.energy_sta,
        "site_energ": data[i].properties.site_energ,
        "total_annu": data[i].properties.total_annu,
        "primary_us": data[i].properties.primary_us,
        "building_s": data[i].properties.building_s,
        "ayb": data[i].properties.ayb,
        "parcel": data[i].properties.parcel
    }

    compareList.push(building);                           // add building to compare list
      //alert(compareList[compareList.length - 1].name +"\n\n IS ADDED TO THE COMPARE LIST\n\nTHE COMPARE LIST HAS \n"+compareList.length+" BUILDINGS")
    display_compare();
}

init_compare_div = () => {
    compareDiv = document.getElementById('compareDiv');
    compare_btn = document.getElementById('compare_btn')
    display_compare();
}