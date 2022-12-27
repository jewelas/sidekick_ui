import React, { useEffect, useRef, useState } from 'react';
import Strings from '../../../config/localization/translations';
import { RiseLoader } from 'react-spinners';
import { Grid, Card, Button } from '@material-ui/core';
import testAd from '../../../assets/images/ads/SideKick-Surge-Ad-v2b.gif';
import clsx from 'clsx';
import { GetAd, PostAdStats } from 'services/FirebaseService';
import { useInterval } from 'hooks/useInterval';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function WatcherAd({ propTarget }) {
  const VISIBLE_TIME_MS = 1000;

  let [activeAd, setActiveAd] = useState(null);
  let [mouseCheck, setMouseCheck] = useState(false);
  let [mouseTimeout, setMouseTimeout] = useState(null);
  let [onScreenTime, setOnScreenTime] = useState(null);

  let defaultPermaClosed =
    !!window.localStorage.getItem('toasterAd') && propTarget === 'toaster';
  let [isPermaClosed, setIsPermaClosed] = useState(defaultPermaClosed);

  const [adStats, setAdStats] = useState({
    docId: null,
    clicks: 0,
    mouseOverCount: 0,
    timeOnScreenActive: 0,
    timeOnScreenInactive: 0,
    impressions: 1
  });

  const adLinkRef = useRef(null);
  const adCardRef = useRef(null);

  useEffect(() => {
    if (!isPermaClosed) {
      pullDownAd();
    }
  }, []);

  useInterval(() => pullDownAd(), 30 * 1000);

  useInterval(() => checkVisible(), 1000);

  useEffect(() => {}, [activeAd]);

  const checkVisible = () => {
    if (!isPermaClosed) {
      let element = adCardRef.current;

      if (!element) {
        return;
      }

      var rect = element.getBoundingClientRect();
      var viewHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight
      );

      let isVisible =
        !(rect.bottom < 0 || rect.top - viewHeight >= 0) && !document.hidden;

      if (isVisible) {
        adStats.timeOnScreenActive += VISIBLE_TIME_MS / 1000.0;
      }
    }
  };

  const pullDownAd = () => {
    if (!isPermaClosed) {
      if (activeAd) {
        let secondsOnScreen = Math.floor((new Date() - onScreenTime) / 1000.0);

        adStats.timeOnScreenInactive = secondsOnScreen;

        PostAdStats(adStats);
      }

      GetAd(propTarget).then((adData) => {
        setOnScreenTime(new Date());
        setAdStats({
          docId: adData.docId,
          clicks: 0,
          mouseOverCount: 0,
          timeOnScreenActive: 0,
          timeOnScreenInactive: 0,
          impressions: 1
        });
        setActiveAd(adData);
      });
    }
  };

  const permaCloseAd = () => {
    window.localStorage.setItem('toasterAd', true);
    setIsPermaClosed(true);

    if (activeAd) {
      let secondsOnScreen = Math.floor((new Date() - onScreenTime) / 1000.0);

      adStats.timeOnScreenInactive = secondsOnScreen;

      PostAdStats(adStats).then(() => {
        setOnScreenTime(new Date());
        setAdStats({
          docId: 'A',
          clicks: 0,
          mouseOverCount: 0,
          timeOnScreenActive: 0,
          timeOnScreenInactive: 0,
          impressions: 1
        });
      });
    }
  };

  const handleAdClick = () => {
    setAdStats({ ...adStats, ...{ clicks: adStats.clicks + 1 } });

    adLinkRef.current.click();
  };

  const handleMouseEnter = () => {
    mouseCheck = true;

    setMouseTimeout(
      setTimeout(() => {
        if (mouseCheck) {
          setAdStats({
            ...adStats,
            ...{ mouseOverCount: adStats.mouseOverCount + 1 }
          });
        }
      }, 500)
    );
  };

  const handleMouseLeave = () => {
    mouseCheck = false;
    clearTimeout(mouseTimeout);
  };

  if (!activeAd && propTarget != 'toaster') {
    return (
      <Card className={clsx('bg-first', 'text-center')} style={{minHeight: '100px'}}>     
        {/* Ad Loading Spinner */}
      </Card>
    );
  } else if (propTarget === 'br') {
    return !activeAd ? null : (
      <Card className={clsx('bg-first', 'text-center')} ref={adCardRef}>
        <a
          style={{ display: 'none' }}
          ref={adLinkRef}
          href={activeAd.url}
          target={'_blank'}
          rel={'noopener noreferrer'}></a>
        <img
          onClick={handleAdClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          src={activeAd.fileLink}
          className={'watcher-ad'}
        />
      </Card>
    );
  } else if (propTarget === 'toaster') {
    return (
      <div
        className={
          'toaster-ad-outer' + (isPermaClosed || !activeAd ? ' closed' : '')
        }>
        <a
          style={{ display: 'none' }}
          ref={adLinkRef}
          href={activeAd?.url ?? ''}
          target={'_blank'}
          rel={'noopener noreferrer'}></a>
        <img
          onClick={handleAdClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          src={activeAd?.fileLink ?? ''}
          className={'toaster-ad-img'}
        />
        <div className={'toaster-ad-message'}>
          {activeAd?.descriptionText ?? ''}
        </div>
        <Button
          className={
            'm-2 btn-gradient shadow-none bg-sidekick-dark text-primary font-weight-bold text-uppercase toaster-ad-button'
          }
          onClick={handleAdClick}>
          {activeAd?.buttonText ?? ''}
        </Button>
        <div className={'toaster-ad-close'} onClick={permaCloseAd}>
          <FontAwesomeIcon icon={['fas', 'times']} />
        </div>
      </div>
    );
  }
}
