import React from 'react';
import StringComponent from '../../StringComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Collapse, Grid, Container, Card, Button } from '@material-ui/core';
import { Bell, Settings, Users, Briefcase, LifeBuoy } from 'react-feather';
import { NavLink } from 'react-router-dom';
import CountUp from 'react-countup';
import Slider from 'react-slick';
import Strings from '../../../config/localization/translations';
import sidekickGif from '../../../assets/images/sidekick/animation/Sidekick_transparent_large.gif';
import laptopMock from '../../../assets/images/sidekick/Laptop Mock 2.png'
import gangsterLogo from '../../../assets/images/stock-logos/Gangster_Finance_logo.png'
import miniLogo from '../../../assets/images/sidekick/logo/PNG Small/Logo_mark_white.png';
import CryptoHeader from './CryptoHeader.js';
import WebTwoToneIcon from '@material-ui/icons/WebTwoTone';

function SliderArrowNext(props) {
  const { className, onClick } = props;
  return (
    <div className={className} onClick={onClick}>
      <FontAwesomeIcon icon={['fas', 'chevron-right']} />
    </div>
  );
}

function SliderArrowPrev(props) {
  const { className, onClick } = props;
  return (
    <div className={className} onClick={onClick}>
      <FontAwesomeIcon icon={['fas', 'chevron-left']} />
    </div>
  );
}

