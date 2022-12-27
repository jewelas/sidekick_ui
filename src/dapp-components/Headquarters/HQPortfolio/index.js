import React, { useEffect, useState } from 'react';
import StringComponent from '../../StringComponent';
import Strings from '../../../config/localization/translations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RiseLoader } from 'react-spinners';
import { Grid, Card,  Button, InputAdornment, DialogContentText, Dialog, DialogContent, TextField, DialogTitle, DialogActions } from '@material-ui/core';
import HQFeaturedTable from './HQPortfolioTable';
import HQExposureChart from './HQExposureChart';

import { faAnalytics, faPlusSquare, faCoin } from '@fortawesome/pro-duotone-svg-icons';
import clsx from 'clsx';

import { useStoreActions, useStoreState } from 'easy-peasy';
import NameServiceComponent from 'dapp-components/NameReturn';
import AvatarCheck from 'dapp-components/AvatarCheck';
import { useWallet } from 'use-wallet'
import { GetTokenSearch } from 'services/FirebaseService';

export default function HQPortfolio(props) {
    const { userCoinsList } = useStoreState(state => state.Dapp);
    const { setUserCoinsList } = useStoreActions(state => state.Dapp);
    const [tokenContract, setTokenContract] = useState(undefined);
    const [totalUSD, setTotalUSD] = useState(0);
    const [totalTokens, setTotalTokens] = useState(0);
    const [totalDebt, setTotalDebt] = useState(0);
    const wallet = useWallet();
    const userCoinsCache = 'UserCoinsList';

    const { data, noData, isLoading, currentTags, setTags } = props;

    useEffect(() => {
        if (data !== undefined) {
            setTotalUSD(data.totalUSD);
            setTotalTokens(data.totalTokens);
        }

    }, [data])

    const [anchorEl, setAnchorEl] = useState(null);
    const handleChange = (event) => {
        setTokenContract(event.target.value);
    }
    const handleSubmit = async() => {
        console.log(tokenContract);
        
        const data = await GetTokenSearch(tokenContract, "bsc");
        

        if (userCoinsList.length > 0) {
            if (data.data.search.length === 1) {
                const token = data.data.search[0].subject;
                const tokenList = userCoinsList;
                tokenList.push(token);
                setUserCoinsList(tokenList);
                localStorage.setItem(userCoinsCache, JSON.stringify(tokenList));
                handleClose1();
            }
        } else {
            const token = data.data.search[0].subject;
            const tokenList = userCoinsList;
            tokenList.push(token);
            setUserCoinsList(tokenList);
            localStorage.setItem(userCoinsCache, JSON.stringify(tokenList));
            handleClose1();
        }
        
    }

    const renderFeaturedTable = () => {
        return <HQFeaturedTable data={data} noData={noData} isLoading={isLoading} currentTags={currentTags} setTags={setTags}  />
    }

    const renderExposureChart = () => {
        return <HQExposureChart data={data} noData={noData} isLoading={isLoading} />
    }
    const [open1, setOpen1] = useState(false);

     const handleClickOpen1 = () => {
       setOpen1(true);
     };

     const handleClose1 = () => {
       setOpen1(false);
     };

    const defiStrings = Strings.DefiWatcher;
    return (
        <span>

        
        <Card className={clsx('bg-first', 'text-center','px-2', 'skOverview')}>
            <div className="card-header-alt pt-3">
                <div className="skOverview-label-sm mb-0 d-flex align-items-center justify-content-center flex-wrap">
                    {/* <div className="avatar-icon-wrapper avatar-icon-sm">
                        <a href={currentTokenInfo ? currentTokenInfo.siteUrl : ''} target='_blank' className="avatar-icon">
                            <img src={currentTokenInfo ? currentTokenInfo.logoUrl : 'https://i.imgur.com/kyvXrEK.png'} alt="..." />
                        </a>
                    </div> */}
                        { wallet.status === 'connected' &&
                            <AvatarCheck address={wallet.account} size={`lg`}/>}
                    <div className='mx-2 truncate'><NameServiceComponent address={wallet.account} /></div>
                    <StringComponent string={defiStrings.string39} />
                </div>
            </div>
            {isLoading ? (
                <div className="my-9 py-3">
                    <h6 className='text-white' >
                        Loading... Could take longer for large portfolios...
                    </h6>
                    <span className="mx-2 mt-5">
                        <RiseLoader
                            color={'var(--green)'}
                            size={25}
                            loading={isLoading}
                        />
                    </span>
                </div>) : (
                <>
                    <Grid container spacing={1} className='mt-3 skOverview-label-sm' >
                        <Grid item xs={4} >
                            <span>Net Worth</span>
                        </Grid>
                        <Grid item xs={4}>
                            <span>Total Assets</span>
                        </Grid>
                        <Grid item xs={4}>
                            <span>Total Debts</span>
                        </Grid>
                        <Grid item xs={4}>
                            {totalUSD > 1000000 ? '$' + parseInt(totalUSD).toLocaleString('en') : '$' + parseFloat(totalUSD).toFixed(2)}
                        </Grid>
                        <Grid item xs={4}>
                            {totalUSD > 1000000 ? '$' + parseInt(totalUSD).toLocaleString('en') : '$' + parseFloat(totalUSD).toFixed(2)}
                        </Grid>
                        <Grid item xs={4}>
                            {totalDebt > 1000000 ? '$' + parseInt(totalDebt).toLocaleString('en') : '$' + parseFloat(totalDebt).toFixed(2)}
                        </Grid>
                    </Grid>
                </>
            )}
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    {isLoading ? undefined : renderExposureChart()}
                </Grid>
                <Grid item xs={12}>
                    {isLoading ? undefined : renderFeaturedTable()}
                </Grid>
                <Grid item xs={4}>
                    <Button
                        // size="large"
                        // fullWidth={true}
                        //disabled={!isApproved}
                        onClick={handleClickOpen1}
                        className="font-weight-bold shadow-black-lg btn-second text-first mt-3">
                        <div className='d-flex justify-content-between'>
                            <div className="mr-2" style={{ alignSelf: 'center' }}>Add</div>
                            <FontAwesomeIcon icon={faPlusSquare} size='2x' className='' />
                        </div>
                    </Button>
                </Grid>
                <Grid item xs={8}>
                    <Button
                        // size="large"
                        // fullWidth={true}
                        //disabled={!isApproved}
                        // onClick={() => handleRoll()}
                        className="font-weight-bold shadow-black-lg btn-second text-first mt-3">
                        <div className='d-flex justify-content-between'>
                            <div className="mr-2" style={{ alignSelf: 'center' }}>REQUEST NEW TRACKING</div>
                            <FontAwesomeIcon icon={faAnalytics} size='2x' className='' />
                        </div>
                    </Button>
                </Grid>
            </Grid>
            </Card>
            <Dialog classes={{ paper: 'modal-content bg-primary rounded-lg modal-dark' }} open={open1} onClose={handleClose1} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Feature New Token</DialogTitle>
                        <DialogContent className="p-4">
                            <DialogContentText>
                                Please enter the contract address of the token you would like to add.
                            </DialogContentText>
                            <DialogContentText className="mb-0">
                                <TextField
                                    className="text-white-50"
                                    variant="outlined"
                                    size="small"
                                    autoFocus
                                    margin="dense"
                                    id="input-with-icon-textfield134"
                                    label="Token Contract"
                                    type=""
                                    onChange={handleChange}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <FontAwesomeIcon icon={faCoin} size='1x' className='' />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions className="p-4">
                            <Button onClick={handleClose1} variant="text" className="bg-white-10 text-white mr-3 shadow-none">
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit} className="btn-success shadow-none">
                                Submit
                            </Button>
                        </DialogActions>
                    </Dialog>
            </span>
    );
}
