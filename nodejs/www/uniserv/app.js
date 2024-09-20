const { DatePicker, Space, Button, Checkbox } = antd;
const { useState } = React;
const { RangePicker } = DatePicker;

let globalData;
// console.log(globalData);

document.addEventListener('DOMContentLoaded', async function () {



    await aod_hour_API();

    if (globalData && globalData.length > 0) {


        if (globalData[0].status === 'empty') {
            chart_hour(globalData);
        } else {
            chart_hour(globalData);
            widgets(globalData);
        }
    } else {
        console.error('globalData is empty or undefined');
    }

    // let aod_day = await aod_dayily_API();
    // chart_day(aod_day);


    config_chart_day()
    config_chart_year()

    dropdown();
    datePicker_chart_hour();
    datePicker_chart_daily()
    button_wrapper()
});






jQuery(function ($) {
    var doAnimations = function () {
        var offset = $(window).scrollTop() + $(window).height(),
            $animatables = $('.animatable');

        if ($animatables.length == 0) {
            $(window).off('scroll', doAnimations);
        }

        $animatables.each(function (i) {
            var $animatable = $(this);
            if (($animatable.offset().top + $animatable.height() - 20) < offset) {
                $animatable.removeClass('animatable').addClass('animated');
            }
        });
    };

    $(window).on('scroll', doAnimations);
    $(window).trigger('scroll');
});





