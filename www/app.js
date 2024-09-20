var firstupdateData
var aod_differenceData
document.addEventListener('DOMContentLoaded', async function () {
    firstupdateData = await lastupdate_API();
    aod_differenceData = await aod_difference_API();

    leaflet_map();
    initDropdown();
    widget();
    button_wrapper();
});



const widget = async () => {

    try {
        var data = await firstupdateData;
        var data = await convert_remark(data)
        var data = await convert_date_format(data)
        var data_difference = await aod_differenceData;

        data.forEach(item => {

            console.log(item);
            const differenceData = data_difference.find(diff => diff.station === item.station);
            if (differenceData) {
                item.difference = differenceData.difference;
                item.percentage_difference = differenceData.percentage_difference;
            } else {
                item.difference = null;
                item.percentage_difference = null;
            }

            var st_rmutl = document.getElementById('st_rmutl');
            var st_engi = document.getElementById('st_engi');
            var st_maehia = document.getElementById('st_maehia');
            var st_uni = document.getElementById('st_uni');

            if (item.id == null && item.id == undefined) {
                item.aod = 'ㅡ';
                item.time = '';
                item.remarken = ''
                item.dateth = ''
            }


            let { station, remarken, aod, dateth, time, color, difference, percentage_difference } = item;

            if (typeof aod == 'number') {
                aod = Number(aod.toFixed(0));

            }

            if (typeof difference == 'number') {


                if (difference > 0) {
                    difference = '+' + Number(difference.toFixed(0));
                    item.diff_color = '#FF0303'
                    item.differenceIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
                    <path fill-rule="evenodd" d="M10 18a.75.75 0 0 1-.75-.75V4.66L7.3 6.76a.75.75 0 0 1-1.1-1.02l3.25-3.5a.75.75 0 0 1 1.1 0l3.25 3.5a.75.75 0 1 1-1.1 1.02l-1.95-2.1v12.59A.75.75 0 0 1 10 18Z" clip-rule="evenodd" />
                    </svg>

                    `;

                } else if (difference < 0) {
                    difference = Number(difference.toFixed(0));
                    item.diff_color = '#58E30E'
                    item.differenceIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
                    <path fill-rule="evenodd" d="M10 2a.75.75 0 0 1 .75.75v12.59l1.95-2.1a.75.75 0 1 1 1.1 1.02l-3.25 3.5a.75.75 0 0 1-1.1 0l-3.25-3.5a.75.75 0 1 1 1.1-1.02l1.95 2.1V2.75A.75.75 0 0 1 10 2Z" clip-rule="evenodd" />
                    </svg>

                    `;

                } else if (difference == 0) {
                    difference = Number(difference.toFixed(0));
                    item.diff_color = '#000000b5'
                    item.differenceIcon = ' '

                }




                else {
                    item.difference = '';
                    item.diff_color = '#FFFFFF';

                }

            } else {
                item.difference = '';
                item.diff_color = '#FFFFFF';
            }

            if (typeof percentage_difference == 'number') {
                percentage_difference = Number(percentage_difference.toFixed(0));

            } else {
                percentage_difference = ' ';

            }


            if (station == 106) {

                if (typeof aod == 'number' && typeof aod !== undefined) {
                    gauge_rmutl(aod)
                }


                st_rmutl.innerHTML = `
                <div class="status" style="background-color: ${color};">${remarken}</div>
                <div class="aqi-value" style="color: ${color}">${aod}</div>
                <div class="percentage" style="color: ${item.diff_color};">${item.differenceIcon} 
                <span style="margin-right: 0.5em;">${difference}</span> 
                <span>(${percentage_difference}%)</span></div>
                <div class="time">${dateth} ${time}</div>
                <div class="epa">RMUTL</div>
                `
            } else if (station == 2004) {

                if (typeof aod == 'number' && typeof aod !== undefined) {
                    gauge_engineering_cmu(aod)
                }

                st_engi.innerHTML = `
                <div class="status" style="background-color: ${color};">${remarken}</div>
                <div class="aqi-value" style="color: ${color}">${aod}</div>
                <div class="percentage" style="color: ${item.diff_color};">${item.differenceIcon} 
                <span style="margin-right: 0.5em;">${difference}</span> 
                <span>(${percentage_difference}%)</span></div>
                <div class="time">${dateth} ${time}</div>
                <div class="epa">Engineering CMU</div>
                `
            } else if (station == 6) {

                if (typeof aod == 'number' && typeof aod !== undefined) {
                    gauge_maehia_cmu(aod)
                }

                st_maehia.innerHTML = `
                <div class="status" style="background-color: ${color};">${remarken}</div>
                <div class="aqi-value" style="color: ${color}">${aod}</div>
                <div class="percentage" style="color: ${item.diff_color};">${item.differenceIcon} 
                <span style="margin-right: 0.5em;">${difference}</span> 
                <span>(${percentage_difference}%)</span></div>
                <div class="time">${dateth} ${time}</div>
                <div class="epa">Maehia CMU</div>
                `
            } else if (station == 4439) {

                if (typeof aod == 'number' && typeof aod !== undefined) {
                    gauge_uniserv_cmu(aod)
                }

                st_uni.innerHTML = `
                <div class="status" style="background-color: ${color};">${remarken}</div>
                <div class="aqi-value" style="color: ${color}">${aod}</div>
                <div class="percentage" style="color: ${item.diff_color};">${item.differenceIcon} 
                <span style="margin-right: 0.5em;">${difference}</span> 
                <span>(${percentage_difference}%)</span></div>
                <div class="time">${dateth} ${time}</div>
                <div class="epa">Uniserv CMU</div>
                `
            }


        });

    } catch (error) {
        console.error('Error fetching data:', error);
    }


}








