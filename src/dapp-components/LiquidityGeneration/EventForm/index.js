import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useBnbBalance } from 'hooks/useTokenFunctions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { contribute } from 'utils/callHelpers';
import { Grid, Card, Button, TextField } from '@material-ui/core';
import { useStoreState } from 'easy-peasy';
import CountUp from 'react-countup';
import { useWallet } from 'use-wallet';
import { getWeb3 } from 'utils/web3.js';
import StringComponent from '../../StringComponent';
import Strings from '../../../config/localization/translations';

export default function LivePreviewExample() {
  const [bnbBalance, setBnbBalance] = useState(null);
  const [bnbToContribute, setBnbToContribute] = useState('');
  const [contributionReferral, setContributionReferral] = useState('');
  const { currentUserAddress } = useStoreState(state => state.Dapp);
  
  const wallet = useWallet();
  const bnb = useBnbBalance(wallet);
  const web3 = getWeb3(wallet);

  const query = new URLSearchParams(useLocation().search);

  useEffect(() => {
    setBnbBalance(bnb);
  }, [bnbBalance, bnb]);

  useEffect(() => {
    if (contributionReferral === '' || contributionReferral === null) {
      setContributionReferral(query.get('ref'))
    }
    
  })

  const handleChange = (e) => {
    setBnbToContribute(e.target.value);
  };

  const handleRefChange = (e) => {
    setContributionReferral(e.target.value);
  };
  const EventFormStrings = Strings.LiquidityGeneration.EventForm;
  return (
    <>
      <div className="divider my-4 border-2 rounded border-second w-75 eventMainDivider"/>
      
      <div className="d-flex justify-content-center">
        <Card className="pb-3 px-3 bg-primary text-white w-100">
          <Grid container className="justify-content-center w-100 pb-3 text-center">
            <Grid item className="w-100">
              <div className="display-3 text-white font-weight-bold">
              <CountUp
                        start={0}
                        end={web3.utils.fromWei(wallet.balance)}
                          duration={3}
                          separator=""
                          delay={1}
                          decimals={3}
                          decimal="."
                          prefix=""
                          suffix=""
                        />
                {/* {web3.utils.fromWei(wallet.balance)} */}{' '}
                <small>
                  <sup>BNB</sup>
                </small>
              </div>
              <div className="font-weight-bold opacity-7 text-uppercase pb-3">
                <StringComponent string={EventFormStrings.string1}/>
              </div>  
            </Grid>
          </Grid>

          <Grid container className="justify-content-center w-100 pb-3 text-center">
            <Grid item className="w-100">
              <TextField
                id="BnbToContribute"
                placeholder="BNB"
                value={bnbToContribute}
                onChange={handleChange}
                InputProps={{style: {color: 'white'}}}>
              </TextField>
              <div className="font-weight-bold opacity-7 text-uppercase pt-2 pb-3">
              <StringComponent string={EventFormStrings.string2}/>
              </div>
            </Grid>
          </Grid>

          <Grid container className="justify-content-center w-100 text-center">
            <Grid item className="w-75">              
            <TextField
                fullWidth={true}
                placeholder="Wallet Address"
                value={contributionReferral}
                onChange={handleRefChange}
                InputProps={{ style: {color: 'white'} }}>
              </TextField>
              <div className="font-weight-bold opacity-7 text-uppercase pt-2 pb-3">
              <StringComponent string={EventFormStrings.string3}/>
              </div>
            </Grid>
          </Grid>
     
        <div className="pt-3 text-center">
            <Button
              button
              size="large"
              className="btn-success font-weight-bold w-50"
              onClick={() => {
                contribute(bnbToContribute, contributionReferral, wallet);
              }}>
              <span className="btn-wrapper--label text-uppercase text-first"><StringComponent string={EventFormStrings.string4}/></span>
            </Button>
          </div>

          <div className="justify-content-center w-100 text-center">
            <div className='mt-5'><StringComponent string={EventFormStrings.string5}/> &nbsp;
            <Button
              className="btn-light text-first px-3"
              title="Copy"
              onClick={(e) => navigator.clipboard.writeText(`https://SideKick.Finance/MGE?ref=${currentUserAddress}`)}>
              <span>
                <FontAwesomeIcon icon={['fa', 'copy']} />
              </span>
            </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
