import React, { useState, useEffect } from 'react';
import { useBnbBalance } from 'hooks/useTokenFunctions';
import {  claim, claimReferralRewards } from 'utils/callHelpers';
import { Grid, Card,  Button,   Badge} from '@material-ui/core';
import CountUp from 'react-countup';

import Countdown from 'react-countdown';
import { withStyles } from '@material-ui/core/styles';
import { useMgeStats, useMgdStats } from 'hooks/useMGE';
import EventForm from '../EventForm';
import { useWallet } from 'use-wallet';
import miniLogo from '../../../assets/images/sidekick/logo/PNG Small/Logo_mark_blue.png';
import StringComponent from '../../StringComponent';
import Strings from '../../../config/localization/translations';

export default function LivePreviewExample() {
  const [bnbBalance, setBnbBalance] = useState(null);
  const [bnbToContribute, setBnbToContribute] = useState('');
  const [contractStats, setContractStats] = useState(null);
  const [distributionStats, setDistributionStats] = useState(null);

  const [totalContribution, setTotalContribution] = useState(0);
  const [userContribution, setUserContribution] = useState(0);
  const [totalClaim, setTotalClaim] = useState(0);
  const [referralRewards, setReferralRewards] = useState(0);
  const [contractActive, setContractActive] = useState(true);
  const wallet = useWallet();
  const active = true;
  const stats = useMgeStats(wallet);
  const bnb = useBnbBalance(wallet);
  const distStats = useMgdStats(wallet);
  const LiquidityGenStrings = Strings.LiquidityGeneration;

  useEffect(() => {

    setBnbBalance(bnb);    
    setContractStats(stats);

    if (stats) {
      setTotalContribution(stats.totalContribution);
      setUserContribution(stats.userContribution);
    }

    setContractActive(active);
    
    if (!active) {
      setDistributionStats(distStats);      
      if (distStats) {
        setTotalClaim(distStats.totalClaim);
        setReferralRewards(distStats.referralRewards);
      }
    }

  }, [bnbBalance, bnb, contractStats, stats, contractActive, active, distStats, distributionStats]);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChange = (e) => {
    setBnbToContribute(e.target.value);
  };

  const StyledBadgeActive = withStyles({
    badge: {
      backgroundColor: 'var(--success)',
      color: 'var(--success)',
      boxShadow: '0 0 0 3px #fff',
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: '$ripple 1.2s infinite ease-in-out',
        border: '3px solid currentColor',
        content: '""'
      }
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1
      },
      '100%': {
        transform: 'scale(3)',
        opacity: 0
      }
    }
  })(Badge);

  const StyledBadgeInactive = withStyles({
    badge: {
      backgroundColor: 'var(--danger)',
      color: 'var(--danger)',
      boxShadow: '0 0 0 3px #fff',
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: '$ripple 1.2s infinite ease-in-out',
        border: '3px solid currentColor',
        content: '""'
      }
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1
      },
      '100%': {
        transform: 'scale(3)',
        opacity: 0
      }
    }
  })(Badge);

  const countdownRender = ({ days, hours, minutes, seconds, completed }) => {
    let render;

    if (completed) {
      return (
        <Grid container className="d-flex skClock my-3">
          <Grid item>
            <div className="display-3 text-first font-weight-bold ">00</div>
            <div className="divider mt-2 mb-3 border-2 w-100 bg-first rounded border-first" />
            <div className="font-weight-bold opacity-7 text-uppercase">
              <StringComponent string={LiquidityGenStrings.DayString}/>
            </div>
          </Grid>
          <Grid item>
            <h1>:</h1>
          </Grid>
          <Grid item>
            <div className="display-3 text-first font-weight-bold">00</div>
            <div className="divider mt-2 mb-3 border-2 w-100 bg-first rounded border-first" />
            <div className="font-weight-bold opacity-7 text-uppercase">
            <StringComponent string={LiquidityGenStrings.HoursString}/>
            </div>
          </Grid>
          <Grid item>
            <h1>:</h1>
          </Grid>
          <Grid item>
            <div className="display-3 text-first font-weight-bold">
              00
            </div>
            <div className="divider mt-2 mb-3 border-2 w-100 bg-first rounded border-first" />
            <div className="font-weight-bold opacity-7 text-uppercase">
            <StringComponent string={LiquidityGenStrings.MinutesString}/>
            </div>
          </Grid>
          <Grid item>
            <h1>:</h1>
          </Grid>
          <Grid item>
            <div className="display-3 text-first font-weight-bold">
              00
            </div>
            <div className="divider mt-2 mb-3 border-2 w-100 bg-first rounded border-first shortClock" />
            <div className="font-weight-bold opacity-7 text-uppercase shortClock">
            <StringComponent string={LiquidityGenStrings.SecondsString}/>
            </div>
          </Grid>
        </Grid>
      );
    } else {
      render = (
        <Grid container className="d-flex skClock my-3">
          <Grid item>
            <div className="display-3 text-white font-weight-bold ">{days}</div>
            <div className="text-white font-size-lg">
            <StringComponent string={LiquidityGenStrings.DayString}/>
            </div>
          </Grid>
          <Grid item>
            <h1>:</h1>
          </Grid>
          <Grid item>
            <div className="display-3 text-white font-weight-bold">{hours}</div>
            <div className="text-white font-size-lg">
            <StringComponent string={LiquidityGenStrings.HoursString}/>
            </div>
          </Grid>
          <Grid item>
            <h1>:</h1>
          </Grid>
          <Grid item>
            <div className="display-3 text-white font-weight-bold">
              {minutes}
            </div>
            <div className="text-white font-size-lg">
            <StringComponent string={LiquidityGenStrings.MinutesString}/>
            </div>
          </Grid>
          <Grid item className="shortClock">
            <h1>:</h1>
          </Grid>
          <Grid item className="shortClock">
            <div className="display-3 text-white font-weight-bold">
              {seconds}
            </div>
            <div className="text-white font-size-lg">
            <StringComponent string={LiquidityGenStrings.SecondsString}/>
            </div>
          </Grid>
        </Grid>
      );
      return render;
    }
  };
  const eventCardStrings = LiquidityGenStrings.EventCard;
  return (
    <>
      <div className="d-flex justify-content-center skEventZ">
        <Card className="p-4 p-lg-4 bg-first text-white w-70">
          <div>
            <div className="display-4 line-height-1 font-weight-bold mr-3 d-flex justify-content-center text-center">
            <StringComponent string={eventCardStrings.string1}/>
            </div>
            <div className="text-dark d-flex justify-content-center pt-3 ">
              <div className="mr-2 ">
                {contractActive &&
                  <StyledBadgeActive
                    overlap="circle"
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'left'
                    }}
                    badgeContent=" "
                    classes={{ badge: 'bg-success badge-circle border-0 badge-xl ' }}
                    variant="dot"></StyledBadgeActive>
                }
                {!contractActive &&
                  <StyledBadgeInactive
                    overlap="circle"
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'left'
                    }}
                    badgeContent=" "
                    classes={{ badge: 'bg-danger badge-circle border-0 badge-xl' }}
                    variant="dot"></StyledBadgeInactive>
                }
              </div>
              {contractActive &&
                <p className="text-white ml-2" style={{marginTop: "0.1rem"}}><StringComponent string={eventCardStrings.string2}/></p>}
              {!contractActive &&
                <p className="text-white ml-2" style={{marginTop: "0.1rem"}}><StringComponent string={eventCardStrings.string3}/></p>}
            </div>
          </div>
          <div>
            <Countdown
              date={"2021-06-11T03:59:59+0000"} /*June 9, 2021 at 11:59:59 PM EDT*/
              precision={3}
              renderer={countdownRender}
              zeroPadTime={2}>
            </Countdown>                     
          </div>
          <Grid container className="justify-content-center">
            <Grid item className="skEventStatsContainer">
              <div className="display-3 text-white font-weight-bold mt-3">
              <CountUp
                        start={0}
                        end={totalContribution}
                          duration={3}
                          separator=""
                          delay={1}
                          decimals={3}
                          decimal="."
                          prefix=""
                          suffix=""
                        />
                {' '}
                <small>
                  <sup>BNB</sup>
                </small>
              </div>

              <div className="font-weight-bold opacity-7 text-uppercase">
              <StringComponent string={eventCardStrings.string4}/>
              </div>

              <div className="my-4 w-60" />

              <div className="display-3 text-white font-weight-bold">
              <CountUp
                        start={0}
                        end={userContribution}
                          duration={3}
                          separator=""
                          delay={1}
                          decimals={3}
                          decimal="."
                          prefix=""
                          suffix=""
                        />
               {' '}
                <small>
                  <sup>BNB</sup>
                </small>
              </div>

              <div className="font-weight-bold opacity-7 text-uppercase">
              <StringComponent string={eventCardStrings.string5}/>
              </div>
            
              {!contractActive &&
              
                <span>
                  <div className="divider my-4 border-2 rounded border-second w-75 eventMainDivider"/>

                  <div className="my-4 w-60" />
                  
                <div className="display-3 text-white font-weight-bold mt-3">
                <CountUp
                        start={0}
                        end={totalClaim}
                          duration={3}
                          separator=""
                          delay={1}
                          decimals={3}
                          decimal="."
                          prefix=""
                          suffix=""
                        />
                   {' '}
                    <small>
                      <sup>SK</sup>
                    </small>
                  </div>

                  <div className="font-weight-bold opacity-7 text-uppercase">
                  <StringComponent string={eventCardStrings.string6}/>
                  </div>

                  <div className="my-4 w-60" />

                <div className="display-3 text-white font-weight-bold mt-3">
                <CountUp
                        start={0}
                        end={referralRewards}
                          duration={3}
                          separator=""
                          delay={1}
                          decimals={3}
                          decimal="."
                          prefix=""
                          suffix=""
                        />
                    {' '}
                    <small>
                      <sup>SK</sup>
                    </small>
                  </div>

                  <div className="font-weight-bold opacity-7 text-uppercase">
                  <StringComponent string={eventCardStrings.string7}/>
                  </div>

                  <div className="my-4 w-60" />
                </span>
              }

            </Grid>
          </Grid>

          {contractActive &&
            <EventForm />
          }

          {!contractActive &&
            <Grid container className="justify-content-center mt-3">
              <Grid item className="pt-2 mr-3">
                <Button
                  size="large"
                  onClick={() => {
                    claim(wallet)
                  }}
                  className="font-weight-bold shadow-black-lg btn-second text-first">
                  <span className="btn-wrapper--label"><StringComponent string={eventCardStrings.string8}/></span>
                  <img alt="SideKick" src={miniLogo} className="btnBuyNowFooter app-nav-logo--text"/>
                </Button>
              </Grid>

              <Grid item className="pt-2">
                <Button
                  size="large"
                  onClick={() => {
                    claimReferralRewards(wallet)
                  }}
                  className="font-weight-bold shadow-black-lg btn-second text-first">
                  <span className="btn-wrapper--label"><StringComponent string={eventCardStrings.string9}/></span>
                </Button>
              </Grid>
            </Grid>
          }
        </Card>
      </div>
    </>
  );
}