const gauge_rmutl = async (data) => {

    let aod = data;

    let color;
    if (aod <= 50) {
        color = '#58e30e';
    } else if (aod >= 50 && aod <= 100) {
        color = '#FCDC2A';
    } else if (aod >= 101 && aod <= 150) {
        color = '#FF9800';
    } else if (aod >= 151 && aod <= 200) {
        color = '#FF0303';
    } else if (aod >= 201 && aod <= 300) {
        color = '#874CCC';
    } else if (aod >= 301) {
        color = '#8E3E63';
    }

    var gaugeChart = echarts.init(document.getElementById('gauge'));

    let option = {
        series: [
            {
                type: 'gauge',
                startAngle: 180,
                endAngle: 0,
                center: ['50%', '75%'],
                radius: '100%',
                min: 0,
                max: 320,
                splitNumber: 0,
                axisLine: {
                    lineStyle: {
                        width: 20,
                        color: [
                            [0.156, '#58e30e'],
                            [0.313, '#FCDC2A'],
                            [0.469, '#FF9800'],
                            [0.625, '#FF0303'],
                            [0.938, '#874CCC'],
                            [1, '#8E3E63']
                        ]
                    }
                },
                pointer: {
                    icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
                    length: '70%',
                    width: 9,
                    offsetCenter: [0, '5%'],
                    itemStyle: {
                        color: color
                    }
                },
                splitLine: {
                    length: 20,
                    lineStyle: {
                        width: 0,
                        color: 'auto'
                    }
                },
                axisLabel: {
                    show: false,
                    color: '#464646',
                    fontSize: 20,
                },
                title: {
                    offsetCenter: [0, '-10%'],
                    fontSize: 20
                },
                detail: {
                    fontSize: 0,
                    offsetCenter: [0, '-35%'],
                    valueAnimation: true,
                    color: 'inherit'
                },
                data: [
                    {
                        value: aod
                    }
                ]
            }
        ]
    };

    gaugeChart.setOption(option);
    window.addEventListener('resize', () => gaugeChart.resize());
}

const gauge_engineering_cmu = (data) => {

    let aod = data;

    let color;
    if (aod <= 50) {
        color = '#58e30e';
    } else if (aod >= 50 && aod <= 100) {
        color = '#FCDC2A';
    } else if (aod >= 101 && aod <= 150) {
        color = '#FF9800';
    } else if (aod >= 151 && aod <= 200) {
        color = '#FF0303';
    } else if (aod >= 201 && aod <= 300) {
        color = '#874CCC';
    } else if (aod >= 301) {
        color = '#8E3E63';
    }

    var gaugeChart = echarts.init(document.getElementById('gauge2'));

    let option = {
        series: [
            {
                type: 'gauge',
                startAngle: 180,
                endAngle: 0,
                center: ['50%', '75%'],
                radius: '100%',
                min: 0,
                max: 320,
                splitNumber: 0,
                axisLine: {
                    lineStyle: {
                        width: 20,
                        color: [
                            [0.156, '#58e30e'],
                            [0.313, '#FCDC2A'],
                            [0.469, '#FF9800'],
                            [0.625, '#FF0303'],
                            [0.938, '#874CCC'],
                            [1, '#8E3E63']
                        ]
                    }
                },
                pointer: {
                    icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
                    length: '70%',
                    width: 9,
                    offsetCenter: [0, '5%'],
                    itemStyle: {
                        color: color
                    }
                },
                splitLine: {
                    length: 20,
                    lineStyle: {
                        width: 0,
                        color: 'auto'
                    }
                },
                axisLabel: {
                    show: false,
                    color: '#464646',
                    fontSize: 20,
                },
                title: {
                    offsetCenter: [0, '-10%'],
                    fontSize: 20
                },
                detail: {
                    fontSize: 0,
                    offsetCenter: [0, '-35%'],
                    valueAnimation: true,
                    color: 'inherit'
                },
                data: [
                    {
                        value: aod
                    }
                ]
            }
        ]
    };

    gaugeChart.setOption(option);
    window.addEventListener('resize', () => gaugeChart.resize());
}

