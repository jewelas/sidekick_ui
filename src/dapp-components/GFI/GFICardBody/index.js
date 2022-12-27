import React, { useState, useEffect, } from 'react';
//import { useLocation } from 'react-router-dom';
import miniLogo from '../../../assets/images/sidekick/logo/PNG Small/Logo_mark_blue.png';
import CountUp from 'react-countup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Grid,
  Card,  
  Button,  
  TextField,
  Switch
} from '@material-ui/core';
import { useStoreActions } from 'easy-peasy';
import { useWallet } from 'use-wallet';
import { useXSKBalance } from 'hooks/useTokenFunctions';
import { useVaultStats, useVaultAllowance } from 'hooks/useGFI';
import { getWeb3 } from 'utils/web3.js';
import StringComponent from '../../StringComponent';
import Strings from '../../../config/localization/translations';
import {  faSackDollar, faMoneyBillWave, faPiggyBank, faHandHoldingUsd, faRedo, faRepeat } from '@fortawesome/pro-duotone-svg-icons';
import { gfiClaim, gfiCompound, gfiDeposit, gfiWithdraw, approveGFIVault } from 'utils/callHelpers';
export default function GFICardBody() {
  const [xSKBalance, setXSKBalance] = useState(0);
  const [xSKToDeposit, setXSKToDeposit] = useState('');
  const { setTransactionMessage } = useStoreActions((state) => state.Dapp);

  //Is Deposits Approved Check
  const [isApproved, setIsApproved] = useState(false);

  //Flow User stats
  const [gfiRewards, setGFIRewards] = useState(0);
  const [countUpStartRewards, setCountUpStartRewards] = useState(0);
  
  const [deposits, setDeposits] = useState(0);
  const [countUpStartDeposits, setCountUpStartDeposits] = useState(0);
  
  const [withdrawn, setWithdrawn] = useState(0);
  const [countUpStartWithdrawn, setCountUpStartWithdrawn] = useState(0);

  const [currentStake, setCurrentStake] = useState(0);
  const [countUpStartStake, setCountUpStartStake] = useState(0);
  
  const [compounds, setCompounds] = useState(0);
  const [countUpStartCompounds, setCountUpStartCompounds] = useState(0);

  const [totalCompounded, setTotalCompounded] = useState(0);
  const [countUpStartCompounded, setCountUpStartCompounded] = useState(0);
  // const [countUpStart, setCountUpStart] = useState(0);
  ///
  //const { flowUserInfo } = useStoreState((state) => state.Dapp);
  //Set FlowUserInfo in state so other shit can use it 
  const [gfiStats, setGFIStats] = useState(undefined);
  //const { setFlowUserInfo } = useStoreActions((actions) => actions.Dapp);

  const wallet = useWallet();
  const web3 = getWeb3(wallet);
  const vaultStats = useVaultStats(wallet);
  const xSK = useXSKBalance(wallet);
  const approved = useVaultAllowance(wallet);
  

  useEffect(() => {
    if (vaultStats !== null && vaultStats !== undefined) {
     
      //setFlowAccount(flowInfo);
      setGFIRewards(vaultStats.rewards);
      setDeposits(vaultStats.totalDeposit);
      setWithdrawn(vaultStats.withdrawn);
      setCurrentStake(vaultStats.currentStake);
      setCompounds(vaultStats.compounds);
      setTotalCompounded(vaultStats.totalCompounded);

      setCountUpStartRewards(gfiRewards);
      setCountUpStartDeposits(deposits);
      setCountUpStartWithdrawn(withdrawn);
      setCountUpStartStake(currentStake)
      setCountUpStartCompounds(compounds);
      setCountUpStartCompounded(totalCompounded);

      
      
      setGFIStats(vaultStats);

    }
  }, [vaultStats]); 

  useEffect(() => {
    if (xSK !== null && xSK !== undefined) {
      setXSKBalance(xSK);
    }
  }, [xSK]);


  useEffect(() => {
    if (approved !== null && approved !== undefined) {
      setIsApproved(approved);
    }
  }, [approved]);

   

  const handleChange = (e) => {
    setXSKToDeposit(e.target.value);
  }
  const handleDeposit = async () => {
    try {
      //format input
      const amount = xSKToDeposit;
      const response = await gfiDeposit(amount, wallet, setTransactionMessage);
      
    } catch (e) {
      console.log(e);
    }
  }
  
  const handleClaim = async() => {
    try {
      
      let response = await gfiClaim(wallet, setTransactionMessage);
    } catch (e) {
      console.log(e);
    }
  }
  const handleRoll = async() => {
    try {
      let response = await gfiCompound(wallet, setTransactionMessage);
      
    } catch (e) {
      console.log(e);
    }
  }
  const handleWithdraw = async () => {
    try {
      const amount = xSKToDeposit;
      let response = await gfiWithdraw(amount, wallet, setTransactionMessage);

    } catch (e) {
      console.log(e);
    }
  }

  const handleApprove = async() => {
    try {
      let response = await approveGFIVault(wallet, setTransactionMessage);
     
      setIsApproved(response.status);
    } catch (e) {
      console.log(e);
      setIsApproved(approved);
    }
  } 
  //const stakeFormStrings = Strings.StakingStrings.StakingForm;
  
return (
  <>
    <Card className="p-4 bg-first p-lg-5">
      <div className="rounded p-4  text-center border-light mb-5 border-1">
        <Grid container spacing={6} className='mt-1 mb-3'>
          <Grid item md={4}>
            <FontAwesomeIcon
              icon={faMoneyBillWave}
              size="3x"
              className="skIconColor"
            />
            <div className="text-white pb-1">Current Stake</div>
            <div className="font-size-lg d-flex align-items-center justify-content-center text-second">
              <small className="opacity-6 pr-1">xSK</small>
              <span>
                <CountUp
                  start={countUpStartStake}
                  end={currentStake}
                  duration={2}
                  separator=""
                  decimals={3}
                  decimal="."
                  prefix=""
                  suffix=""
                />
              </span>
            </div>
          </Grid>
          <Grid item md={4}>
            <FontAwesomeIcon
              icon={faPiggyBank}
              size="3x"
              className="skIconColor"
            />
            <div className="text-white pb-1">Deposits</div>
            <div className="font-size-lg d-flex align-items-center justify-content-center text-second">
              <small className="opacity-6 pr-1">xSK</small>
              <span>
                <CountUp
                  start={countUpStartDeposits}
                  end={deposits}
                  duration={2}
                  deplay={2}
                  separator=""
                  decimals={3}
                  decimal="."
                />
              </span>
            </div>
          </Grid>
          <Grid item md={4}>
            <FontAwesomeIcon
              icon={faSackDollar}
              size="3x"
              className="skIconColor"
            />
            <div className="text-white pb-1">Rewards</div>
            <div className="font-size-lg d-flex align-items-center justify-content-center text-second">
              <small className="opacity-6 pr-1">xSK</small>
              <span>
                <CountUp
                  start={countUpStartRewards}
                  end={gfiRewards}
                  duration={1}
                  deplay={2}
                  separator=""
                  decimals={3}
                  decimal="."
                />
              </span>
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={6}>
          <Grid item md={4}>
            <FontAwesomeIcon
              icon={faRepeat}
              size="3x"
              className="skIconColor"
            />
            <div className="text-white pb-1">Compounds</div>
            <div className="font-size-lg d-flex align-items-center justify-content-center text-second">
              <span>
                <CountUp
                  start={countUpStartCompounds}
                  end={compounds}
                  duration={1}
                  separator=""
                  decimals={0}
                  decimal="."
                  prefix=""
                  suffix=""
                />
              </span>
            </div>
          </Grid>
          <Grid item md={4}>
            <FontAwesomeIcon
              icon={faHandHoldingUsd}
              size="3x"
              className="skIconColor"
            />
            <div className="text-white pb-1">Withdrawn</div>
            <div className="font-size-lg d-flex align-items-center justify-content-center text-second">
              <small className="opacity-6 pr-1">xSK</small>
              <span>
                <CountUp
                  start={countUpStartWithdrawn}
                  end={withdrawn}
                  duration={1}
                  deplay={2}
                  separator=""
                  decimals={3}
                  decimal="."
                />
              </span>
            </div>
          </Grid>
          <Grid item md={4}>
            <FontAwesomeIcon icon={faRedo} size="3x" className="skIconColor" />
            <div className="text-white pb-1">Compounded</div>
            <div className="font-size-lg d-flex align-items-center justify-content-center text-second">
              <small className="opacity-6 pr-1">xSK</small>
              <span>
                <CountUp
                  /* TODO CHANGE Start property below!!! */
                  start={countUpStartCompounded}
                  end={totalCompounded}
                  duration={1}
                  deplay={2}
                  separator=""
                  decimals={3}
                  decimal="."
                />
              </span>
            </div>
          </Grid>
        </Grid>
      </div>


      <div className='justify-content-center gfi-form'>
      <Grid container>
        <Grid container item>
          <Grid item xs={8}>
            <div>
              <span className="text-white">Deposit</span>
            </div>
          </Grid>
          <Grid item>
            <span className="text-white ">
              Balance: {parseFloat(xSKBalance).toFixed(3)}
            </span>
          </Grid>
        </Grid>
        <Grid container item>
          <Grid item xs={10}>
            <TextField
              id="xSKToDeposit"
              placeholder="xSK"
              fullWidth={true}
              value={xSKToDeposit}
              onChange={handleChange}
              InputProps={{ style: { color: 'white' } }}></TextField>
          </Grid>
          <Grid container item>
            <Grid item>
              <small className="skGoldSubtext">
                10% Transaction fee is charged on deposits and withdraws
              </small>
            </Grid>
          </Grid>
        </Grid>
        <Grid container item>
          <Grid item className="mr-3">
            <span>
              <Switch
                checked={isApproved}
                //onClick={handleApprove}
                className="switch-medium toggle-switch-line toggle-switch-success"
              />
            </span>
          </Grid>
          <Grid item>
            <span className="text-white">APPROVE DEPOSITS</span>
          </Grid>
        </Grid>
        <Grid container item className="mt-3">
          <Grid item xs={5} className="pr-1">
            <Button
              fullWidth={true}
              size="large"
              disabled={!isApproved}
              onClick={() => handleDeposit()}
              className="font-weight-bold shadow-black-lg btn-second text-first">
              <span>
                <span className="btn-wrapper--label">DEPOSIT</span>
                <img
                  alt="SideKick"
                  src={miniLogo}
                  className="btnBuyNowFooter app-nav-logo--text"
                />
              </span>
            </Button>
          </Grid>
          <Grid item xs={5}>
            <Button
              size="large"
              fullWidth={true}
              disabled={!isApproved}
              onClick={() => handleWithdraw()}
              className="font-weight-bold shadow-black-lg btn-second text-first">
              <span>
                <span className="btn-wrapper--label">WITHDRAW</span>
                <img
                  alt="SideKick"
                  src={miniLogo}
                  className="btnBuyNowFooter app-nav-logo--text"
                />
              </span>
            </Button>
          </Grid>
        </Grid>
        <Grid container item className="mt-1">
          <Grid item xs={5} className="pr-1">
            <Button
              size="large"
              fullWidth={true}
              disabled={!isApproved}
              onClick={() => handleClaim()}
              className="font-weight-bold shadow-black-lg btn-second text-first">
              <span>
                <span className="btn-wrapper--label">CLAIM</span>
                <img
                  alt="SideKick"
                  src={miniLogo}
                  className="btnBuyNowFooter app-nav-logo--text"
                />
              </span>
            </Button>
          </Grid>
          <Grid item xs={5}>
            <Button
              size="large"
              fullWidth={true}
              disabled={!isApproved}
              onClick={() => handleRoll()}
              className="font-weight-bold shadow-black-lg btn-second text-first">
              <span>
                <span className="btn-wrapper--label">ROLL</span>
                <img
                  alt="SideKick"
                  src={miniLogo}
                  className="btnBuyNowFooter app-nav-logo--text"
                />
              </span>
            </Button>
          </Grid>
        </Grid>
        
        </Grid>
        </div>
    </Card>
  </>
);
}