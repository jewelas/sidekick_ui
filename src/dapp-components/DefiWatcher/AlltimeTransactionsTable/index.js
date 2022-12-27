import React, { useState, useRef, useEffect } from 'react';
import { CSVLink } from "react-csv";
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Card } from '@material-ui/core';
import {
  TableBody,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  IconButton,
  Tooltip,
  Grid
} from '@material-ui/core';
import { RiseLoader } from 'react-spinners';
import { makeStyles, lighten } from '@material-ui/core/styles';
import { groupBy } from 'underscore';
import moment from 'moment';
import TablePagination from '@material-ui/core/TablePagination';
import { useStoreState, useStoreActions } from 'easy-peasy';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import TransactionFilter from '../TransactionFilter';
import StringComponent from '../../StringComponent';
import Strings from '../../../config/localization/translations';
import bscscanLogo from '../../../assets/images/stock-logos/bscscan.svg';
import NameServiceComponent from 'dapp-components/NameReturn';
import { rowScramble } from 'utils/dappUtils';
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
};

const defiStrings = Strings.DefiWatcher;

function filterData(data, filter) {
  if (filter !== undefined && filter !== null) {
    if (filter.transactionType === 'BUY' || filter.transactionType === 'SELL') {
      data = data.filter((d) => d.buySell === filter.transactionType);
    }

    if (filter.transactionCount !== undefined)
      data = data.filter(
        (d) =>
          d.transactions >= filter.transactionCount[0] &&
          d.transactions <= filter.transactionCount[1]
      );
    if (filter.transactionTimeRange !== undefined)
      data = data.filter(
        (d) =>
          d.transactions >= filter.transactionTimeRange[0] &&
          d.transactions <= filter.transactionTimeRange[1]
      );
  }
  return data;
}

