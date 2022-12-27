import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Button } from '@material-ui/core';
import clsx from 'clsx';
import TrendingDownTwoToneIcon from '@material-ui/icons/TrendingDownTwoTone';
import TrendingUpTwoToneIcon from '@material-ui/icons/TrendingUpTwoTone';

import Chart from 'react-apexcharts';
import { getDisplayBalance, getDisplayUsd } from 'utils/formatBalance';
import { connect } from 'react-redux';
import {
  setSidebarToggle,
  setSidebarToggleMobile
} from '../../reducers/ThemeOptions';

import { useStoreState } from 'easy-peasy';


const SidebarWidget = (props) => {

  const {
    sidebarToggleMobile,
    setSidebarToggleMobile,

    sidebarToggle,
    setSidebarToggle
  } = props;


  const { sidekickTokenStats, candleData } = useStoreState(state => state.Dapp)

  const [xaxisChartOptions, setXaxisChartOptions] = useState([]);
  const [mappedChartData, setMappedChartData] = useState([]);

  useEffect(() => {
    if (candleData !== null && candleData !== undefined) {
      getChartOptions();
      mapChartData();
    }
  }, [candleData])

  const toggleSidebarMobile = () => {
    setSidebarToggleMobile(!sidebarToggleMobile);
  };
  const toggleSidebar = () => {
    setSidebarToggle(!sidebarToggle);
  };

  const chart33Options = {
    chart: {
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: true
      }

    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      colors: ['#49E287'],
      curve: 'smooth',
      width: 2
    },
    fill: {
      colors: ['#49E287'],
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.6,
        opacityTo: 0,
        stops: [0, 100]
      }
    },
    colors: ['#49E287','#fff'],
    markers: {
      colors: ["#fff"],
      strokeColors: ['#49E287'],
      strokeWidth: 2,
      strokeOpacity: 1,
      strokeDashArray: 0,
      fillOpacity: 1,
    },      
    legend: {
      show: false
    },
    xaxis: {
      categories: xaxisChartOptions,
      crosshairs: {
        width: 0
      }
    },
    yaxis: {
      min: 0,
      show: false,
      forceNiceScale: true
    },
    tooltip: {
      enabled: true,
      enabledOnSeries: undefined,
      shared: true,
      followCursor: false,
      intersect: false,
      inverseOrder: false,
      custom: undefined,
      fillSeriesColor: false,
      theme: false,
      style: {
        fontSize: '12px',
        fontFamily: 'Rubik',
      },
      onDatasetHover: {
        highlightDataSeries: true
      },
      marker: {
        show: true,
      },
      x: {
        show: true,
        format: 'dd MMM',
      },
      fixed: {
        enabled: false,
        position: 'topRight',
        offsetX: 0,
        offsetY: 0,
      }
    }
  };
  const chart33Data = [
    {
      name: 'Trades',
      data: mappedChartData
    },
  ];

  const getChartOptions = () => {
    if (candleData !== null && candleData !== undefined && candleData.length > 0) {
      const xaxisChartOptions = candleData.map(item => {
        return moment.utc(item.timeInterval.minute).format('L');
      })

      setXaxisChartOptions(xaxisChartOptions);
    }
  }

  const mapChartData = () => {
    if (candleData !== null && candleData !== undefined && candleData.length > 0) {
      const mappedChartData = candleData.map(item => {
        return item.trades;
      })

      setMappedChartData(mappedChartData);
    }
  }

  return (
    <>
      <div className="app-sidebar--widget">
        <div className="sidebar-header align-items-center font-weight-bold d-flex justify-content-between text-primary">
          <span>$SK Price Tracker</span>
          <Button
            className={clsx(
              'navbar-toggler hamburger hamburger--elastic ',
              { 'is-active': sidebarToggle }
            )}
            onClick={toggleSidebarMobile}
            style={{ position: "absolute", right: "1rem" }}>
            <span className="hamburger-box">
              <span className="hamburger-inner" />
            </span>
          </Button>
        </div>
        <div className="app-sidebar-spacer">
          <div className="d-flex justify-content-between mt-2 mb-1">
            <div className="d-flex">
              <div className="font-size-lg text-success">
                <TrendingUpTwoToneIcon />
              </div>
              <div className="text-left ml-3">
                <div className="d-flex align-items-center justify-content-between">
                  <a href='/Headquarters?token=0x5755e18d86c8a6d7a6e25296782cb84661e6c106'>
                    <div className="font-weight-bold text-success" >{sidekickTokenStats !== undefined ? `$${getDisplayUsd(sidekickTokenStats.skPrice)}` : 'Loading...'}</div>
                  </a>
                  {/* <div className="badge  ml-2 text-success">
                    +25%
                  </div> */}
                </div>
              </div>
            </div>
          </div>
          {/*<div className="d-flex mt-3 justify-content-between">
           <Button className="px-4 py-2 text-uppercase btn-danger">
              <span className="font-size-xs font-weight-bold px-1">
                Deposit
              </span>
            </Button>
            <Button className="px-4 py-2 text-uppercase btn-success">
              <span className="font-size-xs font-weight-bold px-1">
                Withdraw
              </span>
            </Button> 
          </div>*/}
        </div>
        <div>
          <Chart
            options={chart33Options}
            series={chart33Data}
            type="area"
            height={110}
          />
        </div>
      </div>
    </>
  );
};
const mapStateToProps = (state) => ({
  sidebarToggle: state.ThemeOptions.sidebarToggle,
  sidebarToggleMobile: state.ThemeOptions.sidebarToggleMobile
});

const mapDispatchToProps = (dispatch) => ({
  setSidebarToggle: (enable) => dispatch(setSidebarToggle(enable)),
  setSidebarToggleMobile: (enable) => dispatch(setSidebarToggleMobile(enable))
});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarWidget);