// const gauge_maehia_cmu = (data) => {
//     console.log(data);
//     let aod = data;
//     var gaugeChart = echarts.init(document.getElementById('gauge3'));

//     option = {
//         series: [
//             {
//                 type: 'gauge',
//                 startAngle: 180,
//                 endAngle: 0,
//                 center: ['50%', '75%'],
//                 radius: '100%',
//                 min: 0,
//                 max: 310,
//                 splitNumber: 0,
//                 axisLine: {
//                     lineStyle: {
//                         width: 20,
//                         color: [
//                             [0.15, '#58e30e'],
//                             [0.30, '#FCDC2A'],
//                             [0.45, '#FF9800'],
//                             [0.60, '#FF0303'],
//                             [0.90, '#874CCC'],
//                             [1, '#8E3E63']
//                         ]
//                     }
//                 },
//                 pointer: {
//                     icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
//                     length: '70%',
//                     width: 9,
//                     offsetCenter: [0, '5%'],
//                     itemStyle: {
//                         color: 'auto'
//                     }
//                 },

//                 splitLine: {
//                     length: 20,
//                     // lineStyle: {
//                     //     color: 'auto',
//                     //     width: 0
//                     // }
//                     lineStyle: {
//                         width: 0,
//                         color: [
//                             [0.16, '#58e30e'],
//                             [0.33, '#FCDC2A'],
//                             [0.49, '#FF9800'],
//                             [0.66, '#FF0303'],
//                             [0.99, '#874CCC'],
//                             [1.00, '#8E3E63']
//                         ]
//                     }
//                 },
//                 axisLabel: {
//                     show: false,
//                     color: '#464646',
//                     fontSize: 20,
//                 },
//                 title: {
//                     offsetCenter: [0, '-10%'],
//                     fontSize: 20
//                 },
//                 detail: {
//                     fontSize: 0,   // number
//                     offsetCenter: [0, '-35%'],
//                     valueAnimation: true,
//                     color: 'inherit'
//                 },
//                 data: [
//                     {
//                         value: `${aod}`,
//                         // value: `120`,
//                     }
//                 ]
//             }
//         ]
//     };

//     gaugeChart.setOption(option);
//     window.addEventListener('resize', () => gaugeChart.resize());
// }
const gauge_maehia_cmu = (data) => {

    let aod = data;

    let color;
    if (aod <= 50) {
        color = '#58e30e';
    } else if (aod >= 50 && aod <= 100) {
        color = '#FCDC2A';
    } else if (aod >= 101 && aod <= 150) {
        color = '#FF9800';
    } else if (aod >= 151 && aod <= 200) {
        color = '#FF0303';
    } else if (aod >= 201 && aod <= 300) {
        color = '#874CCC';
    } else if (aod >= 301) {
        color = '#8E3E63';
    }

    var gaugeChart = echarts.init(document.getElementById('gauge3'));

    let option = {
        series: [
            {
                type: 'gauge',
                startAngle: 180,
                endAngle: 0,
                center: ['50%', '75%'],
                radius: '100%',
                min: 0,
                max: 320,
                splitNumber: 0,
                axisLine: {
                    lineStyle: {
                        width: 20,
                        color: [
                            [0.156, '#58e30e'],
                            [0.313, '#FCDC2A'],
                            [0.469, '#FF9800'],
                            [0.625, '#FF0303'],
                            [0.938, '#874CCC'],
                            [1, '#8E3E63']
                        ]
                    }
                },
                pointer: {
                    icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
                    length: '70%',
                    width: 9,
                    offsetCenter: [0, '5%'],
                    itemStyle: {
                        color: color
                    }
                },
                splitLine: {
                    length: 20,
                    lineStyle: {
                        width: 0,
                        color: 'auto'
                    }
                },
                axisLabel: {
                    show: false,
                    color: '#464646',
                    fontSize: 20,
                },
                title: {
                    offsetCenter: [0, '-10%'],
                    fontSize: 20
                },
                detail: {
                    fontSize: 0,
                    offsetCenter: [0, '-35%'],
                    valueAnimation: true,
                    color: 'inherit'
                },
                data: [
                    {
                        value: aod
                    }
                ]
            }
        ]
    };

    gaugeChart.setOption(option);
    window.addEventListener('resize', () => gaugeChart.resize());
}





