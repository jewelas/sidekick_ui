import React, { useState, useEffect } from 'react';

import TransactionsOverview from '../../dapp-components/DefiWatcher/TransactionsOverview';
import TransactionAccordions from '../../dapp-components/DefiWatcher/TransactionAccordions';
import { groupBy, sortBy, union } from 'underscore'
import PropTypes from 'prop-types';
import moment from 'moment';
import StringComponent from '../../dapp-components/StringComponent';
import Strings from '../../config/localization/translations';

import { Grid, Card, Tab, Tabs, Typography, useMediaQuery } from '@material-ui/core';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { useAlltimeDripTrades, useGetLatestPairs, useTopTradesByToken, useTopTradesForDrip } from 'hooks/useData';
import { useTotalSupply } from 'hooks/useTokenFunctions';
import DripTransactionsTable from 'dapp-components/DripWatcher/DripTransactionsTable';
import LatestDripTransactionsTable from 'dapp-components/DripWatcher/LatestDripTransactionsTable';
import AlltimeDripTransactionsTable from 'dapp-components/DripWatcher/AlltimeDripTransactionsTable';
import { getWeb3 } from 'utils/web3';
import { useWallet } from 'use-wallet';
import DripView from 'dapp-components/DripWatcher/DripView';
import { getDripTokenAddress } from 'utils/addressHelpers';
import { useDripPrice } from 'hooks/useDrip';
import StockChart from 'dapp-components/Charts/StockChart';
import WatcherAd from 'dapp-components/AdComponents/WatcherAd';
import SubscriptionModal from 'dapp-components/SubscriptionModal'
import TopHolders from 'dapp-components/DripWatcher/TopHolders';
import BiggestDeposits from 'dapp-components/DripWatcher/BiggestDeposits';
import NewStats from 'dapp-components/DripWatcher/NewStats';
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

