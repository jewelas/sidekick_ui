import React, { useState } from 'react';

import clsx from 'clsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Table,
  Grid,
  InputLabel,
  InputAdornment,
  Card,
  Menu,
  MenuItem,
  Button,
  List,
  ListItem,
  TextField,
  FormControl,
  Select
} from '@material-ui/core';

import Pagination from '@material-ui/lab/Pagination';

import FilterListTwoToneIcon from '@material-ui/icons/FilterListTwoTone';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import SaveTwoToneIcon from '@material-ui/icons/SaveTwoTone';

import ArrowDownwardTwoToneIcon from '@material-ui/icons/ArrowDownwardTwoTone';
import ArrowUpwardTwoToneIcon from '@material-ui/icons/ArrowUpwardTwoTone';
import RadioButtonUncheckedTwoToneIcon from '@material-ui/icons/RadioButtonUncheckedTwoTone';

import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone';
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone';
import TrendingUpTwoToneIcon from '@material-ui/icons/TrendingUpTwoTone';
import TrendingDownTwoToneIcon from '@material-ui/icons/TrendingDownTwoTone';

export default function LivePreviewExample() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [anchorEl2, setAnchorEl2] = useState(null);
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const [status, setStatus] = useState('');

  const handleStatus = (event) => {
    setStatus(event.target.value);
  };

  const [type, setType] = useState('');

  const handleType = (event) => {
    setType(event.target.value);
  };

  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => setSearchOpen(false);

  return (
    <>
      <Card className="mb-5">
        <div className="card-header d-flex align-items-center justify-content-between card-header-alt p-4">
          <div className={clsx({ 'd-none': searchOpen })}>
            <h6 className="font-weight-bold font-size-lg mb-0 text-black">
              All Orders
            </h6>
          </div>
          <div
            className={clsx('d-flex align-items-center', {
              'w-100': searchOpen
            })}>
            <div
              className={clsx('search-wrapper search-wrapper--grow w-100', {
                'is-active': searchOpen
              })}>
              <TextField
                variant="outlined"
                size="small"
                id="input-with-icon-textfield22-2"
                placeholder="Search orders..."
                onFocus={openSearch}
                onBlur={closeSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchTwoToneIcon />
                    </InputAdornment>
                  )
                }}
              />
            </div>
          </div>
        </div>
        <div className="divider" />
        <div className="divider" />
        <div className="d-flex align-items-center justify-content-between px-4 py-3">
          <div>
            <Button
              onClick={handleClick}
              size="small"
              variant="text"
              className="btn-outline-primary d-40 p-0 d-flex align-items-center justify-content-center mr-2">
              <FilterListTwoToneIcon className="w-50" />
            </Button>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              open={Boolean(anchorEl)}
              classes={{ list: 'p-0' }}
              onClose={handleClose}>
              <div className="dropdown-menu-xxl overflow-hidden p-0">
                <div className="p-3">
                  <Grid container spacing={6}>
                    <Grid item md={6}>
                      <FormControl
                        variant="outlined"
                        size="small"
                        className="w-100">
                        <InputLabel id="type-select-label">Type</InputLabel>
                        <Select
                          labelId="type-select-label"
                          id="type-select-label-id"
                          fullWidth
                          label="Type"
                          value={type}
                          onChange={handleType}>
                          <MenuItem value={0}>All types</MenuItem>
                          <MenuItem value={1}>Deposit</MenuItem>
                          <MenuItem value={2}>Buy Crypto</MenuItem>
                          <MenuItem value={3}>Sell Crypto</MenuItem>
                          <MenuItem value={4}>Withdraw</MenuItem>
                          <MenuItem value={5}>Transfer Funds</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item md={6}>
                      <FormControl
                        variant="outlined"
                        size="small"
                        className="w-100">
                        <InputLabel id="status-select-label">Status</InputLabel>
                        <Select
                          labelId="status-select-label"
                          id="status-select-label-id"
                          fullWidth
                          label="Status"
                          value={status}
                          onChange={handleStatus}>
                          <MenuItem value={0}>All statuses</MenuItem>
                          <MenuItem value={1}>Pending</MenuItem>
                          <MenuItem value={2}>Completed</MenuItem>
                          <MenuItem value={3}>Rejected</MenuItem>
                          <MenuItem value={4}>Processing</MenuItem>
                          <MenuItem value={5}>Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </div>
                <div className="divider" />
                <div className="p-3 text-center bg-secondary">
                  <Button className="btn-primary" size="small">
                    Filter results
                  </Button>
                </div>
                <div className="divider" />
                <div className="p-3">
                  <Grid container spacing={6}>
                    <Grid item md={6}>
                      <List
                        component="div"
                        className="nav-neutral-danger flex-column p-0">
                        <ListItem
                          button
                          className="d-flex rounded-sm justify-content-center"
                          href="#/"
                          onClick={(e) => e.preventDefault()}>
                          <DeleteTwoToneIcon className="mr-2" />
                          <span>Cancel</span>
                        </ListItem>
                      </List>
                    </Grid>
                    <Grid item md={6}>
                      <List
                        component="div"
                        className="nav-neutral-success flex-column p-0">
                        <ListItem
                          button
                          className="d-flex rounded-sm justify-content-center"
                          href="#/"
                          onClick={(e) => e.preventDefault()}>
                          <SaveTwoToneIcon className="mr-2" />
                          <span>Save filter</span>
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </Menu>
          </div>
          <div>
            <Button
              onClick={handleClick2}
              size="small"
              variant="text"
              className="btn-outline-primary d-40 p-0  d-flex align-items-center justify-content-center">
              <SettingsTwoToneIcon className="w-50" />
            </Button>
            <Menu
              anchorEl={anchorEl2}
              keepMounted
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorEl2)}
              classes={{ list: 'p-0' }}
              onClose={handleClose2}>
              <div className="dropdown-menu-lg overflow-hidden p-0">
                <div className="font-weight-bold px-4 pt-3">Results</div>
                <List
                  component="div"
                  className="nav-neutral-first nav-pills-rounded flex-column p-2">
                  <ListItem
                    component="a"
                    button
                    href="#/"
                    onClick={(e) => e.preventDefault()}>
                    <div className="mr-2">
                      <RadioButtonUncheckedTwoToneIcon />
                    </div>
                    <span className="font-size-md">
                      <b>10</b> results per page
                    </span>
                  </ListItem>
                  <ListItem
                    component="a"
                    button
                    href="#/"
                    onClick={(e) => e.preventDefault()}>
                    <div className="mr-2">
                      <RadioButtonUncheckedTwoToneIcon />
                    </div>
                    <span className="font-size-md">
                      <b>20</b> results per page
                    </span>
                  </ListItem>
                  <ListItem
                    component="a"
                    button
                    href="#/"
                    onClick={(e) => e.preventDefault()}>
                    <div className="mr-2">
                      <RadioButtonUncheckedTwoToneIcon />
                    </div>
                    <span className="font-size-md">
                      <b>30</b> results per page
                    </span>
                  </ListItem>
                </List>
                <div className="divider" />
                <div className="font-weight-bold px-4 pt-4">Order</div>
                <List
                  component="div"
                  className="nav-neutral-first nav-pills-rounded flex-column p-2">
                  <ListItem
                    component="a"
                    button
                    href="#/"
                    onClick={(e) => e.preventDefault()}>
                    <div className="mr-2">
                      <ArrowUpwardTwoToneIcon />
                    </div>
                    <span className="font-size-md">Ascending</span>
                  </ListItem>
                  <ListItem
                    component="a"
                    button
                    href="#/"
                    onClick={(e) => e.preventDefault()}>
                    <div className="mr-2">
                      <ArrowDownwardTwoToneIcon />
                    </div>
                    <span className="font-size-md">Descending</span>
                  </ListItem>
                </List>
              </div>
            </Menu>
          </div>
        </div>
        <div className="divider" />
        <Table className="table table-borderless text-nowrap mb-0">
          <thead className="thead-light text-capitalize font-size-sm font-weight-bold">
            <tr>
              <th className="text-left px-4">Order details</th>
              <th className="text-left">Source</th>
              <th className="text-left">Order ID</th>
              <th className="text-right">Balance</th>
              <th className="text-right">Amount</th>
              <th className="text-right">Balance</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4">
                <div className="d-flex align-items-center">
                  <div className="d-40 text-white d-flex align-items-center justify-content-center rounded-pill mr-3 bg-neutral-success text-success">
                    <TrendingUpTwoToneIcon />
                  </div>
                  <div>
                    <div className="font-size-sm font-weight-bold">
                      Fiat deposit
                    </div>
                    <div className="font-size-sm opacity-7">
                      17 Feb 2020 | 10:45 PM
                    </div>
                  </div>
                </div>
              </td>
              <td className="text-left">
                <div>
                  <div className="font-size-sm font-weight-bold">
                    Bank Account
                  </div>
                  <div className="font-size-sm opacity-7">****1111</div>
                </div>
              </td>
              <td className="text-left">
                <div>
                  <div className="font-size-sm font-weight-bold">
                    54XHGSA34GJ
                  </div>
                  <div className="font-size-sm opacity-7 text-success d-flex align-items-center">
                    <div className="badge badge-success mr-1 border-0 badge-circle">
                      Deposit
                    </div>
                    Deposit
                  </div>
                </div>
              </td>
              <td className="text-right">
                <div className="px-4 py-1 h-auto text-success text-capitalize font-size-sm border-0 badge badge-neutral-success">
                  Completed
                </div>
              </td>
              <td className="text-right">
                <div className="font-size-sm font-weight-bold">
                  + 0.349854 BTC
                </div>
                <div className="font-size-sm opacity-7">1,296 USD</div>
              </td>
              <td className="text-right">
                <div className="font-size-sm font-weight-bold">
                  12.454539 BTC
                </div>
                <div className="font-size-sm opacity-7">26,349 USD</div>
              </td>
              <td className="text-center">
                <Button className="btn-neutral-primary mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center">
                  <FontAwesomeIcon
                    icon={['fas', 'search']}
                    className="font-size-sm"
                  />
                </Button>
                <Button className="btn-neutral-first mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center">
                  <FontAwesomeIcon
                    icon={['far', 'edit']}
                    className="font-size-sm"
                  />
                </Button>
                <Button className="btn-neutral-danger mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center">
                  <FontAwesomeIcon
                    icon={['fas', 'times']}
                    className="font-size-sm"
                  />
                </Button>
              </td>
            </tr>
            <tr>
              <td className="px-4">
                <div className="d-flex align-items-center">
                  <div className="d-40 text-white d-flex align-items-center justify-content-center rounded-pill mr-3 bg-neutral-first text-first">
                    <TrendingDownTwoToneIcon />
                  </div>
                  <div>
                    <div className="font-size-sm font-weight-bold">
                      Paypal withdraw
                    </div>
                    <div className="font-size-sm opacity-7">
                      18 March 2020 | 11:26 PM
                    </div>
                  </div>
                </div>
              </td>
              <td className="text-left">
                <div>
                  <div className="font-size-sm font-weight-bold">
                    Crypto Wallet
                  </div>
                  <div className="font-size-sm opacity-7">
                    My Bitcoin Wallet
                  </div>
                </div>
              </td>
              <td className="text-left">
                <div>
                  <div className="font-size-sm font-weight-bold">
                    39FJDSHE84HA
                  </div>
                  <div className="font-size-sm opacity-7 text-danger d-flex align-items-center">
                    <div className="badge badge-danger mr-1 border-0 badge-circle">
                      Withdraw
                    </div>
                    Withdraw
                  </div>
                </div>
              </td>
              <td className="text-right">
                <div className="px-4 py-1 h-auto text-warning text-capitalize font-size-sm border-0 badge badge-neutral-warning">
                  Pending
                </div>
              </td>
              <td className="text-right">
                <div className="font-size-sm font-weight-bold">
                  + 45,459 USD
                </div>
                <div className="font-size-sm opacity-7">45,273 BTC</div>
              </td>
              <td className="text-right">
                <div className="font-size-sm font-weight-bold">346.274 USD</div>
                <div className="font-size-sm opacity-7">26,349 BTC</div>
              </td>
              <td className="text-center">
                <Button className="btn-neutral-primary mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center">
                  <FontAwesomeIcon
                    icon={['fas', 'search']}
                    className="font-size-sm"
                  />
                </Button>
                <Button className="btn-neutral-first mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center">
                  <FontAwesomeIcon
                    icon={['far', 'edit']}
                    className="font-size-sm"
                  />
                </Button>
                <Button className="btn-neutral-danger mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center">
                  <FontAwesomeIcon
                    icon={['fas', 'times']}
                    className="font-size-sm"
                  />
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
        <div className="divider" />
        <div className="card-footer p-4 d-flex justify-content-center">
          <Pagination className="pagination-primary" count={10} />
        </div>
      </Card>
    </>
  );
}
