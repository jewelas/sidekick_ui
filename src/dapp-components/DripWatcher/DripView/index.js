import React, { useEffect, useState } from 'react';
import StringComponent from '../../StringComponent';
import Strings from '../../../config/localization/translations';
import { Grid, Card } from '@material-ui/core';
import { ScaleLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSackDollar, faPiggyBank, faTint, faScythe, faRaindrops, faCauldron } from '@fortawesome/pro-duotone-svg-icons';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { GetDripDownline } from 'services/ApiService';
import { getBr34pContract, getFaucetContract, getDripContract } from 'utils/contractHelpers';
import { useWallet } from 'use-wallet';
import { getWeb3 } from 'utils/web3';
import { useVaultStats } from 'hooks/useGFI';

export default function DripView(props) {
    const { currentUserAddress, dripStats } = useStoreState(state => state.Dapp);
    const { setDripStats } = useStoreActions(actions => actions.Dapp);
    const [teamStats, setTeamStats] = useState(undefined);
    const [loadingStats, setLoadingStats] = useState(false);

    const [faucetContract, setFaucetContract] = useState(undefined);
    const [br34pContract, setBr34pContract] = useState(undefined);
    const [vaultDeposits, setVaultDeposits] = useState(undefined);
    const [dripContract, setDripContract] = useState(undefined);
    const [vaultDailyEstimate, setVaultDailyEstimate] = useState(undefined);

    const wallet = useWallet();
    const web3 = getWeb3(wallet);
    const vaultStats = useVaultStats(wallet);
    const dummyCurrentUserAddr = "0x64edCA441aaE7B3dDA4B23f2cd6546c501ab894f";


    useEffect(() => {
        async function GetData() {
            if (wallet !== undefined && wallet !== null && wallet.status === 'connected' && faucetContract === undefined) {
                setFaucetContract(await getFaucetContract(wallet));
                setBr34pContract(await getBr34pContract(wallet));
                setDripContract(await getDripContract(wallet));
            }
        }

        GetData();
    }, [wallet]);

    useEffect(() => {
        if (vaultStats !== null && vaultStats !== undefined) {
            setVaultDeposits(vaultStats.totalDeposit);
            setVaultDailyEstimate(vaultStats.dailyEstimate);
        }
    }, [vaultStats]);

    useEffect(() => {
        async function GetData() {
            if (currentUserAddress !== undefined && currentUserAddress !== null && currentUserAddress.length > 0 && !loadingStats) {
                try {
                    setLoadingStats(true);
                    // const response = await GetDripDownline(dummyCurrentUserAddr);
                    const response = await GetDripDownline(currentUserAddress);

                    const downlineArray = response.data.children.map(person => {
                        return person.id;
                    })

                    // downlineArray.unshift(dummyCurrentUserAddr);
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

        if (faucetContract !== undefined && br34pContract !== undefined && dripContract !== undefined) {
            GetData();
        }
    }, [currentUserAddress, faucetContract, br34pContract, dripContract]);

    const calculateTotals = async (downline) => {
        let teamStats = {
            TotalDeposits: 0,
            TotalWithdrawals: 0,
            TotalBr34p: 0,
            // Br34p USD value + Drip USD  value
            TotalUSD: 0
        };

        for (let x = 0; x < downline.length - 1; x++) {
            // const memberStats = await faucetContract.methods.userInfo(downline[x]).call({ from: dummyCurrentUserAddr });
            const memberStats = await faucetContract.methods.userInfo(downline[x]).call({ from: currentUserAddress });

            const dripDeposited = parseFloat(web3.utils.fromWei(memberStats.deposits));
            const dripWithdrawals = parseFloat(web3.utils.fromWei(memberStats.payouts));
            let resp = await br34pContract.methods.balanceOf(downline[x]).call()
            const br34pBalance = parseFloat(await br34pContract.methods.balanceOf(downline[x]).call()) / 100000000;

            teamStats.TotalDeposits += dripDeposited;
            teamStats.TotalWithdrawals += dripWithdrawals;
            teamStats.TotalBr34p += br34pBalance;
        }

        teamStats.TotalUSD = (teamStats.TotalDeposits * dripStats.usdDripPrice);

        setTeamStats(teamStats);
        setLoadingStats(false);
    }

    const defiStrings = Strings.DefiWatcher;
    return (
        <Card className="bg-first px-4 pt-2 text-center dripView">
            {currentUserAddress && currentUserAddress.length > 0 ? teamStats === undefined || loadingStats ? (
                <div className='mt-5 skOverview-label'>
                    <ScaleLoader
                        color={'var(--green)'}
                        size={2}
                        loading={true}
                    />
                    <StringComponent string={defiStrings.string24} />
                </div>) : (
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <div className="p-1 text-center skOverview-label">
                            <div>
                                <FontAwesomeIcon
                                    icon={faScythe}
                                    className="font-size-xxl"
                                />
                            </div>
                            <div className="mt-2">
                                <div className="m-1 d-flex justify-content-center">
                                    <div className='drip-label mr-2'>{parseInt(teamStats.TotalBr34p.toFixed()).toLocaleString('en')}</div>
                                    <div className='text-white badge' style={{ backgroundColor: '#56c770' }}>Br34p</div>
                                </div>
                                <span className="">Team Br34P</span>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <div className="p-1 text-center skOverview-label">
                            <div>
                                <FontAwesomeIcon
                                    icon={faTint}
                                    className="font-size-xxl"
                                />
                            </div>
                            <div className="mt-2">
                                <div className="m-1 d-flex justify-content-center">
                                    <div className='drip-label mr-2'>
                                        {parseInt(teamStats.TotalDeposits.toFixed()).toLocaleString('en')}
                                    </div>
                                    <div className='text-white badge' style={{ backgroundColor: 'rgb(0,123,255)' }}>Drip</div>
                                </div>
                                <span className="">Team Deposits</span>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <div className="p-1 text-center skOverview-label">
                            <div>
                                <FontAwesomeIcon
                                    icon={faSackDollar}
                                    className="font-size-xxl"
                                />
                            </div>
                            <div className="mt-2">
                                <div className="m-1 d-flex justify-content-center">
                                    <div className='drip-label mr-2'>
                                        {parseInt(teamStats.TotalWithdrawals.toFixed()).toLocaleString('en')}
                                    </div>
                                    <div className='text-white badge' style={{ backgroundColor: '#f83245' }}>Drip</div>
                                </div>
                                <div className="">Team Withdrawals</div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <div className="p-1 text-center skOverview-label">
                            <div>
                                <FontAwesomeIcon
                                    icon={faPiggyBank}
                                    className="font-size-xxl"
                                />
                            </div>
                            <div className="mt-2">
                                <div className="m-1 d-flex justify-content-center">
                                    <div className='drip-label mr-2'>{parseFloat(teamStats.TotalUSD.toFixed()).toLocaleString('en')}</div>
                                    <div className='text-white badge' style={{ backgroundColor: '#56c770' }}>USD</div>
                                </div>
                                <div className="">Team USD</div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <div className="p-1 text-center skOverview-label">
                            <div>
                                <FontAwesomeIcon
                                    icon={faRaindrops}
                                    className="font-size-xxl"
                                />
                            </div>
                            <div className="mt-2">
                                <div className="m-1 d-flex justify-content-center">
                                    <div className='drip-label mr-2'>{parseInt(vaultDeposits.toFixed()).toLocaleString('en')}</div>
                                    <div className='text-white badge' style={{ backgroundColor: '#56c770' }}>DRIP</div>
                                </div>
                                <div className="">Drip in Vault</div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <div className="p-1 text-center skOverview-label">
                            <div>
                                <FontAwesomeIcon
                                    icon={faCauldron}
                                    className="font-size-xxl"
                                />
                            </div>
                            <div className="mt-2">
                                <div className="m-1 d-flex justify-content-center">
                                    <div className='drip-label mr-2'>
                                        {parseInt(vaultDailyEstimate.toFixed()).toLocaleString('en')}
                                    </div>
                                    <div className='text-white badge' style={{ backgroundColor: 'rgb(0,123,255)' }}>Drip</div>
                                </div>
                                <span className="">Daily Drip</span>
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
