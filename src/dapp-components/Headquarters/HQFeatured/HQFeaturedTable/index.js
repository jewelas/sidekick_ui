import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card } from '@material-ui/core';
import { TableBody, Table, Switch, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@material-ui/core';
import { RiseLoader } from 'react-spinners';
import { useHistory } from 'react-router-dom';
import { makeStyles, lighten } from '@material-ui/core/styles';
import { useStoreState, useStoreActions } from 'easy-peasy';
import StringComponent from '../../../StringComponent';
import Strings from '../../../../config/localization/translations';
import bscscanLogo from '../../../../assets/images/stock-logos/bscscan.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTags, faAnalytics } from '@fortawesome/pro-duotone-svg-icons';
import { useWallet } from 'use-wallet';

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
    { id: 'price', numeric: true, disablePadding: false, label: getString(defiStrings.string42, selectedLangauge) },
    { id: 'totalUSD', numeric: true, disablePadding: false, label: getString(defiStrings.TableLabels.string4, selectedLangauge) },
    { id: 'totalTokens', center: true, numeric: false, disablePadding: false, sortDirection: false, label: getString(defiStrings.TableLabels.string5, selectedLangauge) },
    { id: 'isWalletSaved', center: true, numeric: false, disablePadding: false, sortDirection: false, label: getString(defiStrings.TableLabels.string10, selectedLangauge) },
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
            className={''}>
            <span className="tableCellSpan"> {headCell.label}</span>

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

function createData(symbol, address, price, totalUSD, totalTokens) {
  return { symbol, address, price, totalUSD, totalTokens };
}

function buildRow(row) {
  const { subject, price } = row;
  let totalUSD = 0, totalTokens = 0;
  //take symbol get price, check user wallet for tokens
  return createData(subject.symbol, subject.address,price !== undefined && price.usd !== undefined ? price.usd : 0, totalUSD, totalTokens);
}

function generateRows(data) {

  let rows = [];
  if (data !== undefined && data.length > 0) {
    data.forEach((item) => {
      rows.push(buildRow(item));
    });
  }

  return rows;
}

export default function HQFeaturedTable(props) {
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('time');
  const [filter, setFilter] = useState('filter');
  const [selected, setSelected] = useState([]);
  const [filterRefreshCount, setFilterRefreshCount] = useState(0);
  const { selectedLangauge } = useStoreState((state) => state.Dapp);
  const { setSearchString } = useStoreActions((actions) => actions.Dapp);
  const CACHED_PROVIDER_KEY = 'TaggedTokens';
  const wallet = useWallet();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  let maxTime = 0;
  let maxTransactionCount = 0
  let rows = generateRows(props.data, props.currentWallets, selectedLangauge);

  let history = useHistory();
  const navigateToPage = (route, params) => {
    history.push({
      pathname: route,
      search: params
    })
  }

  const handleFilter = (filter) => {
    setPage(0);
    setFilterRefreshCount(filterRefreshCount + 1);
    setFilter(filter);
  }

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

  const handleSearchClicked = (event, row) => {
    setSearchString(row.address);
  }

  const handleOpenDefiwatcher = (event, row) => {
    setSearchString(row.address);
    navigateToPage('/DefiWatcher', '?token=' + row.address)
  }

  const handleOpenBSC = (event, row) => {
    const bsc = 'https://bscscan.com/address/';
    window.open(bsc + row.address, '_blank');
  }

  const handleTagSelection = (event, row) => {
   
    //console.log(currentTags);
    //check token to see if its already tagged
    const found = checkTag(row);
    if (found === true) {
      let currentIndex;
      currentTags.find((element, index) => {
        if (element.symbol === row.symbol) {
          currentIndex = index;
        }
      });
      currentTags.splice(currentIndex, 1);
      localStorage.setItem(CACHED_PROVIDER_KEY, JSON.stringify(currentTags));
      setTags(currentTags);
      return;
    } else {
    currentTags.push(row);
    console.log(currentTags);
    localStorage.setItem(CACHED_PROVIDER_KEY, JSON.stringify(currentTags));
    setTags(currentTags);}
     
    //console.log(currentTags);
  }
  const checkTag = (row) => {
    const found = currentTags.find(element => element.symbol === row.symbol);
    if (found !== undefined) {
      return true;
    } else {
      return false;
    }
  }

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const displayRows = rows;
  const emptyRows = 0;//rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const { isLoading, noData, currentTags, setTags } = props;

  return (
    <>
      <Card className="bg-first text-center">
        {isLoading || noData || isLoading == undefined ?
          (
            <div>
              {props.noData ?
                (<h4 className="text-white"><StringComponent string={defiStrings.string23} /></h4>) :
                (<h4 className="text-white">
                  {
                    isLoading != undefined ?
                      <div className="mt-5">
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
                      </div> : null
                  }
                </h4>)
              }
            </div>
          )
          : (
            <>
              <TableContainer className="tableMaxHeight mt-3">
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
                            key={row.symbol}
                          // selected={isItemSelected}
                          >
                            <TableCell align="left" width="10%">{row.symbol}</TableCell>
                            <TableCell align="right" width="10%">{"$" + row.price.toLocaleString(undefined, { 'minimumFractionDigits': 2, 'maximumFractionDigits': 4 })}</TableCell>
                            <TableCell align="right" width="15%">{"$" + row.totalUSD.toLocaleString(undefined, { 'minimumFractionDigits': 2, 'maximumFractionDigits': 2 })}</TableCell>
                            <TableCell align="right" width="15%">{row.totalTokens.toLocaleString(undefined, { 'minimumFractionDigits': 0, 'maximumFractionDigits': 0 })}</TableCell>
                            <TableCell align="center" width="30%" className="skSavedIcon">
                              <IconButton onClick={(event) => handleSearchClicked(event, row)}>
                                <FontAwesomeIcon icon={faSearch}
                                  className="font-size-sm text-white" />
                              </IconButton>
                              <IconButton onClick={(event) => handleOpenDefiwatcher(event, row)}>
                                <FontAwesomeIcon icon={faAnalytics}
                                  className="font-size-sm text-white" />
                              </IconButton>
                              <IconButton onClick={(event) => handleOpenBSC(event, row)}>
                                <img src={bscscanLogo} width={16} style={{backgroundColor: 'white', borderRadius: '8px'}} />
                              </IconButton>
                              <IconButton onClick={(event) => handleTagSelection(event, row)}>
                                {checkTag(row) && wallet.status === 'connected'
                                  ? <FontAwesomeIcon icon={faTags}
                                  className="font-size-sm skIconColor" />
                                  : <FontAwesomeIcon icon={faTags}
                                  className="font-size-sm text-white" />}
                                
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: (33) * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>

                </Table>
              </TableContainer>
            </>
          )
        }
      </Card>
    </>
  );
}
