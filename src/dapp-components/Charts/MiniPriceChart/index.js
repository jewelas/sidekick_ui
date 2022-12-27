import Chart from 'react-apexcharts';
import React, { useState, useEffect } from 'react';
import { useStoreState } from 'easy-peasy';
import Strings from '../../../config/localization/translations';

export default function MiniPriceChart(props) {

    const { selectedLangauge, priceChartData, bnbPrice } = useStoreState((state) => state.Dapp);

    const [chartData, setChartData] = useState([]);

    const [chartOptions, setChartOptions] = useState({
        chart: {
            zoom: {
                enabled: false,
                autoScaleYaxis: true
            },
            toolbar: {
                show: false,
                tools: {
                    download: false,
                    selection: false,
                    zoom: false,
                    pan: false
                }
            },
            sparkline: {
                enabled: false
            },
            background: '#1d2b72'
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            curve: 'smooth'
        },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: '#49e287',
                    downward: '#f83245'
                }
            }
        },
        // labels: props.chartLabels,
        fill: {
            // opacity: 0.85,
            // colors: ['#2ebc7f', '#f83245']
        },
        colors: ['#2ebc7f', '#f83245'],
        legend: {
            show: false
        },
        grid: {
            show: true,
            strokeDashArray: 0,
            // position: 'back',
            borderColor: 'rgba(91, 111, 212,.5)',
            xaxis: {
                lines: {
                    show: true
                }
            },
            // column: {
            //     colors: undefined,
            //     opacity: 0.1
            // },  
            padding: {
                top: 0,
                right: 20,
                bottom: 10,
                left: 20
            }
        },
        tooltip: {
            enabled: true,
            style: {
                fontSize: '10px',
                fontFamily: 'Heebo,sans-serif'
            },
            custom: function ({ seriesIndex, dataPointIndex, w }) {
                const o = w.globals.seriesCandleO[seriesIndex][dataPointIndex]
                const h = w.globals.seriesCandleH[seriesIndex][dataPointIndex]
                const l = w.globals.seriesCandleL[seriesIndex][dataPointIndex]
                const c = w.globals.seriesCandleC[seriesIndex][dataPointIndex]
                return (
                    '<div class="apexcharts-tooltip-candlestick">' +
                    '<div>Open: <span class="value">' +
                    o +
                    '</span></div>' +
                    '<div>High: <span class="value">' +
                    h +
                    '</span></div>' +
                    '<div>Low: <span class="value">' +
                    l +
                    '</span></div>' +
                    '<div>Close: <span class="value">' +
                    c +
                    '</span></div>' +
                    '</div>'
                )
            }
        },
        title: {
            text: 'Price Past 24hrs',
            align: 'center',
            margin: 5,
            offsetY: 10,
            style: {
                fontFamily: 'Heebo,sans-serif',
                color: '#fff'
            }
        },

        // points:
        // [
        //     {
        //         x: new Date('2021-07-19'),
        //         y: .025,
        //         marker: {
        //             size: 8,
        //         },
        //         label: {
        //             borderColor: '#FF4560',
        //             text: 'Point Annotation'
        //         }
        //     }
        // ]
        xaxis: {
            // tickAmount: '8',
            labels: {
                style: {
                    colors: '#fff'
                },
                // datetimeUTC: false            
            },
            tooltip: {
                enabled: false
            },
            type: 'datetime'
        },
        yaxis: {
            logarithmic: false,
            // tickAmount: '1',
            //min: .0000000046,
            labels: {
                style: {
                    colors: '#fff'
                }
            },
            axisBorder: {
                show: false
            }
        }
    });

    useEffect(() => {
        // map to chart data
        let chartData = [
            { data: [] }
        ]

        let min = 0, max = 0;

        if (priceChartData !== undefined && priceChartData.length > 0 && bnbPrice !== undefined) {
            const mappedData = priceChartData.map(item => {

                if (item.maximum_price * bnbPrice > max) {
                    max = item.maximum_price * bnbPrice;
                }
                if (item.minimum_price * bnbPrice < min || min === 0) {
                    min = item.minimum_price * bnbPrice;
                }

                return {
                    x: new Date(item.timeInterval.minute),
                    y: [
                        formatPrice(bnbPrice * parseFloat(item.open_price)),
                        formatPrice(bnbPrice * parseFloat(item.maximum_price)),
                        formatPrice(bnbPrice * parseFloat(item.minimum_price)),
                        formatPrice(bnbPrice * parseFloat(item.close_price)),
                    ]
                }
            })

            chartData[0].data = mappedData;
        }

        setChartData(chartData);
        setChartOptions(chartOptions);

    }, [priceChartData, bnbPrice])

    const formatPrice = (price) => {
        price = parseFloat(price);
        return price < .0001 ? price.toFixed(10) : price < 1 ? price.toFixed(4) : price.toFixed(2)
    }

    const defiStrings = Strings.DefiWatcher;

    const getString = (jsonPath) => {

        return jsonPath[selectedLangauge] === '' ? jsonPath[1] : jsonPath[selectedLangauge];
    }

    return (
        <>
            <Chart
                // style={{paddingTop: '20px', paddingBottom: '20px'}}
                options={chartOptions}
                series={chartData}
                type="candlestick"
                height='90%'
            />
        </>
    );
}