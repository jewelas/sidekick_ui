import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Container, Card, Button, List, ListItem } from '@material-ui/core';
import StringComponent from '../../StringComponent';
import Strings from '../../../config/localization/translations';
import infographic from '../../../assets/images/sidekick/infographics/SideKick_01_FeeInfo.png';

export default function Tokenomics() {
  const HomePage3 = Strings.Homepage3Strings;
  return (
    <>
      <div className="bg-white px-4 py-4 py-xl-5 tokenomicsZ">
        <Container className="tokenomicsMargin">
          <Grid container spacing={4}>
            <Grid item xl={12}>
              <div className="pr-4 pr-xl-5 text-first">
                <h1 className="display-3 mb-3 pt-4 font-weight-bold text-first">
                <StringComponent string={Strings.TokenomicsString}/> {/* String1 */} {/* Tokenomics string */}
                </h1>
                <p className="font-size-xxl m-0 py-3 text-first">
                {/* string1 */}  <StringComponent string={HomePage3.string1}/>
                </p>
                {/* <p className="font-size-xxl m-0 py-3 text-first">
                 <StringComponent string={HomePage3.string2}/> <span className="font-weight-bold"><StringComponent string={HomePage3.string3}/></span>.
                </p> */}
                <p className="font-size-xxl m-0 py-3 text-first">
                 {/* string4 */}<StringComponent string={HomePage3.string4}/>
                </p>
                <div className="py-3">
                  <Button
                    href="https://docs.sidekick.finance/sidekick-finance/tokenomics/fair-launch"
                    target="_blank"
                    size="large"
                    className="rounded-sm font-weight-bold shadow-black-lg btn-first py-3">
                    <span className="btn-wrapper--label text-white font-weight-bold text-uppercase fontRubik"><StringComponent string={HomePage3.string5}/></span> {/* string5 */}
                  </Button>
                </div>
               </div>
            </Grid>
            <Grid item xl={12} className="d-flex align-items-center tokenomicsWidth">
              <div className="my-5 my-xl-0  shadow-xl card-box w-100 mobileMargin px-2 py-5" style={{border: 'none'}}>
                <img className='w-100' src={infographic} />
                {/* <List component="div" className="list-group-flush">
                  <ListItem
                    className="d-flex align-items-center py-3 rounded-top">
                    <div className="d-flex align-items-center">
                    <div className="bg-sidekick-green text-white font-size-xxl d-50 my-2 tokenIcon btn-icon card-icon-wrapper rounded-circle">
                      <span className="font-size-md font-weight-bold m-2 singleDigit">10%</span>
                    </div>
                      <div>
                        <div className="font-weight-bold text-first">
                        <StringComponent string={HomePage3.string6}/>
                        </div>
                        <div className="text-first o-50"><StringComponent string={HomePage3.string7}/></div> 
                      </div>
                    </div>
                  </ListItem>                
                  <ListItem
                    className="d-flex align-items-center py-3">
                    <div className="d-flex align-items-center">
                    <div className="bg-sidekick-green text-white font-size-xxl d-50 my-2 tokenIcon btn-icon card-icon-wrapper rounded-circle">
                      <span className="font-size-md font-weight-bold m-2">60%</span>
                    </div>
                      <div>
                        <div className="font-weight-bold text-first">
                        <StringComponent string={HomePage3.string8}/>
                        </div>
                        <div className="text-first o-50"><StringComponent string={HomePage3.string9}/></div>
                      </div>
                    </div>
                  </ListItem>
                  <ListItem
                    className="d-flex align-items-center py-3">
                    <div className="d-flex align-items-center">
                    <div className="bg-sidekick-green text-white font-size-xxl d-50 my-2 tokenIcon btn-icon card-icon-wrapper rounded-circle">
                      <span className="font-size-md font-weight-bold m-2">24%</span>
                    </div>
                      <div>
                        <div className="font-weight-bold text-first">
                        <StringComponent string={HomePage3.string10}/>
                        </div>
                        <div className="text-first o-50"><StringComponent string={HomePage3.string11}/></div>
                      </div>
                    </div>
                  </ListItem>
                  <ListItem
                    className="d-flex align-items-center py-3">
                    <div className="d-flex align-items-center">
                    <div className="bg-sidekick-green text-white font-size-xxl d-50 my-2 tokenIcon btn-icon card-icon-wrapper rounded-circle">
                      <span className="font-size-md font-weight-bold m-2 singleDigit">1%</span>
                    </div>
                      <div>
                        <div className="font-weight-bold text-first">
                        <StringComponent string={HomePage3.string12}/>
                        </div>
                        <div className="text-first o-50"><StringComponent string={HomePage3.string13}/></div>
                      </div>
                    </div>
                  </ListItem>
                  <ListItem
                    className="d-flex align-items-center py-3">
                    <div className="d-flex align-items-center">
                    <div className="bg-sidekick-green text-white font-size-xxl d-50 my-2 tokenIcon btn-icon card-icon-wrapper rounded-circle">
                      <span className="font-size-md font-weight-bold m-2 singleDigit">1%</span>
                    </div>
                      <div>
                        <div className="font-weight-bold text-first">
                        <StringComponent string={HomePage3.string14}/>
                        </div>
                        <div className="text-first o-50"><StringComponent string={HomePage3.string15}/></div>
                      </div>
                    </div>
                  </ListItem>
                  <ListItem
                    className="d-flex align-items-center py-3">
                    <div className="d-flex align-items-center">
                    <div className="bg-sidekick-green text-white font-size-xxl d-50 my-2 tokenIcon btn-icon card-icon-wrapper rounded-circle">
                      <span className="font-size-md font-weight-bold m-2 singleDigit">4%</span>
                    </div>
                      <div>
                        <div className="font-weight-bold text-first">
                        <StringComponent string={HomePage3.string17}/>
                        </div>
                        <div className="text-first o-50"><StringComponent string={HomePage3.string18}/></div>
                      </div>
                    </div>
                  </ListItem>
                </List> */}
              </div>
            </Grid>
          </Grid>
        </Container>
      </div>
    </>
  );
}