const datePicker_chart_daily = async () => {

    let dateobj = {};

    const onChange_Start = (date, dateString) => {
        dateobj.datestart = dateString;
        checkAndSendToAPI();
    };

    const onChange_End = (date, dateString) => {
        dateobj.dateend = dateString;
        checkAndSendToAPI();
    };

    const checkAndSendToAPI = async () => {
        if (dateobj.datestart && dateobj.dateend) {
            const startDate = moment(dateobj.datestart, "YYYY-MM-DD");
            const endDate = moment(dateobj.dateend, "YYYY-MM-DD");

            // console.log(startDate);
            // console.log(endDate);

            if (endDate.isSameOrAfter(startDate, 'day')) {
                console.log(dateobj);
                // console.log(globalData);
                let aod = await aod_day_API(dateobj);
                let check = await empty_day(aod);
                let aod_day = await convert_date_format(check);
                chart_day(aod_day);
            } else {
                console.log("End date must be after start date.");
            }
        }
    };

    const disabledDate = (current) => {
        return current && current > moment().endOf('day');
    };

    const presetDates = {
        '14 วันย้อนหลัง': [moment().subtract(14, 'days').startOf('day'), moment().endOf('day')],
        '1 เดือนย้อนหลัง': [moment().subtract(1, 'months').startOf('day'), moment().endOf('day')],
        '3 เดือนย้อนหลัง': [moment().subtract(3, 'months').startOf('day'), moment().endOf('day')],
        '6 เดือนย้อนหลัง': [moment().subtract(6, 'months').startOf('day'), moment().endOf('day')]
    };

    const handlePresetClick = (preset) => {
        const [start, end] = presetDates[preset];
        dateobj.datestart = start.format("YYYY-MM-DD");
        dateobj.dateend = end.format("YYYY-MM-DD");
        checkAndSendToAPI();
    };

    const App_Start = () => (
        React.createElement(Space, { direction: "vertical", size: "large" },
            React.createElement(DatePicker, {
                onChange: onChange_Start,
                format: "YYYY-MM-DD",
                placeholder: "เริ่มต้น",
                disabledDate: disabledDate
            })
        )
    );

    const App_End = () => (
        React.createElement(Space, { direction: "vertical", size: "large" },
            React.createElement(DatePicker, {
                onChange: onChange_End,
                format: "YYYY-MM-DD",
                placeholder: "สิ้นสุด",
                disabledDate: disabledDate
            })
        )
    );

    const App_btn_date = () => (
        React.createElement(Space, { direction: "vertical", size: "large" },
            React.createElement(Space, null,
                Object.keys(presetDates).map(preset =>
                    React.createElement(Button, {
                        key: preset,
                        onClick: () => handlePresetClick(preset),
                        size: 'small'
                    }, preset)
                )
            )
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


    ReactDOM.createRoot(document.getElementById('datePicker-Start')).render(React.createElement(App_Start));
    ReactDOM.createRoot(document.getElementById('datePicker-End')).render(React.createElement(App_End));
    ReactDOM.createRoot(document.getElementById('btn-datepicker-chart-day')).render(React.createElement(App_btn_date));

    ReactDOM.createRoot(document.getElementById('checkbox_chart_day_aod')).render(React.createElement(App_checkbox_number));
    ReactDOM.createRoot(document.getElementById('checkbox_chart_day_max_min')).render(React.createElement(App_checkbox_max_min_avg));
    ReactDOM.createRoot(document.getElementById('checkbox_chart_day_checkbox_highlight')).render(React.createElement(App_checkbox_highlight));
};



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

    ReactDOM.createRoot(document.getElementById('checkbox_chart_hour_aod')).render(React.createElement(App_checkbox_number));
    ReactDOM.createRoot(document.getElementById('checkbox_chart_hour_max_min')).render(React.createElement(App_checkbox_max_min_avg));
    ReactDOM.createRoot(document.getElementById('checkbox_chart_hour_checkbox_highlight')).render(React.createElement(App_checkbox_highlight));
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

const dropdown = () => {
    const toggleButton = document.getElementById('dropdown-toggle');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const iconPath = document.getElementById('icon-path');

    toggleButton.addEventListener('click', function (event) {
        event.stopPropagation();
        dropdownMenu.classList.toggle('hidden');
        if (dropdownMenu.classList.contains('hidden')) {
            iconPath.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
        } else {
            iconPath.setAttribute('d', 'M6 18 18 6M6 6l12 12');
        }
    });

    document.addEventListener('click', function (event) {
        if (!dropdownMenu.contains(event.target) && !toggleButton.contains(event.target)) {
            dropdownMenu.classList.add('hidden');
            iconPath.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
        }
    });
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

const aod_hour_API = async (date) => {

    if (typeof date === 'string') {
        date = date;
    } else {
        // date = checkdate();
        date = '2024-05-31';
    }

    try {
        const station = 4439;
        const url = `/aod/api/select/${date}/${station}`;
        const response = await axios.get(url);

        if (response.status === 200) {
            const resultAPI = response.data
            convert_month(resultAPI)
            convert_yearth(resultAPI)
            convert_remark(resultAPI)

            let message_succeed = { 'date': date, 'message': 'aod_hour_API_200' }
            Toast(message_succeed)
            globalData = resultAPI;

            return resultAPI;
        }

    } catch (error) {
        let message_close = { 'date': date, 'message': 'aod_hour_API_404' }
        Toast(message_close)

        let nulldata = empty_hour();
        globalData = nulldata;

        return nulldata;
    }
}


const aod_day_API = async (dateobject) => {


    const { datestart, dateend } = dateobject

    try {
        const station = 4439;
        const url = `/aod/api/aod/avg/${station}/${datestart}/${dateend}`;


        const response = await axios.get(url);

        if (response.status === 200) {
            const resultAPI = response.data

            let message_succeed = { 'date': ' ', 'message': 'aod_day_API_200' }
            Toast(message_succeed)

            return resultAPI;
        }

    } catch (error) {
        let message_close = { 'date': ' ', 'message': 'aod_day_API_404' }
        Toast(message_close)

        return nulldata;
    }
}



// const aod_dayily_API = async (date) => {

//     if (typeof date === 'string') {
//         date = date;
//     } else {
//         date = checkdate();
//     }

//     try {
//         const station = 106;
//         const url = `http://localhost:3000/api/aod/${station}/avg/daily`;
//         const response = await axios.get(url);

//         if (response.status === 200) {
//             const resultAPI = response.data
//             const data = await convert_date_format(resultAPI);

//             return data;
//         }

//     } catch (error) {
//         return nulldata;
//     }
// }


// ---------------------------------  convert_remark  --------------------------------- //
const convert_remark = async (data) => {

    try {
        if (Array.isArray(data)) {
            data.forEach(item => {
                if (item.aod !== null && item.aod !== undefined) {
                    let aod = item.aod;

                    if (aod >= 1 && aod < 50) {
                        item.remarken = 'Good';
                        item.remarkth = 'คุณภาพอากาศดีมาก';
                        item.color = '#58e30e';
                    } else if (aod >= 51 && aod < 100) {
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
                    } else {
                        item.remarken = ' ';
                        item.remarkth = ' ';
                        item.color = '#fff';
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

// ------------------------------------  widgets  ------------------------------------- //
const widgets = async (data) => {
    try {
        let last_data;
        if (data.length > 0) {
            last_data = data[data.length - 1];
        } else {
            last_data = data;
        }

        if (last_data) {
            let box_1_image = document.getElementById('box-1-image');
            box_1_image.innerHTML = `
                <img src="https://www-old.cmuccdc.org/uploads/cam/${last_data.image_name}" alt=""/>
                <div class="nav-button prev" id="previous">«</div>
                <div class="nav-button next" id="next">»</div>
            `;

            let stat_title = document.getElementById('stat-title');
            stat_title.innerHTML = `ค่าฝุ่นละอองลอย (AOD)`;

            let stat_value = document.getElementById('stat-value');
            stat_value.innerHTML = `<div class="stat-value" style="color: ${last_data.color}; text-shadow: 0 0 2px ${last_data.color};">${last_data.aod.toFixed(2)}</div>`;

            let stat_desc1 = document.getElementById('stat-desc1');
            stat_desc1.innerHTML = `<div class="stat-desc stat-desc1" style="color: ${last_data.color}; text-shadow: 0 0 2px ${last_data.color};">${last_data.remarken}</div>`;

            let stat_desc2 = document.getElementById('stat-desc2');
            stat_desc2.innerHTML = `วันที่ ${last_data.date.split('-')[2]} ${last_data.month} ${last_data.yearth} เวลา ${last_data.time} น. <br> มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา`;

            document.getElementById('previous').addEventListener('click', (event) => checkevent(event));
            document.getElementById('next').addEventListener('click', (event) => checkevent(event));
        } else {
            console.warn('No valid data found');
        }
    } catch (error) {
        console.error("Error processing data:", error);
    }
}


// -----------------------------------  chart_hour  ----------------------------------- //
const chart_hour = async (data) => {
    try {
        const dataMap = new Map(data.map(item => [item.time, item]));

        const chartElement = document.getElementById('chart-hour');
        if (!chartElement) {
            return;
        }

        const myChart = echarts.init(chartElement);

        const chartData = data.map(item => ({
            time: item.time,
            aod: parseFloat(item.aod)
        }));



        const maxAod = Math.max(...chartData.map(item => parseFloat(item.aod)));
        const minAod = Math.min(...chartData.map(item => parseFloat(item.aod)));

        const markLinedata = [
            {
                type: 'average',
                name: 'Avg',
                lineStyle: {
                    color: '#FCDC2A', // สีของเส้นสำหรับค่า Avg
                    width: 1.3,
                    type: 'dashed', // รูปแบบของเส้น เช่น 'dashed', 'dotted', 'solid'
                    // shadowColor: '#FFDE4D',
                    // shadowBlur: 20,
                    // shadowOffsetX: 1,
                    // shadowOffsetY: 1
                },
                label: {
                    show: true,
                    position: 'end',
                    formatter: function (params) {
                        return `${params.name}: ${Math.round(params.value)}`;
                    },
                    color: '#FCDC2A',
                    fontFamily: 'Noto Sans Thai, sans-serif',
                    fontSize: 14,
                    fontWeight: 'bold',
                    offset: [-65, -10]
                }
            },
            {
                type: 'max',
                name: 'Max',
                lineStyle: {
                    color: '#FF0000', // สีของเส้นสำหรับค่า Avg
                    width: 1.3,
                    type: 'dashed',
                    // shadowColor: '#FF0000',
                    // shadowBlur: 20,
                    // shadowOffsetX: 1,
                    // shadowOffsetY: 1
                },
                label: {
                    show: true,
                    position: 'end',
                    formatter: function (params) {
                        return `${params.name}: ${Math.round(params.value)}`;
                    },
                    color: '#FF0000',
                    fontFamily: 'Noto Sans Thai, sans-serif',
                    fontSize: 14,
                    fontWeight: 'bold',
                    offset: [-65, -10]
                }
            },
            {
                type: 'min',
                name: 'Min',
                lineStyle: {
                    color: '#9CFF2E', // สีของเส้นสำหรับค่า Avg
                    width: 1.3,
                    type: 'dashed',
                    // shadowColor: '#9CFF2E',
                    // shadowBlur: 20,
                    // shadowOffsetX: 1,
                    // shadowOffsetY: 1
                },
                label: {
                    show: true,
                    position: 'end',
                    formatter: function (params) {
                        return `${params.name}: ${Math.round(params.value)}`;
                    },
                    color: '#9CFF2E',
                    fontFamily: 'Noto Sans Thai, sans-serif',
                    fontSize: 14,
                    fontWeight: 'bold',
                    offset: [-65, -10]
                }
            }
        ];

        let markAreaData_hour = [];
        for (let i = 1; i < chartData.length; i++) {
            const difference = chartData[i].aod - chartData[i - 1].aod;
            if (difference > 200) {
                markAreaData_hour.push([
                    { name: ' ', xAxis: chartData[i - 1].time },
                    { xAxis: chartData[i].time }
                ]);
            }
        }
        const colors = {
            backgroundColor: 'rgb(75, 112, 245)',
            maxAodColor: '#E72929',
            minAodColor: '#38E54D',
            defaultAodColor: 'rgb(2, 21, 38)',
            axisLineColor: '#3C4048',
            splitLineColor: '#ddd',
            labelTextColor: '#ffffff',
            tooltipLabelBgColor: '#090910',
            markAreaColor: 'rgb(252, 65, 0, 0.15)',
            lineShadowColor: 'rgb(75, 112, 245)',
            areaGradient: {
                start: 'rgb(75, 112, 245, 0.7)',
                end: 'rgb(75, 112, 245, 0.3)'
            }
        };

        const option = {
            animationDuration: 2000,
            animationEasing: 'quadraticOut',
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'cross', label: { backgroundColor: colors.tooltipLabelBgColor } },
            },
            legend: { data: ['AOD'] },
            toolbox: {
                show: true,
                feature: {
                    dataView: { show: true, readOnly: true },
                    magicType: { show: true, type: ['line', 'bar'] },
                    restore: { show: false },
                    saveAsImage: { show: true }
                }
            },
            title: {
                text: '',
                textStyle: {
                    fontFamily: 'Noto Sans Thai, sans-serif',
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#333'
                }
            },
            xAxis: {
                type: 'category',
                data: chartData.map(item => item.time),
                name: 'Time',
                nameLocation: 'middle',
                nameGap: 30,
                boundaryGap: false,
                axisLabel: {
                    fontFamily: 'Noto Sans Thai, sans-serif',
                    fontSize: 14,
                    color: colors.axisLineColor
                },
                nameTextStyle: {
                    fontFamily: 'Noto Sans Thai, sans-serif',
                    fontSize: 14,
                    color: colors.axisLineColor
                },
                axisLine: { lineStyle: { color: colors.axisLineColor } },
                axisTick: { show: true },
                splitLine: { show: false }
            },
            yAxis: {
                type: 'value',
                name: 'AOD',
                nameLocation: 'middle',
                nameGap: 40,
                boundaryGap: [0, 0.1],
                axisLabel: {
                    fontFamily: 'Noto Sans Thai, sans-serif',
                    fontSize: 14,
                    color: colors.axisLineColor
                },
                nameTextStyle: {
                    fontFamily: 'Noto Sans Thai, sans-serif',
                    fontSize: 14,
                    color: colors.axisLineColor
                },
                axisLine: { lineStyle: { color: colors.axisLineColor } },
                axisTick: { show: true },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: colors.splitLineColor,
                        width: 1,
                        type: 'dashed',
                        opacity: 60,
                    }
                }
            },
            grid: {
                left: '30',
                right: '31',
                top: '30',
                bottom: '30',
                containLabel: true
            },
            series: [{
                name: 'AOD',
                type: 'line',
                data: chartData.map(item => ({
                    value: item.aod,
                    itemStyle: {
                        color: item.aod == maxAod ? colors.maxAodColor : item.aod == minAod ? colors.minAodColor : colors.backgroundColor
                    }
                })),
                smooth: false,
                color: colors.backgroundColor,
                // symbol: 'circle',
                symbolSize: 6,
                itemStyle: { color: colors.backgroundColor },
                lineStyle: {
                    width: 3,
                    type: 'solid',
                    shadowBlur: 50,
                    shadowColor: colors.lineShadowColor,
                    shadowOffsetX: 20,
                    shadowOffsetY: 20,
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: colors.areaGradient.start },
                        { offset: 1, color: colors.areaGradient.end }
                    ])
                },
                label: {
                    show: true,
                    position: 'top',
                    color: colors.labelTextColor,
                    formatter: '{c}',
                    fontFamily: 'Noto Sans Thai, sans-serif',
                    fontSize: 12,
                    fontWeight: 'bold',
                    backgroundColor: colors.backgroundColor,
                    borderRadius: 5,
                    padding: [3, 5, 0, 5],
                    lineHeight: 20,
                },
                emphasis: { focus: 'series' },
                tooltip: {
                    textStyle: { fontFamily: 'Noto Sans Thai, sans-serif', fontSize: 12 },
                    valueFormatter: value => (Number(value)).toFixed(2)
                },
                markLine: {
                    data: markLinedata,
                    symbol: 'circle',
                    symbolSize: [0, 0],
                    symbolOffset: [0, 0],
                    animation: false,
                },
                markArea: {
                    itemStyle: { color: colors.markAreaColor },
                    data: markAreaData_hour
                },
            }]
        };
        myChart.setOption(option);


        // const option = {
        //     animationDuration: 2000,
        //     animationEasing: 'quadraticOut',
        //     tooltip: {
        //         trigger: 'axis',
        //         axisPointer: { type: 'cross', label: { backgroundColor: '#090910' } },
        //     },
        //     legend: { data: ['AOD'] },
        //     toolbox: {
        //         show: true,
        //         feature: {
        //             dataView: { show: true, readOnly: true },
        //             magicType: { show: true, type: ['line', 'bar'] },
        //             restore: { show: false },
        //             saveAsImage: { show: true }
        //         }
        //     },
        //     title: {
        //         text: '',
        //         textStyle: {
        //             fontFamily: 'Noto Sans Thai, sans-serif',
        //             fontSize: 20,
        //             fontWeight: 'bold',
        //             color: '#333'
        //         }
        //     },
        //     xAxis: {
        //         type: 'category',
        //         data: chartData.map(item => item.time),
        //         name: 'Time',
        //         nameLocation: 'middle',
        //         nameGap: 30,
        //         boundaryGap: false,
        //         axisLabel: {
        //             fontFamily: 'Noto Sans Thai, sans-serif',
        //             fontSize: 14,
        //             color: '#3C4048'
        //         },
        //         nameTextStyle: {
        //             fontFamily: 'Noto Sans Thai, sans-serif',
        //             fontSize: 14,
        //             color: '#3C4048'
        //         },
        //         axisLine: { lineStyle: { color: '#3C4048' } },
        //         axisTick: { show: true },
        //         splitLine: { show: false }
        //     },
        //     yAxis: {
        //         type: 'value',
        //         name: 'AOD',
        //         nameLocation: 'middle',
        //         nameGap: 40,
        //         boundaryGap: [0, 0.1],
        //         axisLabel: {
        //             fontFamily: 'Noto Sans Thai, sans-serif',
        //             fontSize: 14,
        //             color: '#3C4048'
        //         },
        //         nameTextStyle: {
        //             fontFamily: 'Noto Sans Thai, sans-serif',
        //             fontSize: 14,
        //             color: '#3C4048'
        //         },
        //         axisLine: { lineStyle: { color: '#3C4048' } },
        //         axisTick: { show: true },
        //         splitLine: {
        //             show: true,
        //             lineStyle: {
        //                 color: '#ddd',
        //                 width: 1,
        //                 type: 'dashed',
        //                 opacity: 60,
        //             }
        //         }
        //     },
        //     grid: {
        //         left: '30',
        //         right: '31',
        //         top: '30',
        //         bottom: '30',
        //         containLabel: true
        //     },
        //     series: [{
        //         name: 'AOD',
        //         type: 'line',
        //         data: chartData.map(item => ({
        //             value: item.aod,
        //             itemStyle: {
        //                 color: item.aod == maxAod ? '#E72929' : item.aod == minAod ? '#38E54D' : 'rgb(2, 21, 38)'
        //             }
        //         })),
        //         smooth: false,
        //         color: '#1A2130',
        //         // symbol: 'circle',
        //         symbolSize: 6,
        //         itemStyle: { color: 'rgb(75, 112, 245)' },
        //         lineStyle: {
        //             width: 3,
        //             type: 'solid',
        //             shadowBlur: 50,
        //             shadowColor: 'rgb(75, 112, 245)',
        //             shadowOffsetX: 20,
        //             shadowOffsetY: 20,
        //         },
        //         areaStyle: {
        //             color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //                 { offset: 0, color: 'rgb(75, 112, 245, 0.7)' },
        //                 { offset: 1, color: 'rgb(75, 112, 245, 0.3)' }
        //             ])
        //         },
        //         label: {
        //             show: true,
        //             position: 'top',
        //             color: '#ffffff',
        //             formatter: '{c}',
        //             fontFamily: 'Noto Sans Thai, sans-serif',
        //             fontSize: 12,
        //             fontWeight: 'bold',
        //             backgroundColor: 'rgb(75, 112, 245)',
        //             borderRadius: 5,
        //             padding: [3, 5, 0, 5],
        //             lineHeight: 20,
        //         },
        //         emphasis: { focus: 'series' },
        //         tooltip: {
        //             textStyle: { fontFamily: 'Noto Sans Thai, sans-serif', fontSize: 12 },
        //             valueFormatter: value => (Number(value)).toFixed(2)
        //         },
        //         markLine: {
        //             data: markLinedata,
        //             symbol: 'circle',
        //             symbolSize: [0, 0],
        //             symbolOffset: [0, 0],
        //             animation: false,
        //         },
        //         markArea: {
        //             itemStyle: { color: 'rgb(252, 65, 0, 0.15)' },
        //             data: markAreaData_hour
        //         },
        //     }]
        // };
        // myChart.setOption(option);

        const checkbox_chart_hour_aod = document.getElementById('checkbox_chart_hour_aod');
        checkbox_chart_hour_aod.addEventListener('change', function (event) {

            myChart.setOption({
                series: [{
                    label: {
                        show: event.target.checked
                    }
                }]
            });
        });

        const checkbox_chart_hour_max_min = document.getElementById('checkbox_chart_hour_max_min');
        checkbox_chart_hour_max_min.addEventListener('change', function (event) {

            myChart.setOption({
                series: [{
                    markLine: {
                        data: event.target.checked ? markLinedata : []
                    }
                }]
            });
        });

        const checkbox_chart_hour_checkbox_highlight = document.getElementById('checkbox_chart_hour_checkbox_highlight');
        checkbox_chart_hour_checkbox_highlight.addEventListener('change', function (event) {
            console.log(event.target.checked);

            myChart.setOption({
                series: [{
                    markArea: {
                        itemStyle: {
                            color: event.target.checked ? 'rgba(252, 65, 0, 0.25)' : 'rgba(252, 65, 0, 0.00)'
                        },
                        data: event.target.checked ? markAreaData_hour : []
                    }
                }]
            });
        });



        myChart.on('magictypechanged', function (params) {
            if (params.currentType === 'line') {
                console.log('Type === line');

                myChart.setOption({
                    animationDuration: 0,
                    series: [{
                        data: chartData.map(item => ({
                            value: item.aod,
                            itemStyle: {
                                color: item.aod == maxAod ? colors.maxAodColor : item.aod == minAod ? colors.minAodColor : colors.backgroundColor
                            }
                        })),
                        label: {
                            show: true,
                            position: 'top',
                            color: '#ffffff',
                            formatter: '{c}',
                            fontFamily: 'Noto Sans Thai, sans-serif',
                            fontSize: 12,
                            fontWeight: 'bold',
                            backgroundColor: 'rgb(75, 112, 245)',
                            borderRadius: 5,
                            padding: [3, 5, 0, 5],
                            lineHeight: 20,
                        },
                        animation: false,
                    }]
                });

            } else if (params.currentType === 'bar') {
                console.log('Type === bar');

                myChart.setOption({
                    animationDuration: 1000,
                    series: [{
                        data: chartData.map(item => ({
                            value: item.aod,
                            itemStyle: {
                                color: item.aod == maxAod ? colors.maxAodColor : item.aod == minAod ? colors.minAodColor : colors.tooltipLabelBgColor
                            }
                        })),
                        label: {
                            show: true,
                            position: 'top',
                            color: '#000000',
                            formatter: '{c}',
                            fontFamily: 'Noto Sans Thai, sans-serif',
                            fontSize: 12,
                            fontWeight: 'bold',
                            backgroundColor: '',
                            borderRadius: 5,
                            padding: [3, 5, 0, 5],
                            lineHeight: 20,
                        },
                        animation: false,
                    }]
                });
            }
        });







        window.addEventListener('resize', () => myChart.resize());

        myChart.on('mousemove', function (params) {
            if (params.value) {
                const time = params.name;
                const data = dataMap.get(time);

                let box_1_image = document.getElementById('box-1-image');
                if (typeof data.image_name == 'undefined') {
                    box_1_image.innerHTML = ``;
                } else {
                    box_1_image.innerHTML = `
                        <img src="https://www-old.cmuccdc.org/uploads/cam/${data.image_name}" alt=""/>
                        <div class="nav-button prev" id="previous">«</div>
                        <div class="nav-button next" id="next">»</div>
                    `;

                    const previousButton = document.getElementById('previous');
                    const nextButton = document.getElementById('next');

                    if (previousButton) {
                        previousButton.addEventListener('click', (event) => checkevent(event));
                    }

                    if (nextButton) {
                        nextButton.addEventListener('click', (event) => checkevent(event));
                    }
                }

                let stat_value = document.getElementById('stat-value');
                stat_value.innerHTML = `<div class="stat-value" style="color: ${data.color}; text-shadow: 0 0 2px ${data.color};">${data.aod.toFixed(2)}</div>`

                let stat_desc1 = document.getElementById('stat-desc1');
                stat_desc1.innerHTML = `<div class="stat-desc stat-desc1" style="color: ${data.color}; text-shadow: 0 0 2px ${data.color};">${data.remarken}</div>`

                let stat_desc2 = document.getElementById('stat-desc2');
                stat_desc2.innerHTML = `วันที่ ${data.date.split('-')[2]} ${data.month} ${data.yearth} เวลา ${data.time} น. <br> มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา`
            }
        });

    } catch (error) {
        console.error("Error processing data:", error);
    }
}


const chart_day = async (data) => {
    try {

        const chartElement = document.getElementById('chart-day');
        if (!chartElement) {
            return;
        }

        const myChart = echarts.init(chartElement);

        const chartData = data.map(item => ({
            date: item.dateth,
            aod: parseFloat(item.avg_aod).toFixed(2)
        }));

        const maxAod = Math.max(...chartData.map(item => parseFloat(item.aod)));
        const minAod = Math.min(...chartData.map(item => parseFloat(item.aod)));

        const markLinedata = [
            {
                type: 'average',
                name: 'Avg',
                lineStyle: {
                    color: '#FCDC2A', // สีของเส้นสำหรับค่า Avg
                    width: 1.3,
                    type: 'dashed', // รูปแบบของเส้น เช่น 'dashed', 'dotted', 'solid'
                    // shadowColor: '#FFDE4D',
                    // shadowBlur: 20,
                    // shadowOffsetX: 1,
                    // shadowOffsetY: 1
                },
                label: {
                    show: true,
                    position: 'end',
                    formatter: function (params) {
                        return `${params.name}: ${Math.round(params.value)}`;
                    },
                    color: '#FCDC2A',
                    fontFamily: 'Noto Sans Thai, sans-serif',
                    fontSize: 14,
                    fontWeight: 'bold',
                    offset: [-65, -10]
                }
            },
            {
                type: 'max',
                name: 'Max',
                lineStyle: {
                    color: '#FF0000', // สีของเส้นสำหรับค่า Avg
                    width: 1.3,
                    type: 'dashed',
                    // shadowColor: '#FF0000',
                    // shadowBlur: 20,
                    // shadowOffsetX: 1,
                    // shadowOffsetY: 1
                },
                label: {
                    show: true,
                    position: 'end',
                    formatter: function (params) {
                        return `${params.name}: ${Math.round(params.value)}`;
                    },
                    color: '#FF0000',
                    fontFamily: 'Noto Sans Thai, sans-serif',
                    fontSize: 14,
                    fontWeight: 'bold',
                    offset: [-65, -10]
                }
            },
            {
                type: 'min',
                name: 'Min',
                lineStyle: {
                    color: '#9CFF2E', // สีของเส้นสำหรับค่า Avg
                    width: 1.3,
                    type: 'dashed',
                    // shadowColor: '#9CFF2E',
                    // shadowBlur: 20,
                    // shadowOffsetX: 1,
                    // shadowOffsetY: 1
                },
                label: {
                    show: true,
                    position: 'end',
                    formatter: function (params) {
                        return `${params.name}: ${Math.round(params.value)}`;
                    },
                    color: '#9CFF2E',
                    fontFamily: 'Noto Sans Thai, sans-serif',
                    fontSize: 14,
                    fontWeight: 'bold',
                    offset: [-65, -10]
                }
            }
        ];

        let markAreaData_day = [];
        for (let i = 1; i < chartData.length; i++) {
            const difference = chartData[i].aod - chartData[i - 1].aod;
            if (difference > 100) {
                markAreaData_day.push([
                    { name: ' ', xAxis: chartData[i - 1].date },
                    { xAxis: chartData[i].date }
                ]);
            }
        }

        const colors = {
            backgroundColor: 'rgb(75, 112, 245)',
            maxAodColor: '#E72929',
            minAodColor: '#38E54D',
            defaultAodColor: 'rgb(2, 21, 38)',
            axisLineColor: '#3C4048',
            splitLineColor: '#ddd',
            labelTextColor: '#ffffff',
            tooltipLabelBgColor: '#090910',
            markAreaColor: 'rgb(252, 65, 0, 0.15)',
            lineShadowColor: 'rgb(75, 112, 245)',
            areaGradient: {
                start: 'rgb(75, 112, 245, 0.7)',
                end: 'rgb(75, 112, 245, 0.3)'
            }
        };

        const option = {
            animationDuration: 2000,
            animationEasing: 'quadraticOut',
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'cross', label: { backgroundColor: colors.tooltipLabelBgColor } },
            },
            legend: { data: ['AOD'] },
            toolbox: {
                show: true,
                feature: {
                    dataView: { show: true, readOnly: true },
                    magicType: { show: true, type: ['line', 'bar'] },
                    restore: { show: false },
                    saveAsImage: { show: true }
                }
            },
            title: {
                text: '',
                textStyle: {
                    fontFamily: 'Noto Sans Thai, sans-serif',
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#333'
                }
            },
            xAxis: {
                type: 'category',
                data: chartData.map(item => item.date),
                name: 'Date',
                nameLocation: 'middle',
                nameGap: 30,
                boundaryGap: false,
                axisLabel: {
                    fontFamily: 'Noto Sans Thai, sans-serif',
                    fontSize: 14,
                    color: colors.axisLineColor
                },
                nameTextStyle: {
                    fontFamily: 'Noto Sans Thai, sans-serif',
                    fontSize: 14,
                    color: colors.axisLineColor
                },
                axisLine: { lineStyle: { color: colors.axisLineColor } },
                axisTick: { show: true },
                splitLine: { show: false }
            },
            yAxis: {
                type: 'value',
                name: 'AOD',
                nameLocation: 'middle',
                nameGap: 40,
                boundaryGap: [0, 0.2],
                axisLabel: {
                    fontFamily: 'Noto Sans Thai, sans-serif',
                    fontSize: 14,
                    color: colors.axisLineColor
                },
                nameTextStyle: {
                    fontFamily: 'Noto Sans Thai, sans-serif',
                    fontSize: 14,
                    color: colors.axisLineColor
                },
                axisLine: { lineStyle: { color: colors.axisLineColor } },
                axisTick: { show: true },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: colors.splitLineColor,
                        width: 1,
                        type: 'dashed',
                        opacity: 60,
                    }
                }
            },
            grid: {
                left: '30',
                right: '31',
                top: '30',
                bottom: '30',
                containLabel: true
            },
            series: [{
                name: 'AOD',
                type: 'line',
                data: chartData.map(item => ({
                    value: item.aod,
                    itemStyle: {
                        color: item.aod == maxAod ? colors.maxAodColor : item.aod == minAod ? colors.minAodColor : colors.backgroundColor
                    }
                })),
                smooth: false,
                color: colors.backgroundColor,
                // symbol: 'circle',
                symbolSize: 6,
                itemStyle: { color: colors.backgroundColor },
                lineStyle: {
                    width: 3,
                    type: 'solid',
                    shadowBlur: 50,
                    shadowColor: colors.lineShadowColor,
                    shadowOffsetX: 20,
                    shadowOffsetY: 20,
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: colors.areaGradient.start },
                        { offset: 1, color: colors.areaGradient.end }
                    ])
                },
                label: {
                    show: true,
                    position: 'top',
                    color: colors.labelTextColor,
                    formatter: '{c}',
                    fontFamily: 'Noto Sans Thai, sans-serif',
                    fontSize: 12,
                    fontWeight: 'bold',
                    backgroundColor: colors.backgroundColor,
                    borderRadius: 5,
                    padding: [3, 5, 0, 5],
                    lineHeight: 20,
                },
                emphasis: { focus: 'series' },
                tooltip: {
                    textStyle: { fontFamily: 'Noto Sans Thai, sans-serif', fontSize: 12 },
                    valueFormatter: value => (Number(value)).toFixed(2)
                },
                markLine: {
                    data: markLinedata,
                    symbol: 'circle',
                    symbolSize: [0, 0],
                    symbolOffset: [0, 0],
                    animation: false,
                },
                markArea: {
                    itemStyle: { color: colors.markAreaColor },
                    data: markAreaData_day
                },

            }]
        };

        myChart.setOption(option);

        const checkbox_chart_day_aod = document.getElementById('checkbox_chart_day_aod');
        checkbox_chart_day_aod.addEventListener('change', function (event) {

            myChart.setOption({
                series: [{
                    label: {
                        show: event.target.checked
                    }
                }]
            });
        });

        const checkbox_chart_day_max_min = document.getElementById('checkbox_chart_day_max_min');
        checkbox_chart_day_max_min.addEventListener('change', function (event) {

            myChart.setOption({
                series: [{
                    markLine: {
                        data: event.target.checked ? markLinedata : []
                    }
                }]
            });
        });

        const checkbox_chart_day_checkbox_highlight = document.getElementById('checkbox_chart_day_checkbox_highlight');
        checkbox_chart_day_checkbox_highlight.addEventListener('change', function (event) {
            console.log(event.target.checked);

            myChart.setOption({
                series: [{
                    markArea: {
                        itemStyle: {
                            color: event.target.checked ? 'rgba(252, 65, 0, 0.25)' : 'rgba(252, 65, 0, 0.00)'
                        },
                        data: event.target.checked ? markAreaData_day : []
                    }
                }]
            });
        });

        myChart.on('magictypechanged', function (params) {
            if (params.currentType === 'line') {
                console.log('Type === line');

                myChart.setOption({
                    animationDuration: 0,
                    series: [{
                        data: chartData.map(item => ({
                            value: item.aod,
                            itemStyle: {
                                color: item.aod == maxAod ? colors.maxAodColor : item.aod == minAod ? colors.minAodColor : colors.backgroundColor
                            }
                        })),
                        label: {
                            show: true,
                            position: 'top',
                            color: '#ffffff',
                            formatter: '{c}',
                            fontFamily: 'Noto Sans Thai, sans-serif',
                            fontSize: 12,
                            fontWeight: 'bold',
                            backgroundColor: 'rgb(75, 112, 245)',
                            borderRadius: 5,
                            padding: [3, 5, 0, 5],
                            lineHeight: 20,
                        },
                        animation: false,
                    }]
                });

            } else if (params.currentType === 'bar') {
                console.log('Type === bar');

                myChart.setOption({
                    animationDuration: 1000,
                    series: [{
                        data: chartData.map(item => ({
                            value: item.aod,
                            itemStyle: {
                                color: item.aod == maxAod ? colors.maxAodColor : item.aod == minAod ? colors.minAodColor : colors.tooltipLabelBgColor
                            }
                        })),
                        label: {
                            show: true,
                            position: 'top',
                            color: '#000000',
                            formatter: '{c}',
                            fontFamily: 'Noto Sans Thai, sans-serif',
                            fontSize: 12,
                            fontWeight: 'bold',
                            backgroundColor: '',
                            borderRadius: 5,
                            padding: [3, 5, 0, 5],
                            lineHeight: 20,
                        },
                        animation: false,
                    }]
                });
            }
        });

        window.addEventListener('resize', () => myChart.resize());


    } catch (error) {
        console.error("Error processing data:", error);
    }
}



