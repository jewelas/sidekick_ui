import React, { useState, useEffect } from 'react';
import { useStoreState } from 'easy-peasy';
import {
  Card
} from '@material-ui/core';
import clsx from 'clsx';
import { widget } from '../../../charting_library';
import { DataFeed } from './DataFeed/index.js';
import { usePrevious } from 'hooks/useHelpers';
import * as addressHelper from '../../../utils/addressHelpers';

function getLanguageFromURL() {
  const regex = new RegExp('[\\?&]lang=([^&#]*)');
  const results = regex.exec(window.location.search);
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export default function StockChart(props) {

  const { selectedLangauge, bnbPrice, transactionFilter, currentUserAddress, selectedQueryNetwork } = useStoreState((state) => state.Dapp);

  const [hoverData, setHoverData] = useState(null);
  const [options, setOptions] = useState({
    symbol: 'SK/BNB',
    interval: '240',
    containerId: 'tv_chart_container',
    libraryPath: '/charting_library/',
    chartsStorageUrl: 'https://saveload.tradingview.com',
    chartsStorageApiVersion: '1.1',
    clientId: 'tradingview.com',
    userId: 'public_user_id',
    fullscreen: false,
    autosize: true,
    studiesOverrides: {},
  });

  const [tvWidget, setTvWidget] = useState(undefined);

  const [isUsdConvert, setIsUsdConvert] = useState(true);
  const toggleUsdConvert = () => { setIsUsdConvert(prev => !prev); }
  const prevIsUsdConvert = usePrevious(isUsdConvert)

  const [isPlotTrades, setIsPlotTrades] = useState(true);
  const togglePlotTrades = () => { setIsPlotTrades(prev => !prev); }
  const prevIsPlotTrades = usePrevious(isPlotTrades)

  const prevFilter = usePrevious(transactionFilter)
  const prevUserAddress = usePrevious(currentUserAddress)
  const prevNetwork = usePrevious(selectedQueryNetwork)

  useEffect(() => {

    let feedParams = {
      network: selectedQueryNetwork,
      baseCurrency: transactionFilter.token === undefined || transactionFilter.token === null ? addressHelper.getRootedAddress() : transactionFilter.token.subject.address,
      quoteCurrency: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', //BNB
      currentUserAddress: currentUserAddress,
      isUsdConvert: isUsdConvert,
      isPlotTrades: isPlotTrades
    }

    console.log(prevIsPlotTrades, isPlotTrades)

    if (tvWidget === undefined || prevFilter !== transactionFilter || 
      prevIsUsdConvert != isUsdConvert || prevIsPlotTrades != isPlotTrades 
      || prevUserAddress !== currentUserAddress || prevNetwork !== selectedQueryNetwork) {
      let widgetOptions = {
        symbol: transactionFilter.token === undefined || transactionFilter.token === null ? options.symbol : transactionFilter.token.subject.symbol,
        // BEWARE: no trailing slash is expected in feed URL
        datafeed: DataFeed(feedParams),
        interval: options.interval,
        container_id: options.containerId,
        library_path: options.libraryPath,

        locale: getLanguageFromURL() || 'en',
        disabled_features: ['use_localstorage_for_settings'],
        enabled_features: ['study_templates'],
        charts_storage_url: options.chartsStorageUrl,
        charts_storage_api_version: options.chartsStorageApiVersion,
        client_id: options.clientId,
        user_id: options.userId,
        fullscreen: options.fullscreen,
        autosize: options.autosize,
        studies_overrides: options.studiesOverrides,
        // toolbar_bg: '#232a32',
        study_count_limi: 2,
        disabled_features: [
          'header_symbol_search',
          'save_chart_properties_to_local_storage',
          'header_compare',
          'header_chart_type', 'go_to_date'],
        enabled_features: [],
        //snapshot_url: "https://myserver.com/snapshot",
        theme: "Dark",
        // check here https://github.com/tradingview/charting_library/wiki/Overrides
        overrides: {
          // "mainSeriesProperties.style": 2
          'paneProperties.backgroundType': 'solid',
          "paneProperties.background": "#1d2b72"
        },
        //url should be an absolute or relative path to the static folder.
        // custom_css_url: window.location.origin + '/site.css',
        // loading_screen: { 
        //   backgroundColor: "#000000", 
        //   foregroundColor: '' 
        // }
      };

      let _tvWidget = new widget(widgetOptions);
      _tvWidget.onChartReady(() => {
        _tvWidget.headerReady().then(() => {

          const usdButton = _tvWidget.createButton();
          usdButton.setAttribute('title', 'Toggle between BNB and USD');
          usdButton.addEventListener('click', toggleUsdConvert );
          usdButton.textContent = isUsdConvert ? 'Use BNB' : 'Use USD';

          const plotButton = _tvWidget.createButton();
          plotButton.setAttribute('title', 'Show and hide my trades');
          plotButton.addEventListener('click', togglePlotTrades );
          plotButton.textContent = isPlotTrades ? 'Hide My Trades' : 'Show My Trades';

          // const button = _tvWidget.createButton();
          // button.setAttribute('title', 'Click to show a notification popup');
          // button.classList.add('apply-common-tooltip');
          // button.addEventListener('click', () => _tvWidget.showNoticeDialog({
          //   title: 'Notification',
          //   body: 'TradingView Charting Library API works correctly',
          //   callback: () => {
          //     console.log('Noticed!');
          //   },
          // }));

          // button.innerHTML = 'Check API';
        });
      });

      setTvWidget(_tvWidget);
    }

    // refresh
    // if(tvWidget !== undefined && currentUserAddress !== undefined && currentUserAddress !== prevUserAddress){
    //   tvWidget._options.datafeed = DataFeed(feedParams)
    //   tvWidget.activeChart().refreshMarks();
    //   tvWidget.activeChart().resetData();
    // }

  }, [bnbPrice, transactionFilter, isUsdConvert, isPlotTrades, currentUserAddress])

  const getString = (jsonPath) => {

    return jsonPath[selectedLangauge] === '' ? jsonPath[1] : jsonPath[selectedLangauge];
  }

  return (
    <>
      <Card className={clsx('bg-first', 'text-center', 'p-2')}>
        <div
          id={options.containerId}
          className={'TVChartContainer'}
        />
      </Card>
    </>
  );
}