const gauge_uniserv_cmu = (data) => {


    let aod = data;

    let color;
    if (aod <= 50) {
        color = '#58e30e';
    } else if (aod >= 50 && aod <= 100) {
        color = '#FCDC2A';
    } else if (aod >= 101 && aod <= 150) {
        color = '#FF9800';
    } else if (aod >= 151 && aod <= 200) {
        color = '#FF0303';
    } else if (aod >= 201 && aod <= 300) {
        color = '#874CCC';
    } else if (aod >= 301) {
        color = '#8E3E63';
    }

    var gaugeChart = echarts.init(document.getElementById('gauge4'));

    let option = {
        series: [
            {
                type: 'gauge',
                startAngle: 180,
                endAngle: 0,
                center: ['50%', '75%'],
                radius: '100%',
                min: 0,
                max: 320,
                splitNumber: 0,
                axisLine: {
                    lineStyle: {
                        width: 20,
                        color: [
                            [0.156, '#58e30e'],
                            [0.313, '#FCDC2A'],
                            [0.469, '#FF9800'],
                            [0.625, '#FF0303'],
                            [0.938, '#874CCC'],
                            [1, '#8E3E63']
                        ]
                    }
                },
                pointer: {
                    icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
                    length: '70%',
                    width: 9,
                    offsetCenter: [0, '5%'],
                    itemStyle: {
                        color: color
                    }
                },
                splitLine: {
                    length: 20,
                    lineStyle: {
                        width: 0,
                        color: 'auto'
                    }
                },
                axisLabel: {
                    show: false,
                    color: '#464646',
                    fontSize: 20,
                },
                title: {
                    offsetCenter: [0, '-10%'],
                    fontSize: 20
                },
                detail: {
                    fontSize: 0,
                    offsetCenter: [0, '-35%'],
                    valueAnimation: true,
                    color: 'inherit'
                },
                data: [
                    {
                        value: aod
                    }
                ]
            }
        ]
    };

    gaugeChart.setOption(option);
    window.addEventListener('resize', () => gaugeChart.resize());
}






const leaflet_map = async () => {
    let data = firstupdateData;
    await convert_remark(data);


    let carto = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20
    });

    let Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        {
            attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
            maxZoom: 16
        });
    // 

    var map = L.map('map', {
        center: [18.787800966579614, 98.94813765422506],
        zoom: 13,
        zoomControl: true,
        doubleClickZoom: true,
        scrollWheelZoom: true,
        boxZoom: true,
        keyboard: true,
        dragging: true,
        touchZoom: 'true',
        layers: [carto],
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: 'topleft'
        }
    });



    let markers = [];

    const markerData = [
        { position: [18.795739594690353, 98.9530624508629], stationId: 2004, nameTH: 'คณะวิศวกรรมศาสตร์ มหาวิทยาลัยเชียงใหม่', nameEN: 'Faculty of Engineering Chiang Mai University.' },
        { position: [18.809792610881917, 98.95671263406584], stationId: 106, nameTH: 'มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา', nameEN: 'Rajamangala University of Technology Lanna Nan.' },
        { position: [18.79417009002368, 98.9667513685618], stationId: 4439, nameTH: 'สำนักบริการวิชาการ มหาวิทยาลัยเชียงใหม่', nameEN: 'Uniserv Chiang Mai University.' },
        { position: [18.76139615376945, 98.93185143728131], stationId: 6, nameTH: 'มหาวิทยาลัยเชียงใหม่ (แม่เหียะ)', nameEN: 'Chiang Mai University (Maehia)' }
    ];

    markerData.forEach(dataItem => {
        let obj = firstupdateData.find(i => i.station === dataItem.stationId);
        let color = obj ? obj.color : '#ffffff00';
        let aod = obj ? obj.aod : '';

        let customIcon;

        if (typeof aod == 'number') {
            aod = aod.toFixed(0);
            customIcon = L.divIcon({
                className: '',
                html: `
                <div class="bg-marker" style="--background-color: ${color}30;">
                    <div class="marker">
                        <div class="dot" style="background-color: ${color}; box-shadow: 0px 0px 10px ${color}80;"></div>
                        <span style=" color: #000000f5;">${aod}</span>
                    </div>
                </div>
                `,
                iconSize: [0, 0],
            });
        } else {
            customIcon = L.divIcon({
                className: '',
                html: `
                `,
                iconSize: [0, 0],
            });
        }

        let marker = L.marker(dataItem.position, { icon: customIcon })
            .addTo(map)
            .on('click', (e) => {
                try {
                    if (obj) {
                        obj.stationth = dataItem.nameTH;
                        obj.stationen = dataItem.nameEN;
                        // console.log(obj);
                        displayCard([obj]);
                    }
                } catch (error) {
                    console.log(error);
                }
            });

        markers.push(marker);
    });

    var cities = L.layerGroup(markers).addTo(map);


    var baseMaps = {
        "Carto": carto,
        "<span style='color: black'>Esri_WorldGrayCanvas</span>": Esri_WorldGrayCanvas
    };

    var overlayMaps = {
        "กล้อง CCTV": cities
    };

    L.control.layers(baseMaps, overlayMaps).addTo(map);
};







