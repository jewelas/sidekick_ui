import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ClimbingBoxLoader } from 'react-spinners';

import { ThemeProvider } from '@material-ui/styles';
import { SnackbarProvider } from 'notistack';

import MuiTheme from './theme';

// Layout Blueprints

import {
  LeftSidebar,
  PresentationLayout
} from './layout-blueprints';

// Example Pages
import DefiWatcher from './dapp-pages/DefiWatcher';
import Feedback from './dapp-pages/Feedback';
import Headquarters from './dapp-pages/Headquarters';
import LiquidityGenerationEvent from './dapp-pages/LiquidityGenerationEvent';
import Profile from './dapp-pages/Profile';
import Settings from './dapp-pages/Settings';
import PageLoginCover from './dapp-pages/PageLoginCover';
import PageRegisterCover from './dapp-pages/PageRegisterCover';
import PageRecoverCover from './dapp-pages/PageRecoverCover';
import PageError404 from './dapp-pages/PageError404';
import Staking from './dapp-pages/Staking';
import Sideflow from './dapp-pages/Sideflow';

import sidekickGif from './assets/images/sidekick/animation/Sidekick_transparent_large.gif';
import miniLogo from './assets/images/sidekick/logo/PNG Large/Logo_horizontal_color for green BG@3x.png';
import DripWatcher from 'dapp-pages/DripWatcher';
import GFI from 'dapp-pages/GangsterFinance'

const Homepage = lazy(() => import('./dapp-pages/Homepage'));
const LandingPage = lazy(() => import('./dapp-pages/LandingPage'));

const Routes = () => {
  const location = useLocation();

  const pageVariants = {
    initial: {
      opacity: 0
    },
    in: {
      opacity: 1
    },
    out: {
      opacity: 0
    }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'linear',
    duration: 0.3
  };

  const SuspenseLoading = () => {
    const [show, setShow] = useState(false);
    useEffect(() => {
      let timeout = setTimeout(() => setShow(true), 300);
      return () => {
        clearTimeout(timeout);
      };
    }, []);

    return (
      <>
        <AnimatePresence>
          {show && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}>
              <div className="d-flex align-items-center flex-column vh-100 justify-content-center text-center py-3">
                <div className="d-flex align-items-center flex-column px-4">
                  <ClimbingBoxLoader color={'#3c44b1'} loading={true} />
                </div>
                <div className="text-muted font-size-xl text-center pt-3">
                  <img src={sidekickGif} alt="SideKick Mascot" class="skMascot" />
                  <img src={miniLogo} alt="SideKick" class="skLogoType" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  };
  return (
    <ThemeProvider theme={MuiTheme}>
      <SnackbarProvider maxSnack={3}>
        <AnimatePresence>
          <Suspense fallback={<SuspenseLoading />}>
            <Switch>
              {/* <Redirect exact from="/" to="/" /> */}
              <Route exact path={['/']}>
                <PresentationLayout>
                  <Switch location={location} key={location.pathname}>
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}>
                      <Route path="/" component={Homepage} />
                    </motion.div>
                  </Switch>
                </PresentationLayout>
              </Route>
              <Route path={['/Homepage']}>
                <PresentationLayout>
                  <Switch location={location} key={location.pathname}>
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}>
                      <Route path="/Homepage" component={Homepage} />
                    </motion.div>
                  </Switch>
                </PresentationLayout>
              </Route>
              <Route
                path={[
                  '/DefiWatcher',
                  '/DripWatcher',
                  '/Feedback',
                  '/Headquarters',
                  '/MGE',
                  '/Profile',
                  '/Settings',
                  '/Staking',
                  '/Sideflow',
                  '/GFI'
                ]}>
                <LeftSidebar>
                  <Switch location={location} key={location.pathname}>
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}>
                      <Route path="/DefiWatcher" component={DefiWatcher} />
                      <Route path="/DripWatcher" component={DripWatcher} />
                      <Route path="/Feedback" component={Feedback} />
                      <Route path="/Headquarters" component={Headquarters} />
                      <Route path="/MGE" component={LiquidityGenerationEvent} />
                      <Route path="/Staking" component={Staking} />
                      <Route path="/Sideflow" component={Sideflow} />
                      <Route path="/Profile" component={Profile} />
                      <Route path="/Settings" component={Settings} />
                      <Route path='/GFI' component={GFI} />
                    </motion.div>
                  </Switch>
                </LeftSidebar>
              </Route>

              <Route path={['*']}>
                <PresentationLayout>
                  <Switch location={location} key={location.pathname}>
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}>
                      <Route path="*" component={LandingPage} />
                    </motion.div>
                  </Switch>
                </PresentationLayout>
              </Route>
            </Switch>
          </Suspense>
        </AnimatePresence>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default Routes;
