import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Tab, Tabs, Typography, useMediaQuery } from '@material-ui/core';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Strings from '../../config/localization/translations';
import { getBaseTokenForNetwork, getTimeframe } from '../../utils/dappUtils';
import { useGetCandleData, useQuotePrice, usePortfolioData, useTopTradesByToken, useCurrentUserTrades } from 'hooks/useData';

import WatcherAd from 'dapp-components/AdComponents/WatcherAd';
import HQFeatured from '../../dapp-components/Headquarters/HQFeatured';
import HQTagged from 'dapp-components/Headquarters/HQTagged';
import TransactionsSearch from '../../dapp-components/DefiWatcher/TransactionsSearch';
import HQPortfolio from 'dapp-components/Headquarters/HQPortfolio';
import StockChart from 'dapp-components/Charts/StockChart';
import { useWallet } from 'use-wallet';
import LatestTransactionsTable from 'dapp-components/Headquarters/LatestTransactionsTable';
import UserTransactionsTable from 'dapp-components/Headquarters/UserTransactionsTable';
import NetworkSearch from 'dapp-components/DefiWatcher/NetworkSearch';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      {...other}>
      {value === index && <div>{children}</div>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

export default function Headquarters() {
  const { watchedWallets, transactionFilter, bnbPrice, selectedQueryNetwork, selectedLangauge, firebase, currentUserAddress, featuredCoinsList  } = useStoreState(state => state.Dapp);
  const { setPriceChartData } = useStoreActions(actions => actions.Dapp);

  const [transactions, setTransactions] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [taggedTokenList, setTaggedTokenList] = useState([]);
  const [taggedLoading, setTaggedLoading] = useState(false);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [recentTradesLoading, setRecentTradesLoading] = useState(false);
  const [coinLoading, setCoinLoading] = useState(undefined);
  const [noData, setNoData] = useState(false);
  const [noUserData, setNoUserData] = useState(true);
  const [noTaggedData, setNoTaggedData] = useState(true);
  const [tabId, setTabId] = useState(0);  
  const [selectedTokenAddress, setSelectedTokenAddress] = useState();
  const [selectedTokenPrice, setSelectedTokenPrice] = useState(0);

  const wallet = useWallet();

  const selectedTokenBnbPrice = useQuotePrice(selectedTokenAddress, getBaseTokenForNetwork(selectedQueryNetwork));
  // to do add network switching
  const priceChartData = useGetCandleData(30, getTimeframe(transactionFilter.dateRange), selectedTokenAddress);

  // to do add network switching
  const portfolioData = usePortfolioData(wallet);
  
  const { topTradesByToken, topPastTradesByToken } = useTopTradesByToken(selectedQueryNetwork, transactionFilter, getTimeframe(transactionFilter.dateRange), 99999, 0);
  const CACHED_PROVIDER_KEY = 'TaggedTokens';
  const desktop = useMediaQuery(theme => theme.breakpoints.up("lg"));  
  
  const _userTransactions = useCurrentUserTrades(90);  

  useEffect(() => {
    if (firebase !== null && firebase !== undefined) {
      firebase.analytics.logEvent('page_view');
    }
  }, [firebase]);

  useEffect(() => {
    if (transactions !== undefined && transactions !== topTradesByToken && topTradesByToken !== undefined && topTradesByToken.length > 0) {
      setTransactions(topTradesByToken);
      setCoinLoading(false);
    }
  }, [topTradesByToken])

  useEffect(() => {
    setPriceChartData(priceChartData);
  }, [priceChartData])

  useEffect(() => {

    if (_userTransactions !== undefined) {
      setUserTransactions(_userTransactions);
      setRecentTradesLoading(false);
    }
  }, [_userTransactions, currentUserAddress])

  useEffect(() => {
    const cachedProvider = JSON.parse(localStorage.getItem(CACHED_PROVIDER_KEY));
    if (cachedProvider === null || cachedProvider === undefined) {
      setNoTaggedData(true);
      
      return;
    } else {
      if (Array.isArray(cachedProvider)) {
        if (cachedProvider.length > 0) {
          setTaggedTokenList(cachedProvider);
          setNoTaggedData(false);
        }
      }
    }
    
  }, [taggedTokenList.length])

  useEffect(() => {
    if (portfolioData === undefined && currentUserAddress !== undefined) {
      setPortfolioLoading(true);
      setRecentTradesLoading(true);
      setNoUserData(false);
    }
    if (portfolioData !== undefined && currentUserAddress !== undefined && portfolioLoading) {
      setPortfolioLoading(false);
    }
  }, [portfolioData, currentUserAddress])

  useEffect(() => {
    if (transactionFilter !== null && transactionFilter.token !== undefined && transactionFilter.token !== null && transactionFilter.token.subject !== null) {
      setSelectedTokenAddress(transactionFilter.token.subject.address);
    }

    if (selectedTokenBnbPrice !== undefined && bnbPrice !== undefined) {
      setSelectedTokenPrice(parseFloat(selectedTokenBnbPrice * bnbPrice));
    }
  }, [transactionFilter, selectedTokenBnbPrice, bnbPrice])

  const handleSearchChanged = () => {
    setCoinLoading(true);
    setNoData(false);
  }

  const handleTabChange = (e, tabId) => {
    setTabId(tabId);
  }
  const getString = (jsonPath) => {
    return jsonPath[selectedLangauge] === '' ? jsonPath[1] : jsonPath[selectedLangauge];
  }
  const defiStrings = Strings.DefiWatcher;

  const renderHQFeatured = () => {
    return (<HQFeatured noData={noData} isLoading={featuredLoading}
      data={featuredCoinsList} currentWallets={watchedWallets} currentTags={taggedTokenList} setTags={setTaggedTokenList} />)
  }
  const renderHQTagged = () => {
    
    return (<HQTagged noData={noTaggedData} isLoading={taggedLoading}
      data={taggedTokenList} currentWallets={watchedWallets} setTags={setTaggedTokenList} />)
  }

  const renderStockChart = () => {
    return (<StockChart />)
  }

  const renderHQPortfolio = () => {
    return (<HQPortfolio noData={noUserData} isLoading={portfolioLoading}
      data={portfolioData} currentTags={taggedTokenList} setTags={setTaggedTokenList} />);
  }

  const renderLatestTransactionsTable = () => {
    return (<LatestTransactionsTable noData={noData} isLoading={coinLoading} data={transactions} />);
  }

  const renderUserTransactionsTable = () => {
    return (<UserTransactionsTable noData={noUserData} isLoading={recentTradesLoading} data={userTransactions} />);
  }

  const renderTransactionSearch = () => {
    return (<TransactionsSearch filterChanged={handleSearchChanged} />);
  }

  const renderNetworkSearch = () => {
    return (<NetworkSearch filterChanged={handleSearchChanged} />);
  }

  const renderAds = () => {
    return (<WatcherAd propTarget={"br"} />)
  }

  const renderTabs = () => {
    return (
      <>
        <div className="">
          <Tabs
            className="nav-tabs-primary skTabs"
            value={tabId}
            onChange={handleTabChange}>
            <Tab className="skTabBtn skSelected" label={getString(defiStrings.string38)} />
            <Tab className="skTabBtn skSelected" label={getString(defiStrings.string39)} />
            <Tab className="skTabBtn skSelected" label={getString(defiStrings.string40)} />
          </Tabs>
        </div>
        <div className="">
          <TabPanel value={tabId} index={0} >
            {renderHQFeatured()}
          </TabPanel>
          <TabPanel value={tabId} index={1}>
            <Grid item xl={12}>
              {renderHQPortfolio()}
            </Grid>
          </TabPanel>
          <TabPanel value={tabId} index={2} >
            {renderHQTagged()}
          </TabPanel>
        </div>
      </>)
  }

  return (
    <>
      <Grid container>
        {desktop ? (
          <>
            <Grid container xl={9} className='' style={{padding: '4px'}}>
              <Grid container xl={12} className=''>
                <Grid item xl={12} className=''>
                  {renderStockChart()}
                </Grid>
              </Grid>
              <Grid container xl={12} spacing={1} className='mt-1'>
                <Grid item xl={6} >
                  {renderLatestTransactionsTable()}
                </Grid>
                <Grid item xl={6}  >
                  {renderUserTransactionsTable()}
                </Grid>
              </Grid>
            </Grid>
            <Grid container xl={3} className='' style={{padding: '4px'}}>
              <Grid container item xl={12} >
                <Grid item xl={10} >
                  {renderTransactionSearch()}
                </Grid>
                <Grid item xl={2} >
                  {renderNetworkSearch()}
                </Grid>                
              </Grid>
              <Grid item xl={12} className='my-2' >
                {renderTabs()}
              </Grid>
              <Grid item xl={12}>
                {renderAds()}
              </Grid>
            </Grid>
          </>
        ) :
          ///
          /// MOBILE/TABLET LAYOUT
          ///
          (
            <>
              <Grid container>
                <Grid item style={{paddingBottom: '10px'}}>
                  {renderTransactionSearch()}
                </Grid>
                <Grid item>
                  {renderTabs()}
                </Grid>
              </Grid>
              <Grid container style={{paddingTop: '10px'}}>
                <Grid container spacing={1} className=''>
                  <Grid item style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                    {renderStockChart()}
                  </Grid>
                </Grid>
                <Grid container spacing={1} className=''>
                  <Grid item style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                    {/* {renderAlltimeTransactionsTable()} */}

                  </Grid>
                  <Grid item style={{ paddingBottom: '15px' }}>
                    {/* {renderPairsByTradeAmountTable()} */}
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}
        <WatcherAd propTarget={"toaster"} />
      </Grid>
    </>
  );
}
