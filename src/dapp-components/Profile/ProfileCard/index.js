import React, { useState, useEffect } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { Card, Container, Button, List, ListItem, TextField, Switch, FormControl, InputLabel, Select, MenuItem, Tooltip } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useWallet } from 'use-wallet';
import CountUp from 'react-countup';
import sideKickGif from 'assets/images/sidekick/animation/Sidekick_transparent_large.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMask, faInfoSquare } from '@fortawesome/pro-duotone-svg-icons';
import StringComponent from '../../StringComponent';
import Strings from '../../../config/localization/translations';
import { RiseLoader } from 'react-spinners';
import { updateSideKickName, checkSideKickName, approveNameService, updateSideKickNFT, approveSubscriptionContract } from 'utils/callHelpers';
import { useNameServiceAllowance } from 'hooks/useNameService';
import { useSubscriptionAllowance, useSubscriptionLevel } from 'hooks/useSKSubscription';
import NameServiceComponent from 'dapp-components/NameReturn'
import { findSideKickByAddress, findAddressByName, subscribeToContract, paySubscription } from 'utils/callHelpers';
import { useLocation } from 'react-router-dom';
import { useSKBalance, useXSKBalance, useStakingAllowance, usePriceOfXSkToSk } from 'hooks/useTokenFunctions';

