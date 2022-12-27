import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Container, Card, Button, Paper } from '@material-ui/core';
import { shadows } from '@material-ui/system';
import illustration1 from '../../../assets/images/illustrations/pack5/analysisSK2.svg';
import illustration2 from '../../../assets/images/illustrations/pack5/handshakeSK2.svg';
import illustration3 from '../../../assets/images/illustrations/pack5/timeSK2.svg';
import StringComponent from '../../StringComponent';
import Strings from '../../../config/localization/translations';

export default function LivePreviewExample() {
  const Homepage4 = Strings.Homepage4Strings;
  return (
    <>
      <Container className="coreMargin">
        <h1 className="display-3 mb-5 pt-4 font-weight-bold text-center text-first"><StringComponent string={Strings.CoreValuesString}/></h1>
        <Card className="card-box p-0 mb-spacing-6-x2">
          <Grid container spacing={0}>
            <Grid item lg={7} className="d-flex align-items-center">
              <div className="p-4 text-center text-lg-left p-lg-5">
                <div className="bg-sidekick-green btn-icon mx-auto mx-lg-0 text-white font-size-xl d-50 rounded-circle mb-4">
                  <FontAwesomeIcon icon={['fas', 'cogs']} />
                </div>
                <h4 className="display-4 font-weight-bold mb-3 text-first">
                <StringComponent string={Homepage4.string1}/> {/* string1 */}
                </h4>
                <p className="text-first mb-4 font-size-lg">
                {/* string2 */}  <StringComponent string={Homepage4.string2}/>
                </p>
              </div>
            </Grid>
            <Grid item lg={5} className="d-flex align-items-center">
              <img alt="..." className="w-100 p-4 p-lg-0" src={illustration1} />
            </Grid>
          </Grid>
        </Card>
        <Card className="card-box p-0 mb-spacing-6-x2 ">
          <Grid container spacing={0}>
            <Grid item lg={7} className="d-flex align-items-center">
              <div className="p-4 text-center text-lg-left p-lg-5">
                <div className="bg-sidekick-green btn-icon mx-auto mx-lg-0 text-white font-size-xl d-50 rounded-circle mb-4">
                  <FontAwesomeIcon icon={['fas', 'shield-alt']} />
                </div>
                <h4 className="display-4 font-weight-bold mb-3 text-first">
               {/* string3 */}   <StringComponent string={Homepage4.string3}/>
                </h4>
                <p className="text-first mb-4 font-size-lg">
               {/* string4 */}   <StringComponent string={Homepage4.string4}/>
                </p>
              </div>
            </Grid>
            <Grid item lg={5} className="d-flex align-items-center">
              <img alt="..." className="w-100 p-4 p-lg-0" src={illustration2} />
            </Grid>
          </Grid>
        </Card>
        <Card className="card-box p-0 mb-spacing-6-x2 ">
          <Grid container spacing={0}>
            <Grid item lg={7} className="d-flex align-items-center">
              <div className="p-4 text-center text-lg-left p-lg-5">
                <div className="bg-sidekick-green btn-icon mx-auto mx-lg-0 text-white font-size-xl d-50 rounded-circle mb-4">
                  <FontAwesomeIcon icon={['far', 'hourglass']} />
                </div>
                <h4 className="display-4 font-weight-bold mb-3 text-first">
              {/* string5 */}    <StringComponent string={Homepage4.string5}/>
                </h4>
                <p className="text-first mb-4 font-size-lg">
               {/* string6 */}   <StringComponent string={Homepage4.string6}/>
                </p>
              </div>
            </Grid>
            <Grid item lg={5} className="d-flex align-items-center">
              <img alt="..." className="w-100 p-4 p-lg-0" src={illustration3} />
            </Grid>
          </Grid>
        </Card>
      </Container>
    </>
  );
}
