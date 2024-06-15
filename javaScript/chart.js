/*
 Orlando Building Energy Dashboard App
 Created by Mike Hodges on 12/20/21.
*/

showCharts = () => {

    divCatCnt = document.getElementById('catCnt');
    div_tGE_v = document.getElementById('tGE_v');
    div_tEC_v = document.getElementById('tEC_v');
    div_tGFAC_v = document.getElementById('tGFAC_v');
    div_tBR_v = document.getElementById('tBR_v');
    complianceChartDiv.innerHTML = complianceChart();

    divCatCnt.innerHTML = catChart();
    div_tGE_v.innerHTML =  parseFloat(tGE_v()).toLocaleString(); // done
    div_tEC_v.innerHTML = parseFloat(tEC_v()).toLocaleString();
    div_tGFAC_v.innerHTML = parseFloat(tGFAC_v()).toLocaleString();
    div_tBR_v.innerHTML = parseFloat(tBR_v()).toLocaleString();
}




const complianceChart = () => {
    // primary use grouped by count
    groupByCatCnt = obdJson
        .reduce((a, c) => {
            i = a.findIndex(x => x.compliance === c.compliance);
            (i >= 0) ? a[i].cnt = ++a[i].cnt : a.push({ 'compliance': c['compliance'], 'cnt': 1 });
            return a
        }, [])
        .sort((a, b) => b.cnt - a.cnt)
    html = `<svg width=100% viewBox="0 0 190 20" xmlns="http://www.w3.org/2000/svg">`
    i = 0;
    ti = .2
    height = 3;
    barHeight = 2
    y_adjust_offset = -.7;

    groupByCatCnt.forEach(e => {
        w = e.cnt/6 
        html += `
            <rect x="40" y="${(i  * height)- y_adjust_offset }" width="${w}" height="${barHeight}" />
            <text x="1" y="${ti * height}" class="small" dominant-baseline="hanging">
            ${e.compliance}
            </text>
            <text x="32" y="${ti * height}" class="small" dominant-baseline="hanging">
            ${e.cnt}
            </text>
            `
            i++
            ti ++
    });
    html += `</svg> `
    return html
};


const catChart = () => {
    // primary use grouped by count+
    groupByCatCnt = obdJson
        .reduce((a, c) => {
            i = a.findIndex(x => x.primary_us === c.primary_us);
            (i >= 0) ? a[i].cnt = ++a[i].cnt : a.push({ 'primary_us': c['primary_us'], 'cnt': 1 });
            return a
        }, [])
        .sort((a, b) => b.cnt - a.cnt)

    sizeChart();    
    participatingChart();
    html = `<svg width="100%" viewBox="0 0 170 120" xmlns="http://www.w3.org/2000/svg">`
    i = 0;
    ti = .2
    height = 3;
    barHeight = 2
    // y_adjust_offset = - .7;
    // line_offset = -3.25;
    y_adjust_offset = - .7;
    y_adjust_offset_down = 5;
    line_offset = -3.2;
    

html += `
        <text x="1" y  = "0" class="header" dominant-baseline="hanging">Primary Use</text>
        <text x="70" y  = "0" class="header" dominant-baseline="hanging">Total Buildings</text>
        <text x="101" y  = "0" class="header" dominant-baseline="hanging">Area (ft²)</text>
        <text x="137" y  = "0" class="header" dominant-baseline="hanging">Participation</text>
        
        
        `

    groupByCatCnt.forEach(e => {
         //console.log(groupByCatSizeChartCnt)
        size = groupByCatSizeChartCnt.filter(x=>x.primary_us === e.primary_us);
        participating = groupByParticipating.filter(x=>x.primary_us === e.primary_us);
        if (participating.length) {
           partCountWidth = participating[0].cnt; 
        } else { 
            partCountWidth = 0;
         }
        w = e.cnt/25 
        html += 
            `
            <rect x="80"  y= "${y_adjust_offset_down + (i  * height) - y_adjust_offset }" width="${w}" height = "${barHeight}"/>
            <text x="1"   y= "${y_adjust_offset_down + (ti * height)}" class="small" dominant-baseline="hanging">${e.primary_us}</text>
            <text x="70"  y= "${y_adjust_offset_down + (ti * height)}" class="small" dominant-baseline="hanging">${e.cnt}</text>
            
            <text x="101"  y= "${y_adjust_offset_down + (ti * height)}" class="small" dominant-baseline="hanging">${(size[0].cnt).toLocaleString()}</text>
            <rect x="118"  y= "${y_adjust_offset_down + (i  * height) - y_adjust_offset }" width="${size[0].cnt/4500000}" height = "${barHeight}"/>
                                        
            <text x="137" y  = "${y_adjust_offset_down + (ti * height)}" class="small" dominant-baseline="hanging">${partCountWidth}</text>
            <rect x="143" y  = "${y_adjust_offset_down + (i  * height) - y_adjust_offset }" width="${partCountWidth/5}" height = "${barHeight}"/>

            <line x1="0"  y1 = "${y_adjust_offset_down + (i* height)-line_offset}" y2="${y_adjust_offset_down+(i* height)-line_offset}" x2="158" stroke="black" />

            `
        i++
        ti ++
    });
    html += `</svg> `
    return html
};


const participatingChart = () => {
    // primary use grouped by count
    groupByParticipating = obdJson
        .filter(x => x.compliance === 'Participating')
        .reduce((a, c) => {
            i = a.findIndex(x => (x.primary_us === c.primary_us));
            (i >= 0) ? a[i].cnt = ++a[i].cnt : a.push({ 'primary_us': c['primary_us'], 'cnt': 1 });
            return a
        }, [])
        .sort((a, b) => b.cnt - a.cnt)
};

const sizeChart = () => {
    // primary use grouped by count
    groupByCatSizeChartCnt = obdJson
        .reduce((a, c) => {
            i = a.findIndex(x => x.primary_us === c.primary_us);
            (i >= 0) ? a[i].cnt +=  parseFloat(c.building_s) : a.push({ 'primary_us': c['primary_us'], 'cnt': parseFloat(c.building_s) });
            return a
        }, [])
        .sort((a, b) => b.cnt - a.cnt)
};


const tGE_v = () => {
    return obdJson.filter(x => x.total_annu !== null).reduce((acc, cur) => {
        if (typeof parseFloat(cur.total_annu) === 'number') {
            return (acc + parseFloat(cur.total_annu))
        }
    }, 0).toFixed(0);
};

const tEC_v = () => {
    return obdJson.filter(x => x.site_energ !== null).reduce((acc, cur) => {
        if (typeof parseFloat(cur.site_energ) === 'number') {
            return (acc + parseFloat(cur.site_energ))
        }
    }, 0).toFixed(0);
};

const tGFAC_v = () => {
    return obdJson.filter(x => x.building_s !== null).reduce((acc, cur) => {
        if (typeof parseFloat(cur.building_s) === 'number') {
            return (acc + parseFloat(cur.building_s))
        }
    }, 0).toFixed(0);
};

const tBR_v = () => {
    return obdJson.length
};