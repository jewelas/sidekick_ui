import { thunk, action, thunkOn, actionOn } from 'easy-peasy';
import {
  featuredCoinsList,
  featuredCoinsList_ETH,
  featuredCoinsList_MATIC
} from 'config/featured_coins_list';
import {
  promoCoinsList,
  promoCoinsList_ETH,
  promoCoinsList_MATIC
} from 'config/promo_coins_list';

const getLocalStorageLang = () => {
  if (localStorage.getItem('Langauge_ID') !== null) {
    return parseInt(localStorage.getItem('Langauge_ID'));
  } else {
    localStorage.setItem('Langauge_ID', '1');
    return 1;
  }
};
const Dapp = {
  // state
  dripStats: {},
  // Blockchain Data
  moonBuddyContract: undefined,
  watchedWallets: [],
  nameServiceMappings: [],
  selectedNameService: 'sidekick',
  // daterange ex: NOW (today / 24 hrs ) WTD (week) MTD (month) QTD (3 mo) YTD (year)
  transactionFilter: { dateRange: 'NOW', token: undefined },
  chainId: 56, //BSC Default
  tokenList: [],
  pairsByTradeAmount: [],
  topTradesForDrip: [],
  topPastTradesForDrip: [],
  latestPairs: [],
  //todo add array for nameservice
  featuredCoinsList: featuredCoinsList,
  promoCoinsList: promoCoinsList,
  recentlySearchedTokens:
    localStorage.getItem('Recently_Searched') !== null
      ? JSON.parse(localStorage.getItem('Recently_Searched'))
      : [],
  selectedLangauge: getLocalStorageLang(), //Default langauge is English
  selectedNetwork: 'bsc', // eth matic bsc_testnet
  selectedQueryNetwork: 'bsc', // eth matic bsc tron - this corresponds to the network we will be searching on bitquery, not network we are using
  selectedToken: undefined,
  searchString: undefined,
  transactionMessage: {},
  systemNotification: undefined,
  // UserInfo
  connectedWallet: undefined,
  currentUserAddress: undefined,
  flowUserInfo: undefined,
  avatar: undefined,
  subscription: { level: -2, active: false },
  openSubscriptionModal: false,
  userCoinsList:
    localStorage.getItem('UserCoinsList') !== null
      ? JSON.parse(localStorage.getItem('UserCoinsList'))
      : [],
  //firebase component
  firebase: undefined,
  currentUserTradesByToken: undefined,
  // actions
  setSelectedQueryNetwork: action((state, data) => {
    state.selectedQueryNetwork = data;
  }),
  setSearchString: action((state, data) => {
    state.searchString = data;
  }),
  setTransactionMessage: action((state, data) => {
    state.transactionMessage.message = data.message;
    state.transactionMessage.style = data.style;
    state.transactionMessage.url = data.url;
  }),
  setSystemNotification: action((state, data) => {
    state.systemNotification = data;
  }),
  setConnectedWallet: action((state, data) => {
    state.connectedWallet = data;
  }),
  setSelectedLangauge: action((state, data) => {
    state.selectedLangauge = data;
    localStorage.setItem('Langauge_ID', data.toString());
  }),
  setCurrentUserAddress: action((state, data) => {
    state.currentUserAddress = data;
  }),
  setFlowUserInfo: action((state, data) => {
    state.flowUserInfo = data;
  }),
  setAvatar: action((state, data) => {
    state.avatar = data;
  }),
  setSubscription: action((state, data) => {
    state.subscription = data;
  }),
  setOpenSubscriptionModal: action((state, data) => {
    state.openSubscriptionModal = data;
  }),
  setSKNames: action((state, data) => {
    state.skNames[data.account] = data.name;
  }),
  setUserCoinsList: action((state, data) => {
    state.userCoinsList = data;
  }),
  setFirebase: action((state, data) => {
    state.firebase = data;
  }),
  setChainId: action((state, data) => {
    state.chainId = data;
  }),
  handleSetRecentlySearched: action((state, data) => {
    state.recentlySearchedTokens = data;
  }),
  setRecentlySearched: thunk(async (actions, payload, { getStoreState }) => {
    let state = getStoreState().Dapp;

    let found = state.recentlySearchedTokens.filter((item) => {
      return item.subject.address === payload.subject.address;
    });

    // set url
    const newurl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?token=${payload.subject.address}`;
    window.history.pushState({ path: newurl }, '', newurl);

    if (found === undefined || found.length === 0) {
      // recently searched length > 5 remove first inserted
      if (state.recentlySearchedTokens.length > 4) {
        state.recentlySearchedTokens.shift();
      }
      // push to recentlySearched array
      payload.type = 'Recently Searched';
      state.recentlySearchedTokens.push(payload);
      let newArray = [...new Set(state.recentlySearchedTokens)];

      localStorage.setItem('Recently_Searched', JSON.stringify(newArray));
      actions.handleSetRecentlySearched(newArray);
    }
  }),
  setCurrentUserTradesByToken: action((state, data) => {
    state.currentUserTradesByToken = data;
  }),
  setCurrentUserTrades: action((state, data) => {
    state.currentUserTrades = data;
  }),
  setCurrentUserPortfolioData: action((state, data) => {
    state.currentUserPortfolioData = data;
  }),
  setTopTradesForDrip: action((state, data) => {
    state.topTradesForDrip = data;
  }),
  setPastTopTradesForDrip: action((state, data) => {
    state.topPastTradesForDrip = data;
  }),
  setTopTradesByToken: action((state, data) => {
    state.topTradesByToken = data;
  }),
  setPastTopTradesByToken: action((state, data) => {
    state.topPastTradesByToken = data;
  }),
  setWatchedWallets: action((state, data) => {
    state.watchedWallets = data;
  }),
  setTransactionFilter: action((state, data) => {
    state.transactionFilter = data;
  }),
  setTokenList: action((state, data) => {
    state.tokenList = data;
  }),
  setSidekickTokenStats: action((state, data) => {
    state.sidekickTokenStats = data;
  }),
  setGenerationEventStats: action((state, data) => {
    state.mgeStats = data;
  }),
  setBnbPrice: action((state, data) => {
    state.bnbPrice = data;
  }),
  setCandleData: action((state, data) => {
    state.candleData = data;
  }),
  setPriceChartData: action((state, data) => {
    state.priceChartData = data;
  }),
  setPairsByTradeAmount: action((state, data) => {
    const { id, value} = data;
    state.pairsByTradeAmount = {...state.pairsByTradeAmount, [id]: value};
  }),
  setLatestPairs: action((state, data) => {
    state.latestPairs = data;
  }),
  setDripStats: action((state, data) => {
    const { id, value } = data;
    state.dripStats = { ...state.dripStats, [id]: value };
  }),
  setNameServiceMapping: action((state, data) => {
    const { id, value } = data;
    state.nameServiceMappings = { ...state.nameServiceMappings, [id]: value };
  }),
  setSelectedNameService: action((state, data) => {
    state.selectedNameService = data;
  }),
  setPortfolioExecuting: action((state, data) => {
    state.portfolioExecuting = data;
  }),
  setFeaturedCoinsList: action((state, data) => {
    state.featuredCoinsList = data;
  }),

  // thunkOn / actionOn
  onSetSelectedQueryNetwork: actionOn(
    (actions) => actions.setSelectedQueryNetwork,
    (state, target) => {
      // change featured tokens list
      // change promo tokens list
      switch (target.payload) {
        case 'bsc':
          state.featuredCoinsList = featuredCoinsList;
          break;
        case 'matic':
          state.featuredCoinsList = featuredCoinsList_MATIC
          break;
        case 'ethereum':
          state.featuredCoinsList = featuredCoinsList_ETH;
          break;
        default:
          break;
      }
    }
  )
};

export default Dapp;