function EnhancedTableHead(props) {
  const {
    classes,
    order,
    orderBy,
    onRequestSort
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  const { selectedLangauge } = useStoreState((state) => state.Dapp);

  const headCells = [
    {
      id: 'rank',
      numeric: false,
      disablePadding: false,
      label: getString(defiStrings.TableLabels.string11, selectedLangauge),
      className: 'cell-rank'
    },
    {
      id: 'wallet',
      numeric: false,
      disablePadding: false,
      label: getString(defiStrings.TableLabels.string1, selectedLangauge)
    },
    {
      id: 'buySell',
      numeric: false,
      disablePadding: false,
      label: getString(defiStrings.TableLabels.string2, selectedLangauge)
    },
    {
      id: 'amountUsd',
      numeric: false,
      disablePadding: false,
      label: getString(defiStrings.TableLabels.string4, selectedLangauge)
    },
    {
      id: 'totalTokens',
      numeric: false,
      disablePadding: false,
      label: getString(defiStrings.TableLabels.string5, selectedLangauge)
    },
    {
      id: 'time',
      numeric: false,
      disablePadding: false,
      label: getString(defiStrings.string4, selectedLangauge)
    },
    {
      id: 'actions',
      numeric: false,
      disablePadding: true,
      sortDirection: false,
      label: getString(defiStrings.TableLabels.string10, selectedLangauge)
    }
  ];

  return (
    <TableHead ref={props.theadRef}>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
            className={clsx(
              '',
              headCell.className !== undefined ? headCell.className : undefined
            )}>
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
    </TableHead>
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

const EnhancedTableFooter = (props) => {
  const classes = useToolbarStyles();
  const { numSelected, selectedWallets } = props;
  const { selectedLangauge } = useStoreState((state) => state.Dapp);
  const saveWallets = (e) => {
    if (props.saveWallets !== undefined) {
      props.saveWallets(selectedWallets);
    }
  };

  const removeWallets = (e) => {
    if (props.removeWallets !== null) props.removeWallets();
  };

  return (
    numSelected > 0 && (
      <>
        <Grid container xl={3} className={'ml-4'}>
          <Grid item className="text-white font-size-sm">
            <div>{numSelected}</div>
            <div>{getString(defiStrings.string17, selectedLangauge)}</div>
          </Grid>
          <Grid item>
            <Tooltip title={getString(defiStrings.string18, selectedLangauge)}>
              <IconButton
                aria-label={getString(defiStrings.string18, selectedLangauge)}
                onClick={saveWallets}
                className="btnWallet">
                <SaveIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title={getString(defiStrings.string19, selectedLangauge)}>
              <IconButton
                aria-label={getString(defiStrings.string19, selectedLangauge)}
                onClick={removeWallets}
                className="btnWallet">
                <CancelIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </>
    )
  );
};

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { maxTransactionCount, maxTime, tokenSymbol } = props;
  const { selectedLangauge } = useStoreState((state) => state.Dapp);

  return (
    <Toolbar
      className={clsx(
        classes.root,
        'text-white',
        'd-flex',
        'justify-content-center',
        'text-center',
        'dwTitle'
      )}>
      <h6 className="line-height-1 font-weight-bold">
        {tokenSymbol !== undefined && tokenSymbol.length > 0
          ? getString(defiStrings.string36, selectedLangauge) +
            ' for $' +
            tokenSymbol
          : getString(defiStrings.string36, selectedLangauge)}
      </h6>
      <TransactionFilter
        filterChanged={props.filterCallback}
        maxTranCount={maxTransactionCount}
        maxTime={maxTime}
        exportCSV={props.exportCSV}
      />
    </Toolbar>
  );
};

EnhancedTableFooter.propTypes = {
  numSelected: PropTypes.number.isRequired
};

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 750,
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

function createData(
  tranId,
  buySell,
  amountUsd,
  transactions,
  totalTokens,
  wallet,
  time,
  walletType,
  actualTime,
  displayTime,
  isWalletSaved
) {
  return {
    tranId,
    buySell,
    amountUsd,
    transactions,
    totalTokens,
    wallet,
    time,
    walletType,
    actualTime,
    displayTime,
    isWalletSaved
  };
}

function buildRow(row, currentWallets, buyString, sellString) {
  const { buyAmount, transaction, sellAmount, baseAmount, block, tradeAmount, baseCurrency } = row;
  const buyOrSell = buyAmount === 0 ? sellString : buyAmount === tradeAmount && baseCurrency.address !== platforms.binance.baseToken ? buyString : sellString;
  const buySellAmount = buyAmount === 0 ? sellAmount : buyAmount === tradeAmount ? buyAmount : sellAmount;
  const isWalletSaved =
    currentWallets.find(
      ({ wallet }) => wallet === transaction.txFrom.address
    ) !== undefined;
  return createData(
    transaction.hash,
    buyOrSell,
    buySellAmount,
    1,
    baseAmount,
    transaction.txFrom.address,
    0,
    'WHALE',
    block.timestamp.time,
    '',
    isWalletSaved
  );
}

function findWallets(tranIds, rows) {
  let selectedWallets = [];
  for (let i = 0; i < tranIds.length; i++) {
    if (tranIds[i] !== undefined) {
      let obj = rows.find((r) => r.tranId === tranIds[i]);
      if (obj !== undefined && obj.wallet !== undefined) {
        if (selectedWallets.indexOf(obj.wallet) === -1)
          selectedWallets.push(obj.wallet);
      }
    }
  }
  return selectedWallets;
}

export default function TransactionTable(props) {
  const classes = useStyles();
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('amountUsd');
  const [filter, setFilter] = useState('filter');
  const [selected, setSelected] = useState([]);
  const [filterRefreshCount, setFilterRefreshCount] = useState(0);
  const {
    selectedLangauge,
    transactionFilter,
    subscription
  } = useStoreState((state) => state.Dapp);
  const { setOpenSubscriptionModal } = useStoreActions((state) => state.Dapp);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [tableData, setTableData] = useState([]);
  const tableRef = useRef();
  const tbodyRef = useRef();
  const theadRef = useRef();
  const exportLink = useRef();

  const exportCSV = () => {
    let csvData = [];
    let theadData = [];
    for (let i = 0; i < theadRef.current.children[0].children.length; i++) {
      theadData.push(theadRef.current.children[0].children[i].innerText);
    }
    let tbodyData = [];
    for (let i = 0; i < (subscription.level < 1 ? 5 : tbodyRef.current.children.length); i++) {
      let trData = [];
      for (let j = 0; j < tbodyRef.current.children[i].children.length; j++) {
        trData.push(tbodyRef.current.children[i].children[j].innerText);
      }
      tbodyData.push(trData);

    }
    csvData.push(theadData);
    csvData.push(...tbodyData);
    setTableData(csvData);
  }

  useEffect(() => {
    if (tableData && tableData.length) {
      exportLink.current.link.click();
    }
  }, [tableData])

  const generateRows = (transactions, currentWallets, selectedLangauge) => {
    let rows = [];

    transactions.forEach((transaction) => {
      rows.push(
        buildRow(
          transaction,
          currentWallets,
          getString(defiStrings.string8, selectedLangauge),
          getString(defiStrings.string9, selectedLangauge)
        )
      );
    });

    //Do Row Filter (Time, # Of Trans, Types)
    let finalData = [];
    let groupedTrades = groupBy(rows, (trade) => {
      return trade.tranId;
    });
    let keys = Object.keys(groupedTrades);
    keys.forEach((key) => {
      let trades = groupedTrades[key];
      let newTrade = createData(
        trades[0].tranId,
        trades[0].buySell,
        0,
        0,
        0,
        trades[0].wallet,
        999999999999,
        trades[0].walletType,
        trades[0].actualTime,
        trades[0].displayTime,
        trades[0].isWalletSaved
      );
      trades.forEach((trade) => {
        newTrade.amountUsd += trade.amountUsd;
        newTrade.transactions += trade.transactions;
        newTrade.totalTokens += trade.totalTokens;
        let tradeTime = moment.utc(trade.actualTime);

        if (
          moment.duration(tradeTime.diff(moment().utc())).asMinutes() <
          newTrade.time
        ) {
          newTrade.time = parseInt(
            moment.duration(moment().utc().diff(tradeTime)).asMinutes()
          );
          newTrade.actualTime = moment
            .utc(tradeTime)
            .format('MM-DD-YYYYTHH:mm:ss.SSSZ');
          if (newTrade.time > 60 * 24 * 2) {
            newTrade.displayTime =
              (newTrade.time / 60 / 24).toFixed(0) +
              getString(defiStrings.string21, selectedLangauge);
          } else if (newTrade.time > 60 * 3) {
            newTrade.displayTime =
              (newTrade.time / 60).toFixed(0) +
              getString(defiStrings.string20, selectedLangauge);
          } else {
            newTrade.displayTime =
              newTrade.time + getString(defiStrings.string22, selectedLangauge);
          }
        }
      });
      finalData.push(newTrade);
    });
    return finalData;
  };

  const loadFilterMax = (rows) => {
    if (rows.length > 0) {
      maxTime = Math.max.apply(
        Math,
        rows.map(function (o) {
          return o.time;
        })
      );
      maxTransactionCount = Math.max.apply(
        Math,
        rows.map(function (o) {
          return o.transactions;
        })
      );
    }
  };

  const handleFilter = (filter) => {
    setPage(0);
    setFilterRefreshCount(filterRefreshCount + 1);
    setFilter(filter);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.tranId);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRemoveWallets = () => {
    props.removeWallets();
    setSelected([]);
  };

  const handleSavedWallets = (selectedWallets) => {
    props.saveWallets(selectedWallets);
    setSelected([]);
  };

  const handleOpenBSC = (event, row) => {
    const bsc = 'https://bscscan.com/tx/';
    window.open(bsc + row.tranId, '_blank');
  };
  const handleBlurredClick = () => {
    setOpenSubscriptionModal(true);
  };

  let maxTime = 0;
  let maxTransactionCount = 0;
  let rows = generateRows(
    props.transactions,
    props.currentWallets,
    selectedLangauge
  );
  const isSelected = (name) => selected.indexOf(name) !== -1;
  const selectedWallets = findWallets(selected, rows);
  loadFilterMax(rows);
  const displayRows = filterData([...rows], filter);
  const emptyRows = 0; //rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  const { isLoading, noData } = props;
  const tokenSymbol =
    transactionFilter !== null &&
    transactionFilter.token !== null &&
    transactionFilter.token !== undefined
      ? transactionFilter.token.subject.symbol
      : '';

  return (
    <>
      <Card className="bg-first ml-2 px-2 pt-4 text-center">
        <CSVLink
          data={tableData}
          filename="data.csv"
          className='hidden'
          ref={exportLink}
          target={"_blank"} />
        <EnhancedTableToolbar
          filterCallback={handleFilter}
          maxTransactionCount={maxTransactionCount}
          maxTime={maxTime}
          tokenSymbol={tokenSymbol}
          exportCSV={exportCSV}
        />
        {isLoading || noData || isLoading === undefined ? (
          <div>
            {props.noData ? (
              <h4 className="text-white" style={{ minHeight: '285px' }}>
                {getString(defiStrings.string23, selectedLangauge)}
              </h4>
            ) : (
              <h4 className="text-white" style={{ minHeight: '285px' }}>
                {isLoading !== undefined ? (
                  <div className="mt-5">
                    <h6 className="mb-2">
                      Loading... Could take up to 30 seconds for large
                      transaction volumes...
                    </h6>
                    <span className="mx-2">
                      <RiseLoader
                        color={'var(--green)'}
                        size={15}
                        loading={isLoading}
                      />
                    </span>
                  </div>
                ) : null}
              </h4>
            )}
          </div>
        ) : (
          <>
            <TableContainer className="tableHeight-defiwatcher">
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
                  rowCount={displayRows.length}
                  theadRef={theadRef}
                />

                <TableBody ref={tbodyRef}>
                  {stableSort(displayRows, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.tranId);
                      const rank = (page * rowsPerPage) + index + 1;
                      if (
                        (subscription.level < 1 && index > 4) ||
                        (page > 0 && subscription.level < 1)
                      ) {
                        row = rowScramble(row, 'allTimeTrades');
                      }

                      return (
                        <TableRow
                          className={
                            (subscription.level < 1 && index > 4) || (subscription.level < 1 && page > 0)
                              ? 'blurred'
                              : ''
                          }
                          hover
                          //activate modal on click
                          onClick={
                            subscription.level < 1 && index > 4
                              ? () => handleBlurredClick()
                              : undefined
                          }
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.tranId + row.wallet}
                          selected={isItemSelected}>
                          <TableCell
                            align="left"
                            width="1%"
                            className="cell-rank">
                            {rank}
                          </TableCell>
                          <TableCell align="left" className="cellWallet">
                            <NameServiceComponent address={row.wallet} />
                          </TableCell>
                          <TableCell align="center" width="1%">
                            {row.buySell.toLowerCase() ===
                              getString(
                                defiStrings.string8,
                                selectedLangauge
                              ).toLowerCase() ? (
                              <div
                                className="text-white badge"
                                style={{ backgroundColor: '#2ebc7f' }}>
                                {row.buySell}
                              </div>
                            ) : (
                              <div
                                className="text-white badge"
                                style={{
                                  backgroundColor: 'rgba(255, 0, 0, 0.7)'
                                }}>
                                {row.buySell}
                              </div>
                            )}
                          </TableCell>
                          <TableCell align="left" width="7%">
                            {'$' +
                              row.amountUsd.toLocaleString(undefined, {
                                maximumFractionDigits: 0
                              })}
                          </TableCell>
                          <TableCell align="left" width="7%">
                            {row.totalTokens > 1000
                              ? row.totalTokens.toLocaleString(undefined, {
                                  maximumFractionDigits: 0
                                })
                              : row.totalTokens.toLocaleString(undefined, {
                                  minimumFractionDigits: 3,
                                  maximumFractionDigits: 3
                                })}
                          </TableCell>
                          {/*<TableCell align="right" style={{ display: 'none' }}>{row.walletType}</TableCell>*/}
                          <TableCell align="left" width="12%">
                            {row.displayTime}
                          </TableCell>
                          <TableCell
                            align="left"
                            width="5%"
                            className="skSavedIcon">
                            {/* <IconButton onClick={(event) => handleSearchClicked(event, row)}>
                                <SearchIcon />
                              </IconButton> */}
                            {/* <IconButton onClick={(event) => handleOpenCharts(event, row)}>
                                <AssessmentIcon />
                              </IconButton> */}
                            <IconButton
                              disabled={
                                subscription.level < 1 && index > 4
                                  ? true
                                  : false
                              }
                              onClick={(event) => handleOpenBSC(event, row)}>
                              <img src={bscscanLogo} width={20} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 33 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {displayRows.length > 0 && !isLoading ? (
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={displayRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        ) : (
          <div>&nbsp;</div>
        )}
      </Card>
    </>
  );
}
