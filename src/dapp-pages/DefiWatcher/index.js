import React, { useState, useEffect } from 'react';

import PairsByTradeAmountTable from 'dapp-components/DefiWatcher/PairsByTradeAmountTable';
import TransactionsTable from 'dapp-components/DefiWatcher/TransactionsTable/index';
import AlltimeTransactionsTable from 'dapp-components/DefiWatcher/AlltimeTransactionsTable/index';
import TransactionsOverview from 'dapp-components/DefiWatcher/TransactionsOverview';
import TransactionsSearch from 'dapp-components/DefiWatcher/TransactionsSearch';
import TransactionAccordions from 'dapp-components/DefiWatcher/TransactionAccordions';
import { groupBy, sortBy } from 'underscore';
import { getTimeframe } from 'utils/dappUtils';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Grid, Tab, Tabs, Typography, useMediaQuery } from '@material-ui/core';
import { useStoreState, useStoreActions } from 'easy-peasy';
import {
  useGetCandleData,
  useQuotePrice,
  useTopTradesByToken,
  useTrueTopTrades
} from 'hooks/useData';
import { useTotalSupply } from 'hooks/useTokenFunctions';
import Strings from 'config/localization/translations';
import WatcherAd from 'dapp-components/AdComponents/WatcherAd';
import NetworkSearch from 'dapp-components/DefiWatcher/NetworkSearch';
import SubscriptionModal from 'dapp-components/SubscriptionModal';
import { useWallet } from 'use-wallet';

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

