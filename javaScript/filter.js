/*
 Orlando Building Energy Dashboard App
 Created by Mike Hodges on 12/20/21.
*/
// Data problems:
// year built has bad data one property with a future date and ten properties with a date of 0 
// one property is without cordinates 'HILTON HOME2 SUITES ORLANDO'
//                   
// I forget what is wrong with this one I think it is it's size 'Conserv II'
// Unversals parking lots and volcano bay have a problem
//                   

let filterJson
let filterName
let filterAddr
/**
* Function that set all primary_use check boxes to check or un checked.  
* @param    {object}      selectAllCat checkbox
*/
function selectAllCat(source) {
    var clist = document.getElementsByClassName("checkPrimaryUse");
    for (var i = 0; i < clist.length; ++i) {
        clist[i].checked = source.checked;
    }
    console.log('ok');
    updateCheckedPrimaryUse();
}

reset_filter = () => {
    filteredData = orlandoBuildingEnergyData;
    initFilters()
    resetNameAddrFilter(); 
    updateMap(filteredData)
    updateGrid(filteredData)
}
resetNameAddrFilter = () =>{
    document.getElementById("fname").value = '';
    document.getElementById("faddr").value = '';
}

initNameAddr = ()=>{
    filterName =  obdJson
    .reduce((a, c) => {
          a.push(c.property_n);
        return a
    }, [])
    .sort()
    filterAddr =  obdJson
    .reduce((a, c) => {
          a.push(c.property_a);
        return a
    }, [])
    .sort()

    /*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById("fname"), filterName);
autocomplete(document.getElementById("faddr"), filterAddr);
}
displayPrtNameAddrData = (s_type,val) =>{
    console.log(s_type);
    console.log(val);
    
    if (s_type == 'fname') {
        document.getElementById("faddr").value = ''  
   }else{
    document.getElementById("fname").value = ''  
   }
    filteredData  = orlandoBuildingEnergyData.filter((x)=>{
        if (s_type == 'fname') {
             return  x.properties.property_n == val
        }else{
            return  x.properties.property_a == val  
        }
    })
    initFilters();
    updateMap(filteredData)
    updateGrid(filteredData)
}




initFilters = () => {
    filterJson = {
        "complianceStutus": ["Exempt", "Not Participating", "Participating", "Pending final review", "Voluntarily Complying"],
        "energyStarScore": { "min": 0, "max": 100 },
        "eui": { "min": 0, "max": 1441.5 },
        "annualGreenhouseGas": { "min": 0, "max": 32076.6 },
        "priUseType": ["Commercial", "Office", "Apartment", "Multifamily Housing", "Hotel", "Distribution Center", "Non Refrigerated Warehouse", "Retail Store", "Parking", "Condo", "College/University", "Self Storage Facility", "Strip Mall", "Social/Meeting Hall", "Other", "Manufacturing/Industrial Plant", "Worship Facility", "Fire Station", "Wholesale Club/Supercenter", "Medical Office", "Hospital (General Medical & Surgical)", "Other   Recreation", "Repair Services (Vehicle, Shoe, Locksmith, etc.)", "Courthouse", "Supermarket/Grocery Store", "Non-Refrigerated Warehouse", "Senior Care Community", "Wastewater Treatment Plant", "Other   Entertainment/Public Assembly", "Other   Technology/Science", "Pending final review", "Police Station", "Fitness Center/Health Club/Gym", "Refrigerated Warehouse", "Ambulatory Surgical Center", "Other   Services", "Automobile Dealership", "Movie Theater"],
        "buildingSize": { "min": 0, "max": 3653517 },
        "ayb": { "min": 1913, "max": 2020 }
    };


    const parent = document.querySelectorAll('.range-slider');
    const f_cnt = document.getElementById('f_cnt')
    const t_cnt = document.getElementById('t_cnt')

    t_cnt.innerHTML = orlandoBuildingEnergyData.length
    f_cnt.innerHTML = filteredData.length

    if (!parent) {
        return;
    }

    let obj = [{}]
    obj[0] = filterJson.energyStarScore;
    obj[1] = filterJson.eui
    obj[2] = filterJson.annualGreenhouseGas
    obj[3] = filterJson.buildingSize
    obj[4] = filterJson.ayb


    for (let i = 0; i < parent.length; i++) {
        const rangeS = parent[i].querySelectorAll('input[type="range"]'),
            numberS = parent[i].querySelectorAll('input[type="number"]');

        rangeS[0].min = obj[i].min;
        rangeS[0].max = obj[i].max;
        rangeS[0].value = obj[i].min;

        rangeS[1].min = obj[i].min;
        rangeS[1].max = obj[i].max;
        rangeS[1].value = obj[i].max;

        numberS[0].value = obj[i].min;
        numberS[1].value = obj[i].max;

        rangeS.forEach((el) => {
            el.oninput = () => {
                let slide1 = parseFloat(rangeS[0].value),
                    slide2 = parseFloat(rangeS[1].value);
                if (slide1 > slide2) {
                    [slide1, slide2] = [slide2, slide1];
                }
                numberS[0].value = slide1;
                numberS[1].value = slide2;
                obj[i].min = slide1;
                obj[i].max = slide2;
                delayDisplay()
            }
        });

        numberS.forEach((el) => {
            el.oninput = () => {
                let number1 = parseFloat(numberS[0].value),
                    number2 = parseFloat(numberS[1].value);

                if (number1 > number2) {
                    let tmp = number1;
                    numberS[0].value = number2;
                    numberS[1].value = tmp;
                }
                rangeS[0].value = number1;
                rangeS[1].value = number2;
                obj[i].min = number1;
                obj[i].max = number2;
                delayDisplay()
            }
        });
    }
    // primary use grouped by count
    groupByCatCnt = obdJson
        .reduce((a, c) => {
            i = a.findIndex(x => x.primary_us === c.primary_us);
            (i >= 0) ? a[i].cnt = ++a[i].cnt : a.push({ 'primary_us': c['primary_us'], 'cnt': 1 });
            return a
        }, [])
        .sort((a, b) => b.cnt - a.cnt)

    // create primary use check boxes
    let html = '';
    groupByCatCnt.forEach(primaryUseCat => {
        html += `<div><input type="checkbox" name = "checkPrimaryUse" class = "checkPrimaryUse" value = "${primaryUseCat.primary_us}" checked="true">${primaryUseCat.primary_us}</div>`
    });

    let container_primary_use = document.getElementById('primary_use');
    container_primary_use.innerHTML = html

    //ComplianceStatus event listner and function
    parentCheckBoxes = document.querySelectorAll('.check-boxes');
    CompianceStatus = parentCheckBoxes[0].getElementsByClassName('CompianceStatus')
    for (let i = 0; i < CompianceStatus.length; i++) {
        CompianceStatus[i].oninput = (el) => {
            var boxes = document.getElementsByName("CompianceStatus")
            filterJson.complianceStutus = [];
            boxes.forEach(element => {
                if (element.checked) {
                    filterJson.complianceStutus.push(element.value);
                }
            });
            delayDisplay();
        }
        CompianceStatus[i].checked = true;
    }
    //Primary Use event listner and function
    parentCheckBoxes = document.querySelectorAll('.check-boxes');
    checkPrimaryUse = parentCheckBoxes[1].getElementsByClassName('checkPrimaryUse')
    for (let i = 0; i < checkPrimaryUse.length; i++) {
        checkPrimaryUse[i].onchange = (el) => {
            updateCheckedPrimaryUse();
        }
    }

};
const updateCheckedPrimaryUse = () => {
    var boxes = document.getElementsByName("checkPrimaryUse")
    filterJson.priUseType = [];
    boxes.forEach(element => {
        if (element.checked) {
            filterJson.priUseType.push(element.value);
        }
        delayDisplay();
    });

}

displayFilteredData = () => {
    console.log("Don't Panic");
    resetNameAddrFilter(); 
    filteredData = orlandoBuildingEnergyData.filter((x) => {
        let b = true;
        // Energy Star
        if ((x.properties.energy_sta == null) && (filterJson.energyStarScore.min == 0)) {
            b = b && true
        } else {
            b = b && (x.properties.energy_sta >= filterJson.energyStarScore.min && x.properties.energy_sta <= filterJson.energyStarScore.max)
        }
        // Site Energy Score Pre Sqaure Foot 
        if ((x.properties.site_energ == null) && (filterJson.eui.min == 0)) {
            b = b && true
        } else {
            b = b && (x.properties.site_energ >= filterJson.eui.min && x.properties.site_energ <= filterJson.eui.max)
        }
        //Total Annual Greenhouse Gas
        if ((x.properties.total_annu == null) && (filterJson.annualGreenhouseGas.min == 0)) {
            b = b && true
        } else {
            b = b && (x.properties.total_annu >= filterJson.annualGreenhouseGas.min && x.properties.total_annu <= filterJson.annualGreenhouseGas.max)
        }
        //Building Size
        if ((x.properties.building_s == null) && (filterJson.buildingSize.min == 0)) {
            b = b && true
        } else {
            b = b && (x.properties.building_s >= filterJson.buildingSize.min && x.properties.building_s <= filterJson.buildingSize.max)
        }
        //Year Built
        if ((x.properties.ayb == null) && (filterJson.ayb.min == 0)) {
            b = b && true
        } else {
            b = b && (x.properties.ayb >= filterJson.ayb.min && x.properties.ayb <= filterJson.ayb.max)
        }
        // Compliance Stutus
        b = b && (filterJson.complianceStutus.includes(x.properties.compliance))
        // Primary Use Type
        b = b && (filterJson.priUseType.includes(x.properties.primary_us))
        return b
    });
    f_cnt.innerHTML = filteredData.length
    updateMap(filteredData)
    updateGrid(filteredData)
}

let timer;
const debounce = function (fn, d) {
    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(fn, d);
}
const delayDisplay = () => {
    debounce(displayFilteredData, 200);
}
// Autocomplete From w3schools
// https://www.w3schools.com/howto/howto_js_autocomplete.asp 
//
function autocomplete(inp, arr) {
    console.log('auto complete!');
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
     
        
        this.parentNode.parentNode.style.maxHeight = "400px";
        this.parentNode.parentNode.style.height = "400px";

       

      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
               displayPrtNameAddrData(inp.name,inp.value);  
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/

    var x = document.getElementsByClassName("autocomplete-items");
    var acp = document.getElementById("autocompletepanel")
     acp.style.maxHeight = "null";
     acp.style.height = "130px";
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}