export default function Homepage1(props) {

  const HomePage1 = Strings.Homepage1Strings;

  const { scrollDivH2, scrollDivH3, tokenStats } = props;

  const widgetsCarousels3A = {
      dots: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      nextArrow: <SliderArrowNext />,
      prevArrow: <SliderArrowPrev />
    };

  return (
    <>
      <div className="hero-wrapper bg-composed-wrapper bg-sidekick-dark">
        <div className="header-top-section pb-2">
          <CryptoHeader scrollDivH2={scrollDivH2} scrollDivH3={scrollDivH3} />
        </div>
        <div className="hero-wrapper--content">
          <div
            className="bg-composed-wrapper--image bg-composed-filter-rm"
          />
          <div className="bg-composed-wrapper--bg" />
          <div className="bg-composed-wrapper--content">
            <Container className="z-over shadow-container-content-5">
              <Slider
                className="rounded-lg overflow-hidden slider-arrows-outside slider-dots-outside slider-dots-light skSlider"
                {...widgetsCarousels3A}>
                <div> {/* SLIDE 1 */}
                  <Grid container className="sliderContainer">
                    <Grid item lg={8} className="skHeroLt">
                      <div className="pt-3 text-first pr-0 pr-xl-5">
                        <h2 className="display-3 font-weight-bold">
                        <StringComponent string={HomePage1.string1}/> {/* String1 */}
                        </h2>
                        <p className="font-size-xl py-3 text-first">
                        {/*HomePage1 String2 */} <StringComponent string={HomePage1.string2}/>
                        </p>
                        <p className="font-size-xl text-first">
                        {/* HomePage1 string3 */} <StringComponent string={HomePage1.string3}/>
                        </p>
                        <div className="pt-3">
                          <Button
                            target="_blank"
                            href="https://pancakeswap.finance/swap?outputCurrency=0x5755E18D86c8a6d7a6E25296782cb84661E6c106"
                            size="large"
                            className="rounded-sm font-weight-bold shadow-black-lg btn-first">
                            <span className="btn-wrapper--label text-white font-weight-bold text-uppercase fontRubik"><StringComponent string={HomePage1.string4}/></span> {/* string4 */}
                            <img alt="SideKick" src={miniLogo} className="btnBuyNowFooter app-nav-logo--text" />
                          </Button>
                          <Button                    
                            href="https://docs.sidekick.finance/sidekick-finance/info/how-to"
                            target="_blank"
                            size="large"
                            className="rounded-sm shadow-black-lg ml-3 btn-light">
                            <span className="btn-wrapper--label text-first font-weight-bold text-uppercase fontRubik"><StringComponent string={HomePage1.string5}/></span>{/* string5 */}
                            <span className="btn-wrapper--icon text-first btnLaunchIcon">
                              <FontAwesomeIcon icon={['fas', 'rocket']} className="font-size-xxl" style={{fill: "#1d2b72"}} />
                            </span>
                          </Button>
                        </div>
                      </div>
                    </Grid>
                    <Grid item lg={4} className="d-flex align-items-center skHeroRt">
                      <img
                        src={sidekickGif}
                        alt="..."
                        className="m-5 m-lg-0 img-fit-container sidekickGifXY"
                      />
                    </Grid>
                  </Grid>
                </div>
                <div> {/* SLIDE 2 */}
                  <Grid container className="sliderContainer">
                    <Grid item lg={8} className="skHeroLt">
                      <div className="pt-3 text-first pr-0 pr-xl-5">
                        <h2 className="display-3 font-weight-bold">
                        <StringComponent string={HomePage1.string12}/> {/* String12 */}
                        </h2>
                        <p className="font-size-xl py-3 text-first">
                        {/*HomePage1 String13 */} <StringComponent string={HomePage1.string13}/>
                        </p>
                        <p className="font-size-xl text-first">
                        {/* HomePage1 string14 */} <StringComponent string={HomePage1.string14}/>
                        </p>
                        <div className="pt-3">
                          <Button
                            href="/Headquarters"
                            size="large"
                            className="rounded-sm font-weight-bold shadow-black-lg btn-first">
                            <span className="btn-wrapper--label mr-2"><StringComponent string={HomePage1.string15}/></span> {/* string15 */}
                            <WebTwoToneIcon />
                          </Button>
                        </div>
                      </div>
                    </Grid>
                    <Grid item lg={4} className="d-flex align-items-center skHeroRt mt-3">
                      <img
                        src={laptopMock}
                        alt="..."
                        className="m-5 m-lg-0 laptopMockXY"
                      />
                    </Grid>
                  </Grid>
                </div>
                <div> {/* SLIDE 3 */}
                  <Grid container className="sliderContainer">
                    <Grid item lg={8} className="skHeroLt">
                      <div className="pt-3 text-first pr-2 pr-xl-5">
                        <h2 className="display-3 font-weight-bold">
                        <StringComponent string={HomePage1.string16}/> {/* String16 */}
                        </h2>
                        <p className="font-size-xl py-3 text-first">
                        {/*HomePage1 String17 */} <StringComponent string={HomePage1.string17}/>
                        </p>
                        <p className="font-size-xl text-first">
                        {/* HomePage1 string18 */} <StringComponent string={HomePage1.string18}/>
                        </p>
                        <div className="pt-3">
                          <Button
                            target='_blank'
                            href="https://sidekick-finance.medium.com/gangster-finance-partnership-beginnings-of-the-sidekick-super-network-26d61b941fbc"
                            size="large"
                            className="rounded-sm font-weight-bold shadow-black-lg btn-first">
                            <span className="btn-wrapper--label"><StringComponent string={HomePage1.string19}/></span> {/* string19 */}
                          </Button>
                        </div>
                      </div>
                    </Grid>
                    <Grid item lg={4} className="d-flex align-items-center skHeroRt mt-3">
                      <img
                        src={gangsterLogo}
                        alt="..."
                        className="m-5 m-lg-0 gangsterLogoXY"
                      />
                    </Grid>
                  </Grid>
                </div>
              </Slider>         
              <Grid container>
                <Grid item xl={12} className="skStats">
                  <Card className="card-box skCardPadding shadow-xxl">
                    <Grid container spacing={0} >
                      <Grid lg={4} className="p-3 flexWidth">
                        <div className="text-center">
                          <div>
                            <FontAwesomeIcon icon={['fas', 'recycle']} className="font-size-xxl text-second" />
                          </div>
                          <div className="mt-2 line-height-sm text-first">
                            <b className="font-size-lg">
                              <CountUp
                                start={0}
                                end={tokenStats !== undefined ? parseInt(tokenStats?.circulatingSupply) : 0}
                                duration={3}
                                deplay={2}
                                separator=","
                                decimals={0}
                                decimal="."
                                prefix=""
                                suffix=""
                              />
                            </b>
                            <span className="text-first o-75 pt-1 d-block"><StringComponent string={HomePage1.string6}/></span>{/*string6  */}
                          </div>
                        </div>
                      </Grid>
                      <Grid lg={4} className="p-3 flexWidth">
                        <div className="text-center">
                          <div>
                            <FontAwesomeIcon icon={['fas', 'fire']} className="font-size-xxl text-second" />
                          </div>
                          <div className="mt-2 line-height-sm text-first">
                            <b className="font-size-lg">
                              <CountUp
                                start={0}
                                end={tokenStats !== undefined ? parseInt(tokenStats?.burned) : 0}
                                duration={3}
                                deplay={2}
                                separator=","
                                decimals={0}
                                decimal="."
                                prefix=""
                                suffix=""
                              /></b>
                            <span className="text-first o-75 pt-1 d-block"><StringComponent string={HomePage1.string7}/></span>{/* BurnedString */}

                          </div>
                        </div>
                      </Grid>
                      <Grid lg={4} className="p-3 flexWidth">
                        <div className="text-center">
                          <div>
                            <FontAwesomeIcon icon={['fas', 'water']} className="font-size-xxl text-second" />
                          </div>
                          <div className="mt-2 line-height-sm text-first">
                            <b className="font-size-lg">
                              <CountUp
                                start={0}
                                end={tokenStats !== undefined ? tokenStats?.liquidityPoolUSD : 0}
                                duration={3}
                                deplay={2}
                                separator=","
                                decimals={2}
                                decimal="."
                                prefix="$"
                                suffix="" />
                            </b>
                            <span className="text-first o-75 pt-1 d-block"><StringComponent string={HomePage1.string8}/></span>{/* string8 */}
                          </div>
                        </div>
                      </Grid>
                      <Grid lg={4} className="p-3 flexWidth">
                        <div className="text-center">
                          <div>
                            <FontAwesomeIcon icon={['fas', 'chart-line']} className="font-size-xxl text-second" />
                          </div>
                          <div className="mt-2 line-height-sm text-first">
                            <b className="font-size-lg">
                              <CountUp
                                start={0}
                                end={tokenStats !== undefined ? tokenStats?.marketcapUSD : 0}
                                duration={3}
                                deplay={2}
                                separator=","
                                decimals={2}
                                decimal="."
                                prefix="$"
                                suffix=""
                              />
                            </b>
                            <span className="text-first o-75 pt-1 d-block"><StringComponent string={HomePage1.string9}/></span> {/* string9 */}
                          </div>
                        </div>
                      </Grid>
                      <Grid lg={4} className="p-3 flexWidth">
                        <div className="text-center">
                          <div>
                            <FontAwesomeIcon icon={['fas', 'money-bill-wave']} className="font-size-xxl text-second" />
                          </div>
                          <div className="mt-2 line-height-sm text-first">
                            <b className="font-size-lg">
                              <CountUp
                                start={0}
                                end={tokenStats !== undefined ? parseFloat(tokenStats?.skPrice) : 0}
                                duration={3}
                                separator=","
                                decimals={4}
                                decimal="."
                                prefix="$"
                                suffix=""
                              />
                            </b>
                            <span className="text-first o-75 pt-1 d-block"><StringComponent string={HomePage1.string10}/></span>{/* string10 */}
                          </div>
                        </div>
                      </Grid>
                      <Grid lg={4} className="p-3 flexWidth">
                        <div className="text-center">
                          <div>
                            <FontAwesomeIcon icon={['fas', 'users']} className="font-size-xxxl text-second" />
                          </div>
                          <div className="mt-2 line-height-sm text-first">
                            <b className="font-size-lg">
                              <CountUp
                                start={0}
                                end={tokenStats !== undefined ? parseInt(tokenStats?.totalHodlers) : 0}
                                duration={3}
                                deplay={2}
                                separator=","
                                decimals={0}
                                decimal="."
                                prefix=""
                                suffix=""
                              />
                            </b>
                            <span className="text-first o-75 pt-1 d-block"><StringComponent string={HomePage1.string11}/></span> {/* string11 */}
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
            </Container>
            <div className="shadow-container-blocks-5 z-below">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="10 0 1420 320">
                <path
                  fill="var(--white)"
                  fillOpacity="1"
                  stroke="#1d2b72"
                  strokeWidth="8px"
                  strokeDasharray="1900, 1540"
                  strokeLinejoin="round"
                  d="M0,288L15,266.7C30,245,60,203,90,202.7C120,203,150,245,180,240C210,235,240,181,270,170.7C300,160,330,192,360,176C390,160,420,96,450,96C480,96,510,160,540,186.7C570,213,600,203,630,186.7C660,171,690,149,720,165.3C750,181,780,235,810,218.7C840,203,870,117,900,69.3C930,21,960,11,990,10.7C1020,11,1050,21,1080,42.7C1110,64,1140,96,1170,96C1200,96,1230,64,1260,48C1290,32,1320,32,1350,69.3C1380,107,1410,181,1425,218.7L1440,256L1440,320L1425,320C1410,320,1380,320,1350,320C1320,320,1290,320,1260,320C1230,320,1200,320,1170,320C1140,320,1110,320,1080,320C1050,320,1020,320,990,320C960,320,930,320,900,320C870,320,840,320,810,320C780,320,750,320,720,320C690,320,660,320,630,320C600,320,570,320,540,320C510,320,480,320,450,320C420,320,390,320,360,320C330,320,300,320,270,320C240,320,210,320,180,320C150,320,120,320,90,320C60,320,30,320,15,320L0,320Z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
