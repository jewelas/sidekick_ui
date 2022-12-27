import React, { useEffect, useState } from 'react';
import StringComponent from '../../StringComponent';
import Strings from '../../../config/localization/translations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Card, Button } from '@material-ui/core';
import { faAnalytics} from '@fortawesome/pro-duotone-svg-icons';
import clsx from 'clsx';
import Chart from 'react-apexcharts';
import CountUp from 'react-countup';
import { useStoreState } from 'easy-peasy';
import { convertNumberToShortString } from 'utils/formatBalance';

export default function TransactionOverview(props) {
    const { transactionFilter, promoCoinsList } = useStoreState(state => state.Dapp);

    const [currentTokenInfo, setCurrentTokenInfo] = useState(undefined);
    const [checked, setChecked] = useState(false);

    useEffect(() => {

        if (transactionFilter !== null && transactionFilter.token !== undefined && transactionFilter.token !== null && transactionFilter.token.subject !== null) {
            const foundToken = promoCoinsList.filter(x => x.address === transactionFilter.token.subject.address)[0];
            setCurrentTokenInfo({
                symbol: transactionFilter.token.subject.symbol,
                address: transactionFilter.token.subject.address,
                logoUrl: foundToken ? foundToken.logoUrl : 'https://i.imgur.com/kyvXrEK.png',
                siteUrl: foundToken && foundToken.siteUrl ? foundToken.siteUrl : ''
            })
        }

    }, [transactionFilter])

    const chartsLarge5Options = {
        chart: {
            toolbar: {
                show: false
            },
            sparkline: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            curve: 'smooth',
            width: 4
        },
        labels: props.chartLabels,
        fill: {
            opacity: 1,
            colors: ['#49E287', '#f83245']
        },
        colors: ['#49E287', '#f83245'],
        markers: {
            colors: ["#fff","#fff"],
            strokeColors: ['#49E287', '#f83245'],
            strokeWidth: 2,
            strokeOpacity: 1,
            strokeDashArray: 0,
            fillOpacity: 1,
        },        
        legend: {
            show: false
        },
        grid: {
            strokeDashArray: '5',
            borderColor: 'rgba(255, 255, 255, 1)',
            padding: {
                top: 0,
                right: 20,
                bottom: 0,
                left: 20
            }
        },
        xaxis: {
            tickAmount: '8',
            labels: {
                style: {
                    colors: '#fff'
                }
            },
            tooltip: {
                enabled: false
            }
        },
        yaxis: {
            tickAmount: '5',
            min: 0,
            labels: {
                style: {
                    colors: '#fff'
                }
            }
        },
        title: {
            text: 'Buy / Sells Past 24hrs',
            align: 'center',
            margin: 5,
            offsetY: 10,
            style: {
                fontFamily: 'Rubik',
                fontWeight: 700,
                color: '#fff'
            }
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

    const chartsLarge5Data = [
        {
            name: 'Buy',
            data: props.buyData != undefined ? props.buyData : []
        },
        {
            name: 'Sell',
            data: props.sellData != undefined ? props.sellData : []
        }
    ];

    const defiStrings = Strings.DefiWatcher;

    return (
        <Card className={clsx('bg-first', 'px-4', 'pt-2', 'text-center', !props.drip ? 'skOverview' : 'skOverview-drip')}>
            <div className="card-header-alt">
                <div className="skOverview-label mb-0 d-flex align-items-center justify-content-center flex-wrap">
                    <div className="avatar-icon-wrapper avatar-icon-lg">
                        <a href={props.drip ? 'https://drip.community' : currentTokenInfo ? currentTokenInfo.siteUrl : ''} target='_blank' className="avatar-icon">
                            <img src={props.drip ? 'https://drip.community/img/dropLogo.cea61927.png' : currentTokenInfo ? currentTokenInfo.logoUrl : 'https://i.imgur.com/kyvXrEK.png'} alt="..." />
                        </a>
                    </div>
                    <div className='mx-2'>{props.drip ? '$DRIP' : currentTokenInfo ? `$${currentTokenInfo.symbol}` : ''}</div>
                    <StringComponent string={defiStrings.string10} />
                </div>
            </div>
            <h3 className="display-4 mt-3 mb-0 font-weight-bold">
                <span className="pr-1  text-white">
                    $<CountUp
                        start={0}
                        end={parseInt(props.totalVolume)}
                        duration={2}
                        separator=","
                        delay={0}
                        decimals={2}
                        decimal="."
                        prefix=""
                        suffix=""
                    />
                </span>

                {props.volumnPercentChange > 0 ?
                    (<div className="badge skIncrease ml-2 ">
                        {props.volumnPercentChange}%
                    </div>) :
                    (<div className="badge skDecrease ml-2 ">
                        {props.volumnPercentChange}%
                    </div>)
                }

            </h3>
            <Grid container spacing={1} className='mt-1 skOverview-label-sm'>
                <Grid item xs={4} >
                    <span>Total Supply</span>
                </Grid>
                <Grid item xs={4}>
                    <span>Price</span>
                </Grid>
                <Grid item xs={4}>
                    <span>Diluted Marketcap</span>
                </Grid>
                <Grid item xs={4}>
                    {props.totalSupply <= 1000000 ? parseInt(props.totalSupply).toLocaleString('en') : convertNumberToShortString(parseInt(props.totalSupply))}
                </Grid>
                <Grid item xs={4}>
                    {props.price < .0001 ? props.price?.toFixed(10) : props.price < 1 ? props.price?.toFixed(4) : props.price?.toFixed(2)}
                </Grid>
                <Grid item xs={4}>
                    ${parseInt(props.price * parseInt(props.totalSupply)).toLocaleString('en')}
                </Grid>
            </Grid>
            <div className="divider my-3" />
            <Grid container spacing={6} className='mt-3'>
                <Grid item xs={6}>
                    <div className="d-flex align-items-center justify-content-center">
                        <span className="skOverview-label">
                            <StringComponent string={defiStrings.string8} /> ({props.buyTotal})
                        </span>

                    </div>
                    <div className="d-flex align-items-center justify-content-center">
                        <span className="skOverview-label">
                            ${props.buyTotalAmount}
                        </span>
                        {props.buyAmountPercentChange > 0 ?
                            (<div className="badge skIncrease ml-2">
                                {props.buyAmountPercentChange === NaN || props.buyAmountPercentChange === Infinity ? 0.0 : props.buyAmountPercentChange}%
                            </div>) :
                            (<div className="badge skDecrease ml-2">
                                {props.buyAmountPercentChange === NaN || props.buyAmountPercentChange === Infinity ? 0.0 : props.buyAmountPercentChange}%
                            </div>)
                        }
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <div className="d-flex align-items-center justify-content-center">
                        <span className="skOverview-label">
                            <StringComponent string={defiStrings.string9} /> ({props.sellTotal})
                        </span>
                    </div>
                    <div className="d-flex align-items-center justify-content-center">
                        <span className="skOverview-label">
                            ${props.sellTotalAmount}
                        </span>
                        {props.buyAmountPercentChange > 0 ?
                            (<div className="badge skIncrease ml-2">
                                {props.sellAmountPercentChange === NaN || props.sellAmountPercentChange === Infinity ? 0.0 : props.sellAmountPercentChange}%
                            </div>) :
                            (<div className="badge skDecrease ml-2">
                                {props.sellAmountPercentChange === NaN || props.sellAmountPercentChange === Infinity ? 0.0 : props.sellAmountPercentChange}%
                            </div>)
                        }
                    </div>
                </Grid>
            </Grid>
            <div className={clsx(!props.drip ? "skOverviewChart-price" : 'skOverviewChart-drip')}>
                {!checked ?
                    (<Chart
                        options={chartsLarge5Options}
                        series={chartsLarge5Data}
                        type="line"
                        height='90%' />) :
                    (<div></div>)
                }
            </div>
            <Grid container className={clsx(!props.drip ? "requestNone" : "requestTrackingButton")}>               
                <Grid item>
                    <Button
                        // size="large"
                        // fullWidth={true}
                        //disabled={!isApproved}
                        // onClick={() => handleRoll()}
                        className="font-weight-bold shadow-black-lg btn-second text-first">
                        <div className='d-flex justify-content-between'>
                            <div className="mr-2" style={{ alignSelf: 'center' }}>REQUEST NEW TRACKING</div>
                            <FontAwesomeIcon icon={faAnalytics} size='2x' className='' />
                        </div>
                    </Button>
                </Grid>
            </Grid>
        </Card>
    );
}
