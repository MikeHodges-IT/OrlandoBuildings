/*
 Orlando Building Energy Dashboard App
 Created by Mike Hodges on 12/20/21.
*/
showTopPerfomers = ()=>{
top_performers_data = orlandoBuildingEnergyData.filter((x)=>{
return x.properties.energy_sta === '100' ;
});
top_performers = document.getElementById('top_performers');
top_performers.innerHTML = createGrid(top_performers_data,"top");
};
 