export default function ProfileCard(props) {
  const [sideKickName, setSideKickName] = useState('');
  const [nftAddress, setNFTAddress] = useState('');
  const [nftId, setNFTId] = useState('');
  const [nameCheck, setNameCheck] = useState(null);
  const [buttonCheck, setButtonCheck] = useState(true);
  const [isApproved, setIsApproved] = useState(false);
  const [isSubscriptionApproved, setIsSubscriptionApproved] = useState(false);
  const [heroToLookUp, setHeroToLookUp] = useState('');
  const [lookUpResult, setLookUpResult] = useState(null);
  const [resultText, setResultText] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState(0);
  const { avatar, selectedNameService, subscription } = useStoreState((state) => state.Dapp);
  const { setSelectedNameService, setTransactionMessage, setSubscription } = useStoreActions((actions) => actions.Dapp);
  const { selectedLangauge } = useStoreState((state) => state.Dapp);

  const wallet = useWallet();
  const approved = useNameServiceAllowance(wallet);
  const subscriptionApproved = useSubscriptionAllowance(wallet);
  const { firebase } = useStoreState((state) => state.Dapp);
  const zeroAddress = '0x0000000000000000000000000000000000000000';

  console.log('load');
  const skBalance = useSKBalance(wallet);
  const xskBalance = useXSKBalance(wallet);

  const query = new URLSearchParams(useLocation().search);

  const urlAddress = query.get('tab');

  const sub = useSubscriptionLevel(wallet)
  const [activeTab, setActiveTab] = useState(props.tab);
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {
    if (subscriptionApproved !== null && subscriptionApproved !== undefined) {
      setIsSubscriptionApproved(subscriptionApproved);
    }
  }, [subscriptionApproved]);

  useEffect(() => {
    if (sub !== null && sub !== undefined) {
      setSubscription(sub);
    }
  }, [sub]);

  useEffect(() => {
    if (approved !== null && approved !== undefined) {
      setIsApproved(approved);
    }
  }, [approved]);

  //SideKick Name Input Handle
  const handleChange = (e) => {
    setSideKickName(e.target.value);
    if (nameCheck !== null) {
      setNameCheck(null);
    }
    if (e.target.value.replace(/ /g, '') === '') {
      setButtonCheck(true);
    } else {
      setButtonCheck(false);
    }
  };
  //Hero Lookup Input handle
  const handleChangeLookup = (e) => {
    setHeroToLookUp(e.target.value);
  };
  //NFT Input handle
  const handleChangeNFT = (e) => {
    setNFTAddress(e.target.value);
  };
  const handleChangeNFTId = (e) => {
    setNFTId(e.target.value);
  };
  //NameService Dropdown handler
  const handleChangeNameService = (e) => {
    setSelectedNameService(e.target.value);
  };
  //Subscription Dropdown Handler
  const handleChangeSelectedSub = (e) => {
    setSelectedSubscription(e.target.value);
  }

  // Update Users name -- Contract call on Name Service
  const handleUpdateName = async () => {
    try {
      const result = await updateSideKickName(wallet, sideKickName, setTransactionMessage);

      const data = {
        account: wallet.account,
        message: `has updated their name to ${sideKickName}`,
        name: wallet.account,
        time: Date.now() / 1000
      };
      await firebase.firestore.collection('system-notifications').add(data);
    } catch (e) {
      console.log(e);
    }
  };
  //Update NFT Picture -- Contract call on Name Service
  const handleUpdateNFT = async () => {
    try {
      const result = await updateSideKickNFT(wallet, nftAddress, nftId, setTransactionMessage);
      const name = await findSideKickByAddress(wallet, wallet.account);

      const data = {
        account: wallet.account,
        message: `updated their NFT picture`,
        name: wallet.account,
        time: Date.now() / 1000
      };
      await firebase.firestore.collection('system-notifications').add(data);
    } catch (e) {
      console.log(e);
    }
  };
  //Approve for Name Service Contract
  const handleApprove = async () => {
    try {
      let response = await approveNameService(wallet,);

      setIsApproved(response.status);
    } catch (e) {
      console.log(e);
      setIsApproved(approved);
    }
  };

  const checkNameAvailability = async (name) => {
    try {
      const result = await checkSideKickName(wallet, sideKickName);
      setNameCheck(result);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCheckName = async () => {
    try {
      let result = '';
      if (heroToLookUp.startsWith('0x')) {
        result = await findSideKickByAddress(wallet, heroToLookUp);
        setResultText('Found Name by Address: ');
      } else {
        result = await findAddressByName(wallet, heroToLookUp);
        setResultText('Found Address by Name: ');
      }
      if (result === '' || result === zeroAddress) {
        setLookUpResult('Not Found');
      } else {
        setLookUpResult(result);
      }
    } catch (e) {
      console.log(e);
    }
  };

  //Subscription Contract Functions
  const handleApproveSubscription = async () => {
    try {
      let response = await approveSubscriptionContract(wallet);
    } catch (e) {
      console.log(e);
    }
  }

  const handleSubscribe = async () => {
    try {
      let response = await subscribeToContract(selectedSubscription, wallet, setTransactionMessage)
    } catch (e) {
      console.log(e);
    }
  }

  const handlePayment = async () => {
    try {
      let response = await paySubscription(sub.id, wallet, setTransactionMessage)
    } catch (e) {
      console.log(e);
    }
  }

  const dateFormat = (date) => {
    if (date === 0) {
      return 'None';
    }
    const formatted = date.getDay() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    //Day / month / year format for international users
    return formatted;
  }

  const ProfileStrings = Strings.Profile;

  const getString = (jsonPath, langaugeId) => {
    return jsonPath[langaugeId] === '' ? jsonPath[1] : jsonPath[langaugeId];
  }

  return (
    <>
      <Container>
        <div className="d-flex justify-content-center skEventZ">
          <Card className="text-center py-4 px-6  bg-first text-white w-50">
            <div className="display-4 line-height-1 font-weight-bold mr-3 d-flex justify-content-center text-center">
              <FontAwesomeIcon icon={faMask} className="skIconColor mr-2" />{' '}
              <StringComponent string={ProfileStrings.string0} />
            </div>
            <div className="my-2 eventMainDivider" />
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
                  <span className="font-weight-bold text-uppercase">
                    <StringComponent string={ProfileStrings.string15} />
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
                  <span className="font-weight-bold text-uppercase">
                    <StringComponent string={ProfileStrings.string16} />
                  </span>
                  <div className="divider bg-second" />
                </ListItem>
              </List>
            </div>
            <div className={clsx('tab-item-wrapper overflow-visible', { active: activeTab === '1' })}>
              <div className="pt-3 mt-5 mb-2">
                <FormControl fullWidth variant="outlined" color='red' className="w-75 text-center mb-2">
                  <InputLabel className='text-white'><StringComponent string={ProfileStrings.string1} /></InputLabel>
                  <Select
                    value={selectedNameService}
                    onChange={handleChangeNameService}
                    label={<StringComponent string={ProfileStrings.string1} />}>
                    <MenuItem value={'sidekick'}><StringComponent string={ProfileStrings.string2} /></MenuItem>
                    <MenuItem value={'gangster'}><StringComponent string={ProfileStrings.string3} /></MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="mb-2">
                <Switch
                  checked={isApproved}
                  onClick={handleApprove}
                  className="switch-medium toggle-switch-line toggle-switch-success mr-2"
                />
                <small className="skGoldSubtext text-uppercase"><StringComponent string={ProfileStrings.string4} /></small>{' '}
                <Tooltip title={<StringComponent string={ProfileStrings.string5} />} arrow placement="top">
                  <span>
                    <FontAwesomeIcon
                      icon={faInfoSquare}
                      className="skIconColor ml-1"
                    />
                  </span>
                </Tooltip>
              </div>

              <div className="avatar-icon-wrapper avatar-icon-lg">
                <div className="avatar-icon">
                  {avatar !== null && avatar !== undefined ? (
                    <img alt="..." className="img-fluid" src={avatar} />
                  ) : (
                    <img title={<StringComponent string={ProfileStrings.string17} />} alt="..." className="img-fluid" src={sideKickGif} />
                  )}
                </div>
              </div>

              <h4 className="font-size-lg font-weight-bold my-2">
                {wallet.status === 'connected' && (
                  <NameServiceComponent address={wallet.account} />
                )}
              </h4>

              <div className="mt-3">
                <div>
                  <span>
                    <h6>
                      <StringComponent string={ProfileStrings.string6} />
                      <Tooltip title={<StringComponent string={ProfileStrings.string7} />} arrow placement="top">
                        <span>
                          <FontAwesomeIcon
                            icon={faInfoSquare}
                            className="skIconColor ml-2"
                          />
                        </span>
                      </Tooltip>
                    </h6>
                  </span>
                  <TextField
                    className="mb-2"
                    placeholder={getString(ProfileStrings.string6, selectedLangauge)}
                    //fullWidth={true}
                    //value={skToStake}
                    onChange={handleChange}
                    InputProps={{ style: { color: 'white' } }}></TextField>
                </div>
                {nameCheck === false && (
                  <small className="text-danger pb-1">
                    {sideKickName}{' '}<StringComponent string={ProfileStrings.string8} />
                  </small>
                )}
                {nameCheck === true && (
                  <small>
                    <span className="skGoldSubtext pb-1">{sideKickName}</span>{' '}
                    <span className="text-success"><StringComponent string={ProfileStrings.string9} /> </span>
                  </small>
                )}
              </div>

              <div>
                {nameCheck === false || nameCheck === null ? (
                  <Button
                    onClick={checkNameAvailability}
                    //fullWidth={true}
                    disabled={buttonCheck}
                    size="large"
                    className="font-weight-bold shadow-black-lg btn-second text-first mt-3 mb-3 text-uppercase">
                    <StringComponent string={ProfileStrings.string10} />
                  </Button>
                ) : (
                  <Button
                    onClick={handleUpdateName}
                    size="large"
                    //fullWidth={true}
                    className="font-weight-bold shadow-black-lg btn-second text-first mt-3 mb-3 text-uppercase">
                    <StringComponent string={ProfileStrings.string13} />
                  </Button>
                )}
              </div>

              <div className="mt-3">
                <div>
                  <h6>
                    <StringComponent string={ProfileStrings.string11} />
                    <Tooltip title={<StringComponent string={ProfileStrings.string14} />} arrow placement="top">
                      <span>
                        <FontAwesomeIcon
                          icon={faInfoSquare}
                          className="skIconColor ml-2"
                        />
                      </span>
                    </Tooltip>
                  </h6>
                  <span className='d-flex'>
                    <TextField
                      className="mb-2 mr-2"
                      placeholder={getString(ProfileStrings.string12, selectedLangauge)}
                      //fullWidth={true}
                      //value={skToStake}
                      onChange={handleChangeNFT}
                      InputProps={{ style: { color: 'white' } }}></TextField>
                    <TextField
                      className="ml-1"
                      placeholder={'ID'}
                      //fullWidth={true}
                      //value={skToStake}
                      onChange={handleChangeNFTId}
                      InputProps={{ style: { color: 'white' } }}></TextField>
                  </span>

                </div>
              </div>

              <div>
                <Button
                  onClick={handleUpdateNFT}
                  size="large"
                  //fullWidth={true}
                  className="font-weight-bold shadow-black-lg btn-second text-first mt-3 mb-2 text-uppercase">
                  <StringComponent string={ProfileStrings.string13} />
                </Button>
              </div>
            </div>
            <div className={clsx('tab-item-wrapper overflow-visible', { active: activeTab === '2' })}>
              {wallet.status === 'disconnected' && <h6><StringComponent string={ProfileStrings.string27} /></h6>}

              {wallet.status === 'connected' && subscription.level === -2 &&
                <div className="my-3">
                  <RiseLoader
                    color={'var(--green)'}
                    size={35}
                    loading={true}
                  />
                </div>
              }

              {wallet.status === 'connected' && subscription.level > -2 &&
                <div>
                  <div>
                    {subscription.level < 1 ? <h3 className="display-3 text-white font-weight-bold"><StringComponent string={ProfileStrings.string28} /></h3> : ""}
                    {subscription.level === 1 ? <h3 className="display-3 text-white font-weight-bold"><StringComponent string={ProfileStrings.string29} /></h3> : ""}
                    {subscription.level === 2 ? <h3 className="display-3 text-white font-weight-bold"><StringComponent string={ProfileStrings.string30} /></h3> : ""}
                  </div>
                  <div className="font-weight-bold opacity-7 text-uppercase mb-4"><StringComponent string={ProfileStrings.string31} /></div>
                  <div className="display-3 text-white font-weight-bold mt-3">
                    <CountUp
                      start={0}
                      end={parseFloat(xskBalance)}
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
                  </div>
                  <div className="font-weight-bold opacity-7 pb-3">
                    <StringComponent string={ProfileStrings.string21} className="mr-2" />{' (xSK)'}
                  </div>
                  <div className="display-3 text-white font-weight-bold mt-3">
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
                  </div>
                  <div className="font-weight-bold opacity-7 pb-3">
                    <StringComponent string={ProfileStrings.string22} className="mr-2" />{' (SK)'}
                  </div>
                </div>
              }

              {/*Stake for Superhero or Superhero Ultra*/}
              {wallet.status === 'connected' && subscription.level === -1 &&
                <div className="mt-3">
                  <h6><StringComponent string={ProfileStrings.string23} />
                    <Tooltip title={<StringComponent string={ProfileStrings.string33} />} arrow placement="top">
                      <span>
                        <FontAwesomeIcon
                          icon={faInfoSquare}
                          className="skIconColor ml-2"
                        />
                      </span>
                    </Tooltip></h6>
                  <div>
                    <Button
                      component={NavLink}
                      to="/Staking"
                      size="large"
                      className="font-weight-bold shadow-black-lg btn-second text-first mt-3 mb-2 text-uppercase">
                      <span><StringComponent string={ProfileStrings.string24} /></span>
                    </Button>
                  </div>
                </div>
              }

              {/*Stake for Superhero Ultra*/}
              {wallet.status === 'connected' && subscription.level === 1 &&
                <div className="mt-3">
                  <h6><StringComponent string={ProfileStrings.string32} />
                    <Tooltip title={<StringComponent string={ProfileStrings.string34} />} arrow placement="top">
                      <span>
                        <FontAwesomeIcon
                          icon={faInfoSquare}
                          className="skIconColor ml-2"
                        />
                      </span>
                    </Tooltip></h6>
                  <div>
                    <Button
                      component={NavLink}
                      to="/Staking"
                      size="large"
                      className="font-weight-bold shadow-black-lg btn-second text-first mt-3 mb-2 text-uppercase">
                      <span><StringComponent string={ProfileStrings.string24} /></span>
                    </Button>
                  </div>
                </div>
              }

              {/*Subscribe for Superhero for 1 month -- NEED TO ADD LOGIC TO CONDITIONS BELOW TO HIDE IF WITHIN THE 1-MONTH WINDOW*/}
              {wallet.status === 'connected' && subscription.level === -1 &&
                <div className="mt-3">
                  <h6><StringComponent string={ProfileStrings.string25} />
                    <Tooltip title={<StringComponent string={ProfileStrings.string35} />} arrow placement="top">
                      <span>
                        <FontAwesomeIcon
                          icon={faInfoSquare}
                          className="skIconColor ml-2"
                        />
                      </span>
                    </Tooltip></h6>
                  <div>
                    <Button
                      onClick={handleSubscribe} /*NEED TO CONNECT*/
                      size="large"
                      className="font-weight-bold shadow-black-lg btn-second text-first mt-3 mb-2 text-uppercase">
                      <span><StringComponent string={ProfileStrings.string26} /></span>
                    </Button>
                  </div>
                  <div className="mb-2">
                    <Switch
                      checked={isSubscriptionApproved}
                      onClick={handleApproveSubscription}
                      className="switch-medium toggle-switch-line toggle-switch-success mr-2"
                    />
                    <small className="skGoldSubtext text-uppercase">Approve</small>{' '}
                  </div>
                </div>
              }

              {/*Expiration for 1-month subscription that is hidden if trial is already active.*/}
              {wallet.status === 'connected' && subscription.level === -1 && subscription.subscriptionType === 'subscription' && subscription.active === true &&
                <h6><StringComponent string={ProfileStrings.string36} /> 1/2/21.</h6> /*{dateFormat(subscription.nextPayment)}*/
              }
            </div>
          </Card>
        </div>
      </Container>
    </>
  );
}
