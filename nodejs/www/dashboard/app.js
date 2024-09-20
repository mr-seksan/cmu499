const { DatePicker, Space, Button, Checkbox } = antd;
const { useState } = React;
const { RangePicker } = DatePicker;


var firstupdateData
var aod_differenceData
var data_all_station_API



document.addEventListener('DOMContentLoaded', async function () {
    firstupdateData = await lastupdate_API();
    aod_differenceData = await aod_difference_API();

    dateobj = { 'datestart': '2024-04-01' }
    // let data = await all_station_API(dateobj)
    // console.log(data);

    await all_station_API(dateobj)
    console.log(data_all_station_API);
    chart_hour(data_all_station_API)

    // let data = await aod_hour_API(dateobj)
    // chart_hour(data)

    initDropdown();
    button_wrapper();

    datePicker_chart_hour()
    // chart_circle()   

    widget();
});




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



// const aod_hour_API = async (date) => {

//     if (typeof date === 'string') {
//         date = date;
//     } else {
//         // date = checkdate();
//         date = '2024-01-31';
//     }

//     try {
//         const station = 106;
//         const url = `http://localhost:3000/api/select/${date}/${station}`;
//         const response = await axios.get(url);

//         if (response.status === 200) {
//             const resultAPI = response.data
//             convert_month(resultAPI)
//             convert_yearth(resultAPI)
//             convert_remark(resultAPI)

//             data_all_station_API = resultAPI;

//             return resultAPI;
//         }

//     } catch (error) {

//         let nulldata = empty_hour();
//         data_all_station_API = nulldata;

//         return nulldata;
//     }
// }






const all_station_API = async (dateobj) => {
    // console.log(dateobj);

    const { datestart } = dateobj;

    try {
        const url = `http://localhost:3000/api/aod/hour/allstation/${datestart}`;

        const response = await axios.get(url);

        if (response.status === 200) {

            data_all_station_API = response.data;
            return data_all_station_API;
        }

    } catch (error) {
        console.error("Error fetching data:", error);
        return nulldata;
    }
}








// ---------------------------------  convert_month  --------------------------------- //
const convert_month = async (data) => {

    try {
        if (Array.isArray(data)) {
            data.forEach(item => {

                if (item.date !== null && item.date !== undefined) {
                    let month = item.date.split('-')[1];

                    if (month === '01') {
                        return item.month = 'มกราคม'

                    } else if (month === '02') {
                        return item.month = 'กุมภาพันธ์'

                    } else if (month === '03') {
                        return item.month = 'มีนาคม'

                    } else if (month === '04') {
                        return item.month = 'เมษายน'

                    } else if (month === '05') {
                        return item.month = 'พฤษภาคม'

                    } else if (month === '06') {
                        return item.month = 'มิถุนายน'

                    } else if (month === '07') {
                        return item.month = 'กรกฎาคม'

                    } else if (month === '08') {
                        return item.month = 'สิงหาคม'

                    } else if (month === '09') {
                        return item.month = 'กันยายน'

                    } else if (month === '10') {
                        return item.month = 'ตุลาคม'

                    } else if (month === '11') {
                        return item.month = 'พฤศจิกายน'

                    } else if (month === '12') {
                        return item.month = 'ธันวาคม'
                    }
                    return data
                }
            });

        } else {
            console.error("Input data is not an array or object");
            return data;

        }

    } catch (error) {
        console.error("Error", error);
        return data;
    }

};

// ---------------------------------  convert_yearth  --------------------------------- //
const convert_yearth = async (data) => {

    try {

        data.forEach(item => {

            let year = item.date.split('-')[0];
            let yearth = parseInt(year, 10) + 543;
            result = item.yearth = yearth;
            return result;

        })

    } catch (error) {
        console.error("Error", error);
        return data;
    }
}

// ---------------------------------  empty  --------------------------------- //
const empty_hour = () => {
    let station = 106;
    let data = [];
    let date = checkdate();
    let hr = checkHour();

    for (let hour = 6; hour <= hr; hour++) {
        let time = hour.toString().padStart(2, '0') + ':00';
        data.push({ station: station, date: date, time: time, aod: Number(0), status: 'empty' });
    }
    return data
}


