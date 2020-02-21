/*alert(window.ql);*/
let rowsNumber = 1;
let server_url = 'http://95.183.13.86:8000/get_data';

function clickSubmitButton() {
    let dt_start = ql;
    let dt_stop = pl;

    TESTER.innerHTML = `<div class="windows8"  style="z-index: 100;">
                <div class="wBall" id="wBall_1">
                    <div class="wInnerBall"></div>
                </div>
                <div class="wBall" id="wBall_2">
                    <div class="wInnerBall"></div>
                </div>
                <div class="wBall" id="wBall_3">
                    <div class="wInnerBall"></div>
                </div>
                <div class="wBall" id="wBall_4">
                    <div class="wInnerBall"></div>
                </div>
                <div class="wBall" id="wBall_5">
                    <div class="wInnerBall"></div>
            </div>`;

    GEO.innerHTML = '';

    let data = {};

    for (let i = 0; i < rowsNumber; i++) {

        let city = document.querySelector(`#ch1-${i}`);
        let category = document.querySelector(`#ch2-${i}`);

        let item_data = {
            "city": city.value,
            "business_type": category.value,
            "dt_start": dt_start,
            "dt_stop": dt_stop
        };

        data[`${i}`] = item_data;
    };

    // fetch data for comparison graph
    fetch(server_url + '/get_data', {
        method: "POST",
        body: JSON.stringify(data)

    })
        .then(function (response) {
            console.log(response);
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            TESTER = document.getElementById('tester');

            let plots_array = [];

            for (let key in data) {
                let x = [];
                let y = [];

                let dates = data[key]['dates'];
                let city = data[key]['city'];
                let type = data[key]['business_type'];

                for (let key_in in dates) {
                    x.push(key_in);
                    y.push(dates[key_in]);
                }

                plots_array.push({
                    x: x,
                    y: y,
                    name: city + " " + type,
                    type: 'scatter'
                })
            }

            TESTER.innerHTML = '';
            Plotly.newPlot(TESTER, plots_array);

        });

    // fetch data for points on map
    fetch(server_url + "/get_cord", {
        method: "POST",
        body: JSON.stringify(data)

    }).then(function (response) {
        console.log(response);
        return response.json();

    }).then(function (dict_data) {
        console.log(dict_data);

        GEO = document.getElementById('geo_map');

        let rows = unpack(dict_data, 'business_type');
        // let classArray = unpack(rows, 'business_type');
        // let classes = [...new Set(classArray)];

        function unpack(rows, key) {
            let array = [];
            // console.log(rows)
            for (var doc in rows) {
                array.push(rows[doc]);
            }
            return array;
        }

        let data = rows.map(function (row) {
            // console.log(row)
            return {
                title: 'Количество бизнесов в день',
                type: 'scattermapbox',
                name: row['business_type'],
                lat: row['cords']['lat_array'],
                lon: row['cords']['lon_array']
            };
        });

        console.log(data);

        var layout = {
            title: 'Точки локализации направлений бизнеса',
            font: {
                 color: 'white'
             },
             dragmode: 'zoom',
             mapbox: {
                 center: {
                     lat: 40.730610,
                     lon: -73.935242
                 },
                 domain: {
                     x: [0, 1],
                     y: [0, 1]
                 },
                 style: 'dark',
                 zoom: 9.5
             },
             margin: {
                 r: 20,
                 t: 40,
                 b: 20,
                 l: 20,
                 pad: 0
             },
            legend: {"orientation": "h"},
             paper_bgcolor: '#191A1A',
             plot_bgcolor: '#191A1A',
             showlegend: true,
             annotations: [{
                 x: 0,
                 y: 0,
                 xref: 'paper',
                 yref: 'paper',
                 text: 'Source: <a href="https://data.nasa.gov/Space-Science/Meteorite-Landings/gh4g-9sfh" style="color: rgb(255,255,255)">NASA</a>',
                 showarrow: false
             }]
         };

         Plotly.setPlotConfig({
             mapboxAccessToken: 'pk.eyJ1IjoicHJvbXNvZnQiLCJhIjoiY2s0ZHcwdXpzMDZ2dDNubDlrOG01ZjU3biJ9.Ar9lzSFkhDpuZOYJEx4XuQ'
         });

         GEO.innerHTML = '';

         Plotly.newPlot(GEO, data, layout);
    });
}