const showLoadingScreen = () => {
    document.getElementById('loading-screen').style.display = 'flex';
    setTimeout(hideLoadingScreen, 1000);

}
const hideLoadingScreen = () => {
    document.getElementById('loading-screen').style.display = 'none';
}


window.addEventListener('load', function () {
    showLoadingScreen();
});



const initDropdown = () => {
    const toggleButton = document.getElementById('dropdown-toggle');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const iconPath = document.getElementById('icon-path');

    toggleButton.addEventListener('click', function (event) {
        event.stopPropagation();
        dropdownMenu.classList.toggle('hidden');
        if (dropdownMenu.classList.contains('hidden')) {
            iconPath.setAttribute('d', 'M4 6h16M4 12h16M4 18h16'); // Open icon
        } else {
            iconPath.setAttribute('d', 'M6 18 18 6M6 6l12 12'); // Close icon (X)
        }
    });

    document.addEventListener('click', function (event) {
        if (!dropdownMenu.contains(event.target) && !toggleButton.contains(event.target)) {
            dropdownMenu.classList.add('hidden');
            iconPath.setAttribute('d', 'M4 6h16M4 12h16M4 18h16'); // Reset to open icon
        }
    });
}


const lastupdate_API = async () => {
    const stations = [6, 106, 2004, 4439];
    try {
        const requests = stations.map(station => {
            const url = `http://localhost:3000/api/aod/lastupdate/${station}`;
            return axios.get(url)
                .then(res => {
                    return res.data;
                })
                .catch(error => {
                    if (error.response && error.response.status === 404) {
                        console.log(`Station ${station} = Error`);
                        return {
                            id: null,
                            station: station,
                            date: null,
                            time: null,
                            image_name: null,
                            aod: null
                        };
                    } else {
                        console.error(`Error fetching data for station ${station}:`, error);
                        return null;
                    }
                });
        });

        const results = await Promise.all(requests);
        return results

    } catch (error) {
        console.error("Error in fetching data:", error);
    }
};

const aod_difference_API = async () => {
    const stations = [6, 106, 2004, 4439];
    try {
        const requests = stations.map(station => {
            const url = `http://localhost:3000/api/aod/difference/${station}`;
            return axios.get(url)
                .then(res => {
                    return res.data;
                })
                .catch(error => {
                    if (error.response && error.response.status === 404) {
                        console.log(`Station ${station} = Error`);
                        return {
                            station: station,
                            difference: null,
                            percentage_difference: null
                        };
                    } else {
                        console.error(`Error fetching data for station ${station}:`, error);
                        return null;
                    }
                });
        });

        const results = await Promise.all(requests);
        return results

    } catch (error) {
        console.error("Error in fetching data:", error);
    }
};





const convert_date_format = async (data) => {
    try {
        if (Array.isArray(data)) {
            data.forEach(item => {
                if (item.date !== null && item.date !== undefined) {
                    let date = new Date(item.date);
                    let formattedDate = date.toLocaleDateString('th-TH');
                    item.dateth = formattedDate;
                } else {
                    item.dateth = null;
                }
            });
            return data;
        } else {
            console.error("Input data is not an array");
            return [];
        }
    } catch (error) {
        console.error("Error processing data:", error);
        return [];
    }
};



