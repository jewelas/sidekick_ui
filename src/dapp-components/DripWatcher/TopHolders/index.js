import React, { useEffect, useState } from 'react';
import StringComponent from '../../StringComponent';
import Strings from '../../../config/localization/translations';
import { Grid, Card } from '@material-ui/core';
import { ScaleLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSackDollar, faPiggyBank, faTint, faScythe, faRaindrops, faCauldron, faUser } from '@fortawesome/pro-duotone-svg-icons';
import { useStoreState } from 'easy-peasy';
import * as addressHelper from 'utils/addressHelpers';
import { GetTopHolders } from 'services/ApiService';
import { getWeb3 } from 'utils/web3';
import { useWallet } from 'use-wallet';

export default function TopHolders(props) {
    const { currentUserAddress } = useStoreState(state => state.Dapp);
    const [loadingStats, setLoadingStats] = useState(false);
    const [topHolders, setTopHolders] = useState([]);

    const defiStrings = Strings.DefiWatcher;
    const chainId = process.env.REACT_APP_CHAIN_ID;
    const dripTokenAddress = addressHelper.getDripTokenAddress();
    const covalentApiKey = process.env.REACT_APP_COVALENT_API_KEY;

    const wallet = useWallet();
    const web3 = getWeb3(wallet);

    useEffect(() => {
        async function GetData() {
            setLoadingStats(true);
            const response = await GetTopHolders(chainId, dripTokenAddress, covalentApiKey);
            if (response?.data?.data?.items) setTopHolders(response.data.data.items);

            setLoadingStats(false);
        }
        if (currentUserAddress !== undefined && currentUserAddress !== null && currentUserAddress.length > 0 && !loadingStats)
            GetData();
    }, [currentUserAddress]);
    return (
        <Card className="bg-first px-4 pt-2 text-center dripView">
            {currentUserAddress && currentUserAddress.length > 0 ? topHolders.length == 0 || loadingStats ? (
                <div className='mt-5 skOverview-label'>
                    <ScaleLoader
                        color={'var(--green)'}
                        size={2}
                        loading={true}
                    />
                    <StringComponent string={defiStrings.string24} />
                </div>) : (
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <div className="p-1 text-center skOverview-label">
                            <div>
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="font-size-xxl mt-3"
                                />
                            </div>
                            <div className="mt-2">
                                <div className="m-1 d-flex justify-content-center">
                                    <div className='drip-label mr-2'>{topHolders[0].address}</div>
                                </div>
                                <span className="">{parseInt(parseFloat(web3.utils.fromWei(topHolders[0].balance)).toFixed()).toLocaleString('en')}</span>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div className="p-1 text-center skOverview-label">
                            <div>
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="font-size-xxl mt-3"
                                />
                            </div>
                            <div className="mt-2">
                                <div className="m-1 d-flex justify-content-center">
                                    <div className='drip-label mr-2'>{topHolders[1].address}</div>
                                </div>
                                <span className="">{parseInt(parseFloat(web3.utils.fromWei(topHolders[1].balance)).toFixed()).toLocaleString('en')}</span>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div className="p-1 text-center skOverview-label">
                            <div>
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="font-size-xxl mt-3"
                                />
                            </div>
                            <div className="mt-2">
                                <div className="m-1 d-flex justify-content-center">
                                    <div className='drip-label mr-2'>{topHolders[2].address}</div>
                                </div>
                                <span className="">{parseInt(parseFloat(web3.utils.fromWei(topHolders[2].balance)).toFixed()).toLocaleString('en')}</span>
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
