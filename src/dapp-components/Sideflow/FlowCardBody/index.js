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
import { useStoreState, useStoreActions } from 'easy-peasy';
import { useWallet } from 'use-wallet';
import { useFlowAccount, useFlowAllowance } from 'hooks/useFlow';
import { useDripBalance } from 'hooks/useTokenFunctions';
import { getWeb3 } from 'utils/web3.js';
import { faTreasureChest, faSackDollar, faMoneyBillWave, faPiggyBank, faBatteryFull, faUsers } from '@fortawesome/pro-duotone-svg-icons';
import { flowClaim, roll, deposit, approveDeposit } from 'utils/callHelpers';
export default function FlowCardBody() {
  const [dripBalance, setDripBalance] = useState(0);
  const [dripToDeposit, setDripToDeposit] = useState('');

  //Is Deposits Approved Check
  const [isApproved, setIsApproved] = useState(false);

  //Flow User stats
  const [availableClaim, setAvailableClaim] = useState(0);
  const [countUpStartAvailable, setCountUpStartAvailable] = useState(0);
  
  const [deposits, setDeposits] = useState(0);
  const [countUpStartDeposits, setCountUpStartDeposits] = useState(0);
  
  const [claimed, setClaimed] = useState(0);
  const [countUpStartClaimed, setCountUpStartClaimed] = useState(0);
  
  const [rewarded, setRewarded] = useState(0);
  const [countUpStartRewarded, setCountUpStartRewarded] = useState(0);

  const [maxPayout, setMaxPayout] = useState(0);
  const [countUpStartPayout, setCountUpStartPayout] = useState(0);

  const [directReferrals, setDirectReferrals] = useState(0);
  const [totalReferrals, setTotalReferrals] = useState(0);

  const [buddy, setBuddy] = useState(null);
  // const [countUpStart, setCountUpStart] = useState(0);
  ///
  //const { flowUserInfo } = useStoreState((state) => state.Dapp);
  //Set FlowUserInfo in state so other shit can use it 
  const { setFlowUserInfo } = useStoreActions((actions) => actions.Dapp);

  const wallet = useWallet();
  const web3 = getWeb3(wallet);
  const flowInfo = useFlowAccount(wallet);
  const drip = useDripBalance(wallet);
  const approved = useFlowAllowance(wallet);

  useEffect(() => {
    if (flowInfo !== null && flowInfo !== undefined) {
     
      //setFlowAccount(flowInfo);
      setAvailableClaim(flowInfo.availableClaim);
      setDeposits(flowInfo.deposits);
      setClaimed(flowInfo.payouts);
      //TODO Break rewards stat down in stat tab maybe? to show exact rewarded from direct vs match.
      setRewarded(flowInfo.direct_bonus + flowInfo.match_bonus);
      setMaxPayout(flowInfo.maxPayout);
      setDirectReferrals(flowInfo.referrals);
      setTotalReferrals(flowInfo.total_structure);

      setCountUpStartAvailable(availableClaim);
      setCountUpStartDeposits(deposits);
      setCountUpStartPayout(claimed);
      setCountUpStartRewarded(rewarded);
      setCountUpStartPayout(maxPayout);
      setBuddy(flowInfo.buddy);
      setFlowUserInfo(flowInfo);

    }
  }, [flowInfo]);

  useEffect(() => {
    if (drip !== null && drip !== undefined) {
      setDripBalance(drip);
    }
  }, [drip]);

  useEffect(() => {
    if (approved !== null && approved !== undefined) {
      setIsApproved(approved);
    }
  }, [approved]);

  const handleChange = (e) => {
    setDripToDeposit(e.target.value);
  }
  const handleDeposit = async () => {
    try {
      //format input
      const amount = web3.utils.toWei(dripToDeposit);
      const response = await deposit(buddy, amount, wallet)
      
    } catch (e) {
      
    }
  }
  const handleClaim = async() => {
    try {
      
      let response = await flowClaim(wallet);
    } catch (e) {
      console.log(e);
    }
  }
  const handleRoll = async() => {
    try {
      let response = await roll(wallet);
      
    } catch (e) {
      console.log(e);
    }
  }
  const handleApprove = async() => {
    try {
      let response = await approveDeposit(wallet);
     
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
        <Grid container spacing={6}>
          <Grid item md={4}>
            <FontAwesomeIcon icon={faMoneyBillWave} size='3x' className='skIconColor' />
            <div className="text-white pb-1">Available</div>
            <div className="font-size-lg d-flex align-items-center justify-content-center text-second">
              <small className="opacity-6 pr-1">mSK</small>
              <span>
                <CountUp
                  start={countUpStartAvailable}
                  end={availableClaim}
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
          <FontAwesomeIcon icon={faPiggyBank} size='3x' className='skIconColor'/>
            <div className="text-white pb-1">Deposits</div>
            <div className="font-size-lg d-flex align-items-center justify-content-center text-second">
              
              <small className="opacity-6 pr-1">mSK</small>
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
          <FontAwesomeIcon icon={faSackDollar} size='3x' className='skIconColor'/>
            <div className="text-white pb-1">Claimed</div>
            <div className="font-size-lg d-flex align-items-center justify-content-center text-second">
              <small className="opacity-6 pr-1">mSK</small>
              <span>
                <CountUp
                  start={countUpStartClaimed}
                  end={claimed}
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
            <FontAwesomeIcon icon={faTreasureChest} size='3x' className='skIconColor'/>
            <div className="text-white pb-1">Rewarded</div>
            <div className="font-size-lg d-flex align-items-center justify-content-center text-second">
              
              <small className="opacity-6 pr-1">mSK</small>
              <span>
                <CountUp
                  start={countUpStartRewarded}
                  end={rewarded}
                  duration={1}
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
          <FontAwesomeIcon icon={faBatteryFull} size='3x' className='skIconColor'/>
            <div className="text-white pb-1">Max Payout</div>
            <div className="font-size-lg d-flex align-items-center justify-content-center text-second">
              
              <small className="opacity-6 pr-1">mSK</small>
              <span>
                <CountUp
                  start={countUpStartPayout}
                  end={maxPayout}
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
          <FontAwesomeIcon icon={faUsers} size='3x'className='skIconColor'/>
            <div className="text-white pb-1">Sidekicks</div>
            <div className="font-size-lg d-flex align-items-center justify-content-center text-second">
              <span>{directReferrals} / {totalReferrals}</span>
            </div>
          </Grid>
        </Grid>
      </div>


      <Grid container >
        <Grid container item >
          <Grid item xs={8}>
          <div>
        <span className="text-white">Deposit</span>
        
      </div>
          </Grid>
          <Grid item>
            <span className='text-white '>
            Balance: {parseFloat(dripBalance).toFixed(3)}
            </span>
          </Grid>
        </Grid>
        <Grid container item>
          <Grid item xs={10}>
          <TextField
                      id="dripToDeposit"
          placeholder="mSK"
          fullWidth={true}
                      value={dripToDeposit}
                      onChange={handleChange}
          InputProps={{ style: { color: 'white' } }}></TextField>
          </Grid>
          <Grid container item>
            <Grid item><small className='skGoldSubtext'>X% Transaction fee is charged on deposits</small></Grid>
          </Grid>
          
        </Grid>
        <Grid container item>
            <Grid item className='mr-3'>
              <span><Switch
            checked={isApproved}
            onClick={handleApprove}
            className="switch-medium toggle-switch-line toggle-switch-success"
          /></span>
            </Grid>
            <Grid item><span className="text-white">APPROVE DEPOSITS</span></Grid>
          </Grid>
        <Grid container item className='mt-3'>
          <Grid item xs={5} className='pr-1'>
            <Button
              fullWidth={true}
                  size="large"
                  //disabled={!isApproved}
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
                  //disabled={!isApproved}
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
        </Grid>
        <Grid container item className="mt-1">
          <Grid item xs={10}>
          <Button
              size="large"
              fullWidth={true}
                  //disabled={!isApproved}
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
    </Card>
  </>
);
}