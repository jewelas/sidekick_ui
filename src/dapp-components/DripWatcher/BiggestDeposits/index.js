import React, { useEffect, useState } from 'react';
import StringComponent from '../../StringComponent';
import Strings from '../../../config/localization/translations';
import { Grid, Card } from '@material-ui/core';
import { ScaleLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSackDollar, faPiggyBank, faTint, faScythe, faRaindrops, faCauldron, faMoneyCheckAlt } from '@fortawesome/pro-duotone-svg-icons';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { GetDripDownline } from 'services/ApiService';
import { getBr34pContract, getFaucetContract } from 'utils/contractHelpers';
import { useWallet } from 'use-wallet';
import { getWeb3 } from 'utils/web3';

export default function BiggestDeposits(props) {
    const { currentUserAddress, dripStats } = useStoreState(state => state.Dapp);
    const { setDripStats } = useStoreActions(actions => actions.Dapp);
    const [deposits, setDeposits] = useState(undefined);
    const [loadingStats, setLoadingStats] = useState(false);

    const [faucetContract, setFaucetContract] = useState(undefined);

    const wallet = useWallet();
    const web3 = getWeb3(wallet);

    useEffect(() => {
        async function GetData() {
            if (wallet !== undefined && wallet !== null && wallet.status === 'connected' && faucetContract === undefined) {
                setFaucetContract(await getFaucetContract(wallet));
            }
        }

        GetData();
    }, [wallet])

    useEffect(() => {
        async function GetData() {
            if (currentUserAddress !== undefined && currentUserAddress !== null && currentUserAddress.length > 0 && !loadingStats) {
                try {
                    setLoadingStats(true);
                    const response = await GetDripDownline(currentUserAddress);

                    const downlineArray = response.data.children.map(person => {
                        return person.id;
                    })

                    downlineArray.unshift(currentUserAddress);

                    setDripStats({ id: 'downline', value: downlineArray });
                    calculateTotals(downlineArray);
                } catch (e) {
                    console.log(`Drip downline call failed: ${e}`)
                    calculateTotals([])
                    setLoadingStats(false);
                }
            }
        }

        if (faucetContract !== undefined) {
            GetData();
        }
    }, [currentUserAddress, faucetContract])

    const calculateTotals = async (downline) => {
        let depositList = [];


        for (let x = 0; x < downline.length - 1; x++) {
            const memberStats = await faucetContract.methods.userInfo(downline[x]).call({ from: currentUserAddress });

            const dripDeposited = parseFloat(web3.utils.fromWei(memberStats.deposits));

            depositList.push(dripDeposited);
        }

        depositList.sort((a, b) => (b - a));

        setDeposits(depositList);
        setLoadingStats(false);
    }

    const defiStrings = Strings.DefiWatcher;
    return (
        <Card className="bg-first px-4 pt-2 text-center dripView">
            {currentUserAddress && currentUserAddress.length > 0 ? loadingStats ? (
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
                                    icon={faTint}
                                    className="font-size-xxl mt-3"
                                />
                            </div>
                            <div className="mt-2">
                                <div className="m-1 d-flex justify-content-center">
                                    <div className='drip-label mr-2'>
                                        {(deposits && deposits[0]) ? parseInt(deposits[0].toFixed()).toLocaleString('en') : 0}
                                    </div>
                                    <div className='text-white badge' style={{ backgroundColor: '#56c770' }}>Drip</div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div className="p-1 text-center skOverview-label">
                            <div>
                                <FontAwesomeIcon
                                    icon={faTint}
                                    className="font-size-xxl mt-3"
                                />
                            </div>
                            <div className="mt-2">
                                <div className="m-1 d-flex justify-content-center">
                                    <div className='drip-label mr-2'>
                                        {(deposits && deposits[1]) ? parseInt(deposits[1].toFixed()).toLocaleString('en') : 0}
                                    </div>
                                    <div className='text-white badge' style={{ backgroundColor: 'rgb(0,123,255)' }}>Drip</div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div className="p-1 text-center skOverview-label">
                            <div>
                                <FontAwesomeIcon
                                    icon={faTint}
                                    className="font-size-xxl mt-3"
                                />
                            </div>
                            <div className="mt-2">
                                <div className="m-1 d-flex justify-content-center">
                                    <div className='drip-label mr-2'>
                                        {(deposits && deposits[2]) ? parseInt(deposits[2].toFixed()).toLocaleString('en') : 0}
                                    </div>
                                    <div className='text-white badge' style={{ backgroundColor: '#f83245' }}>Drip</div>
                                </div>
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