// ----------------------------------- datepicker----------------------------------- //
let currentPosition = -1;
let dateFromDatepicker = null;
let buttonsDisabled = false;

const datepicker = async (date) => {
    console.log(date);


    try {
        const aod_date = await aod_hour_API(date);
        if (aod_date === null) {

        } else {


            console.log(aod_date);

            if (globalData && globalData.length > 0) {


                if (globalData[0].status === 'empty') {
                    chart_hour(globalData);

                    buttonsDisabled = true;
                    document.getElementById('previous').classList.add('btn-disabled');
                    document.getElementById('next').classList.add('btn-disabled');

                } else {
                    chart_hour(globalData);
                    widgets(globalData);

                    currentPosition = -1;
                    dateFromDatepicker = date;
                    buttonsDisabled = false;
                    document.getElementById('previous').classList.remove('btn-disabled');
                    document.getElementById('next').classList.remove('btn-disabled');
                }
            } else {
                console.error('globalData is empty or undefined');
            }

        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}



// -----------------------------------  checkevent1  ----------------------------------- //
const checkevent = async (event, date = null) => {
    if (buttonsDisabled) {
        return;
    }

    const data = globalData;
    if (data === null) {
        return;
    }

    const id = event.target.id;

    if (currentPosition === -1) {
        currentPosition = data.length - 1;
    }

    if (id === 'previous') {
        currentPosition = (currentPosition > 0) ? currentPosition - 1 : data.length - 1;
    } else if (id === 'next') {
        currentPosition = (currentPosition < data.length - 1) ? currentPosition + 1 : 0;
    }

    widgets(data[currentPosition]);
}


// -----------------------------------  Toast  ----------------------------------- //
let toastTimeout;
const Toast = async (data) => {
    try {
        let toast = document.querySelector('.custom-toast');

        if (data && data.message) {
            if (data.message === 'aod_hour_API_404') {

                const custom_toast = document.querySelector('.custom-toast');
                if (custom_toast) {
                    custom_toast.style.borderLeft = `25px solid #ED2B2A`;
                }

                const custom_toast_progress = document.querySelector('.custom-toast-progress');
                if (custom_toast_progress) {
                    custom_toast_progress.style.backgroundColor = `#ED2B2A`;
                }


                let formattedData = await convert_date_format(data);
                let custom_toast_content = document.querySelector('.custom-toast-content');
                custom_toast_content.innerHTML = `
                <div class="custom-toast-svg" style="color: #ED2B2A;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-10"> <path fill-rule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                            clip-rule="evenodd" />
                    </svg>
                </div>

                <div class="message">
                    <div class="text text-1" style="color: #ED2B2A;">ขออภัย</div>
                    <div class="text text-2">ไม่พบข้อมูลในวันที่ ${formattedData.dateth} </div>
                    <button id="close" class="close" onclick="closeToast()">&times;</button>
                </div>

                `;



            } else if (data.message === 'aod_hour_API_200') {

                const custom_toast = document.querySelector('.custom-toast');
                if (custom_toast) {
                    custom_toast.style.borderLeft = `25px solid #06D001`;
                }

                const custom_toast_progress = document.querySelector('.custom-toast-progress');
                if (custom_toast_progress) {
                    custom_toast_progress.style.backgroundColor = `#06D001`;
                }

                let formattedData = await convert_date_format(data);
                let custom_toast_content = document.querySelector('.custom-toast-content');
                custom_toast_content.innerHTML = `
                <div class="custom-toast-svg" style="color: #06D001;">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>

                </div>

                <div class="message">
                    <div class="text text-1" style="color: #06D001;">สำเร็จ</div>
                    <div class="text text-2">พบข้อมูลวันที่ ${formattedData.dateth} </div>
                    <button id="close" class="close" onclick="closeToast()">&times;</button>
                </div>

                `;

            } else if (data.message === 'aod_day_API_200') {

                const custom_toast = document.querySelector('.custom-toast');
                if (custom_toast) {
                    custom_toast.style.borderLeft = `25px solid #06D001`;
                }

                const custom_toast_progress = document.querySelector('.custom-toast-progress');
                if (custom_toast_progress) {
                    custom_toast_progress.style.backgroundColor = `#06D001`;
                }

                let formattedData = await convert_date_format(data);
                let custom_toast_content = document.querySelector('.custom-toast-content');
                custom_toast_content.innerHTML = `
                <div class="custom-toast-svg" style="color: #06D001;">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>

                </div>

                <div class="message">
                    <div class="text text-1" style="color: #06D001;">สำเร็จ</div>
                    <div class="text text-2">พบข้อมูลในช่วงเวลาดังกล่าว </div>
                    <button id="close" class="close" onclick="closeToast()">&times;</button>
                </div>

                `;

            } else if (data.message === 'aod_day_API_404') {

                const custom_toast = document.querySelector('.custom-toast');
                if (custom_toast) {
                    custom_toast.style.borderLeft = `25px solid #ED2B2A`;
                }

                const custom_toast_progress = document.querySelector('.custom-toast-progress');
                if (custom_toast_progress) {
                    custom_toast_progress.style.backgroundColor = `#ED2B2A`;
                }


                let formattedData = await convert_date_format(data);
                let custom_toast_content = document.querySelector('.custom-toast-content');
                custom_toast_content.innerHTML = `
                <div class="custom-toast-svg" style="color: #ED2B2A;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-10"> <path fill-rule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                            clip-rule="evenodd" />
                    </svg>
                </div>

                <div class="message">
                    <div class="text text-1" style="color: #ED2B2A;">ขออภัย</div>
                    <div class="text text-2">ไม่พบข้อมูลในช่วงเวลาดังกล่าว </div>
                    <button id="close" class="close" onclick="closeToast()">&times;</button>
                </div>

                `;



            }

            toast.classList.add('active');
            clearTimeout(toastTimeout);


            toastTimeout = setTimeout(() => {
                toast.classList.remove('active');
            }, 3000);

        } else {
            throw new Error("Invalid data format");
        }

    } catch (error) {
        console.error(error);
    }
}



// ---------------------------------  closeToast  --------------------------------- //
const closeToast = () => {
    const toast = document.querySelector('.custom-toast');
    toast.classList.remove('active');
    clearTimeout(toastTimeout);
}



// ---------------------------  convert_date_format  ------------------------------ //
const convert_date_format = async (data) => {
    try {

        const formatDate = (dateStr) => {
            let date = new Date(dateStr);
            return date.toLocaleDateString('en-GB');
        };

        if (Array.isArray(data)) {
            return data.map(entry => {
                if (entry.date) {
                    return { ...entry, dateth: formatDate(entry.date) };
                } else {
                    console.warn("Entry does not have a date property:", entry);
                    return entry;
                }
            });
        }

        else if (typeof data === 'object' && data !== null) {
            if (data.date) {
                return { ...data, dateth: formatDate(data.date) };
            } else {
                console.warn("Object does not have a date property:", data);
                return data;
            }
        }
        else {
            throw new Error("Data must be an array or an object");
        }

    } catch (error) {
        console.error(error);
        return;
    }
}

// ---------------------------------  empty  --------------------------------- //
const empty_hour = () => {
    let station = 4439;
    let data = [];
    let date = checkdate();
    let hr = checkHour();

    for (let hour = 6; hour <= hr; hour++) {
        let time = hour.toString().padStart(2, '0') + ':00';
        data.push({ station: station, date: date, time: time, aod: Number(0), status: 'empty' });
    }
    return data
}


const empty_day = (data) => {
    console.log(data);
    console.log(typeof data);

    if (data.length === 0) return [];

    let datestart = new Date(data[0].date);
    let dateend = new Date(data[data.length - 1].date);

    const addDays = (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };

    let currentDate = datestart;
    let dateList = [];
    while (currentDate <= dateend) {
        dateList.push(currentDate.toISOString().split('T')[0]);
        currentDate = addDays(currentDate, 1);
    }

    let dataMap = new Map();
    data.forEach(item => {
        let formattedDate = new Date(item.date).toISOString().split('T')[0];
        dataMap.set(formattedDate, {
            date: formattedDate,
            avg_aod: Number(item.avg_aod),
            status: 'present'
        });
    });

    let result = dateList.map(date => {
        return dataMap.get(date) || {
            date: date,
            avg_aod: 0,
            status: 'empty'
        };
    });

    console.log(result);
    return result;
};





// const config_chart_day = async () => {
//     let dateend = checkdate();
//     let datestart = new Date(dateend);

//     datestart.setDate(datestart.getDate() - 7);

//     let datestartString = datestart.toISOString().split('T')[0];
//     let dateendString = new Date(dateend).toISOString().split('T')[0];

//     let dateobj = { 'datestart': datestartString, 'dateend': dateendString };

//     let aod = await aod_day_API(dateobj);
//     let check = await empty_day(aod);
//     let aod_day = await convert_date_format(check);
//     await chart_day(aod_day);
// };

const config_chart_day = async () => {

    let dateobj = { 'datestart': '2024-05-24', 'dateend': '2024-05-31' };

    let aod = await aod_day_API(dateobj);
    let check = await empty_day(aod);
    let aod_day = await convert_date_format(check);
    await chart_day(aod_day);
};



const config_chart_year = async () => {
    let datestart = '2024-01-01'
    let dateend = checkdate();
    let objdate = { 'datestart': datestart, 'dateend': dateend }

    let aod_day = await aod_day_API(objdate);
    let data = await convert_date_format(aod_day);
    // console.log(data);

    await chart_year(data)
}





const chart_year = async (data) => {
    try {
        let year = await checkdate();
        let Nowyear = year.split('-')[0];

        const chart = echarts.init(document.getElementById('chart-heatmap'));

        function getVirtualData(year) {
            const startDate = echarts.time.parse(year + '-01-01');
            const endDate = echarts.time.parse(year + '-12-31');
            const dayTime = 3600 * 24 * 1000;
            const chartData = [];

            data.forEach(item => {
                const date = echarts.time.parse(item.date);
                if (date >= startDate && date <= endDate) {
                    chartData.push([
                        echarts.time.format(date, '{yyyy}-{MM}-{dd}', false),
                        parseFloat(item.avg_aod).toFixed(2)
                    ]);
                }
            });
            return chartData;
        }

        const virtualData = getVirtualData(Nowyear);

        let option = {
            series: {
                type: 'heatmap',
                coordinateSystem: 'calendar',
                data: virtualData
            },
            title: {
                top: 30,
                left: 'center',
                text: ' '
            },
            tooltip: {
                trigger: 'item',
                backgroundColor: '#F9F9F9',
                borderColor: '#999',
                borderWidth: 0,
                padding: 15,
                textStyle: {
                    color: '#333',
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    fontFamily: 'Noto Sans Thai, sans-serif',
                    fontSize: 14
                },
                formatter: function (params) {
                    return `<b>วันที่:</b> ${params.value[0]}<br><b>AOD (เฉลี่ย):</b> ${params.value[1]}`;
                }
            },
            visualMap: {
                min: 0,
                max: 301,
                type: 'piecewise',
                orient: 'horizontal',
                left: 'center',
                top: '340',

                pieces: [
                    { min: 1, max: 50, color: '#38E54D' },
                    { min: 51, max: 100, color: '#FFDE4D' },
                    { min: 101, max: 150, color: '#FF8F00' },
                    { min: 151, max: 200, color: '#FE0000' },
                    { min: 201, max: 300, color: '#AF47D2' },
                    { min: 301, color: '#820000' }
                ],
                outOfRange: {
                    color: '#fff'
                },
                textStyle: {
                    color: '#000',
                    fontSize: 14,
                    fontFamily: 'Noto Sans Thai, sans-serif',
                    fontWeight: 'normal'
                },
                itemWidth: 25,
                itemHeight: 15,
                borderColor: '#000',
                borderWidth: 0,
                backgroundColor: '#ffffff',
                padding: [5, 5, 5, 5],
            },
            calendar: {
                top: 30,
                left: 160,
                right: 80,
                bottom: 80,
                cellSize: ['auto', '20'],
                range: ['2024-01-01', '2024-05-31'],
                itemStyle: {
                    borderWidth: 3,
                    borderColor: '#ffffff',
                    color: 'rgba(238, 237, 235, 0.5)'
                },
                splitLine: {
                    show: false
                },
                yearLabel: { show: false },
                dayLabel: {
                    nameMap: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                    color: '#000',
                    fontSize: 12,
                    fontFamily: 'Noto Sans, sans-serif',
                    fontWeight: 'normal'
                }
            }
        };

        if (window.innerWidth < 650) {

            option.calendar.left = 50
            option.calendar.right = 25
            option.calendar.bottom = 1
        }

        chart.setOption(option);
        window.addEventListener('resize', () => {
            chart.resize();
        });

    } catch (error) {
        console.log(error);
    }
}



document.getElementById('main-button').addEventListener('click', function () {
    const icon = document.getElementById('button-icon');

    if (icon.innerHTML.includes('M12 6.75a.75.75 0 1 1 0-1.5')) {
        icon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        `;
    } else {

        icon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
        `;
    }
});





const updateProgressCircle = () => {
    const progressCircle = document.querySelector('.custom-progress-circle');
    const scrollTop = window.scrollY || window.pageYOffset;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollHeight = documentHeight - windowHeight;

    if (scrollHeight > 0) {
        const scrollPercent = (scrollTop / scrollHeight) * 100;
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

window.addEventListener('scroll', updateProgressCircle);
window.addEventListener('load', updateProgressCircle);







// let objdate = { 'datestart': datestart, 'dateend': dateend }

// let data = await aod_day_API(objdate);
// await chart_year(data)




// const config_chart_year = async () => {
//     let dateendString = '2024-08-21'; // วันที่เป็น string
//     let dateend = new Date(dateendString); // แปลง string เป็น Date object

//     // ลดวันลง 7 วัน
//     dateend.setDate(dateend.getDate() - 7);

//     // แปลง Date object กลับเป็น string ในรูปแบบ 'YYYY-MM-DD'
//     let datestartString = dateend.toISOString().split('T')[0];

//     let objdate = { 'datestart': datestartString, 'dateend': dateendString };

//     let data = await aod_day_API(objdate);
//     await chart_year(data);
// };

// const chart_day = async (data) => {
//     try {

//         const chartElement = document.getElementById('chart-day');
//         if (!chartElement) {
//             return;
//         }

//         const myChart = echarts.init(chartElement);

//         const chartData = data.map(item => ({
//             date: item.dateth,
//             aod: parseFloat(item.avg_aod).toFixed(2)
//         }));

//         const maxAod = Math.max(...chartData.map(item => parseFloat(item.aod)));
//         const minAod = Math.min(...chartData.map(item => parseFloat(item.aod)));

//         const markLinedata = [
//             {
//                 type: 'average',
//                 name: 'Avg',
//                 lineStyle: {
//                     color: '#FCDC2A', // สีของเส้นสำหรับค่า Avg
//                     width: 1.3,
//                     type: 'dashed', // รูปแบบของเส้น เช่น 'dashed', 'dotted', 'solid'
//                     // shadowColor: '#FFDE4D',
//                     // shadowBlur: 20,
//                     // shadowOffsetX: 1,
//                     // shadowOffsetY: 1
//                 },
//                 label: {
//                     show: true,
//                     position: 'end',
//                     formatter: function (params) {
//                         return `${params.name}: ${Math.round(params.value)}`;
//                     },
//                     color: '#FCDC2A',
//                     fontFamily: 'Noto Sans Thai, sans-serif',
//                     fontSize: 14,
//                     fontWeight: 'bold',
//                     offset: [-65, -10]
//                 }
//             },
//             {
//                 type: 'max',
//                 name: 'Max',
//                 lineStyle: {
//                     color: '#FF0000', // สีของเส้นสำหรับค่า Avg
//                     width: 1.3,
//                     type: 'dashed',
//                     // shadowColor: '#FF0000',
//                     // shadowBlur: 20,
//                     // shadowOffsetX: 1,
//                     // shadowOffsetY: 1
//                 },
//                 label: {
//                     show: true,
//                     position: 'end',
//                     formatter: function (params) {
//                         return `${params.name}: ${Math.round(params.value)}`;
//                     },
//                     color: '#FF0000',
//                     fontFamily: 'Noto Sans Thai, sans-serif',
//                     fontSize: 14,
//                     fontWeight: 'bold',
//                     offset: [-65, -10]
//                 }
//             },
//             {
//                 type: 'min',
//                 name: 'Min',
//                 lineStyle: {
//                     color: '#9CFF2E', // สีของเส้นสำหรับค่า Avg
//                     width: 1.3,
//                     type: 'dashed',
//                     // shadowColor: '#9CFF2E',
//                     // shadowBlur: 20,
//                     // shadowOffsetX: 1,
//                     // shadowOffsetY: 1
//                 },
//                 label: {
//                     show: true,
//                     position: 'end',
//                     formatter: function (params) {
//                         return `${params.name}: ${Math.round(params.value)}`;
//                     },
//                     color: '#9CFF2E',
//                     fontFamily: 'Noto Sans Thai, sans-serif',
//                     fontSize: 14,
//                     fontWeight: 'bold',
//                     offset: [-65, -10]
//                 }
//             }
//         ];

//         let markAreaData_day = [];
//         for (let i = 1; i < chartData.length; i++) {
//             const difference = chartData[i].aod - chartData[i - 1].aod;
//             if (difference > 100) {
//                 markAreaData_day.push([
//                     { name: ' ', xAxis: chartData[i - 1].date },
//                     { xAxis: chartData[i].date }
//                 ]);
//             }
//         }


//         const option = {
//             animationDuration: 2000,
//             animationEasing: 'quadraticOut',
//             tooltip: {
//                 trigger: 'axis',
//                 axisPointer: { type: 'cross', label: { backgroundColor: 'rgb(75, 112, 245)' } },
//             },
//             legend: { data: ['AOD'] },
//             toolbox: {
//                 show: true,
//                 feature: {
//                     dataView: { show: true, readOnly: true },
//                     magicType: { show: true, type: ['line', 'bar'] },
//                     restore: { show: false },
//                     saveAsImage: { show: true }
//                 }
//             },
//             title: {
//                 text: '',
//                 textStyle: {
//                     fontFamily: 'Noto Sans Thai, sans-serif',
//                     fontSize: 20,
//                     fontWeight: 'bold',
//                     color: '#333'
//                 }
//             },
//             xAxis: {
//                 type: 'category',
//                 data: chartData.map(item => item.date),
//                 name: 'Date',
//                 nameLocation: 'middle',
//                 nameGap: 30,
//                 boundaryGap: false,
//                 axisLabel: {
//                     fontFamily: 'Noto Sans Thai, sans-serif',
//                     fontSize: 14,
//                     color: '#3C4048'
//                 },
//                 nameTextStyle: {
//                     fontFamily: 'Noto Sans Thai, sans-serif',
//                     fontSize: 14,
//                     color: '#3C4048'
//                 },
//                 axisLine: { lineStyle: { color: '#3C4048' } },
//                 axisTick: { show: true },
//                 splitLine: { show: false }
//             },
//             yAxis: {
//                 type: 'value',
//                 name: 'AOD',
//                 nameLocation: 'middle',
//                 nameGap: 40,
//                 boundaryGap: [0, 0.2],
//                 axisLabel: {
//                     fontFamily: 'Noto Sans Thai, sans-serif',
//                     fontSize: 14,
//                     color: '#3C4048'
//                 },
//                 nameTextStyle: {
//                     fontFamily: 'Noto Sans Thai, sans-serif',
//                     fontSize: 14,
//                     color: '#3C4048'
//                 },
//                 axisLine: { lineStyle: { color: '#3C4048' } },
//                 axisTick: { show: true },
//                 splitLine: {
//                     show: true,
//                     lineStyle: {
//                         color: '#ddd',
//                         width: 1,
//                         type: 'dashed',
//                         opacity: 60,
//                     }
//                 }
//             },
//             grid: {
//                 left: '30',
//                 right: '31',
//                 top: '30',
//                 bottom: '30',
//                 containLabel: true
//             },
//             series: [{
//                 name: 'AOD',
//                 type: 'line',
//                 data: chartData.map(item => ({
//                     value: item.aod,
//                     itemStyle: {
//                         color: item.aod == maxAod ? '#E72929' : item.aod == minAod ? '#38E54D' : 'rgb(2, 21, 38)'
//                     }
//                 })),
//                 smooth: false,
//                 // color: 'rgb(63, 162, 246, 0.9)',  //F4CE14
//                 // symbol: 'circle',
//                 symbolSize: 6,
//                 itemStyle: { color: 'rgb(75, 112, 245)' }, //7BC9FF
//                 lineStyle: {
//                     width: 3,
//                     type: 'solid',
//                     shadowBlur: 50,
//                     shadowColor: 'rgb(75, 112, 245)',
//                     shadowOffsetX: 20,
//                     shadowOffsetY: 20,
//                 },
//                 areaStyle: {
//                     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
//                         { offset: 0, color: 'rgb(75, 112, 245)' },
//                         { offset: 1, color: 'rgb(75, 112, 245)' }
//                     ])
//                 },
//                 label: {
//                     show: true,
//                     position: 'top',
//                     color: '#1A2130',
//                     formatter: '{c}',
//                     fontFamily: 'Noto Sans Thai, sans-serif',
//                     fontSize: 13,
//                     fontWeight: 'bold',
//                     backgroundColor: '',
//                     borderRadius: 15,
//                     padding: [3, 5, 0, 5],
//                     lineHeight: 20,
//                 },
//                 emphasis: { focus: 'series' },
//                 tooltip: {
//                     textStyle: { fontFamily: 'Noto Sans Thai, sans-serif', fontSize: 12 },
//                     valueFormatter: value => (Number(value)).toFixed(2)
//                 },
//                 markLine: {
//                     data: markLinedata,
//                     symbol: 'circle',
//                     symbolSize: [0, 0],
//                     symbolOffset: [0, 0],
//                     animation: false,
//                 },
//                 markArea: {
//                     itemStyle: { color: 'rgb(252, 65, 0, 0.15)' },
//                     data: markAreaData_day
//                 },

//             }]
//         };

//         myChart.setOption(option);

//         const checkbox_chart_day_aod = document.getElementById('checkbox_chart_day_aod');
//         checkbox_chart_day_aod.addEventListener('change', function (event) {

//             myChart.setOption({
//                 series: [{
//                     label: {
//                         show: event.target.checked
//                     }
//                 }]
//             });
//         });

//         const checkbox_chart_day_max_min = document.getElementById('checkbox_chart_day_max_min');
//         checkbox_chart_day_max_min.addEventListener('change', function (event) {

//             myChart.setOption({
//                 series: [{
//                     markLine: {
//                         data: event.target.checked ? markLinedata : []
//                     }
//                 }]
//             });
//         });

//         const checkbox_chart_day_checkbox_highlight = document.getElementById('checkbox_chart_day_checkbox_highlight');
//         checkbox_chart_day_checkbox_highlight.addEventListener('change', function (event) {
//             console.log(event.target.checked);

//             myChart.setOption({
//                 series: [{
//                     markArea: {
//                         itemStyle: {
//                             color: event.target.checked ? 'rgba(252, 65, 0, 0.25)' : 'rgba(252, 65, 0, 0.00)'
//                         },
//                         data: event.target.checked ? markAreaData_day : []
//                     }
//                 }]
//             });
//         });

//         window.addEventListener('resize', () => myChart.resize());


//     } catch (error) {
//         console.error("Error processing data:", error);
//     }
// }