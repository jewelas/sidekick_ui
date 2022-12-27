import React from 'react';
import { Grid, Card, Button, CardContent} from '@material-ui/core';
import StringComponent from '../../StringComponent';
import Strings from '../../../config/localization/translations';
import gfiImage from 'assets/images/GFI/gangster.png'
import XSKStaking from 'dapp-components/GFI/xSKStaking';
export default function LivePreviewExample() {
  const LiquidityGenStrings = Strings.LiquidityGeneration;
  
  const eventCardStrings = LiquidityGenStrings.EventCard;
  return (
    <>
      <div className="d-flex justify-content-center skEventZ">

        <Grid container >
          <Grid item lg={2}></Grid>
                        <Grid item lg={3} className='gfi-card mr-5'>
                            <Card className="p-4 p-lg-4 bg-first text-white w-70 text-center">
                                <img alt="..." className="card-img-top" src={gfiImage} />
                                <CardContent>
                                    <h5 className="card-title font-weight-bold font-size-xxl">GFI is launching their own MGE, powered by the same ERC-31337 standard SideKick uses!</h5>
                                    <p className="">Head over to Gangster Finanace now to secure your spot as an early adopter!</p>
                <Button
                  color="primary"
                  variant="contained"
                  target="_blank"
                  href="https://gangster.finance/vault.html?v=XGFI"
                  className="btn-second text-first"
                >
                  <span className="btn-wrapper--label">Take me there!</span>
                  </Button>
                                </CardContent>
                            </Card>
          </Grid>
          <Grid item lg={5}>
        <XSKStaking/>
          </Grid>
          </Grid>
      </div>
    </>
  );
}
