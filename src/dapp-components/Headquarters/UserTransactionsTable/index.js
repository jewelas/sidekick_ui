import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Card } from '@material-ui/core';
import { TableBody, Table, TableCell, TableContainer, TableHead, TableRow, Toolbar, IconButton} from '@material-ui/core';
import { RiseLoader } from 'react-spinners';
import { makeStyles, lighten } from '@material-ui/core/styles';
import { groupBy } from 'underscore'
import moment from 'moment';
import TablePagination from '@material-ui/core/TablePagination';
import { useStoreState} from 'easy-peasy';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import StringComponent from '../../StringComponent';
import Strings from '../../../config/localization/translations';
import bscscanLogo from '../../../assets/images/stock-logos/bscscan.svg';
import { platforms } from '../../../config/coingecko_platforms';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el) => [el]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
const getString = (jsonPath, langaugeId) => {
  //console.log(Strings);
  return jsonPath[langaugeId] === '' ? jsonPath[1] : jsonPath[langaugeId];
}

const defiStrings = Strings.DefiWatcher;


function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  const { selectedLangauge } = useStoreState((state) => state.Dapp);

  const headCells = [
    { id: 'symbol', numeric: false, disablePadding: false, label: getString(defiStrings.TableLabels.string8, selectedLangauge) },
    // { id: 'wallet', numeric: false, disablePadding: false, label: getString(defiStrings.TableLabels.string1, selectedLangauge) },
    { id: 'buySell', numeric: false, disablePadding: false, label: getString(defiStrings.TableLabels.string2, selectedLangauge) },
    { id: 'amountUsd', numeric: false, disablePadding: false, label: getString(defiStrings.TableLabels.string4, selectedLangauge) },
    { id: 'profitLoss', numeric: false, disablePadding: false, label: getString(defiStrings.TableLabels.string12, selectedLangauge) },
    { id: 'totalTokens', numeric: false, disablePadding: false, label: getString(defiStrings.TableLabels.string5, selectedLangauge) },
    { id: 'time', numeric: false, disablePadding: false, label: getString(defiStrings.string4, selectedLangauge) },
    { id: 'actions', numeric: false, disablePadding: false, sortDirection: false, label: getString(defiStrings.TableLabels.string10, selectedLangauge) },
  ];

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : headCell.center ? 'center' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
            className={'stickyHeader'}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}>
              <span className="tableCellSpan"> {headCell.label}</span>
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead >
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85)
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark
      },
  title: {
    flex: '1 1 100%'
  }
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { maxTransactionCount, maxTime, currentUserAddress } = props;

  return (
    <Toolbar
      className={clsx(classes.root, 'text-white', 'd-flex', 'justify-content-center', 'text-center', "dwTitle")}>
      <h6 className="line-height-1 font-weight-bold">
        <StringComponent string={defiStrings.string31} prefix={currentUserAddress !== undefined ?
          `${currentUserAddress.substring(0, 5) + '...' + currentUserAddress.substring(currentUserAddress.length - 5)}'s ` : undefined} />
      </h6>
    </Toolbar>
  );
};


const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2)
  },
  table: {
    // minWidth: 750,
    maxHeight: 300
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1
  }

}));

function createData(tranId, buySell, amountUsd, transactions, totalTokens, wallet, time, walletType, actualTime, displayTime, isWalletSaved, symbol, amountUsdCurrent, baseAddress) {
  return { tranId, buySell, amountUsd, transactions, totalTokens, wallet, time, walletType, actualTime, displayTime, isWalletSaved, symbol, amountUsdCurrent, baseAddress };
}

function buildRow(row, buyString, sellString) {
  const { buyAmount, transaction, sellAmount, baseAmount, block, baseCurrency, quoteCurrency, tradeAmountCurrent, tradeAmount } = row;
  const buyOrSell = buyAmount === 0 ? sellString : buyAmount === tradeAmount && baseCurrency.address !== platforms.binance.baseToken ? buyString : sellString;
  const buySellAmount = buyAmount === 0 ? sellAmount : buyAmount === tradeAmount ? buyAmount : sellAmount;
  // const isWalletSaved = currentWallets.find(({ wallet }) => wallet === transaction.txFrom.address) !== undefined;
  return createData(transaction.hash, buyOrSell, buySellAmount, 1, baseAmount, transaction.txFrom.address, 0, 'WHALE', block.timestamp.time, "", false, `${baseCurrency.symbol}/${quoteCurrency.symbol}`, tradeAmountCurrent, baseCurrency.address);
}

function generateRows(transactions, selectedLangauge) {

  let rows = [];
  transactions.forEach((transaction) => {
    rows.push(buildRow(transaction, getString(defiStrings.string8, selectedLangauge), getString(defiStrings.string9, selectedLangauge)));
  });

  //Do Row Filter (Time, # Of Trans, Types)
  let finalData = [];

  // dont group on baseCurrency = wbnb, busd, usdt, usdc
  let groupedTrades = groupBy(rows, (trade) => {
    return trade !== undefined ? trade.tranId + trade.baseAddress : 0
  });
  let keys = Object.keys(groupedTrades);
  keys.forEach((key) => {
    let trades = groupedTrades[key];
    let newTrade = createData(trades[0].tranId, trades[0].buySell, 0, 0, 0, trades[0].wallet, 999999999999, trades[0].walletType, trades[0].actualTime, trades[0].displayTime, trades[0].isWalletSaved, trades[0].symbol, trades[0].amountUsdCurrent)
    trades.forEach((trade) => {
      newTrade.amountUsd += trade.amountUsd;
      newTrade.transactions += trade.transactions;
      newTrade.totalTokens += trade.totalTokens;
      let tradeTime = moment.utc(trade.actualTime);

      if (moment.duration(tradeTime.diff(moment().utc())).asMinutes() < newTrade.time) {
        newTrade.time = parseInt(moment.duration(moment().utc().diff(tradeTime)).asMinutes());
        newTrade.actualTime = moment.utc(tradeTime).format("MM-DD-YYYYTHH:mm:ss.SSSZ");
        if (newTrade.time > 60 * 24 * 2) {
          newTrade.displayTime = (newTrade.time / 60 / 24).toFixed(0) + getString(defiStrings.string21, selectedLangauge);
        }
        else if (newTrade.time > 60 * 3) {
          newTrade.displayTime = (newTrade.time / 60).toFixed(0) + getString(defiStrings.string20, selectedLangauge);
        }
        else {
          newTrade.displayTime = newTrade.time + getString(defiStrings.string22, selectedLangauge);
        }
      }
    });
    finalData.push(newTrade);
  });
  return finalData;
}