const checkdate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const format = `${year}-${month}-${day}`
    return format;
}



const checkHour = () => {
    const date = new Date();
    const hour = date.getHours();
    return hour;
}











// ----------------------------------- datepicker----------------------------------- //
let currentPosition = -1;
let dateFromDatepicker = null;
let buttonsDisabled = false;

const datepicker = async (date) => {
    console.log(date);


    try {

        let dateobj = { 'datestart': date }
        const aod_date = await all_station_API(dateobj);
        chart_hour(aod_date);
        // if (aod_date === null) {

        // } else {


        //     console.log(data_all_station_API);

        //     if (data_all_station_API && data_all_station_API.length > 0) {


        //         if (data_all_station_API[0].status === 'empty') {
        //             chart_hour(data_all_station_API);


        //         } else {
        //             chart_hour(data_all_station_API);

        //         }
        //     } else {
        //         console.error('globalData is empty or undefined');
        //     }

        // }


    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

const datePicker_chart_hour = () => {
    let dateobj = '';

    const onChange = (date, dateString) => {
        dateobj = dateString;
        checkAndSendToAPI();
    };

    const checkAndSendToAPI = async () => {
        const formattedDate = moment(dateobj, "YYYY-MM-DD");
        if (formattedDate.isValid()) {
            datepicker(formattedDate._i);
        }
    };

    const disabledDate = (current) => {
        return current && current > moment().endOf('day');
    };

    const App = () => (
        React.createElement(Space, { direction: "vertical", size: "large" },
            React.createElement(DatePicker, {
                onChange: onChange,
                format: "YYYY-MM-DD",
                placeholder: "วันที่",
                disabledDate: disabledDate
            })
        )
    );

    const App_checkbox_number = () => {
        const [checked, setChecked] = React.useState(true);

        const handleChange = (e) => {
            setChecked(e.target.checked);
            // console.log(`Checked = ${e.target.checked}`);
        };

        return React.createElement(Space, { direction: "vertical", size: "large" },
            React.createElement(Checkbox, { onChange: handleChange, checked: checked }, 'ค่าตัวเลข')
        );
    };

    const App_checkbox_max_min_avg = () => {
        const [checked, setChecked] = React.useState(true);

        const handleChange = (e) => {
            setChecked(e.target.checked);
            // console.log(`Checked = ${e.target.checked}`);
        };

        return React.createElement(Space, { direction: "vertical", size: "large" },
            React.createElement(Checkbox, { onChange: handleChange, checked: checked }, 'ค่าสถิติ')
        );
    };

    const App_checkbox_highlight = () => {
        const [checked, setChecked] = React.useState(true);

        const handleChange = (e) => {
            setChecked(e.target.checked);
            // console.log(`Checked = ${e.target.checked}`);
        };

        return React.createElement(Space, { direction: "vertical", size: "large" },
            React.createElement(Checkbox, { onChange: handleChange, checked: checked }, 'ไฮไลท์')
        );
    };


    ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));

    // ReactDOM.createRoot(document.getElementById('checkbox_chart_hour_aod')).render(React.createElement(App_checkbox_number));
    // ReactDOM.createRoot(document.getElementById('checkbox_chart_hour_max_min')).render(React.createElement(App_checkbox_max_min_avg));
    // ReactDOM.createRoot(document.getElementById('checkbox_chart_hour_checkbox_highlight')).render(React.createElement(App_checkbox_highlight));
};



