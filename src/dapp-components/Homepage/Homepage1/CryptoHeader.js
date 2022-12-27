import React, { useState } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';
import StringComponent from '../../StringComponent';
import clsx from 'clsx';
import Strings from '../../../config/localization/translations';
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Collapse, Container, Button, List, ListItem, lighten } from '@material-ui/core';

import projectLogo from '../../../assets/images/sidekick/logo/PNG Small/Logo_horizontal_color for blue BG.png';
import { NavLink } from 'react-router-dom';

import { FlagIcon } from 'react-flag-kit';

export default function CrypotHeader(props) {
  const [collapse, setCollapse] = useState(false);
  const toggle = () => setCollapse(!collapse);

  const { selectedLangauge } = useStoreState((state) => state.Dapp);
  const { setSelectedLangauge } = useStoreActions((state) => state.Dapp);
  const scrollSmoothHandler = (e) => {
    let scrollDiv = props.scrollDivH2;
    e.preventDefault();

    if (e.target.id === "Tokenomics" || e.target.key === "Tokenomics") {
      scrollDiv = props.scrollDivH3;
    }

    scrollDiv.current.scrollIntoView({ behavior: "smooth" });
  };

  const setLangauge = (langaugeId) => {
    setSelectedLangauge(langaugeId)
  }

  return (
    <>
      <div className="header-top-section py-3">
        <Container className="d-flex header-nav-menu justify-content-between align-items-center navbar-dark ">
          <ul className="d-flex skLangs">
            <li>
              <a
                className="rounded-sm py-1 px-3 font-size-xs font-weight-bold text-uppercase text-first"
                href="#/"
                onClick={(e) => e.preventDefault()}>
                <StringComponent string={Strings.LangaugeString} /> {/* TextID: 1 */}
                <span className="opacity-5 dropdown-arrow">
                  <FontAwesomeIcon icon={['fas', 'angle-down']} />
                </span>
              </a>
              <div className="skLangsMenu submenu-dropdown submenu-dropdown--sm">
                <div className="shadow-sm-dark bg-white rounded-sm">
                  <List
                    component="div"
                    className="nav-pills nav-neutral-primary flex-column p-2">

                    <ListItem
                      button
                      href="#/"
                      onClick={() => setLangauge(1)}
                      className="px-3 d-flex align-items-center bg-white text-primary">
                      <span className="mr-3">
                        <FlagIcon code="US" size={28} />
                      </span>
                      <StringComponent string={Strings.EnglishString} />

                    </ListItem>

                    <ListItem
                      button
                      href="#/"
                      onClick={() => setLangauge(2)}
                      className="px-3 d-flex align-items-center bg-white text-primary">
                      <span className="mr-3">
                        <FlagIcon code="ES" size={28} />
                      </span>
                      <StringComponent string={Strings.SpanishString} />
                    </ListItem>

                    <ListItem
                      button
                      href="#/"
                      onClick={() => setLangauge(3)}
                      className="px-3 d-flex align-items-center bg-white text-primary">
                      <span className="mr-3">
                        <FlagIcon code="KR" size={28} />
                      </span>
                      <StringComponent string={Strings.KoreanString} />
                    </ListItem>

                    {/* <ListItem
                      button
                      href="#/"
                      onClick={() => setLangauge(4)}
                      className="px-3 d-flex align-items-center bg-white text-primary">
                      <span className="mr-3">
                        <FlagIcon code="TR" size={28} />
                      </span>
                      <StringComponent string={Strings.TurkishString}/>
                    </ListItem>                    
                     */}
                    <ListItem
                      button
                      href="#/"
                      onClick={() => setLangauge(5)}
                      className="px-3 d-flex align-items-center bg-white text-primary">
                      <span className="mr-3">
                        <FlagIcon code="NL" size={28} />
                      </span>
                      <StringComponent string={Strings.DutchString} />
                    </ListItem>
                  </List>
                </div>
              </div>
            </li>
          </ul>
        </Container>
      </div>
      <Container>
        <div className="bg-primary p-2 header-nav-wrapper header-nav-wrapper-xl rounded px-4 navbar-dark skMainMenu">
          <div className="app-nav-logo app-nav-logo--dark">
            <div className="app-nav-logo--text">
              <img
                alt="SideKick"
                src={projectLogo}
              />
            </div>
          </div>
          <div className="header-nav-menu d-none d-lg-block">
            <ul className="d-flex nav nav-neutral-first justify-content-center align-items-center">
              <li>
                <a
                  id="Docs"
                  href="https://docs.sidekick.finance/sidekick-finance/"
                  target="_blank"
                  className="font-weight-bold rounded-sm text-white px-3">
                  <StringComponent string={Strings.DocsString} /> {/* TextID: 4 */}
                </a>
              </li>
              {/*<li>
                <a
                  id="Roadmap"
                  onClick={scrollSmoothHandler}
                  href="/#"
                  className="font-weight-bold rounded-sm text-white px-3">
                  <StringComponent string={Strings.RoadmapString} />
                </a>
              </li>*/}
              <li>
                <NavLink
                  // onClick={(e) => e.preventDefault()}
                  to="/DefiWatcher"
                  className="font-weight-bold rounded-sm text-white px-3">
                  <StringComponent string={Strings.DefiWatcher2String} />
                  {/* <div className="badge badge-success m-1 ml-2 badge-inner live"><StringComponent string={Strings.BetaString} /></div> */}
                </NavLink>
              </li>
              <li>
                <NavLink
                  // onClick={(e) => e.preventDefault()}
                  to="/Headquarters"
                  className="font-weight-bold rounded-sm text-white px-3">
                  <StringComponent string={Strings.HeadQuartersString} />
                  {/* <div className="badge badge-warning m-1 ml-2 badge-inner"><StringComponent string={Strings.NewString} /><span className="ml-1">🔥</span></div> */}
                  <div className="badge badge-success m-1 ml-2 badge-inner live"><StringComponent string={Strings.BetaString} /></div>
                </NavLink>
              </li>
              <li>
                <Button
                  component={NavLink}
                  to="/Staking"
                  className="font-weight-bold text-nowrap font-size-sm btnFomo">
                  <span className="btn-wrapper--label">
                    <StringComponent string={Strings.StakeNowString} />
                  </span>
                  <span className="btn-wrapper--icon">
                    <FontAwesomeIcon icon={['fas', 'comment-dollar']} className="font-size-xxl" />
                  </span>
                </Button>
              </li>
            </ul>
          </div>
          <div className="header-nav-actions flex-grow-0 flex-lg-grow-1 pr-3">
            <span className="d-block d-lg-none">
              <button
                onClick={toggle}
                className={clsx('navbar-toggler hamburger hamburger--elastic', {
                  'is-active': collapse
                })}>
                <span className="hamburger-box">
                  <span className="hamburger-inner" />
                </span>
              </button>
            </span>
          </div>
          <div className="d-flex d-lg-none">
            <Collapse
              in={collapse}
              className="nav-collapsed-wrapper shadow-sm-dark navbar-collapse">
              <div className="nav-inner-wrapper">
                <div className="p-3 pb-4 text-center">
                  <ul
                    component="div"
                    className="nav-pills nav-neutral-primary nav-pills-rounded flex-column noBullet p-0">
                    <li>
                      <a
                        id="Docs"
                        // onClick={scrollSmoothHandler}
                        href="https://docs.sidekick.finance/sidekick-finance/"
                        target="_blank"
                        className="rounded-sm text-first MuiList-root nav-pills-rounded MuiListItem-root MuiListItem-button btnMobile">
                        <StringComponent string={Strings.DocsString} /> {/* TextId: 4 */}
                      </a>
                    </li>
                    <li>
                      <a
                        id="Roadmap"
                        onClick={scrollSmoothHandler}
                        href="/#"
                        className="rounded-sm text-first MuiList-root nav-pills-rounded MuiListItem-root MuiListItem-button btnMobile">
                        <StringComponent string={Strings.RoadmapString} />{/* TextID: 5 */}
                      </a>
                    </li>
                    <li>
                      <NavLink
                        // onClick={(e) => e.preventDefault()}
                        to="/DefiWatcher"
                        className="rounded-sm text-first MuiList-root nav-pills-rounded MuiListItem-root MuiListItem-button btnMobile">
                        <StringComponent string={Strings.DefiWatcherString} />
                        <div className="badge badge-success m-1 ml-2 badge-inner"><StringComponent string={Strings.BetaString} /></div>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        // onClick={(e) => e.preventDefault()}
                        to="/DefiWatcher"
                        className="rounded-sm text-first MuiList-root nav-pills-rounded MuiListItem-root MuiListItem-button btnMobile">
                        <StringComponent string={Strings.HeadQuartersString} />
                        <div className="badge badge-warning m-1 ml-2 badge-inner"><StringComponent string={Strings.NewString} /><span className="ml-1">🔥</span></div>
                      </NavLink>
                    </li>
                  </ul>
                  <Button
                    component="a"
                    href="/STAKING"
                    className="font-weight-bold text-nowrap font-size-sm btnFomo">
                    <span className="btn-wrapper--label">
                      <StringComponent string={Strings.StakeNowString} />{/* TextID: 9 */}
                    </span>
                    <span className="btn-wrapper--icon">
                      <FontAwesomeIcon icon={['fas', 'comment-dollar']} className="font-size-xxl" />
                    </span>
                  </Button>
                </div>
              </div>
            </Collapse>
          </div>
        </div>
      </Container>
      <div
        className={clsx('collapse-page-trigger', { 'is-active': collapse })}
        onClick={toggle}
      />
    </>
  );
}
