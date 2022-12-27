import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Container, Card, CardContent, Button, List, ListItem} from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import StringComponent from '../../StringComponent';
import Strings from '../../../config/localization/translations';
import svgImage1 from '../../../assets/images/illustrations/pack5/heroSK.svg';
import svgImage13 from '../../../assets/images/illustrations/pack5/superHeroSK.svg';
import svgImage14 from '../../../assets/images/illustrations/pack5/superHeroUltraSK.svg';

export default function CustomizedTimeline() {
  const HomePage7 = Strings.Homepage7Strings;

  return (
    <div className="py-3">
        <Container className="py-3 py-xl-5">
          <Card className="card-box px-2 pt-3 pb-4 mb-spacing-6-x2">
            <div className="bg-light d-flex justify-content-center">
              <div className="text-center mt-3 mb-4">
                <h4 className="display-4 font-weight-bold mb-2 text-first">
                  <StringComponent string={HomePage7.string1}/>
                </h4>
                <p className="font-size-lg mb-1 text-primary">
                  Choose your subscription tier and upgrade today!
                </p>
              </div>
            </div>
            <CardContent className="px-3 pt-3">
              <div className="container-fluid">
                <Grid container spacing={6}>
                  <Grid item xl={4}>
                    <div className="divider-v divider-v-lg" />
                    <div className="pt-2">
                      <div className="feature-box text-center mt-2 mb-4 priceCol">
                        <img
                          src={svgImage1}
                          className="w-75 mx-auto d-block img-fluid"
                          alt="..."
                        />
                        <h3 className="display-4 font-weight-bold mt-4 text-first">
                          Hero
                        </h3>
                        <p className="text-first opac-50 mb-3">
                          Rise to the challenge and let your crypto journey start now!
                        </p>
                        <Button
                          component={NavLink}
                          to="/Profile?tab=1"                        
                          size="large"
                          className="rounded-sm font-weight-bold shadow-black-lg btn-first upgradeButton">
                          <span className="btn-wrapper--label text-white font-weight-bold fontRubik">CREATE PROFILE</span>
                        </Button>
                        <p className="text-first opac-50 mt-4 payText">
                          Start today for FREE!
                        </p>
                      </div>
                      <div className="divider my-4" />
                      <ul className="list-unstyled text-left font-weight-bold font-size-sm text-first mb-0">
                        <li className="px-4 py-1">
                          <div className="badge badge-success badge-circle-inner mr-2">
                            Success
                          </div>
                          Staking
                        </li>                        
                        <li className="px-4 py-1">
                          <div className="badge badge-success badge-circle-inner mr-2">
                            Success
                          </div>
                          DefiWatcher Basic
                        </li>
                        <li className="px-4 py-1">
                          <div className="badge badge-success badge-circle-inner mr-2">
                            Success
                          </div>
                          Headquarters Basic
                        </li>
                        <li className="px-4 py-1">
                          <div className="badge badge-success badge-circle-inner mr-2">
                            Success
                          </div>
                          Team-Ups with DripWatcher
                        </li>  
                        {/* <li className="px-4 py-1">
                          <div className="badge badge-danger badge-circle-inner mr-2">
                            Danger
                          </div>
                          <span className="opac-50">Ad Free</span>
                        </li>    */}
                        <li className="px-4 py-1">
                          <div className="badge badge-danger badge-circle-inner mr-2">
                            Danger
                          </div>
                          <span className="opac-50">Naming Service Integration</span>
                        </li> 
                        <li className="px-4 py-1">
                          <div className="badge badge-danger badge-circle-inner mr-2">
                            Danger
                          </div>
                          <span className="opac-50">NFT Profile Integration</span>
                        </li>     
                        <li className="px-4 py-1">
                          <div className="badge badge-danger badge-circle-inner mr-2">
                            Danger
                          </div>
                          <span className="opac-50">SideKick DAO Membership</span>
                        </li>
                        <li className="px-4 py-1">
                          <div className="badge badge-danger badge-circle-inner mr-2">
                            Danger
                          </div>
                          <span className="opac-50">VIP Access to Presales &amp; MGEs</span>
                        </li>   
                        <li className="px-4 py-1">
                          <div className="badge badge-danger badge-circle-inner mr-2">
                            Danger
                          </div>
                          <span className="opac-50">Alerts</span>
                        </li>     
                        <li className="px-4 py-1">
                          <div className="badge badge-danger badge-circle-inner mr-2">
                            Danger
                          </div>
                          <span className="opac-50">Liquidation and Trading Bots</span>
                        </li>   
                        <li className="px-4 py-1">
                          <div className="badge badge-danger badge-circle-inner mr-2">
                            Danger
                          </div>
                          <span className="opac-50">Exclusive Upcoming Features</span>
                        </li>  
                      </ul>
                    </div>
                  </Grid>
                  <Grid item xl={4}>
                    <div className="divider-v divider-v-lg" />
                    <div className="pt-2">
                      <div className="feature-box text-center mt-2 mb-4 priceCol">
                        <img
                          src={svgImage13}
                          className="w-75 mx-auto d-block img-fluid"
                          alt="..."
                        />
                        <h3 className="display-4 font-weight-bold mt-4 text-first">
                          Superhero
                        </h3>
                        <p className="text-first opac-50 mb-3">
                          It's time to level up your crypto super powers!
                        </p>
                        <Button
                          component={NavLink}
                          to="/Profile?tab=2"
                          size="large"
                          className="rounded-sm font-weight-bold shadow-black-lg btn-second upgradeButton">
                          <span className="btn-wrapper--label text-first font-weight-bold fontRubik">UPGRADE</span>
                        </Button>
                        <p className="text-first opac-50 mt-4 payText">
                          Hold 50,000 $xSK<em>or</em>pay 4,000 $SK per Month
                        </p>
                      </div>
                      <div className="divider my-4" />
                      <ul className="list-unstyled text-left font-weight-bold font-size-sm text-first mb-0">
                        <li className="px-4 py-1">
                          <div className="badge badge-success badge-circle-inner mr-2">
                            Success
                          </div>
                          Staking
                        </li>                        
                        <li className="px-4 py-1">
                          <div className="badge badge-success badge-circle-inner mr-2">
                            Success
                          </div>
                          DefiWatcher Pro
                        </li>
                        <li className="px-4 py-1">
                          <div className="badge badge-success badge-circle-inner mr-2">
                            Success
                          </div>
                          Headquarters Pro
                        </li>      
                        <li className="px-4 py-1">
                          <div className="badge badge-success badge-circle-inner mr-2">
                            Success
                          </div>
                          Team-Ups with DripWatcher
                        </li>  
                        {/* <li className="px-4 py-1">
                          <div className="badge badge-success badge-circle-inner mr-2">
                            Success
                          </div>
                          Ad Free
                        </li>    */}
                        <li className="px-4 py-1">
                          <div className="badge badge-success badge-circle-inner mr-2">
                            Success
                          </div>
                          Naming Service (One-Time)
                        </li> 
                        <li className="px-4 py-1">
                          <div className="badge badge-success badge-circle-inner mr-2">
                            Success
                          </div>
                          NFT Profile (One-Time)
                        </li>  
                        <li className="px-4 py-1">
                          <div className="badge badge-danger badge-circle-inner mr-2">
                            Danger
                          </div>
                          <span className="opac-50">SideKick DAO Membership</span>
                        </li>
                        <li className="px-4 py-1">
                          <div className="badge badge-danger badge-circle-inner mr-2">
                            Danger
                          </div>
                          <span className="opac-50">VIP Access to Presales &amp; MGEs</span>
                        </li>   
                        <li className="px-4 py-1">
                          <div className="badge badge-danger badge-circle-inner mr-2">
                            Danger
                          </div>
                          <span className="opac-50">Alerts</span>
                        </li>     
                        <li className="px-4 py-1">
                          <div className="badge badge-danger badge-circle-inner mr-2">
                            Danger
                          </div>
                          <span className="opac-50">Liquidation and Trading Bots</span>
                        </li>   
                        <li className="px-4 py-1">
                          <div className="badge badge-danger badge-circle-inner mr-2">
                            Danger
                          </div>
                          <span className="opac-50">Exclusive Upcoming Features</span>
                        </li>  
                      </ul>
                    </div>
                  </Grid>
                  <Grid item xl={4}>
                    <div className="pt-2">
                      <div className="feature-box text-center mt-2 mb-4 priceCol">
                        <img
                          src={svgImage14}
                          className="w-75 mx-auto d-block img-fluid"
                          alt="..."
                        />
                        <h3 className="display-4 font-weight-bold mt-4 text-first">
                          Superhero Ultra
                        </h3>
                        <p className="text-first opac-50 mb-3">
                          Overpower the competition with increased control and tools!
                        </p>
                        <Button
                          component={NavLink}
                          to="/Profile?tab=2"
                          size="large"
                          className="rounded-sm font-weight-bold shadow-black-lg btn-first upgradeButton">
                          <span className="btn-wrapper--label text-white font-weight-bold fontRubik">UPGRADE <em>x10</em></span>
                        </Button>
                        <p className="text-first opac-50 mt-4 payText">
                          Hold 500,000 $xSK
                        </p>
                      </div>
                      <div className="divider my-4" />
                      <ul className="list-unstyled text-left font-weight-bold font-size-sm text-first mb-0">
                        <li className="px-4 py-1">
                          <div className="badge badge-success badge-circle-inner mr-2">
                            Success
                          </div>
                          Staking
                        </li>                        
                        <li className="px-4 py-1">
                          <div className="badge badge-success badge-circle-inner mr-2">
                            Success
                          </div>
                          DefiWatcher Pro
                        </li>
                        <li className="px-4 py-1">
                          <div className="badge badge-success badge-circle-inner mr-2">
                            Success
                          </div>
                          Headquarters Pro
                        </li>   
                        <li className="px-4 py-1">
                          <div className="badge badge-success badge-circle-inner mr-2">
                            Success
                          </div>
                          Team-Ups with DripWatcher
                        </li>    
                        {/* <li className="px-4 py-1">
                          <div className="badge badge-success badge-circle-inner mr-2">
                            Success
                          </div>
                          Ad Free
                        </li>   */}
                        <li className="px-4 py-1">
                          <div className="badge badge-success badge-circle-inner mr-2">
                            Success
                          </div>
                          Naming Service (Unlimited)
                        </li> 
                        <li className="px-4 py-1">
                          <div className="badge badge-success badge-circle-inner mr-2">
                            Success
                          </div>
                          NFT Profile (Unlimited)
                        </li>  
                        <li className="px-4 py-1">
                          <div className="badge badge-success badge-circle-inner mr-2">
                            Success
                          </div>
                          SideKick DAO Membership
                        </li>   
                        <li className="px-4 py-1">
                          <div className="badge badge-success badge-circle-inner mr-2">
                            Success
                          </div>
                          VIP Access to Presales &amp; MGEs
                        </li>   
                        <li className="px-4 py-1">
                          <div className="badge badge-success badge-circle-inner mr-2">
                            Success
                          </div>
                          Alerts
                        </li>     
                        <li className="px-4 py-1">
                          <div className="badge badge-success badge-circle-inner mr-2">
                            Success
                          </div>
                          Liquidation and Trading Bots
                        </li>   
                        <li className="px-4 py-1">
                          <div className="badge badge-success badge-circle-inner mr-2">
                            Success
                          </div>
                          Exclusive Upcoming Features
                        </li>   
                      </ul>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </CardContent>
          </Card>
        </Container>
      </div>
  );
}
