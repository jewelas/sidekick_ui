import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useStoreActions } from 'easy-peasy';
import { useSKBalance, useXSKBalance, useStakingAllowance, usePriceOfXSkToSk } from 'hooks/useTokenFunctions';
import { approveStaking, stakeSideKick, unstakeSideKick } from 'utils/callHelpers';
import { Grid, Card, Button, List, ListItem, TextField, Tooltip, InputAdornment } from '@material-ui/core';
import { MoonLoader, RiseLoader, ScaleLoader } from 'react-spinners';
import { useStoreState } from 'easy-peasy';
import CountUp from 'react-countup';
import clsx from 'clsx';
import { useWallet } from 'use-wallet';
import miniLogo from '../../../assets/images/sidekick/logo/PNG Small/Logo_mark_blue.png';
import { getWeb3 } from 'utils/web3.js';
import { getStakingAddress } from 'utils/addressHelpers';
import StringComponent from '../../StringComponent';
import Strings from '../../../config/localization/translations';
import { useTotalSupply } from 'hooks/useTokenFunctions';
import { findSideKickByAddress } from 'utils/callHelpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoSquare } from '@fortawesome/pro-duotone-svg-icons';
import pancakeLogo from '../../../assets/images/stock-logos/pancakeswap-logo.svg';

