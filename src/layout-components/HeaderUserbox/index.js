import React, { useState, useEffect } from 'react';
import { useWallet } from 'use-wallet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge, Menu, Button, List, ListItem } from '@material-ui/core';
import { getWeb3 } from 'utils/web3.js';
import CountUp from 'react-countup';
import ExitToAppTwoToneIcon from '@material-ui/icons/ExitToAppTwoTone';
import { withStyles } from '@material-ui/core/styles';
import { getNFTInfo } from 'utils/callHelpers';
import { useStoreState, useStoreActions } from 'easy-peasy';
import WalletModal from './WalletModal'
import Identicon from './Identicon'
import NetworkIdentifier from './NetworkIdentifier';
import NameServiceComponent from 'dapp-components/NameReturn';
import StringComponent from '../../dapp-components/StringComponent/index';
import Strings from '../../config/localization/translations';
import { SaveUserInfo } from 'services/FirebaseService';
import TransactionAlert from 'dapp-components/TransactionAlert';
import SystemAlert from 'dapp-components/TransactionAlert/system-alert';

const StyledBadge = withStyles({
  badge: {
    backgroundColor: 'var(--success)',
    color: 'var(--success)',
    boxShadow: '0 0 0 2px #fff',
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""'
    }
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0
    }
  }
})(Badge);

const HeaderUserbox = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [connected, setConnected] = useState(false);
  const [chainID, setChainID] = useState(null);
  const CACHED_PROVIDER_KEY = 'ConnectedID';
  const [modal, setModal] = useState(false);
  const [fireDb, setFireDb] = useState(undefined);
  const toggle = () => setModal(!modal);
  const wallet = useWallet();
  const web3 = getWeb3(wallet);
  const bnb = 0;
  const { firebase, currentUserAddress,  avatar,  connectedWallet } = useStoreState((state) => state.Dapp);
  const { setCurrentUserAddress, setAvatar, setConnectedWallet } = useStoreActions((actions) => actions.Dapp);
  

  useEffect(() => {
    const cachedProvider = localStorage.getItem(CACHED_PROVIDER_KEY);
    if (cachedProvider !== null && (wallet.status === null || wallet.status === 'disconnected' || wallet.status !== 'connecting')) {
      wallet.connect('injected').then(()=>{
        wallet.connect('injected')
      });
    }
  },[]);

  useEffect(() => {
    if (firebase !== undefined && firebase.db !== undefined) {
      setFireDb(firebase.firestore);
    }
  }, [firebase])

  useEffect(() => {
    async function Load() {
      if (wallet.status === 'connected' && wallet.account !== null && wallet.account !== currentUserAddress && wallet.chainID !== chainID) {
        localStorage.setItem(CACHED_PROVIDER_KEY, wallet.connector);
        setUserInfo(wallet);
        // wallet.connect();

        try {

          await SaveUserInfo(wallet.account, { active: true, login: null })
          setConnectedWallet(wallet);

        }
        catch (e) {
          console.log(e);
        }

      }
    }

    Load();

  }, [wallet, fireDb])

  useEffect(()=>{
    async function checkNFTData(){
      if(wallet.status === 'connected' && wallet.account !== null && wallet.account !== currentUserAddress){
        try{
          const data = await getNFTInfo(wallet, wallet.account);
          if (data !== null && data !== undefined){
            setAvatar(data.image);
          }
        } catch(e){
            console.log(e);
        }

      }
    }
    checkNFTData();
  }, [wallet])

  const setUserInfo = (wallet) => {
    setConnected(wallet.connection);
    setConnectedWallet(wallet);
    setChainID(wallet.chainID);
    setCurrentUserAddress(wallet.account);
  };

  const disconnect = () => {
    setUserInfo({});
    localStorage.removeItem(CACHED_PROVIDER_KEY);
    wallet.reset()
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const HeadStrings = Strings.HeaderUserBox;

  return (
    <>
      {wallet.status === 'connected' ? (
        <div>
          <NetworkIdentifier />
          <div>
            <Button
              variant="text"
              onClick={handleClick}
              className="btn-transition-none text-left ml-2 p-0 bg-transparent d-flex align-items-center"
              disableRipple>
              <div className="d-block p-0 avatar-icon-wrapper">
                <StyledBadge
                  overlap="circle"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                  badgeContent=" "
                  classes={{ badge: 'bg-success badge-circle border-0' }}
                  variant="dot">
                  <div className="">
                    {/* <img src={avatar3} alt="..." /> */}
                    {avatar !== undefined 
                    ? <div className="avatar-icon-xs mt-1">
                    <div className="avatar-icon"><img src={avatar} alt="..." /></div>
                </div>
                    : <Identicon />}
                    
                  </div>
                </StyledBadge>
              </div>
              <div className="d-none d-xl-block pl-2">
                <span className="text-success">
                  <small><StringComponent string={HeadStrings.string1} /></small>
                </span>
                <div className="font-weight-bold truncate text-white">
                  <NameServiceComponent address={wallet.account}/>
                </div>
              </div>
              <span className="pl-1 pl-xl-3">
                <FontAwesomeIcon icon={['fas', 'angle-down']} className="opacity-5" />
              </span>
            </Button>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorEl)}

              classes={{ list: 'p-0' }}
              onClose={handleClose}>
              <div className="dropdown-menu-xl overflow-hidden p-0 bg-first text-white">
                <div className="d-flex p-4">
                  <div className="flex-shrink-0  mr-3">
                    
                  <div className="">
                    {/* <img src={avatar3} alt="..." /> */}
                    {avatar !== undefined 
                    ? <div className="avatar-icon-md">
                    <div className="avatar-icon"><img src={avatar} alt="..." /></div>
                </div>
                    : <Identicon />}
                    
                  </div>
                
                  </div>
                  <div>
                    <h6 className="font-weight-bold mb-1  truncate">
                      <NameServiceComponent address={wallet.account} />
                    </h6>

                  </div>
                </div>
                <div className="divider" />
                <div className="divider" />
                <div className=" d-flex align-items-center flex-column py-4">
                  <div className="display-3 mb-0 text-center font-weight-bold">
                    {wallet.balance !== '-1' &&
                      <span className="pl-1">
                        <CountUp
                          start={0}
                          end={parseFloat(web3.utils.fromWei(wallet.balance))}
                          duration={6}
                          separator=""
                          delay={1}
                          decimals={3}
                          decimal="."
                          prefix=""
                          suffix=""
                        />
                        <small>
                          <sup>BNB</sup>
                        </small>
                      </span>
                    }

                  </div>
                  <small className="text-center font-weight-bold opacity-6 text-uppercase">
                    <StringComponent string={HeadStrings.string2} />
                  </small>
                </div>

                <div className="divider" />
                <List
                  component="div"
                  className="nav-neutral-danger nav-pills-rounded flex-column p-3">
                  <ListItem
                    component="a"
                    button
                    onClick={() => disconnect()}>
                    <div className="mr-2">
                      <ExitToAppTwoToneIcon />
                    </div>
                    <span><StringComponent string={HeadStrings.string3} /></span>
                  </ListItem>
                </List>
              </div>
            </Menu>
          </div>
        </div>
      ) : (
        <div>
          <NetworkIdentifier />
          <WalletModal />
        </div>
      )}
      <TransactionAlert />
      <SystemAlert />
    </>
  );
};

export default HeaderUserbox;