export default function DripWatcher() {
  const { watchedWallets, bnbPrice, dripStats } = useStoreState(state => state.Dapp);
  const { setWatchedWallets, setDripStats } = useStoreActions(actions => actions.Dapp);
  const [alltimeTransactions, setAlltimeTransactions] = useState([]);
  const [alltimeTradesLoading, setAlltimeTradesLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [pastTransactions, setPastTransactions] = useState([]);
  const [totals, setTotals] = useState(undefined);
  const [coinLoading, setCoinLoading] = useState(true);
  const [noData, setNoData] = useState(false);
  const [tabId, setTabId] = useState(0);
  const { selectedLangauge } = useStoreState((state) => state.Dapp);

  const wallet = useWallet();
  const web3 = getWeb3(wallet);  
  const totalSupply = useTotalSupply(getDripTokenAddress(), wallet)
  const usdDripPrice = useDripPrice(wallet);
  const { topTradesForDrip, topPastTradesForDrip } = useTopTradesForDrip(1);
  const alltimeDripTrades = useAlltimeDripTrades();
  const desktop = useMediaQuery(theme => theme.breakpoints.up("lg"));

  useEffect(() => {
    if (transactions !== topTradesForDrip && topTradesForDrip !== undefined &&
      pastTransactions !== topPastTradesForDrip && topPastTradesForDrip !== undefined && bnbPrice !== undefined) {
      setTransactions(topTradesForDrip);
      setPastTransactions(topPastTradesForDrip)
      calculateTotals(topTradesForDrip, topPastTradesForDrip);
    }
  }, [topTradesForDrip, topPastTradesForDrip, bnbPrice])
  //Firebase onetime use effect on component load
  const { firebase } = useStoreState((state) => state.Dapp);
  useEffect(() => {
    if (firebase !== null && firebase !== undefined) {
      firebase.analytics.logEvent('page_view');
    }
  }, [firebase]);

  useEffect(() => {
    if (totalSupply !== null && totalSupply !== undefined) {
      setDripStats({ id: 'totalSupply', value: totalSupply });
    }
  }, [totalSupply, usdDripPrice])

  useEffect(() => {
    if (alltimeDripTrades !== null && alltimeDripTrades !== undefined) {
      setAlltimeTransactions(alltimeDripTrades);
      setAlltimeTradesLoading(false);
    }
  }, [alltimeDripTrades])

  const sum = (a, c) => { return a + c };

  const calculateChartData = (trades) => {
    var totals = { buyData: [], sellData: [], buySellChartlabel: [] };
    let dateFormat = "M-D-YY @ hA";
    sortBy(trades, function (trade) { return new Date(trade.block.timestamp.time); })

    let groupedTrade = groupBy(trades, (trade) => {
      return moment(new Date(trade.block.timestamp.time)).format("MM-DD-YYYY HH");
    });

    let keys = Object.keys(groupedTrade);
    let sortedKeys = sortBy(keys, function (key) { return new Date(groupedTrade[key][0].block.timestamp.time); })

    sortedKeys.forEach((key) => {
      let trades = groupedTrade[key];
      let buyBaseAmountTotal = 0;
      totals.buySellChartlabel.push(moment(trades[0].block.timestamp.time).format(dateFormat));

      trades.forEach((trade) => {
        if (trade.method === 'onTokenPurchase' && trade.tradeAmountUsd !== undefined) {
          buyBaseAmountTotal += trade.tradeAmountUsd
        }
      });
      totals.buyData.push(buyBaseAmountTotal.toFixed(2));

      let sellBaseAmountTotal = 0;
      trades.forEach((trade) => {
        if (trade.method === 'onBnbPurchase' && trade.tradeAmountUsd !== undefined) {
          sellBaseAmountTotal += trade.tradeAmountUsd
        }
      });
      totals.sellData.push(sellBaseAmountTotal.toFixed(2));
    });

    return totals;
  }

  const calculateTotals = (trades, pastTrades) => {
    let totals = {};
    // calculate total trading volume  
    let noData = false;
    if (trades != undefined && pastTrades != undefined && bnbPrice !== undefined && trades.length > 0) {
      try {

        totals.totalTradingVolume = trades.map(x => {
          return x.tradeAmountUsd
        }).reduce(sum)
        totals.buyTotals = trades.map(x => x.method === 'onTokenPurchase' ? 1 : 0).reduce(sum)
        totals.sellTotals = trades.map(x => x.method === 'onBnbPurchase' ? 1 : 0).reduce(sum)
        totals.sellTotalAmount = trades.map(x => x.method === 'onBnbPurchase' ? x.tradeAmountUsd : 0).reduce(sum)
        totals.buyTotalAmount = trades.map(x => x.method === 'onTokenPurchase' ? x.tradeAmountUsd : 0).reduce(sum)

        totals.pastTotalTradingVolume = pastTrades.map(x => {
          return x.tradeAmountUsd
        }).reduce(sum)
        totals.pastBuyTotals = pastTrades.map(x => x.method === 'onTokenPurchase' ? 1 : 0).reduce(sum)
        totals.pastSellTotals = pastTrades.map(x => x.method === 'onBnbPurchase' ? 1 : 0).reduce(sum)
        totals.pastSellTotalAmount = pastTrades.map(x => x.method === 'onBnbPurchase' ? x.tradeAmountUsd : 0).reduce(sum)
        totals.pastBuyTotalAmount = pastTrades.map(x => x.method === 'onTokenPurchase' ? x.tradeAmountUsd : 0).reduce(sum)

        totals.volumnPercentChange = (((totals.totalTradingVolume - totals.pastTotalTradingVolume) / totals.pastTotalTradingVolume) * 100).toFixed(1);
        totals.buyPercentChange = (((totals.buyTotals - totals.pastBuyTotals) / totals.pastBuyTotals) * 100).toFixed(1);
        totals.sellPercentChange = (((totals.sellTotals - totals.pastSellTotals / totals.pastSellTotals)) * 100).toFixed(1);
        totals.buyAmountPercentChange = (((totals.buyTotalAmount - totals.pastBuyTotalAmount) / totals.pastBuyTotalAmount) * 100).toFixed(1);
        totals.sellAmountPercentChange = (((totals.sellTotalAmount - totals.pastSellTotalAmount) / totals.pastSellTotalAmount) * 100).toFixed(1);

        let currentChartData = calculateChartData(trades);
        totals.buySellChartlabel = currentChartData.buySellChartlabel;
        totals.buyData = currentChartData.buyData;
        totals.sellData = currentChartData.sellData;

        let pastChartData = calculateChartData(pastTrades);
        totals.pastBuySellChartlabel = currentChartData.buySellChartlabel;
        totals.pastBuyData = pastChartData.buyData;
        totals.pastSellData = pastChartData.sellData;
        setNoData(false);
        setCoinLoading(false);
      }
      catch (e) {
        console.log(e);
        setNoData(true)
        setCoinLoading(false);
      }
    }
    setTotals(totals);
  }

  const loadWallet = (wallet) => {
    let walletData = null;
    let sellWalletTransactions = transactions.filter(x => x.buyer == wallet && x.method === 'onBnbPurchase');
    let buyWalletTransactions = transactions.filter(x => x.buyer == wallet && x.method === 'onTokenPurchase');

    let sellTotalAmount = sellWalletTransactions.length > 0 ? sellWalletTransactions.map(x => x.tradeAmountUsd).reduce(sum) : 0;
    let buyTotalAmount = buyWalletTransactions.length > 0 ? buyWalletTransactions.map(x => x.tradeAmountUsd).reduce(sum) : 0;
    let sellTotalTokens = sellWalletTransactions.length > 0 ? sellWalletTransactions.map(x => x.tradeAmountUsd).reduce(sum) : 0;
    let buyTotalTokens = buyWalletTransactions.length > 0 ? buyWalletTransactions.map(x => x.tradeAmountUsd).reduce(sum) : 0;

    let pastSellWalletTransactions = pastTransactions.filter(x => x.buyer == wallet && x.method === 'onBnbPurchase');
    let pastBuyWalletTransactions = pastTransactions.filter(x => x.buyer == wallet && x.method === 'onTokenPurchase');
    let pastSellTotalAmount = pastSellWalletTransactions.length > 0 ? sellWalletTransactions.map(x => x.tradeAmountUsd).reduce(sum) : 0;
    let pastBuyTotalAmount = pastBuyWalletTransactions.length > 0 ? buyWalletTransactions.map(x => x.tradeAmountUsd).reduce(sum) : 0;

    walletData = {
      wallet: wallet,
      totalTokensBuy: buyTotalTokens.toLocaleString(undefined, { 'minimumFractionDigits': 3, 'maximumFractionDigits': 3 }),
      totalTokensSold: sellTotalTokens.toLocaleString(undefined, { 'minimumFractionDigits': 3, 'maximumFractionDigits': 3 }),
      totalAmountBuy: buyTotalAmount.toLocaleString(undefined, { 'minimumFractionDigits': 2, 'maximumFractionDigits': 2 }),
      totalAmountSold: sellTotalAmount.toLocaleString(undefined, { 'minimumFractionDigits': 2, 'maximumFractionDigits': 2 }),
      pastBuyTotalAmount: pastBuyTotalAmount.toFixed(2),
      pastSellTotalAmount: pastSellTotalAmount.toFixed(2),
      tokenAmountPercentSold: (((sellTotalAmount - pastSellTotalAmount) / pastSellTotalAmount) * 100).toFixed(1),
      tokenAmountPercentBuy: (((buyTotalAmount - pastBuyTotalAmount) / pastBuyTotalAmount) * 100).toFixed(1)
    }

    return walletData;
  }

  const handleSavedWallets = (wallets) => {
    let newWatchedWallets = [...watchedWallets];
    wallets.forEach(w => {
      let index = watchedWallets.findIndex(x => x.wallet == w);
      if (index == -1) {
        newWatchedWallets.push(loadWallet(w));
      }
    });

    setWatchedWallets(newWatchedWallets);
    setTabId(1);
  }

  const handleRemoveWallet = (wallet) => {
    let newWatchedWallets = [...watchedWallets];
    var index = newWatchedWallets.findIndex(x => x.wallet == wallet);

    if (index > -1) {
      newWatchedWallets.splice(index, 1);
    }
    setWatchedWallets(newWatchedWallets);

    if (newWatchedWallets.length == 0) {
      setTabId(0);
    }

  };

  const handleRemoveWallets = () => {
    setWatchedWallets([]);
    setTabId(0);
  };

  const handleTabChange = (e, tabId) => {
    setTabId(tabId);
  }
  const getString = (jsonPath) => {
    return jsonPath[selectedLangauge] === '' ? jsonPath[1] : jsonPath[selectedLangauge];
  }
  const defiStrings = Strings.DefiWatcher;

  const renderTransactionOverview = () => {
    return (<TransactionsOverview drip={true}
      totalSupply={dripStats.totalSupply}
      price={dripStats.usdDripPrice}
      buyTotal={totals != undefined && totals.buyTotals != undefined ? totals.buyTotals.toFixed(0) : 0}
      sellTotal={totals != undefined && totals.sellTotals != undefined ? totals.sellTotals.toFixed(0) : 0}
      buyTotalAmount={totals != undefined && totals.buyTotalAmount != undefined ? totals.buyTotalAmount.toLocaleString(undefined, { 'minimumFractionDigits': 2, 'maximumFractionDigits': 2 }) : 0}
      sellTotalAmount={totals != undefined && totals.sellTotalAmount != undefined ? totals.sellTotalAmount.toLocaleString(undefined, { 'minimumFractionDigits': 2, 'maximumFractionDigits': 2 }) : 0}
      totalVolume={totals !== undefined && totals.totalTradingVolume != undefined ? totals.totalTradingVolume.toFixed(2) : 0}
      volumnPercentChange={totals !== undefined && totals.volumnPercentChange != undefined ? totals.volumnPercentChange : 0}
      sellPercentChange={totals !== undefined && totals.sellPercentChange != undefined ? totals.sellPercentChange : 0}
      buyPercentChange={totals !== undefined && totals.buyPercentChange != undefined ? totals.buyPercentChange : 0}
      sellAmountPercentChange={totals !== undefined && totals.sellAmountPercentChange != undefined ? totals.sellAmountPercentChange : 0}
      buyAmountPercentChange={totals !== undefined && totals.buyAmountPercentChange != undefined ? totals.buyAmountPercentChange : 0}
      buyData={totals !== undefined && totals.buyData != undefined ? totals.buyData : []}
      sellData={totals !== undefined && totals.sellData != undefined ? totals.sellData : []}
      pastBuyData={totals !== undefined && totals.pastBuyData != undefined ? totals.pastBuyData : []}
      pastSellData={totals !== undefined && totals.pastSellData != undefined ? totals.pastSellData : []}
      chartLabels={totals !== undefined && totals.buySellChartlabel != undefined ? totals.buySellChartlabel : []}
    />)
  }

  const renderStockChart = () => {
    return (<StockChart />)
  }

  const renderTransactionAccordions = () => {
    return (<TransactionAccordions watchedWallets={watchedWallets} removeWallet={handleRemoveWallet} maxItems={100} drip={true} />);
  }

  const renderLatestTradesTable = () => {
    return (<LatestDripTransactionsTable noData={noData} isLoading={coinLoading}
      transactions={transactions} currentWallets={watchedWallets} web3={web3} latestTrades={true} />);
  }

  const renderTransactionsTable = () => {
    return (<DripTransactionsTable noData={noData} isLoading={coinLoading}
      saveWallets={handleSavedWallets} removeWallets={handleRemoveWallets}
      transactions={transactions} currentWallets={watchedWallets} web3={web3} />);
  }

  const renderAlltimeTransactionsTable = () => {
    return (<AlltimeDripTransactionsTable noData={noData} isLoading={alltimeTradesLoading}
      transactions={alltimeTransactions} currentWallets={watchedWallets} web3={web3} />);
  }

  const renderDripView = () => {
    return (<DripView />)
  }

  const renderNewStats = () => {
    return (<NewStats/>)
  }

  const renderTopHolders = () => {
    return (<TopHolders/>)
  }

  const renderBiggestDeposits = () => {
    return (<BiggestDeposits/>)
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
            <Tab className="skTabBtn skSelected" label={getString(defiStrings.string25)} />
            <Tab className="skTabBtn skSelected" label={getString(defiStrings.string34)} />
            <Tab className="skTabBtn skSelected" label={getString(defiStrings.string47)} />
            <Tab className="skTabBtn skSelected" label={getString(defiStrings.string26)} disabled={watchedWallets.length == 0} />
          </Tabs>
        </div>
        <div className="">
          <TabPanel value={tabId} index={0} >
            {renderTransactionOverview()}
          </TabPanel>
          <TabPanel value={tabId} index={1} >
            <Grid item xl={12}>
              {renderDripView()}
            </Grid>
          </TabPanel>
          <TabPanel value={tabId} index={2}>
            <Grid item xl={12}>
              {renderNewStats()}
            </Grid>
          </TabPanel>
          <TabPanel value={tabId} index={3}>
            <Grid item xl={12}>
              {renderTransactionAccordions()}
            </Grid>
          </TabPanel>
        </div>
      </>)
  }

  return (
    <>
      <Grid container>
        {desktop ? (
          <>
            <Grid container xl={9} spacing={1} className=''>             
              <Grid container xl={12}className=''>
                <Grid item xl={12} >
                  {renderTransactionsTable()}
                </Grid>
              </Grid>
              <Grid container xl={12} spacing={1} className='mt-1'>
                <Grid item xl={6} >
                  {renderLatestTradesTable()}
                </Grid>
                <Grid item xl={6}  >
                  {renderAlltimeTransactionsTable()}
                </Grid>
              </Grid>
            </Grid>
            <Grid container xl={3} spacing={1} className='ml-2'>              
              <Grid item xl={12} className='mb-2'>
                {renderTabs()}
              </Grid>
              <Grid item xl={12} >
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
              <Grid container spacing={1}>
                <Grid item>
                  {renderDripView()}
                </Grid>
                <Grid item>
                  {renderTabs()}
                </Grid>
              </Grid>
              <Grid container spacing={1} className=''>
                <Grid container spacing={1} className=''>
                  <Grid item style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                    {renderTransactionsTable()}
                  </Grid>
                </Grid>
              </Grid>
              <Grid container spacing={1} className=''>
                <Grid item style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                  {renderAlltimeTransactionsTable()}

                </Grid>
                <Grid item style={{ paddingBottom: '15px' }}>
                  {renderLatestTradesTable()}
                </Grid>
              </Grid>
            </>
          )}

        <WatcherAd propTarget={"toaster"} />
      </Grid>
      <SubscriptionModal />
    </>
  );
}