export default function StakingForm() {
  const [skBalance, setSKBalance] = useState(0);
  const [loadingSkBalance, setLoadingSkBalance] = useState(false);
  const [xSkBalance, setXSkBalance] = useState(0);
  const [loadingXSkBalance, setLoadingXSkBalance] = useState(false);
  const [totalStakedSk, setTotalStakedSk] = useState(0);
  const [loadingTotalStakedSk, setLoadingTotalStakedSk] = useState(false);
  const [skToStake, setSKToStake] = useState('');
  const [loadingStaking, setLoadingStaking] = useState(false);
  const [xSkToUnstake, setXSkToUnstake] = useState('');
  const [loadingUnstaking, setLoadingUnstaking] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [canStake, setCanStake] = useState(false);
  const [loadingApproval, setLoadingApproval] = useState(false);
  const { currentUserAddress } = useStoreState((state) => state.Dapp);
  const { setTransactionMessage } = useStoreActions((state) => state.Dapp);
  const { firebase } = useStoreState((state) => state.Dapp);
      
  // let stkAbi = stakingAbi;
  const wallet = useWallet();
  const sk = useSKBalance(wallet);
  const xSk = useXSKBalance(wallet);
  const totalXSkSupply = useTotalSupply(getStakingAddress(), wallet);
  const priceOfXSkToSk = usePriceOfXSkToSk(totalXSkSupply, wallet);
  const approved = useStakingAllowance(wallet);
  const web3 = getWeb3(wallet);

  const [activeTab, setActiveTab] = useState('1');
  const [anchorEl, setAnchorEl] = useState(null);
  const [xPrice, setXPrice] = useState(undefined);

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const query = new URLSearchParams(useLocation().search);

  useEffect(() => {
    if (wallet.status === 'connected') {
      setLoadingSkBalance(true);
      if (
        typeof sk !== 'undefined' &&
        sk != undefined &&
        sk !== null &&
        sk != 'undefined'
      ) {
        setSKBalance(sk);
        setLoadingSkBalance(false);
      }

      setLoadingXSkBalance(true);
      setLoadingTotalStakedSk(true);
      if (xSk !== undefined && xSk !== null) {
        setXSkBalance(xSk);
        setLoadingXSkBalance(false);
      }

      if (priceOfXSkToSk !== undefined && priceOfXSkToSk !== null) {
        setXPrice(priceOfXSkToSk);
        setLoadingTotalStakedSk(false);
      }
    }
  }, [sk, xSk, totalXSkSupply, wallet, priceOfXSkToSk]);

  useEffect(() => {
    setIsApproved(approved);
  }, [approved]);

  const handleChange = (e) => {
    setSKToStake(e.target.value);
  };

  const handleUnstakeChange = (e) => {
    setXSkToUnstake(e.target.value);
  };

  const handleApproveStaking = async () => {
    setLoadingApproval(true);
    try {
      let response = await approveStaking(wallet, setTransactionMessage);

      setIsApproved(approved);
      setLoadingApproval(false);
    } catch (e) {
      console.log(e);
      setIsApproved(approved);

      setLoadingApproval(false);
    }
  };

  const handleUnstake = async () => {
    setLoadingUnstaking(true);
    try {
      let response = await unstakeSideKick(web3.utils.toWei(xSkToUnstake), wallet, setTransactionMessage);
      console.log(response);
      setLoadingUnstaking(false);
      
    } catch (e) {
      
      console.log(e);
      setLoadingUnstaking(false);
    }
  };

  const handleStake = async () => {
    try {
      setLoadingStaking(true);
      let response = await stakeSideKick(web3.utils.toWei(skToStake), wallet, setTransactionMessage);
    
      setLoadingStaking(false);
      const name = await findSideKickByAddress(wallet, wallet.account);

      const data = {
        account: wallet.account,
        message: `unstaked ${xSkToUnstake} SideKick`,
        name: name,
        time: Date.now() / 1000
      };
      await firebase.firestore.collection('system-notifications').add(data);
    } catch (e) {
      console.log(e);
      setLoadingStaking(false);
    }
  };

  const handleMax = (buyOrSell) => {
    if (buyOrSell === 'buy') {
      console.log(skBalance);
      setSKToStake((skBalance));
    }
    else {
      setXSkToUnstake((xSkBalance));
    }
  }
  const stakeFormStrings = Strings.StakingStrings.StakingForm;
  return (
    <>
      <div className="d-flex justify-content-center">        
        <Card className="pb-3 bg-primary text-white w-100 elevationClear">
          <div className="d-flex align-items-center justify-content-between card-header-alt p-0">
            <List
              component="div"
              className="w-100 nav-line justify-content-center d-flex nav-line-alt nav-tabs-secondary ">
              <ListItem
                button
                disableRipple
                className="px-5 py-4 "
                selected={activeTab === '1'}
                onClick={() => {
                  toggle('1');
                }}>
                <span className="font-weight-bold">
                  <StringComponent string={stakeFormStrings.string1} />
                </span>
                <div className="divider bg-second" />
              </ListItem>
              <ListItem
                button
                disableRipple
                className="px-5 py-4"
                selected={activeTab === '2'}
                onClick={() => {
                  toggle('2');
                }}>
                <span className="font-weight-bold">
                  <StringComponent string={stakeFormStrings.string2} />
                </span>
                <div className="divider bg-second" />
              </ListItem>
            </List>
          </div>

          <div
            className={clsx('tab-item-wrapper overflow-visible', {
              active: activeTab === '1'
            })}>
            <Grid
              container
              className="justify-content-center w-100 pb-3 text-center mt-5">
              <Grid item className="w-100">
                <div className="display-3 text-white font-weight-bold">
                  {loadingSkBalance ? (
                    <span className="mx-2">
                      <RiseLoader
                        color={'var(--green)'}
                        size={30}
                        loading={loadingSkBalance}
                      />
                    </span>
                  ) : (
                    <span>
                      <CountUp
                        start={0}
                        end={parseFloat(skBalance)}
                        duration={3}
                        separator=","
                        delay={0}
                        decimals={3}
                        decimal="."
                        prefix=""
                        suffix=""
                      />
                      <small>
                        <sup>SK</sup>
                      </small>
                    </span>
                  )}
                </div>
                {loadingTotalStakedSk && !loadingXSkBalance ? (
                  <span>
                    <div className="display-6 text-success">
                      <ScaleLoader
                        color={'var(--green)'}
                        size={2}
                        loading={true}
                      />
                      <small>
                        <sup><StringComponent string={stakeFormStrings.string5} /></sup>
                      </small>
                    </div>
                  </span>
                ) :
                  (
                    <span>
                      <div className="ml-3 display-6 text-success d-flex justify-content-center">
                        <CountUp
                          start={0}
                          end={1}
                          duration={1}
                          separator=","
                          delay={0}
                          decimals={3}
                          decimal="."
                          prefix=""
                          suffix=""
                        />
                        <small>
                          <sup>SK</sup>
                        </small>
                        <div className='ml-1 mr-1'>{`=`}</div>
                        <CountUp
                          start={0}
                          end={parseFloat(2 - xPrice)}
                          duration={1}
                          separator=","
                          delay={0}
                          decimals={3}
                          decimal="."
                          prefix=""
                          suffix=""
                        />

                        <small>
                          <sup>xSK</sup>
                        </small>
                      </div>
                      <div className="font-weight-bold opacity-7 text-uppercase pb-3">
                        <StringComponent string={stakeFormStrings.string3}/>
                        <Tooltip title={<StringComponent string={stakeFormStrings.string8}/>} arrow placement="top">
                        <span>
                          <FontAwesomeIcon
                            icon={faInfoSquare}
                            className="skIconColor ml-2"
                          />
                        </span>
                      </Tooltip>
                      </div>
                      {( wallet.status === 'connected' && skBalance > 0 ) ? (
                      <div className="my-3">
                        { xSkBalance < 50000 ? <div>Stake an additional <span className="font-weight-bold">{(50000 - xSkBalance).toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span><sup>SK</sup> to upgrade your SideKick experience to <span className="font-weight-bold">Superhero</span>. </div> : "" }                      
                        { (xSkBalance < 500000) ? <div className="mt-2">Stake an additional <span className="font-weight-bold">{(500000 - xSkBalance).toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span><sup>SK</sup> to upgrade your SideKick experience to <span className="font-weight-bold">Superhero Ultra</span>. </div> : ""}  
                      </div>) : "" }
                    </span>
                  )}
              </Grid>
            </Grid>
            {!loadingSkBalance && (
              <Grid
                container
                className="justify-content-center w-100 pb-3 text-center">
                <Grid item className="w-100">
                  <div className='ml-30 d-flex justify-content-center'>
                    <TextField
                      id="SkToStake"
                      placeholder="SIDEKICK"
                      value={skToStake}
                      onChange={handleChange}
                      InputProps={{ style: { color: 'white' }, endAdornment: <InputAdornment position='end'><Button size='small' onClick={() => handleMax('buy')} className="font-weight-bold btn-second text-first mb-1 mr-1">MAX</Button></InputAdornment>  }}></TextField>
                    <div className='text-success'>
                      = {parseFloat((2 - xPrice) * skToStake).toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} <small>
                        <sup>xSK</sup>
                      </small>
                    </div>
                  </div>
                  <div className="font-weight-bold opacity-7 text-uppercase pt-2 pb-3">
                    <StringComponent string={Strings.StakeString} />
                  </div>
                </Grid>
              </Grid>
            )}

            <Grid container className="justify-content-center mt-3">
              <Grid item className="pt-2 text-center">
                {!isApproved && <Button
                  size="large"
                  /*disabled={isApproved}*/
                  onClick={() => handleApproveStaking()}
                  className="font-weight-bold shadow-black-lg btn-second text-first m-2">
                  {loadingApproval ? (
                    <span className="px-3 py-0">
                      <MoonLoader
                        color={'var(--blue)'}
                        loading={loadingApproval}
                        size={25}
                      />
                    </span>
                  ) : (
                    <span>
                      <span className="btn-wrapper--label"><StringComponent string={stakeFormStrings.string4} /></span>
                      <img
                        alt="SideKick"
                        src={miniLogo}
                        className="btnBuyNowFooter app-nav-logo--text"
                      />
                    </span>
                  )}
                </Button> }

                <Button
                  disabled={!isApproved}
                  size="large"
                  onClick={() => handleStake()}
                  className="font-weight-bold shadow-black-lg btn-second text-first m-2">
                  {loadingStaking ? (
                    <span className="px-3 py-0">
                      <MoonLoader
                        color={'var(--blue)'}
                        loading={loadingStaking}
                        size={15}
                      />
                    </span>
                  ) : (
                    <span className="btn-wrapper--label"><StringComponent string={Strings.StakeString} /></span>
                  )}
                </Button>
                
                <Button
                  disabled={!isApproved}
                  size="large"
                  target="_blank"
                  href="https://pancakeswap.finance/swap?outputCurrency=0x5755E18D86c8a6d7a6E25296782cb84661E6c106"
                  className="font-weight-bold shadow-black-lg btn-second text-first">
                  <div className="btn-wrapper--label pancakeButton">
                    <StringComponent string={stakeFormStrings.string10} />
                    {!isApproved ?
                      <span className="pancakeIcon grayscale"> 
                        <img alt="Pancakeswap Logo" src={pancakeLogo} className="ml-2"/>
                      </span>
                     : 
                      <span className="pancakeIcon"> 
                        <img alt="Pancakeswap Logo" src={pancakeLogo} className="ml-2"/>
                      </span>
                    }
                  </div>                  
                </Button>
              </Grid>
            </Grid>
          </div>
          <div
            className={clsx('tab-item-wrapper overflow-visible', {
              active: activeTab === '2'
            })}>
            <Grid
              container
              className="justify-content-center w-100 pb-3 text-center">
              <Grid item className="w-100">
                <div className="display-3 text-white font-weight-bold">
                  {loadingXSkBalance ? (
                    <span className="mx-2">
                      <RiseLoader
                        color={'var(--green)'}
                        size={30}
                        loading={loadingSkBalance}
                      />
                    </span>
                  ) : (
                    <span>
                      <CountUp
                        start={0}
                        end={parseFloat(xSkBalance)}
                        duration={3}
                        separator=","
                        delay={0}
                        decimals={3}
                        decimal="."
                        prefix=""
                        suffix=""
                      />
                      <small>
                        <sup>xSK</sup>
                      </small>
                    </span>
                  )}
                </div>

                {loadingTotalStakedSk && !loadingXSkBalance ? (
                  <span>
                    <div className="display-6 text-success">
                      <ScaleLoader
                        color={'var(--green)'}
                        size={2}
                        loading={true}
                      />
                      <small>
                        <sup><StringComponent string={stakeFormStrings.string5} /></sup>
                      </small>
                    </div>
                  </span>
                ) :
                  (
                    <span>
                      <div className="ml-3 display-6 text-success d-flex justify-content-center">
                        <CountUp
                          start={0}
                          end={1}
                          duration={1}
                          separator=","
                          delay={0}
                          decimals={3}
                          decimal="."
                          prefix=""
                          suffix=""
                        />
                        <small>
                          <sup>xSK</sup>
                        </small>
                        <div className='ml-1 mr-1'>{`=`}</div>
                        <CountUp
                          start={0}
                          end={parseFloat(xPrice)}
                          duration={1}
                          separator=","
                          delay={0}
                          decimals={3}
                          decimal="."
                          prefix=""
                          suffix=""
                        />
                        <small>
                          <sup><StringComponent string={stakeFormStrings.string5} /></sup>
                        </small>
                      </div>
                      <div className="font-weight-bold opacity-7 text-uppercase pb-3">
                        <StringComponent string={stakeFormStrings.string9} className="mr-2" />
                        <Tooltip title={<StringComponent string={stakeFormStrings.string8}/>} arrow placement="top">
                        <span>
                          <FontAwesomeIcon
                            icon={faInfoSquare}
                            className="skIconColor ml-2"
                          />
                        </span>
                      </Tooltip>
                      </div>
                    </span>
                  )}
              </Grid>
            </Grid>
            {!loadingXSkBalance && (
              <Grid
                container
                className="justify-content-center w-100 pb-3 text-center">
                <Grid item className="w-100">
                  <div className='ml-30 d-flex justify-content-center'>
                    <TextField
                      id="skToStake"
                      placeholder="xSK"
                      value={xSkToUnstake}
                      onChange={handleUnstakeChange}
                      InputProps={{ style: { color: 'white' }, endAdornment: <InputAdornment position='end'><Button size='small' onClick={() => handleMax('sell')} className="font-weight-bold btn-second text-first mb-1 mr-1">MAX</Button></InputAdornment> }}
                    />
                    <div className='text-success'>
                      = {parseFloat(xPrice * xSkToUnstake).toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} <small>
                        <sup>SK</sup>
                      </small>
                    </div>
                  </div>
                  <div className="font-weight-bold opacity-7 pt-2 pb-3">
                    <StringComponent string={stakeFormStrings.string7} /> xSK
                  </div>
                </Grid>
              </Grid>
            )}

            <Grid container className="justify-content-center mt-3">
              <Grid item className="pt-2">
                <Button
                  size="large"
                  disabled={canStake}
                  onClick={() => handleUnstake()}
                  className="font-weight-bold shadow-black-lg btn-second text-first">
                  {loadingUnstaking ? (
                    <span className="px-3 py-0">
                      <MoonLoader
                        color={'var(--blue)'}
                        loading={loadingUnstaking}
                        size={15}
                      />
                    </span>
                  ) : (
                    <span className="btn-wrapper--label"><StringComponent string={stakeFormStrings.string7} /></span>
                  )}
                </Button>
              </Grid>
            </Grid>
          </div>
        </Card>
      </div>
    </>
  );
}