export default function DefiWatcher() {
  const {
    watchedWallets,
    transactionFilter,
    pairsByTradeAmount,
    bnbPrice,
    selectedQueryNetwork
  } = useStoreState((state) => state.Dapp);
  const { setWatchedWallets, setPriceChartData } = useStoreActions(
    (actions) => actions.Dapp
  );

  const [alltimeTransactions, setAlltimeTransactions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [pastTransactions, setPastTransactions] = useState([]);
  const [totals, setTotals] = useState(undefined);
  const [coinLoading, setCoinLoading] = useState(undefined);
  const [alltimeTradesLoading, setAlltimeTradesLoading] = useState(undefined);
  const [pairsLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const [tabId, setTabId] = useState(0);
  const { selectedLangauge } = useStoreState((state) => state.Dapp);
  const [selectedTokenAddress, setSelectedTokenAddress] = useState();

  const wallet = useWallet();
  const totalSupply = useTotalSupply(selectedTokenAddress, wallet);
  const selectedTokenPrice = useQuotePrice(selectedTokenAddress);
  const { topTradesByToken, topPastTradesByToken } = useTopTradesByToken(
    selectedQueryNetwork,
    transactionFilter,
    getTimeframe(transactionFilter.dateRange),
    99999,
    0
  );

  const priceChartData = useGetCandleData(
    30,
    getTimeframe(transactionFilter.dateRange),
    selectedTokenAddress
  );
  const alltimeTopTrades = useTrueTopTrades();

  const desktop = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  useEffect(() => {
    setPriceChartData(priceChartData);
  }, [priceChartData]);

  useEffect(() => {
    if (
      transactionFilter !== null &&
      transactionFilter.token !== undefined &&
      transactionFilter.token !== null &&
      transactionFilter.token.subject !== null
    ) {
      setSelectedTokenAddress(transactionFilter.token.subject.address);
    }
  }, [transactionFilter, bnbPrice]);

  useEffect(() => {
    if (
      transactions !== topTradesByToken &&
      topTradesByToken !== undefined &&
      pastTransactions !== topPastTradesByToken &&
      topPastTradesByToken !== undefined
    ) {
      setTransactions(topTradesByToken);
      setPastTransactions(topPastTradesByToken);
      calculateTotals(topTradesByToken, topPastTradesByToken);
    }
  }, [topTradesByToken, topPastTradesByToken]);

  useEffect(() => {
    if (alltimeTopTrades !== undefined) {
      setAlltimeTransactions(alltimeTopTrades);
      setAlltimeTradesLoading(false);
    }
  }, [alltimeTopTrades]);

  const sum = (a, c) => {
    return a + c;
  };

  const calculateChartData = (trades) => {
    var totals = { buyData: [], sellData: [], buySellChartlabel: [] };
    let dateFormat = 'M-D @ hA';
    sortBy(trades, function (trade) {
      return new Date(trade.block.timestamp.time);
    });

    let groupedTrade = groupBy(trades, (trade) => {
      return moment(new Date(trade.block.timestamp.time)).format(
        'MM-DD-YYYY HH'
      );
    });

    let keys = Object.keys(groupedTrade);
    let sortedKeys = sortBy(keys, function (key) {
      return new Date(groupedTrade[key][0].block.timestamp.time);
    });

    sortedKeys.forEach((key) => {
      let trades = groupedTrade[key];
      let buyBaseAmountTotal = 0;
      totals.buySellChartlabel.push(
        moment(trades[0].block.timestamp.time).format(dateFormat)
      );

      trades.forEach((trade) => {
        if (
          trade.buyAmount !== undefined &&
          trade.buyAmount !== 0 &&
          trade.tradeAmount !== undefined &&
          trade.tradeAmount === trade.buyAmount
        )
          buyBaseAmountTotal += trade.buyAmount;
      });
      totals.buyData.push(buyBaseAmountTotal.toFixed(2));

      let sellBaseAmountTotal = 0;
      trades.forEach((trade) => {
        if (
          trade.sellAmount !== undefined &&
          trade.sellAmount !== 0 &&
          trade.tradeAmount !== undefined &&
          trade.tradeAmount === trade.sellAmount
        )
          sellBaseAmountTotal += trade.sellAmount;
      });
      totals.sellData.push(sellBaseAmountTotal.toFixed(2));
    });

    return totals;
  };

  const mapBuyTotals = (x) => {
    return x.buyAmount === undefined ||
      x.buyAmount === 0 ||
      x.buyAmount !== x.tradeAmount
      ? 0
      : 1
  }

  const calculateTotals = (trades, pastTrades) => {
    let totals = {};
    // calculate total trading volume
    let noData = false;
    if (trades !== undefined && pastTrades !== undefined) {
      try {
        totals.totalTradingVolume = trades
          .map((x) => x.tradeAmount)
          .reduce(sum);
        totals.buyTotals = trades
          .map((x) => mapBuyTotals(x))
          .reduce(sum);
        totals.sellTotals = trades
          .map((x) =>
            x.sellAmount === undefined ||
              x.sellAmount === 0 ||
              x.sellAmount !== x.tradeAmount
              ? 0
              : 1
          )
          .reduce(sum);
        totals.sellTotalAmount = trades
          .map((x) =>
            x.buyAmount === undefined ||
              x.buyAmount === 0 ||
              x.buyAmount !== x.tradeAmount
              ? x.sellAmount
              : 0
          )
          .reduce(sum);
        totals.buyTotalAmount = trades
          .map((x) =>
            x.sellAmount === undefined ||
              x.sellAmount === 0 ||
              x.sellAmount !== x.tradeAmount
              ? x.buyAmount
              : 0
          )
          .reduce(sum);

        if (pastTrades.length !== 0) {
          totals.pastTotalTradingVolume = pastTrades
            .map((x) => x.tradeAmount)
            .reduce(sum);
          totals.pastBuyTotals = pastTrades
            .map((x) =>
              x.buyAmount === undefined ||
                x.buyAmount === 0 ||
                x.buyAmount !== x.tradeAmount ? 0 : 1
            )
            .reduce(sum);
          totals.pastSellTotals = pastTrades
            .map((x) =>
              x.sellAmount === undefined ||
                x.sellAmount === 0 ||
                x.sellAmount !== x.tradeAmount
                ? 0
                : 1
            )
            .reduce(sum);
          totals.pastSellTotalAmount = pastTrades
            .map((x) =>
              x.sellAmount === undefined ||
                x.sellAmount === 0 ||
                x.sellAmount !== x.tradeAmount
                ? x.buyAmount
                : 0
            )
            .reduce(sum);
          totals.pastBuyTotalAmount = pastTrades
            .map((x) =>
              x.buyAmount === undefined ||
                x.buyAmount === 0 ||
                x.buyAmount !== x.tradeAmount
                ? x.sellAmount
                : 0
            )
            .reduce(sum);
        } else {
          totals.pastTotalTradingVolume = 0;
          totals.pastBuyTotals = 0;
          totals.pastSellTotals = 0;
          totals.pastSellTotalAmount = 0;          
          totals.pastBuyTotalAmount = 0;
        }


        totals.volumnPercentChange = (
          ((totals.totalTradingVolume - totals.pastTotalTradingVolume) /
            totals.pastTotalTradingVolume) *
          100
        ).toFixed(1);
        totals.buyPercentChange = (
          ((totals.buyTotals - totals.pastBuyTotals) / totals.pastBuyTotals) *
          100
        ).toFixed(1);
        totals.sellPercentChange = (
          (totals.sellTotals - totals.pastSellTotals / totals.pastSellTotals) *
          100
        ).toFixed(1);
        totals.buyAmountPercentChange = (
          ((totals.buyTotalAmount - totals.pastBuyTotalAmount) /
            totals.pastBuyTotalAmount) *
          100
        ).toFixed(1);
        totals.sellAmountPercentChange = (
          ((totals.sellTotalAmount - totals.pastSellTotalAmount) /
            totals.pastSellTotalAmount) *
          100
        ).toFixed(1);

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
      } catch (e) {
        console.log(e);
        setNoData(true);
        setCoinLoading(false);
      }
    }
    setTotals(totals);
  };

  const loadWallet = (wallet) => {
    let walletData = null;
    let sellWalletTransactions = transactions.filter(
      (x) => x.transaction.txFrom.address === wallet && x.sellAmount !== 0
    );
    let buyWalletTransactions = transactions.filter(
      (x) => x.transaction.txFrom.address === wallet && x.buyAmount !== 0
    );

    let sellTotalAmount =
      sellWalletTransactions.length > 0
        ? sellWalletTransactions.map((x) => x.sellAmount).reduce(sum)
        : 0;
    let buyTotalAmount =
      buyWalletTransactions.length > 0
        ? buyWalletTransactions.map((x) => x.buyAmount).reduce(sum)
        : 0;
    let sellTotalTokens =
      sellWalletTransactions.length > 0
        ? sellWalletTransactions.map((x) => x.baseAmount).reduce(sum)
        : 0;
    let buyTotalTokens =
      buyWalletTransactions.length > 0
        ? buyWalletTransactions.map((x) => x.baseAmount).reduce(sum)
        : 0;

    let pastSellWalletTransactions = pastTransactions.filter(
      (x) => x.transaction.txFrom.address === wallet && x.sellAmount !== 0
    );
    let pastBuyWalletTransactions = pastTransactions.filter(
      (x) => x.transaction.txFrom.address === wallet && x.buyAmount !== 0
    );
    let pastSellTotalAmount =
      pastSellWalletTransactions.length > 0
        ? sellWalletTransactions.map((x) => x.sellAmount).reduce(sum)
        : 0;
    let pastBuyTotalAmount =
      pastBuyWalletTransactions.length > 0
        ? buyWalletTransactions.map((x) => x.buyAmount).reduce(sum)
        : 0;

    walletData = {
      wallet: wallet,
      totalTokensBuy: buyTotalTokens.toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
      }),
      totalTokensSold: sellTotalTokens.toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
      }),
      totalAmountBuy: buyTotalAmount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      totalAmountSold: sellTotalAmount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      pastBuyTotalAmount: pastBuyTotalAmount.toFixed(2),
      pastSellTotalAmount: pastSellTotalAmount.toFixed(2),
      tokenAmountPercentSold: (
        ((sellTotalAmount - pastSellTotalAmount) / pastSellTotalAmount) *
        100
      ).toFixed(1),
      tokenAmountPercentBuy: (
        ((buyTotalAmount - pastBuyTotalAmount) / pastBuyTotalAmount) *
        100
      ).toFixed(1)
    };

    return walletData;
  };

  const handleSavedWallets = (wallets) => {
    let newWatchedWallets = [...watchedWallets];
    wallets.forEach((w) => {
      let index = watchedWallets.findIndex((x) => x.wallet === w);
      if (index === -1) {
        newWatchedWallets.push(loadWallet(w));
      }
    });

    setWatchedWallets(newWatchedWallets);
    setTabId(1);
  };

  const handleRemoveWallet = (wallet) => {
    let newWatchedWallets = [...watchedWallets];
    var index = newWatchedWallets.findIndex((x) => x.wallet === wallet);

    if (index > -1) {
      newWatchedWallets.splice(index, 1);
    }
    setWatchedWallets(newWatchedWallets);

    if (newWatchedWallets.length === 0) {
      setTabId(0);
    }
  };

  const handleRemoveWallets = () => {
    setWatchedWallets([]);

    setTabId(0);
  };

  const handleSearchChanged = () => {
    setCoinLoading(true);
    setAlltimeTradesLoading(true);
    setNoData(false);
  };

  const handleTabChange = (e, tabId) => {
    setTabId(tabId);
  };
  const getString = (jsonPath) => {
    return jsonPath[selectedLangauge] === ''
      ? jsonPath[1]
      : jsonPath[selectedLangauge];
  };
  const defiStrings = Strings.DefiWatcher;

  const renderTransactionOverview = () => {
    return (
      <TransactionsOverview
        price={selectedTokenPrice}
        totalSupply={totalSupply}
        buyTotal={
          totals !== undefined && totals.buyTotals !== undefined
            ? totals.buyTotals.toFixed(0)
            : 0
        }
        sellTotal={
          totals !== undefined && totals.sellTotals !== undefined
            ? totals.sellTotals.toFixed(0)
            : 0
        }
        buyTotalAmount={
          totals !== undefined && totals.buyTotalAmount !== undefined
            ? totals.buyTotalAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })
            : 0
        }
        sellTotalAmount={
          totals !== undefined && totals.sellTotalAmount !== undefined
            ? totals.sellTotalAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })
            : 0
        }
        totalVolume={
          totals !== undefined && totals.totalTradingVolume !== undefined
            ? totals.totalTradingVolume.toFixed(2)
            : 0
        }
        volumnPercentChange={
          totals !== undefined && totals.volumnPercentChange !== undefined
            ? totals.volumnPercentChange
            : 0
        }
        sellPercentChange={
          totals !== undefined && totals.sellPercentChange !== undefined
            ? totals.sellPercentChange
            : 0
        }
        buyPercentChange={
          totals !== undefined && totals.buyPercentChange !== undefined
            ? totals.buyPercentChange
            : 0
        }
        sellAmountPercentChange={
          totals !== undefined && totals.sellAmountPercentChange !== undefined
            ? totals.sellAmountPercentChange
            : 0
        }
        buyAmountPercentChange={
          totals !== undefined && totals.buyAmountPercentChange !== undefined
            ? totals.buyAmountPercentChange
            : 0
        }
        buyData={
          totals !== undefined && totals.buyData !== undefined
            ? totals.buyData
            : []
        }
        sellData={
          totals !== undefined && totals.sellData !== undefined
            ? totals.sellData
            : []
        }
        pastBuyData={
          totals !== undefined && totals.buyData !== undefined
            ? totals.buyData
            : []
        }
        pastSellData={
          totals !== undefined && totals.sellData !== undefined
            ? totals.sellData
            : []
        }
        chartLabels={
          totals !== undefined && totals.buySellChartlabel !== undefined
            ? totals.buySellChartlabel
            : []
        }
      />
    );
  };

  const renderTransactionAccordions = () => {
    return (
      <TransactionAccordions
        watchedWallets={watchedWallets}
        removeWallet={handleRemoveWallet}
        maxItems={100}
      />
    );
  };

  const renderTransactionsTable = () => {
    return (
      <TransactionsTable
        noData={noData}
        isLoading={coinLoading}
        saveWallets={handleSavedWallets}
        removeWallets={handleRemoveWallets}
        transactions={transactions}
        currentWallets={watchedWallets}
      />
    );
  };

  const renderAlltimeTransactionsTable = () => {
    return (
      <AlltimeTransactionsTable
        noData={noData}
        isLoading={alltimeTradesLoading}
        transactions={alltimeTransactions}
        currentWallets={watchedWallets}
      />
    );
  };

  const renderPairsByTradeAmountTable = () => {
    let networkData = pairsByTradeAmount[selectedQueryNetwork];
    return (
      <PairsByTradeAmountTable
        noData={noData}
        isLoading={pairsLoading}
        saveWallets={handleSavedWallets}
        data={networkData}
        filterChanged={handleSearchChanged}
      />
    );
  };

  const renderTransactionSearch = () => {
    return <TransactionsSearch filterChanged={handleSearchChanged} />;
  };

  const renderNetworkSearch = () => {
    return <NetworkSearch />;
  };

  const renderAds = () => {
    return <WatcherAd propTarget={"br"} />;
  };

  const renderTabs = () => {
    return (
      <>
        <div className="">
          <Tabs
            className="nav-tabs-primary skTabs"
            value={tabId}
            onChange={handleTabChange}>
            <Tab
              className="skTabBtn skSelected"
              label={getString(defiStrings.string25)}
            />
            <Tab
              className="skTabBtn skSelected"
              label={getString(defiStrings.string26)}
              disabled={watchedWallets.length === 0}
            />
          </Tabs>
        </div>
        <div className="">
          <TabPanel value={tabId} index={0}>
            {renderTransactionOverview()}
          </TabPanel>
          <TabPanel value={tabId} index={1}>
            <Grid item xl={12}>
              {renderTransactionAccordions()}
            </Grid>
          </TabPanel>
        </div>
      </>
    );
  };

  return (
    <>
      <Grid container>
        {desktop ? (
          <>
            <Grid container xl={9} spacing={1} className="">
              <Grid container xl={12} className="">
                <Grid item xl={12} className="">
                  {renderTransactionsTable()}
                </Grid>
              </Grid>
              <Grid container xl={12} className="mt-1">
                <Grid item xl={6}>
                  {renderPairsByTradeAmountTable()}
                </Grid>
                <Grid item xl={6}>
                  {renderAlltimeTransactionsTable()}
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={1} xl={3} className="ml-2">
              <Grid container item xl={12}>
                <Grid item xl={10}>
                  {renderTransactionSearch()}
                </Grid>
                <Grid item xl={2}>
                  {renderNetworkSearch()}
                </Grid>
              </Grid>
              <Grid item xl={12} className="my-2">
                {renderTabs()}
              </Grid>
              <Grid item xl={12}>
                {renderAds()}
              </Grid>
            </Grid>
          </>
        ) : (
          ///
          /// MOBILE/TABLET LAYOUT
          ///
          <>
            <Grid container spacing={1}>
              <Grid item>{renderNetworkSearch()}</Grid>
              <Grid item>{renderTransactionSearch()}</Grid>
              <Grid item>{renderTabs()}</Grid>
            </Grid>
            <Grid container spacing={1} className="">
              <Grid container spacing={1} className="">
                <Grid
                  item
                  style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                  {renderTransactionsTable()}
                </Grid>
              </Grid>
              <Grid container spacing={1} className="">
                <Grid
                  item
                  style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                  {renderAlltimeTransactionsTable()}
                </Grid>
                <Grid item style={{ paddingBottom: '15px' }}>
                  {renderPairsByTradeAmountTable()}
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
      <SubscriptionModal />
      <WatcherAd propTarget={"toaster"} />
    </>
  );
}