export default function UserTransactionsTable(props) {
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('time');
  const [selected, setSelected] = useState([]);
  const { selectedLangauge, currentUserAddress } = useStoreState((state) => state.Dapp);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  let rows = generateRows(props.data, selectedLangauge);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.address);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenCharts = (event, row) => {
    const poocoinUrl = 'https://poocoin.app/tokens/';

    window.open(poocoinUrl + row.address, '_blank')
  }

  const handleOpenBSC = (event, row) => {
    const bsc = 'https://bscscan.com/tx/';
    window.open(bsc + row.tranId, '_blank');
  }

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const getGainLossClass = (row) => {
    if (row.amountUsdCurrent > row.amountUsd && row.buySell === 'Buy') {
      return 'gain'
    } else if( row.buySell === 'Sell' && row.amountUsdCurrent < row.amountUsd){
      return 'gain'
    }

    return 'loss'
  }

  const displayRows = rows;
  const emptyRows = 0;//rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const { isLoading, noData } = props;

  return (
    <>
      <Card className="bg-first ml-2 px-2 pt-4 text-center">
        <EnhancedTableToolbar currentUserAddress={currentUserAddress} />
        {isLoading || noData || isLoading == undefined ?
          (
            <div className='tableHeight-headquarters'>
              {props.noData ?
                (<h6 className="text-white pt-7">{currentUserAddress === undefined ? 'Please connect wallet to view recent trades' :
                  <StringComponent string={defiStrings.string23} />}</h6>) :
                (<h4 className="text-white">
                  {
                    isLoading !== undefined && isLoading === true ?
                      <div className="pt-5">
                        <h6 className='mb-2' >
                          Loading...
                        </h6>
                        <span className="mx-2">
                          <RiseLoader
                            color={'var(--green)'}
                            size={15}
                            loading={isLoading}
                          />
                        </span>
                      </div> : undefined
                  }
                </h4>)
              }
            </div>
          )
          : (
            <>
              <TableContainer className="tableHeight-headquarters">
                <Table
                  stickyheader="true"
                  className={classes.table}
                  aria-labelledby="tableTitle"
                  size={'small'}
                  aria-label="enhanced table">
                  <EnhancedTableHead
                    classes={classes}
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={displayRows.length} />

                  <TableBody >
                    {stableSort(displayRows, getComparator(order, orderBy))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
                        const isItemSelected = isSelected(row.address);
                        const rank = index + 1;
                        return (
                          <TableRow
                            hover
                            onClick={(event) => handleClick(event, row.address)}
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.tranId + row.symbol}
                            style={{ height: '30px' }}
                          // selected={isItemSelected}
                          >
                            <TableCell align="left" width="20%" className="cellWallet">{row.symbol}</TableCell>
                            <TableCell align="center" width="5%">
                              {row.buySell.toLowerCase() === getString(defiStrings.string8, selectedLangauge).toLowerCase() ? (
                                <div className='text-white badge' style={{ backgroundColor: '#2ebc7f' }}>{row.buySell}</div>
                              ) :
                                (<div className='text-white badge' style={{ backgroundColor: 'rgba(255, 0, 0, 0.7)' }}>{row.buySell}</div>)}

                            </TableCell>
                            <TableCell align="left" width="15%">{"$" + row.amountUsd.toLocaleString(undefined, { 'minimumFractionDigits': 2, 'maximumFractionDigits': 2 })}</TableCell>
                            <TableCell align="left" width="15%" className={getGainLossClass(row)}>{"$" + row.amountUsdCurrent.toLocaleString(undefined, { 'minimumFractionDigits': 2, 'maximumFractionDigits': 2 })}</TableCell>
                            <TableCell align="left" width="15%">{row.totalTokens.toLocaleString(undefined, { 'minimumFractionDigits': 3, 'maximumFractionDigits': 3 })}</TableCell>
                            {/*<TableCell align="right" style={{ display: 'none' }}>{row.walletType}</TableCell>*/}
                            <TableCell align="left" width="15%">{row.displayTime}</TableCell>
                            <TableCell align="left" width="auto" className="skSavedIcon">
                              <IconButton onClick={(event) => handleOpenBSC(event, row)}>
                                <img src={bscscanLogo} width={20} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: (30) * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>

                </Table>
              </TableContainer>
            </>
          )
        }

        {/* <EnhancedTableFooter numSelected={selected.length} saveWallets={handleSavedWallets} cancelWallets={handleCancelWallets} selectedWallets={selectedWallets} /> */}
        {!isLoading ? (
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={displayRows.length > 0 ? displayRows.length : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />) : (<div>&nbsp;</div>)}

      </Card>
    </>
  );
}