const convert_remark = async (data) => {
    try {
        if (Array.isArray(data)) {
            data.forEach(item => {
                if (item.aod !== null && item.aod !== undefined) {

                    let aod = item.aod

                    if (aod < 50) {
                        item.remarken = 'Good';
                        item.remarkth = 'คุณภาพอากาศดีมาก';
                        item.color = '#58e30e';

                    } else if (aod >= 50 && aod < 100) {
                        item.remarken = 'Moderate';
                        item.remarkth = 'คุณภาพอากาศปานกลาง';
                        item.color = '#FCDC2A';

                    } else if (aod >= 100 && aod < 150) {
                        item.remarken = 'Unhealthy for Sensitive Groups';
                        item.remarkth = 'เริ่มส่งผลกระทบต่อกลุ่มเสี่ยง';
                        item.color = '#FF9800';

                    } else if (aod >= 150 && aod < 200) {
                        item.remarken = 'Unhealthy';
                        item.remarkth = 'ส่งผลกระทบต่อสุขภาพ';
                        item.color = '#FF0303';

                    } else if (aod >= 200 && aod < 300) {
                        item.remarken = 'Very Unhealthy';
                        item.remarkth = 'ส่งผลกระทบต่อสุขภาพอย่างมาก';
                        item.color = '#874CCC';

                    } else if (aod >= 300) {
                        item.remarken = 'Hazardous';
                        item.remarkth = 'อันตราย';
                        item.color = '#8E3E63';

                    }

                } else {
                    item.remarken = null;
                    item.remarkth = null;
                    item.color = '#FFFFFF';
                }
            });
            return data;

        } else {
            console.error("Input data is not an array");
            return [];
        }
    } catch (error) {
        console.error("Error processing data:", error);
        return [];
    }
};



const displayCard = async (data) => {

    try {

        console.log(data);
        console.log(typeof data[0].station);

        document.getElementById('my_modal_7').checked = true;
        var modal_content = document.getElementById('modal-content');

        if (data[0]['id'] == null || data[0]['id'] == undefined) {
            modal_content.innerHTML = ``;
        }

        if (data[0]['id'] !== null || data[0]['id'] !== undefined) {
            console.log(data[0]);


            difference = data[0].difference;
            percentage_difference = data[0].percentage_difference;

            if (typeof percentage_difference == 'number') {
                percentage_difference = Number(percentage_difference.toFixed(2))
            }

            if (typeof difference == 'number') {

                if (difference > 0) {
                    percentage_difference = '+' + Number(difference.toFixed(2));

                } else if (difference < 0) {
                    percentage_difference = Number(difference.toFixed(2));
                }

            } else {
                percentage_difference = ' ';
            }

            station = data[0].station
            day = data[0].date.split('-')[2];
            month = filter_month(data).month;
            year = filter_year(data).year;
            stationth = data[0].stationth;
            stationen = data[0].stationen;
            dateth = data[0].dateth;
            time = data[0].time;
            aod = data[0].aod;
            color = data[0].color
            remarkth = data[0].remarkth;
            image_name = data[0].image_name;
            image_url = `https://www-old.cmuccdc.org/uploads/cam/${image_name}`;

            if (typeof aod == 'number') {
                aod = aod.toFixed(0)
            }


            if (typeof station == 'number') {

                if (station == 106) {
                    information = './rmutl/index.html'

                } else if (station == 2004) {
                    information = './eng/index.html'

                } else if (station == 6) {
                    information = './maehia/index.html'

                } else if (station == 4439) {
                    information = './uniserv/index.html'

                }
            }


            modal_content.innerHTML = `
            <img src="${image_url}" alt="" />
                <div class="modal-header">${stationth} <br>
                    ${stationen}
                </div>
                <div class="modal-value" style="color: ${color};">${aod}</div>
                <div class="modal-desc-remark" style="color: ${color};">${remarkth}</div>
                <div class="modal-datetime">${dateth} ${time} น.</div>
                <div class="modal-desc-aod">Aerosol Optical Depth (AOD)</div>
                <div class="modal-btn-container">
                    <a href="${information}" class="btn modal-btn" target="_blank" rel="noopener noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                        </svg>
                        Information
                    </a>
                </div>


    
            `;











        }











    } catch (error) {





    }
}







// document.getElementById('close-card').addEventListener('click', function () {
//     document.getElementById('info-card').classList.add('hidden');
//     document.body.classList.remove('blur-background');
// });

// const displayCard = (data) => {

//     var card = document.getElementById('info-card');
//     var card_content = document.getElementById('card-content');

//     if (data[0]['id'] == null) {
//         card_content.innerHTML = ``;
//         card.classList.remove('hidden');
//         document.body.classList.add('blur-background');


//     } else {

//         console.log(data[0]);

//         difference = data[0].difference;
//         percentage_difference = data[0].percentage_difference;


//         if (typeof percentage_difference == 'number') {
//             percentage_difference = Number(percentage_difference.toFixed(2))
//         }

