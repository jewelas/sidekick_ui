import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Card } from '@material-ui/core';
import { TableBody, Table, Switch, TableCell, TableContainer, TableHead, TableRow, FormControlLabel, Toolbar, IconButton, Paper, Typography, Checkbox, Tooltip } from '@material-ui/core';
import { RiseLoader } from 'react-spinners';
import { makeStyles, lighten } from '@material-ui/core/styles';
import { groupBy, sortBy } from 'underscore'
import moment from 'moment';
import TablePagination from '@material-ui/core/TablePagination';
import { useStoreState, useStoreActions, useStore } from 'easy-peasy';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import TransactionFilter from '../TransactionFilter';
import StringComponent from '../../StringComponent';
import Strings from '../../../config/localization/translations';
import bscscanLogo from '../../../assets/images/stock-logos/bscscan.svg';

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
    { id: 'pair', numeric: false, disablePadding: false, label: getString(defiStrings.TableLabels.string7, selectedLangauge) },
    { id: 'token0Name', numeric: true, disablePadding: false, label: getString(defiStrings.TableLabels.string8, selectedLangauge) },
    { id: 'token1Name', numeric: false, disablePadding: false, label: getString(defiStrings.TableLabels.string8, selectedLangauge) },    
    { id: 'time', numeric: false, disablePadding: false, label: getString(defiStrings.string4, selectedLangauge) },
    { id: 'isWalletSaved', numeric: false, disablePadding: false, sortDirection: false, label: getString(defiStrings.TableLabels.string10, selectedLangauge) },
  ];

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
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
  const { maxTransactionCount, maxTime } = props;

  return (
    <Toolbar
      className={clsx(classes.root, 'text-white', 'd-flex', 'justify-content-center', 'text-center', "dwTitle")}>
      <h6 className="line-height-1 font-weight-bold">
        <StringComponent string={defiStrings.string33} />
      </h6>
      <TransactionFilter filterChanged={props.filterCallback} maxTranCount={maxTransactionCount} maxTime={maxTime} />
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

function createData(token0, token0Name, token1, token1Name, pair, time) {
  return { token0, token0Name, token1, token1Name, pair, time};
}

function buildRow(row) {
  const { token0, token0Name, token1, token1Name, pair, block } = row;
  return createData(token0, token0Name, token1, token1Name, pair, block.timestamp.time);
}

function generateRows(data) {

  let rows = [];
  if (data !== undefined && data !== undefined) {
    data.forEach((item) => {
      rows.push(buildRow(item));
    });
  }

  return rows;
}

export default function LatestPairsTable(props) {
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('time');
  const [filter, setFilter] = useState('filter');
  const [selected, setSelected] = useState([]);
  const [filterRefreshCount, setFilterRefreshCount] = useState(0);
  const { selectedLangauge } = useStoreState((state) => state.Dapp);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  let maxTime = 0;
  let maxTransactionCount = 0
  let rows = generateRows(props.data, props.currentWallets, selectedLangauge);

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
      const newSelecteds = rows.map((n) => n.pair);
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

  const handleOpenBSC = (event, row) => {
    const bsc = 'https://bscscan.com/address/';
    window.open(bsc + row.pair, '_blank');
  }

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const displayRows = rows;
  const emptyRows = 0;//rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const { isLoading, noData } = props;

  return (
    <>
      <Card className="bg-first px-2 pt-4 text-center">
        <EnhancedTableToolbar filterCallback={handleFilter} maxTransactionCount={maxTransactionCount} maxTime={maxTime} />
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
              <TableContainer className="tableMaxHeight">
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
                      .map((row) => {
                        const isItemSelected = isSelected(row.pair);

                        return (
                          <TableRow
                            hover
                            onClick={(event) => handleClick(event, row.pair)}
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.pair}
                            selected={isItemSelected}>
                            <TableCell align="left" width="5%" className="cellWallet">{row.pair}</TableCell>
                            <TableCell align="right" width="20%">{row.token0Name}</TableCell>
                            <TableCell align="left" width="20%">{row.token1Name}</TableCell>                            
                            <TableCell align="left" width="auto">{moment().utc(row.time).format('lll')}</TableCell>                            
                            <TableCell align="center" width="10%" className="skSavedIcon">
                              <IconButton onClick={(event) => handleOpenBSC(event, row)}>
                                <img src={bscscanLogo} width={20} />
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

        {/* <EnhancedTableFooter numSelected={selected.length} saveWallets={handleSavedWallets} cancelWallets={handleCancelWallets} selectedWallets={selectedWallets} /> */}
        {displayRows.length > 0 && !isLoading ? (
          <TablePagination
            rowsPerPageOptions={[10, 20, 50, 100]}
            component="div"
            count={displayRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />) : (<div>&nbsp;</div>)}

      </Card>
    </>
  );
}
