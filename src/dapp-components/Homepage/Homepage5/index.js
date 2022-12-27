import React, { useState } from 'react';
import { Grid, Container, Button } from '@material-ui/core';
import StringComponent from '../../StringComponent';
import Strings from '../../../config/localization/translations';

export default function MGE() {
  const HomePage5 = Strings.Homepage5Strings;
  
  return (
    <>
      <div className="hero-wrapper bg-composed-wrapper bg-first">
        <div className="hero-wrapper--content flex-column">
          <div className="shape-container-bottom-2 skSwirveWidth skEventWrapperHi">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="10 0 1420 380">
              <path
                fill="var(--light)"
                fillOpacity="1"
                stroke="#49e287"
                strokeWidth="8px"
                strokeDasharray="1650, 1820"
                strokeLinejoin="round"
                d="M0,288L34.3,250.7C68.6,213,137,139,206,144C274.3,149,343,235,411,229.3C480,224,549,128,617,101.3C685.7,75,754,117,823,122.7C891.4,128,960,96,1029,112C1097.1,128,1166,192,1234,186.7C1302.9,181,1371,107,1406,69.3L1440,32L1440,0L1405.7,0C1371.4,0,1303,0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0C754.3,0,686,0,617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z"></path>
            </svg>
          </div>
          <Container className="z-over skEventPadding">
            <Grid container spacing={6} className="py-5 px-4">
              <Grid item lg={5} className="skEventLt">
                <div className="pt-3 text-white pr-0">
                  <h2 className="display-3 font-weight-bold"><StringComponent string={HomePage5.string5}/> {/* string 5 */}</h2>
                  <p className="font-size-xl py-3 text-white">
                  <StringComponent string={HomePage5.string7}/> {/* string7 */}
                  </p>
                  <p className="font-size-xl text-white">
                  <StringComponent string={HomePage5.string8}/> {/* string8 */}
                  </p>
                  <div className="pt-3">
                    <Button                    
                        href="https://docs.sidekick.finance/sidekick-finance/info/how-to-stake"
                        target="_blank"
                        size="large"
                        className="rounded-sm shadow-black-lg btn-light">
                        <span className="btn-wrapper--label text-first text-uppercase font-weight-bold fontRubik"><StringComponent string={HomePage5.string9}/></span> {/* string9 */}
                      </Button>
                  </div>
                </div>
              </Grid>
              <Grid item lg={7} className="skEventRt mt-4">
                <div className="iframeContainer">
                  <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/l1o6KjPJrhs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen="allowFullscreen"
                  mozallowfullscreen="mozallowfullscreen" 
                  msallowfullscreen="msallowfullscreen" 
                  oallowfullscreen="oallowfullscreen" 
                  webkitallowfullscreen="webkitallowfullscreen" className="ytPlayer"></iframe>
                </div>
              </Grid>
            </Grid>
          </Container>
          <div className="shape-container-top-1 skSwirveWidth skEventWrapperLo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="10 0 1320 300">
              <path
                fill="var(--light)"
                fillOpacity="1"
                stroke="#49e287"
                strokeWidth="8px"
                strokeDasharray="1650, 1820"
                strokeLinejoin="round"
                d="M0,96L48,112C96,128,192,160,288,176C384,192,480,192,576,202.7C672,213,768,235,864,213.3C960,192,1056,128,1152,133.3C1248,139,1344,213,1392,250.7L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