//         if (typeof difference == 'number') {

//             if (difference > 0) {
//                 percentage_difference = '+' + Number(difference.toFixed(2));

//             } else if (difference < 0) {
//                 percentage_difference = Number(difference.toFixed(2));
//             }

//         } else {
//             percentage_difference = ' ';
//         }

//         day = data[0].date.split('-')[2];
//         month = filter_month(data).month;
//         year = filter_year(data).year;
//         stationth = data[0].stationth;
//         stationen = data[0].stationen;
//         date = data[0].date;
//         time = data[0].time;
//         aod = data[0].aod;
//         image_name = data[0].image_name;
//         image_url = `https://www-old.cmuccdc.org/uploads/cam/${image_name}`;


//         card_content.innerHTML = `
//             <img src="${image_url}" alt="" />

//             <div class="card-text-header">
//                 ${stationth} <br> ${stationen}
//             </div>

//             <div class="card-text">
//                 <b>วันที่:</b> ${day} ${month} ${year} <b>เวลา:</b> ${time} น.

//                     <div class="card-percentage"><b>ค่าฝุ่นละอองลอย: </b>  ${aod.toFixed(0)} (${percentage_difference}%)
//                     </div>

//             </div>



//     `;

//         // card_content.innerHTML = `

//         //                 <img src="${image_url}" alt="${image_name}" class="card-image"/>


//         //                 <div class="card-text">
//         //                     <div class="card-text-header">
//         //                       ${stationth} <br> ${stationen}
//         //                     </div>

//         //                     <div class="card-text-desc">
//         //                         <p> <b>วันที่:</b> ${day} ${month} ${year} <b>เวลา:</b> ${time} น.</p>

//         //                         <div class="card-percentage">
//         //                     <b>ค่าฝุ่นละอองลอย: </b>   ${aod.toFixed(0)} ${difference} (${percentage_difference}%)
//         //                         </div>
//         //                         </p>
//         //                     </div>
//         //                 </div>
//         //             `;


//         card.classList.remove('hidden');
//         document.body.classList.add('blur-background');
//     }
// }







const filter_month = (data) => {
    data_number = data[0].date.split('-')[1]

    if (data_number === '01') {
        return ({ 'month': 'มกราคม' })

    } else if (data_number === '02') {
        return ({ 'month': 'กุมภาพันธ์' })

    } else if (data_number === '03') {
        return ({ 'month': 'มีนาคม' })

    } else if (data_number === '04') {
        return ({ 'month': 'เมษายน  ' })

    } else if (data_number === '05') {
        return ({ 'month': 'พฤษภาคม' })

    } else if (data_number === '06') {
        return ({ 'month': 'มิถุนายน' })

    } else if (data_number === '07') {
        return ({ 'month': 'กรกฎาคม' })

    } else if (data_number === '08') {
        return ({ 'month': 'สิงหาคม' })

    } else if (data_number === '09') {
        return ({ 'month': 'กันยายน' })

    } else if (data_number === '10') {
        return ({ 'month': 'ตุลาคม' })

    } else if (data_number === '11') {
        return ({ 'month': 'พฤศจิกายน' })

    } else if (data_number === '12') {
        return ({ 'month': 'ธันวาคม' })
    }
};


const filter_year = (data) => {

    let data_year = data[0].date.split('-')[0];
    let year = parseInt(data_year, 10) + 543;

    return { 'year': year };
}




const updateProgressCircle = () => {
    const progressCircle = document.querySelector('.custom-progress-circle');
    const scrollTop = window.scrollY || window.pageYOffset;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollHeight = documentHeight - windowHeight;

    if (scrollHeight > 0) {
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        // Update gradient with scroll percentage
        const gradient = `conic-gradient(#7ec1ff ${scrollPercent}%, transparent ${scrollPercent}% 100%)`;
        progressCircle.style.background = gradient;
    }
};

