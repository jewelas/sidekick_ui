import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

export default function HQExposureChart(props) {
    const { data } = props;

    const buildLabels = (data) => {
        let labels = ['n/a'];
        if (data !== undefined && data.tokenData.length > 0) {
            labels = data.tokenData.map(item => {
                return item.symbol;
            })
        }
        return labels;
    }

    const buildSeries = (data) => {
        let series = [1];
        if (data !== undefined && data.tokenData.length > 0) {
            series = data.tokenData.map(item => {
                return item.totalUSD < 1 ?
                    parseFloat(item.totalUSD.toLocaleString(undefined, { 'minimumFractionDigits': 2, 'maximumFractionDigits': 6 }))
                    : parseFloat(item.totalUSD.toLocaleString(undefined, { 'minimumFractionDigits': 2, 'maximumFractionDigits': 2 }));
            })
        }
        return series;
    }

    const options = {
        // chart: {
        //     type: 'donut'
        // },        
        title: {
            text: 'Portfolio Exposure',
            align: 'center',
            offsetY: 5,
            style: {
                fontFamily: 'Heebo,sans-serif',
                color: '#fff',
                fontSize: '12px'
            }
        },
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '10px',
                fontFamily: 'Heebo,sans-serif',
                fontWeight: 'bold',
                colors: ['#fff']
            }
        },
        labels: buildLabels(data),
        plotOptions: {
            pie: {
                startAngle: 0,
                endAngle: 360,
                expandOnClick: true,
                offsetX: 0,
                offsetY: 30,
                // customScale: 1.5,
                dataLabels: {
                    offsetX: 0,
                    offsetY: 10,
                    minAngleToShowLabel: 10
                },
                // donut: {
                // }
            }

        },
        tooltip: {
            enabled: true,
            enabledOnSeries: undefined,
            shared: true,
            followCursor: false,
            intersect: false,
            inverseOrder: false,
            // custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            //     console.log(series);
            //     return '<div class="exposure-tooltip">' +
            //         '<span>' +
            //         w.globals.labels[seriesIndex] +
            //         ": $" +
            //         series[seriesIndex]
            //         + '</span>' +
            //         '</div>'
            // },
            fillSeriesColor: true,
            theme: false,
            style: {
                fontSize: '12px',
                fontFamily: 'Heebo,sans-serif',
                color: '#fff'
            },
            onDatasetHover: {
                highlightDataSeries: false,
            },
            marker: {
                show: true,
            },
            y: {
                formatter: function (value, series) {
                    // use series argument to pull original string from chart data
                    return '$' +value;
                }
            },
            // items: {
            //     display: flex,
            // },
            fixed: {
                enabled: false,
                position: 'topRight',
                offsetX: 0,
                offsetY: 0,
            },
        },
        legend: {
            show: true,
            showForSingleSeries: false,
            showForNullSeries: true,
            showForZeroSeries: true,
            // position: 'bottom',
            horizontalAlign: 'left',
            floating: false,
            fontSize: '12px',
            fontFamily: 'Heebo,sans-serif',
            fontWeight: 400,
            formatter: undefined,
            inverseOrder: false,
            width: undefined,
            height: undefined,
            tooltipHoverFormatter: undefined,
            customLegendItems: [],
            offsetX: 10,
            offsetY: 60,
            labels: {
                colors: ['#fff'],
                useSeriesColors: false
            },
            markers: {
                width: 10,
                height: 10,
                strokeWidth: 0,
                strokeColor: '#fff',
                fillColors: undefined,
                radius: 12,
                customHTML: undefined,
                onClick: undefined,
                offsetX: 0,
                offsetY: 0
            },
            itemMargin: {
                horizontal: 5,
                vertical: 5
            },
            onItemClick: {
                toggleDataSeries: true
            },
            onItemHover: {
                highlightDataSeries: true
            },
        }

    }

    return (
        <>
            <div className="d-flex justify-content-center mt-1">
                <Chart options={options} series={buildSeries(data)} type="donut" width="380" height="150" />
            </div>
        </>
    );
}