const chart_hour = async (data) => {
    try {
        const chartElement = document.getElementById('chart_hour');
        const myChart = echarts.init(chartElement);

        // แผนที่รหัสสถานีไปยังชื่อสถานีและสี
        const stationProperties = {
            '106': { name: 'RMUTL', color: '#FC2947' },
            '2004': { name: 'Engineering CMU', color: '#615EFC' },
            '6': { name: 'Maehia CMU', color: '#38E54D' },
            '4439': { name: 'Uniserv CMU', color: '#F9E400' }
        };

        // สร้างชุด dateTime ที่ครอบคลุมทุกสถานี
        const allDateTimes = [...new Set(data.map(item => `${item.date} ${item.time}`))].sort((a, b) => new Date(a) - new Date(b));

        const stations = [...new Set(data.map(item => item.station))];
        const chartData = stations.map(station => ({
            station,
            data: allDateTimes.map(dateTime => {
                const record = data.find(item => `${item.date} ${item.time}` === dateTime && item.station === station);
                return {
                    dateTime,
                    time: dateTime.split(' ')[1], // แยกเวลาออกมา
                    aod: record ? parseFloat(record.aod).toFixed(2) : null // ถ้าไม่มีข้อมูลให้เป็น null
                };
            })
        }));

        const series = chartData.map(stationData => {
            const color = stationProperties[stationData.station]?.color || '#000'; // ใช้สีที่กำหนดไว้
            return {
                name: stationProperties[stationData.station]?.name || `Station ${stationData.station}`, // ใช้ชื่อสถานีแทนรหัส
                type: 'line',
                data: stationData.data.map(item => ({
                    value: item.aod,
                    dateTime: item.dateTime,
                    time: item.time // ใช้เวลาในแกน x
                })),
                smooth: false,
                symbolSize: 5,
                lineStyle: {
                    width: 2.5,
                    type: 'solid',
                    color: color,
                },
                itemStyle: {
                    color: color,
                },
                emphasis: { focus: 'series' },
                connectNulls: true,
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 0.0, [
                        {
                            offset: 0,
                            color: echarts.color.lift(color, 0)
                        },
                        {
                            offset: 1,
                            color: echarts.color.lift(color, 0.99)
                        }
                    ])
                }
            };
        });

        const option = {
            animationDuration: 2000,
            animationEasing: 'quadraticOut',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function (params) {
                    // เรียงลำดับ params ตามค่า value จากมากไปน้อย
                    const sortedParams = params.sort((a, b) => (b.value || 0) - (a.value || 0));
                    let result = `DateTime: ${params[0].data.dateTime}<br/>`;
                    sortedParams.forEach(param => {
                        const color = param.color;
                        const value = param.value !== null && param.value !== undefined ? param.value : '-';
                        result += `
                            <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${color};"></span>
                            ${param.seriesName}: 
                            <strong style="float: right; text-align: right; width: 60px; display: inline-block;">
                                ${value}
                            </strong><br/>
                        `;
                    });
                    return result;
                }
            },


            legend: {
                data: stations.map(station => stationProperties[station]?.name || `Station ${station}`)
            },

            toolbox: {
                show: true,
                feature: {
                    dataView: { show: true, readOnly: true },
                    magicType: { show: true, type: ['line', 'bar'] },
                    restore: { show: false },
                    saveAsImage: { show: true }
                }
            },
            grid: {
                top: '10%',
                left: '3%',
                right: '4%',
                bottom: '5%',
                containLabel: true
            },

            xAxis: {
                type: 'category',
                data: allDateTimes.map(dateTime => dateTime.split(' ')[1]),
                name: 'Time',
                nameLocation: 'middle',
                nameGap: 30,
                boundaryGap: false,
                axisLabel: {
                    fontFamily: 'Noto Sans Thai, sans-serif',
                    fontSize: 14,
                    color: '#3C4048',
                    formatter: function (value) {
                        return value; // แสดงเฉพาะเวลา
                    }
                },
                axisLine: { lineStyle: { color: '#3C4048' } },
                axisTick: { show: true },
                splitLine: { show: false }
            },
            yAxis: {
                type: 'value',
                name: 'AOD',
                nameLocation: 'middle',
                nameGap: 40,
                axisLabel: {
                    fontFamily: 'Noto Sans Thai, sans-serif',
                    fontSize: 14,
                    color: '#3C4048'
                },
                axisLine: { lineStyle: { color: '#3C4048' } },
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: '#ddd',
                        width: 1,
                        type: 'dashed',
                        opacity: 60,
                    }
                }
            },
            series: series,
            axisPointer: {
                triggerOn: 'mousemove',
                label: {
                    formatter: function (params) {
                        return params.value;
                    }
                }
            }
        };

        myChart.setOption(option, true);


        const updateChartCircle = (time, dateTime) => {
            const total = chartData.reduce((sum, stationData) => {
                const record = stationData.data.find(item => item.time === time);
                return sum + (record ? parseFloat(record.aod) : 0);
            }, 0);

            const selectedData = chartData.map((stationData) => {
                const record = stationData.data.find(item => item.time === time);
                const color = stationProperties[stationData.station]?.color || '#000';
                const value = record ? parseFloat(record.aod) : 0;
                return {
                    name: stationProperties[stationData.station]?.name || `Station ${stationData.station}`,
                    value: value,
                    itemStyle: {
                        color: color
                    },
                    percentage: total > 0 ? (value / total * 100).toFixed(2) : 0
                };
            }).filter(item => item.value > 0)
                .sort((a, b) => b.value - a.value);

            const circleOption = {
                title: {
                    text: `DateTime: ${dateTime}`,
                    left: 'center',
                    bottom: 50,
                    textStyle: {
                        fontSize: 14,
                        fontWeight: 'normal',
                        color: '#333',
                        fontFamily: 'Noto Sans Thai, sans-serif',
                    }
                },

                tooltip: {
                    trigger: 'item',
                    formatter: (params) => {
                        const total = selectedData.reduce((sum, item) => sum + item.value, 0);
                        const percentage = (params.value / total * 100).toFixed(2);
                        return `${params.name}: ${params.value} (${percentage}%)`;
                    }
                },
                legend: {
                    orient: 'vertical',
                    top: 0,
                    left: 0,
                    textStyle: {
                        fontSize: 12,
                        fontWeight: 'normal',
                        color: '#333',
                        fontFamily: 'Noto Sans Thai, sans-serif',
                    },
                    itemGap: 10,
                    itemWidth: 20,
                    itemHeight: 14,
                    symbol: 'circle'
                },

                series: [
                    {
                        name: 'AOD:',
                        type: 'pie',
                        radius: '50%',
                        data: selectedData,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };

            if (window.innerWidth < 650) {
                myChart.setOption({
                    grid: {
                        top: '25%',
                        left: '4%',
                        right: '4%',
                        bottom: '5%',
                        containLabel: true
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: stations.map(station => stationProperties[station]?.name || `Station ${station}`)
                    }
                });
            }

            const chartCircle = document.getElementById('chart_circle');
            const myChartCircle = echarts.init(chartCircle);
            myChartCircle.setOption(circleOption, true); // force update
        };


        const lastDateTime = allDateTimes[allDateTimes.length - 1].split(' ')[1];
        const lastDate = allDateTimes[allDateTimes.length - 1].split(' ')[0];
        updateChartCircle(lastDateTime, `${lastDate} ${lastDateTime}`);

        const debounce = (func, delay) => {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => func(...args), delay);
            };
        };


        const updateChartCircleDebounced = debounce((time, dateTime) => {
            updateChartCircle(time, dateTime);
        }, 200);

        myChart.getZr().on('mousemove', function (event) {
            const pointInPixel = [event.offsetX, event.offsetY];
            if (myChart.containPixel('grid', pointInPixel)) {
                const pointInGrid = myChart.convertFromPixel({ seriesIndex: 0 }, pointInPixel);
                const axisValue = option.xAxis.data[Math.round(pointInGrid[0])];
                const selectedDateTime = allDateTimes.find(dt => dt.split(' ')[1] === axisValue);  // 
                if (selectedDateTime) {
                    updateChartCircleDebounced(axisValue, selectedDateTime);
                }
            }
        });

        window.addEventListener('resize', function () {
            myChart.resize();
            const chartCircle = document.getElementById('chart_circle');
            const myChartCircle = echarts.init(chartCircle);
            myChartCircle.resize();
        });

    } catch (error) {
        console.error("Error processing data:", error);
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

const widget = async () => {

    try {
        var data = await firstupdateData;
        var data = await convert_remark(data)
        var data = await convert_date_format(data)
        var data_difference = await aod_differenceData;

        data.forEach(item => {

            // console.log(item);
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