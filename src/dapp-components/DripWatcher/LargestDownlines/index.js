import React, { useEffect, useState } from 'react';
import StringComponent from '../../StringComponent';
import Strings from '../../../config/localization/translations';
import { Grid, Card } from '@material-ui/core';
import { ScaleLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSackDollar, faPiggyBank, faTint, faScythe, faRaindrops, faCauldron, faUser, faMoneyCheckAlt } from '@fortawesome/pro-duotone-svg-icons';
import { useStoreState } from 'easy-peasy';

export default function LargestDownlines(props) {
    const { currentUserAddress } = useStoreState(state => state.Dapp);

    const defiStrings = Strings.DefiWatcher;
    return (
        <Card className="bg-first px-4 pt-2 text-center dripView">
            {currentUserAddress && currentUserAddress.length > 0 ? (
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <div className="p-1 text-center skOverview-label">
                            <div>
                                <FontAwesomeIcon
                                    icon={faMoneyCheckAlt}
                                    className="font-size-xxl mt-3"
                                />
                            </div>
                            <div className="mt-2">
                                <div className="m-1 d-flex justify-content-center">
                                    <div className='drip-label mr-2'>0xbff8a1f9b5165b787a00659216d7313354d25472</div>
                                </div>
                                <span className="">15</span>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div className="p-1 text-center skOverview-label">
                            <div>
                                <FontAwesomeIcon
                                    icon={faMoneyCheckAlt}
                                    className="font-size-xxl mt-3"
                                />
                            </div>
                            <div className="mt-2">
                                <div className="m-1 d-flex justify-content-center">
                                    <div className='drip-label mr-2'>PancakeSwap V2: DRIP-BUSD</div>
                                </div>
                                <span className="">12</span>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div className="p-1 text-center skOverview-label">
                            <div>
                                <FontAwesomeIcon
                                    icon={faMoneyCheckAlt}
                                    className="font-size-xxl mt-3"
                                />
                            </div>
                            <div className="mt-2">
                                <div className="m-1 d-flex justify-content-center">
                                    <div className='drip-label mr-2'>0x4fe59adcf621489ced2d674978132a54d432653a</div>
                                </div>
                                <span className="">11</span>
                            </div>
                        </div>
                    </Grid>
                    
                </Grid>) : (
                <div className='mt-5 skOverview-label'>
                    <StringComponent string={defiStrings.string35} />
                </div>)}
        </Card>
    );
}