const button_wrapper = () => {
    const mainButton = document.getElementById("main-button");
    const childButtons = document.getElementById("child-buttons");
    const topButton = document.querySelector(".btn-top");
    const customProgressWrap = document.querySelector(".custom-progress-wrap");

    mainButton.addEventListener("click", () => {
        childButtons.classList.toggle("show");
        customProgressWrap.classList.toggle("show");
    });

    topButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

// Initialize progress circle update
window.addEventListener('scroll', updateProgressCircle);
window.addEventListener('load', updateProgressCircle);





// const createPulseIcon = async () => {
//     L.Icon.Pulse = L.DivIcon.extend({
//         options: {
//             className: '',
//             animate: true,
//             heartbeat: 1,
//             aod: ''
//         },

//         initialize: function (options) {
//             L.setOptions(this, options);

//             var uniqueClassName = 'lpi-' + new Date().getTime() + '-' + Math.round(Math.random() * 100000);

//             console.log(this.options);

//             var fillColor = this.options.fillColor;
//             var rgbaColor = fillColor.replace('rgb', 'rgba').replace(')', ', 0.6)');
//             var before = [
//                 'background: radial-gradient(circle, ' + fillColor + ' 51%, ' + rgbaColor + ')',
//                 'background-size: cover',
//                 'box-shadow: 1px 1px 8px 0px ' + fillColor,
//                 'position: relative;',



//             ];

//             var after = [
//                 'box-shadow: 0 0 5px 1px ' + this.options.fillColor,
//                 'animation: pulsate ' + this.options.heartbeat + 's ease-out',
//                 'animation-iteration-count: infinite',
//                 'animation-delay: ' + (this.options.heartbeat + .1) + 's',




//             ];

//             if (!this.options.animate) {
//                 after.push('animation: none');
//                 after.push('box-shadow:none');
//             }

//             var css = [
//                 '.' + uniqueClassName + '{' + before.join(';') + ';}',
//                 '.' + uniqueClassName + ':after{' + after.join(';') + ';}',
//             ].join('');

//             var el = document.createElement('style');
//             if (el.styleSheet) {
//                 el.styleSheet.cssText = css;
//             } else {
//                 el.appendChild(document.createTextNode(css));
//             }

//             document.getElementsByTagName('head')[0].appendChild(el);

//             this.options.className = this.options.className + ' leaflet-pulsing-icon ' + uniqueClassName;

//             L.DivIcon.prototype.initialize.call(this, options);
//         }
//     });

//     L.icon.pulse = function (options) {
//         return new L.Icon.Pulse(options);
//     };

//     L.Marker.Pulse = L.Marker.extend({
//         initialize: function (latlng, options) {
//             options.icon = L.icon.pulse(options);
//             L.Marker.prototype.initialize.call(this, latlng, options);
//         }
//     });

//     L.marker.pulse = function (latlng, options) {
//         return new L.Marker.Pulse(latlng, options);
//     };
// };










// const widget = async () => {
//     try {
//         var data = await lastupdate_API();
//         var data = await convert_date_format(data)
//         var data = await convert_remark(data)

//         // console.log(data);

//         data.forEach(item => {
//             // console.log(item);

//             var st_rmutl = document.getElementById('st_rmutl');
//             var st_engi = document.getElementById('st_engi');
//             var st_maehia = document.getElementById('st_maehia');
//             var st_uni = document.getElementById('st_uni');

//             if (item.id == null && item.id == undefined) {
//                 item.aod = '';
//                 item.time = '';
//                 item.remarken = 'No data'
//                 item.dateth = ''
//             }

//             var { time, station, aod, remarken, dateth } = item;


//             if (typeof aod == 'number') {
//                 aod = aod.toFixed(0)
//             }

//             if (station == 6) {
//                 st_maehia.innerHTML = `
//                         <div class="l">
//                             <div class="stat-title">${remarken}</div>
//                             <div class="stat-desc">${dateth} ${time}<br>ST: Maehia CMU</div>
//                         </div>
//                         <div class="r">
//                             <div class="stat-value">${aod}</div>
//                         </div>
//                     `;
//             } else if (station == 106) {
//                 st_rmutl.innerHTML = `
//                         <div class="l">
//                             <div class="stat-title">${remarken}</div>
//                             <div class="stat-desc">${dateth} ${time}<br>ST: Maehia CMU</div>
//                         </div>
//                         <div class="r">
//                             <div class="stat-value">${aod}</div>
//                         </div>
//                     `;
//             } else if (station == 2004) {
//                 st_engi.innerHTML = `
//                         <div class="l">
//                             <div class="stat-title">${remarken}</div>
//                             <div class="stat-desc">${dateth} ${time}<br>ST: Maehia CMU</div>
//                         </div>
//                         <div class="r">
//                             <div class="stat-value">${aod}</div>
//                         </div>
//                     `;
//             } else if (station == 4439) {
//                 st_uni.innerHTML = `
//                         <div class="l">
//                             <div class="stat-title">${remarken}</div>
//                             <div class="stat-desc">${dateth} ${time}<br>ST: Maehia CMU</div>
//                         </div>
//                         <div class="r">
//                             <div class="stat-value">${aod}</div>
//                         </div>
//                     `;
//             }
//         });

//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// }