arg = {
        "0": {
            "business_type": "Tobacco Retail Dealer",
            "dt_start": 3,
            "dt_stop": 3,
            "city": "NY"
        },
        "1": {
            "business_type": "Laundries",
            "dt_start": 3,
            "dt_stop": 3,
            "city": "NY"
        }
    };

    let data = arg;
    server_url = 'http://95.183.13.86:8000';

                 // fetch data for comparison graph
    fetch(server_url + '/get_data', {
        method: "POST",
        body: JSON.stringify(data)

    })
        .then(function (response) {
            console.log(response);
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            TESTER = document.getElementById('tester');

            let plots_array = [];

            for (let key in data) {
                let x = [];
                let y = [];

                let dates = data[key]['dates'];
                let city = data[key]['city'];
                let type = data[key]['business_type'];

                for (let key_in in dates) {
                    x.push(key_in);
                    y.push(dates[key_in]);
                }

                plots_array.push({
                    x: x,
                    y: y,
                    name: city + " " + type,
                    type: 'scatter'
                })
            }
            var layout = {showlegend: true,
	                legend: {"orientation": "h"},
            title: 'Количество бизнесов в день'};

            TESTER.innerHTML = '';
            Plotly.newPlot(TESTER, plots_array,layout);

        });

    // fetch data for points on map
    fetch(server_url + "/get_cord", {
        method: "POST",
        body: JSON.stringify(data)

    }).then(function (response) {
        console.log(response);
        return response.json();

    }).then(function (dict_data) {
        console.log(dict_data);

        GEO = document.getElementById('geo_map');

        let rows = unpack(dict_data, 'business_type');

        // let classes = [...new Set(classArray)];

        function unpack(rows, key) {
            let array = [];
            // console.log(rows)
            for (var doc in rows) {
                array.push(rows[doc]);
            }
            return array;
        }

        let data = rows.map(function (row) {
            // console.log(row)
            return {
                type: 'scattermapbox',
                name: row['business_type'],
                lat: row['cords']['lat_array'],
                lon: row['cords']['lon_array']
            };
        });

        // console.log(data)

        var layout = {
            title: 'Точки локализации направлений бизнеса',
            font: {
                color: 'white'
            },
            dragmode: 'zoom',
            mapbox: {
                center: {
                    lat: 40.730610,
                    lon: -73.935242
                },
                domain: {
                    x: [0, 1],
                    y: [0, 1]
                },
                style: 'dark',
                zoom: 9.5
            },
            margin: {
                r: 20,
                t: 40,
                b: 20,
                l: 20,
                pad: 0
            },
            paper_bgcolor: '#191A1A',
            plot_bgcolor: '#191A1A',
            showlegend: true,
            legend: {"orientation": "h"},
            annotations: [{
                x: 0,
                y: 0,
                xref: 'paper',
                yref: 'paper',
                text: 'Source: <a href="https://data.nasa.gov/Space-Science/Meteorite-Landings/gh4g-9sfh" style="color: rgb(255,255,255)">NASA</a>',
                showarrow: false
            }]
        };

        Plotly.setPlotConfig({
            mapboxAccessToken: 'pk.eyJ1IjoicHJvbXNvZnQiLCJhIjoiY2s0ZHcwdXpzMDZ2dDNubDlrOG01ZjU3biJ9.Ar9lzSFkhDpuZOYJEx4XuQ'
        });

        Plotly.newPlot(GEO, data, layout);
    });