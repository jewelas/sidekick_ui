import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Container, Button, List, ListItem } from '@material-ui/core';
import { NavLink, useHistory } from 'react-router-dom';
import projectLogo from '../../../assets/images/sidekick/logo/PNG Small/Logo_horizontal_color for blue BG.png';
import miniLogo from '../../../assets/images/sidekick/logo/PNG Small/Logo_mark_blue.png';
import brandGuide from '../../../assets/pdf/Sidekick Logo Guide.pdf';
import StringComponent from '../../StringComponent';
import Strings from '../../../config/localization/translations';

export default function Footer(props) {

  let history = useHistory();

  const scrollSmoothHandler = (e) => {
    let scrollDiv = props.scrollDivH2;
    e.preventDefault();

    if (e.target.id === "Tokenomics") {
      scrollDiv = props.scrollDivH3;
    }

    scrollDiv.current.scrollIntoView({ behavior: "smooth" });
  };

  const navigateToPage = (route) => {
    history.push(route)
  }

  const HomePage6 = Strings.Homepage6Strings;

  return (
    <>
      <div className="bg-first bg-composed-wrapper--content footerOverlap">
        <div className="footerFlip">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="10 0 1420 320">
            <path
              fill="var(--white)"
              fillOpacity="1"
              stroke="#49e287"
              strokeWidth="8px"
              strokeDasharray="1900, 1540"
              strokeLinejoin="round"
              d="M0,288L15,266.7C30,245,60,203,90,202.7C120,203,150,245,180,240C210,235,240,181,270,170.7C300,160,330,192,360,176C390,160,420,96,450,96C480,96,510,160,540,186.7C570,213,600,203,630,186.7C660,171,690,149,720,165.3C750,181,780,235,810,218.7C840,203,870,117,900,69.3C930,21,960,11,990,10.7C1020,11,1050,21,1080,42.7C1110,64,1140,96,1170,96C1200,96,1230,64,1260,48C1290,32,1320,32,1350,69.3C1380,107,1410,181,1425,218.7L1440,256L1440,320L1425,320C1410,320,1380,320,1350,320C1320,320,1290,320,1260,320C1230,320,1200,320,1170,320C1140,320,1110,320,1080,320C1050,320,1020,320,990,320C960,320,930,320,900,320C870,320,840,320,810,320C780,320,750,320,720,320C690,320,660,320,630,320C600,320,570,320,540,320C510,320,480,320,450,320C420,320,390,320,360,320C330,320,300,320,270,320C240,320,210,320,180,320C150,320,120,320,90,320C60,320,30,320,15,320L0,320Z"></path>
          </svg>
        </div>
        <Container className="py-0 text-center text-xl-left py-xl-5 pt-5">
          <Grid container spacing={1}>
            <Grid item xl={5} className="d-flex align-items-center">
              <div className="mb-5 mb-xl-0 w-100">
                <div className="app-nav-logo text-left justify-content-xl-left flex-column flex-xl-row">
                  <img
                    alt="SideKick Finance"
                    src={projectLogo}
                    className="footerLogo"
                  />
                </div>
                <p className="my-4 pr-1 text-white">
                  {/* string1 */} <StringComponent string={HomePage6.string1} />
                </p>
                <div>
                  <Button
                    component="a"
                    target='_blank'
                    href="https://pancakeswap.finance/swap?outputCurrency=0x5755E18D86c8a6d7a6E25296782cb84661E6c106"
                    size="medium"
                    className="rounded-sm font-weight-bold shadow-black-lg btn-second">
                    <span className="btn-wrapper--label font-weight-bold text-uppercase fontRubik"><StringComponent string={HomePage6.string2} /></span> {/* string2 */}
                    <img alt="SideKick" src={miniLogo} className="btnBuyNowFooter app-nav-logo--text" />
                  </Button>
                </div>
              </div>
            </Grid>
            <Grid item xl={7} className="d-none d-md-flex align-items-center mt-3">
              <Grid container spacing={6} className="w-100">
                <Grid item md={4}>
                  <div className="divider-v divider-v-lg opacity-1 d-none d-xl-block" />
                  <div className="pl-0 pl-lg-3">
                    <h6 className="text-white font-weight-bold mb-3">
                      <StringComponent string={Strings.AboutString} /> {/* AboutString */}
                    </h6>
                    <List
                      component="div"
                      className="nav-transparent-alt flex-column">
                      <ListItem
                        button
                        onClick={(e) => e.preventDefault()}
                        className="d-block d-xl-flex px-0 py-1 text-white-50">
                        <StringComponent string={Strings.DocsString} /> {/* Docs string */}
                      </ListItem>                     
                      <ListItem
                        id="Defiwatcher"
                        button
                        onClick={() =>navigateToPage('/DefiWatcher')}
                        className="d-block d-xl-flex px-0 py-1 text-white-50">
                        <StringComponent className='text-white-50' string={Strings.DefiWatcher2String} />
                      </ListItem>
                      <ListItem
                        id="Roadmap"
                        button
                        href="/#"
                        onClick={scrollSmoothHandler}
                        className="d-block d-xl-flex px-0 py-1 text-white-50">
                        <StringComponent string={Strings.HeadQuartersString} /> 
                      </ListItem>
                    </List>
                  </div>
                </Grid>
                <Grid item md={4}>
                  <div className="divider-v divider-v-lg opacity-1 d-none d-xl-block" />
                  <div className="pl-0 pl-lg-3">
                    <h6 className="text-white font-weight-bold mb-3">
                      <StringComponent string={Strings.TransparencyString} /> {/* TransparencyString */}
                    </h6>
                    <List
                      component="div"
                      className="nav-transparent-alt flex-column">
                      <ListItem
                        component="a"
                        button
                        href="#/"
                        onClick={(e) => e.preventDefault()}
                        className="d-block d-xl-flex px-0 py-1 text-white-50">
                        <StringComponent string={Strings.AuditsString} />
                        <div className="badge badge-dark m-1 ml-2 badge-inner"><StringComponent string={Strings.SoonString} /></div> {/* Soonstring */}
                      </ListItem>
                      <ListItem
                        component="a"
                        button
                        href="https://docs.sidekick.finance/sidekick-finance/info/contract-info"
                        target="_blank"
                        className="d-block d-xl-flex px-0 py-1 text-white-50">
                        <StringComponent string={HomePage6.string8} /> {/* FaqString */}
                      </ListItem>
                      <ListItem
                        component="a"
                        button
                        href="mailto:team@sidekick.finance?subject=I need a SideKick!"
                        className="d-block d-xl-flex px-0 py-1 text-white-50">
                        <StringComponent string={Strings.ContactUsString} /> {/* Contactusstring */}
                      </ListItem>
                    </List>
                  </div>
                </Grid>
                <Grid item md={4}>
                  <div className="pl-0 pl-lg-3">
                    <h6 className="text-white font-weight-bold mb-3">
                      <StringComponent string={HomePage6.string3} /> {/* String3 */}
                    </h6>
                    <List
                      component="div"
                      className="nav-transparent-alt flex-column">
                      <ListItem
                        component="a"
                        button
                        href={brandGuide}
                        target="_blank"
                        className="d-block d-xl-flex px-0 py-1 text-white-50">
                        <StringComponent string={HomePage6.string4} />
                      </ListItem>
                      <ListItem
                        component="a"
                        button
                        href="https://docs.sidekick.finance/sidekick-finance/terms-of-service"
                        target="_blank"
                        className="d-block d-xl-flex px-0 py-1 text-white-50">
                        <StringComponent string={HomePage6.string5} />
                      </ListItem>
                      <ListItem
                        component="a"
                        button
                        href="https://docs.sidekick.finance/sidekick-finance/privacy-policy"
                        target="_blank"
                        className="d-block d-xl-flex px-0 py-1 text-white-50">
                        <StringComponent string={HomePage6.string6} />
                      </ListItem>
                    </List>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <div className="divider border-2 d-none d-md-block rounded-circle border-second bg-second opacity-4 mx-auto mt-6 mb-5 w-50" />
          <List
            component="div"
            className="nav-transparent-alt text-nowrap d-flex justify-content-center">
            <ListItem
              component="a"
              button
              className="text-white-50"
              href="https://discord.gg/JeqzCUggWk"
              target="_blank"
              title="Discord">
              <FontAwesomeIcon
                icon={['fab', 'discord']}
                className="font-size-lg"
              />
            </ListItem>
            <ListItem
              component="a"
              button
              className="text-white-50"
              href="https://t.me/sidekickfinance"
              target="_blank"
              title="Telegram">
              <FontAwesomeIcon
                icon={['fab', 'telegram']}
                className="font-size-lg"
              />
            </ListItem>
            <ListItem
              component="a"
              button
              className="text-white-50"
              href="https://www.twitch.com/sidekick.finance"
              target="_blank"
              title="Twitch">
              <FontAwesomeIcon
                icon={['fab', 'twitch']}
                className="font-size-lg"
              />
            </ListItem>
            <ListItem
              component="a"
              button
              className="text-white-50"
              href="https://www.youtube.com/channel/UCvbjCV9QK7se9zUrD773OvA"
              target="_blank"
              title="YouTube">
              <FontAwesomeIcon
                icon={['fab', 'youtube']}
                className="font-size-lg"
              />
            </ListItem>
            <ListItem
              component="a"
              button
              className="tiktokIcon"
              href="https://www.tiktok.com/@sidekick.finance"
              target="_blank"
              title="TikTok">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style={{ minWidth: "1rem" }}>
                <path
                  fill="rgba(255, 255, 255, .5)"
                  fillOpacity="1"
                  strokeLinejoin="round"
                  d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z">
                </path>
              </svg>
            </ListItem>
            <ListItem
              component="a"
              button
              className="text-white-50"
              href="https://twitter.com/SidekickFinance"
              target="_blank"
              title="Twitter">
              <FontAwesomeIcon
                icon={['fab', 'twitter']}
                className="font-size-lg"
              />
            </ListItem>
            <ListItem
              component="a"
              button
              className="text-white-50"
              href="https://www.instagram.com/sidekick.finance/"
              target="_blank"
              title="Instagram">
              <FontAwesomeIcon
                icon={['fab', 'instagram']}
                className="font-size-lg"
              />
            </ListItem>
            <ListItem
              component="a"
              button
              className="text-white-50"
              href="https://www.facebook.com/SideKickFinance-104803845149930"
              target="_blank"
              title="Facebook">
              <FontAwesomeIcon
                icon={['fab', 'facebook']}
                className="font-size-lg"
              />
            </ListItem>
            <ListItem
              component="a"
              button
              className="text-white-50"
              href="https://github.com/SideKick-Finance"
              target="_blank"
              title="Github">
              <FontAwesomeIcon
                icon={['fab', 'github']}
                className="font-size-lg"
              />
            </ListItem>
          </List>
        </Container>
        <div className="text-center text-white py-5"><StringComponent string={HomePage6.string7} /></div>
      </div>
    </>
  );
}
