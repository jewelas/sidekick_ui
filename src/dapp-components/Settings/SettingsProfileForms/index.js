import React, { useState } from 'react';

import clsx from 'clsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Table,
  Switch,
  Grid,
  Container,
  Card,
  MenuItem,
  Button,
  List,
  ListItem,
  TextField,
  Select
} from '@material-ui/core';

export default function LivePreviewExample() {
  const [activeTab, setActiveTab] = useState('1');

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const [checked1, setChecked1] = useState(false);

  const toggleCheck1 = () => {
    setChecked1(!checked1);
  };

  const [checked2, setChecked2] = useState(false);

  const toggleCheck2 = () => {
    setChecked2(!checked2);
  };

  const [country, setCountry] = useState('');

  const handleChange = (event) => {
    setCountry(event.target.value);
  };

  return (
    <>
      <Card>
        <div className="card-header d-flex align-items-center justify-content-between card-header-alt p-0">
          <List
            component="div"
            className="w-100 nav-line justify-content-center d-flex nav-line-alt nav-tabs-primary">
            <ListItem
              button
              className="p-4 font-size-md rounded-0"
              selected={activeTab === '1'}
              onClick={() => {
                toggle('1');
              }}>
              <span className="font-weight-bold font-size-sm text-uppercase">
                Personal details
              </span>
              <div className="divider" />
            </ListItem>
            <ListItem
              button
              className="p-4 font-size-md rounded-0"
              selected={activeTab === '2'}
              onClick={() => {
                toggle('2');
              }}>
              <span className="font-weight-bold font-size-sm text-uppercase">
                Settings
              </span>
              <div className="divider" />
            </ListItem>
            <ListItem
              button
              className="p-4 font-size-md rounded-0"
              selected={activeTab === '3'}
              onClick={() => {
                toggle('3');
              }}>
              <span className="font-weight-bold font-size-sm text-uppercase">
                Social Accounts
              </span>
              <div className="divider" />
            </ListItem>
          </List>
        </div>
        <div className="px-0 py-0 py-lg-4">
          <div
            className={clsx('tab-item-wrapper', { active: activeTab === '1' })}
            index={1}>
            <Container>
              <div className="text-uppercase font-weight-bold text-primary pt-4 font-size-sm">
                General
              </div>
              <div className="py-4">
                <Grid container spacing={6}>
                  <Grid item md={6}>
                    <div className="mb-4">
                      <label className="font-weight-bold mb-2">
                        First Name
                      </label>
                      <TextField
                        variant="outlined"
                        fullWidth
                        placeholder="First name..."
                      />
                    </div>
                    <label className="font-weight-bold mb-2">Birthday</label>
                    <Grid container spacing={6}>
                      <Grid item md={4}>
                        <div className="mb-4">
                          <TextField
                            variant="outlined"
                            fullWidth
                            placeholder="Day..."
                          />
                        </div>
                      </Grid>
                      <Grid item md={4}>
                        <div className="mb-4">
                          <TextField
                            variant="outlined"
                            fullWidth
                            placeholder="Month..."
                          />
                        </div>
                      </Grid>
                      <Grid item md={4}>
                        <div className="mb-4">
                          <TextField
                            variant="outlined"
                            fullWidth
                            placeholder="Year..."
                          />
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={6}>
                    <div className="mb-4">
                      <label className="font-weight-bold mb-2">Last Name</label>
                      <TextField
                        variant="outlined"
                        fullWidth
                        placeholder="Last name..."
                      />
                    </div>
                    <label className="font-weight-bold mb-2">
                      Mobile phone
                    </label>
                    <Grid container spacing={6}>
                      <Grid item md={4}>
                        <div className="mb-4">
                          <TextField
                            variant="outlined"
                            fullWidth
                            placeholder="Area..."
                          />
                        </div>
                      </Grid>
                      <Grid item md={8}>
                        <div className="mb-4">
                          <TextField
                            variant="outlined"
                            fullWidth
                            placeholder="Number..."
                          />
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </Container>
            <div className="divider mb-4" />
            <Container>
              <div className="text-uppercase font-weight-bold text-primary font-size-sm pb-4">
                Location
              </div>
              <Grid container spacing={6}>
                <Grid item md={4}>
                  <div className="mb-4">
                    <label className="font-weight-bold mb-2">Postal Code</label>
                    <TextField
                      variant="outlined"
                      fullWidth
                      placeholder="Postal code..."
                    />
                  </div>
                </Grid>
                <Grid item md={4}>
                  <div className="mb-4">
                    <label className="font-weight-bold mb-2">Country</label>
                    <Select
                      fullWidth
                      variant="outlined"
                      size="small"
                      value={country}
                      onChange={handleChange}
                      labelWidth={0}>
                      <MenuItem className="mx-2" value={0}>
                        Switzerland
                      </MenuItem>
                      <MenuItem className="mx-2" value={10}>
                        United Kingdom
                      </MenuItem>
                      <MenuItem className="mx-2" value={20}>
                        Spain
                      </MenuItem>
                      <MenuItem className="mx-2" value={30}>
                        Portugal
                      </MenuItem>
                      <MenuItem className="mx-2" value={40}>
                        China
                      </MenuItem>
                      <MenuItem className="mx-2" value={50}>
                        Germany
                      </MenuItem>
                    </Select>
                  </div>
                </Grid>
                <Grid item md={4}>
                  <div className="mb-4">
                    <label className="font-weight-bold mb-2">City</label>
                    <TextField
                      variant="outlined"
                      fullWidth
                      placeholder="City..."
                    />
                  </div>
                </Grid>
              </Grid>
              <div className="mb-4">
                <label className="font-weight-bold mb-2">Address</label>
                <TextField
                  multiline
                  variant="outlined"
                  fullWidth
                  placeholder="Address..."
                />
              </div>
            </Container>
            <div className="divider mt-5 mb-4" />
            <Container className="d-flex align-items-center justify-content-end">
              <div className="py-4">
                <Button size="large" className="btn-success font-weight-bold">
                  Save details
                </Button>
              </div>
            </Container>
          </div>
          <div
            className={clsx('tab-item-wrapper', { active: activeTab === '2' })}
            index={2}>
            <Container className="py-3">
              <div>
                <div className="card-header d-flex align-items-center bg-transparent card-header-alt px-0 pb-4">
                  <div>
                    <h6 className="font-weight-bold font-size-xl mb-1 text-black">
                      Account
                    </h6>
                    <p className="text-black-50 mb-0">
                      Manage your account settings from the section below.
                    </p>
                  </div>
                </div>
              </div>
              <List className="mb-4 list-group-bordered">
                <ListItem className="d-flex justify-content-between align-items-center py-3">
                  <div className="d-flex align-items-center mr-4">
                    <div>
                      <div className="font-weight-bold">
                        Wallets Activity Alerts
                      </div>
                      <span className="opacity-6 d-block">
                        Enable SMS alerts for any wallets activities.
                      </span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <Switch
                      checked={checked1}
                      onClick={toggleCheck1}
                      className="switch-medium"
                    />
                  </div>
                </ListItem>
                <ListItem className="d-flex justify-content-between align-items-center py-3">
                  <div className="d-flex align-items-center mr-4">
                    <div>
                      <div className="font-weight-bold">
                        Require Login Pin Code
                      </div>
                      <span className="opacity-6 d-block">
                        Enable the requirement of PIN code for all login
                        attempts.
                      </span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <Switch
                      checked={checked2}
                      onClick={toggleCheck2}
                      className="switch-medium"
                    />
                  </div>
                </ListItem>
              </List>
              <List className="list-group-bordered">
                <ListItem className="d-block d-lg-flex justify-content-between align-items-center py-3">
                  <div className="d-flex align-items-center mr-0 mr-md-4">
                    <div>
                      <div className="font-weight-bold">Change Password</div>
                      <span className="opacity-6 d-block">
                        You can change the password for your account using this
                        dialog window.
                      </span>
                    </div>
                  </div>
                  <div className="d-block d-md-flex mt-3 mt-lg-0 align-items-center">
                    <Button size="small" className="btn-warning text-nowrap">
                      Change Password
                    </Button>
                  </div>
                </ListItem>
                <ListItem className="d-block d-lg-flex justify-content-between align-items-center py-3">
                  <div className="d-flex align-items-center mr-0 mr-md-4">
                    <div>
                      <div className="font-weight-bold d-flex align-items-center">
                        Two-Factor Authentication
                        <div className="badge badge-success text-uppercase ml-2">
                          Enabled
                        </div>
                      </div>
                      <span className="opacity-6 d-block">
                        Enable the requirement of PIN code for all login
                        attempts.
                      </span>
                    </div>
                  </div>
                  <div className="d-block d-md-flex mt-3 mt-lg-0 align-items-center">
                    <Button size="small" selected className="btn-primary">
                      Disabled
                    </Button>
                  </div>
                </ListItem>
              </List>
            </Container>
            <div className="divider my-4" />
            <Container>
              <div>
                <div className="card-header d-flex align-items-center bg-transparent card-header-alt px-0 pb-4">
                  <div>
                    <h6 className="font-weight-bold font-size-xl mb-1 text-black">
                      All Logs
                    </h6>
                    <p className="text-black-50 mb-0">
                      See your sign in activity logs below.
                    </p>
                  </div>
                </div>
                <Table className="table table-sm table-bordered text-nowrap mb-4">
                  <thead className="thead-light text-capitalize font-size-sm font-weight-bold">
                    <tr>
                      <th className="text-left px-4">Browser</th>
                      <th className="text-left px-4">IP Address</th>
                      <th className="text-left px-4">Location</th>
                      <th className="text-left px-4">Date/Time</th>
                      <th className="text-center" />
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4">Chrome on Linux</td>
                      <td className="text-left px-4">192.168.0.1</td>
                      <td className="text-left px-4">San Francisco, USA</td>
                      <td className="text-left px-4">
                        19 Feb, 2020 | 11:22 PM
                      </td>
                      <td className="text-center">
                        <Button className="btn-neutral-danger mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center">
                          <FontAwesomeIcon
                            icon={['fas', 'times']}
                            className="font-size-sm"
                          />
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4">Chrome on UbuntuOS</td>
                      <td className="text-left px-4">192.168.0.1</td>
                      <td className="text-left px-4">Madrid, Spain</td>
                      <td className="text-left px-4">
                        23 Feb, 2020 | 07:35 AM
                      </td>
                      <td className="text-center">
                        <Button className="btn-neutral-danger mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center">
                          <FontAwesomeIcon
                            icon={['fas', 'times']}
                            className="font-size-sm"
                          />
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4">Edge on Windows</td>
                      <td className="text-left px-4">192.168.0.1</td>
                      <td className="text-left px-4">Bucharest, Romania</td>
                      <td className="text-left px-4">
                        25 Feb, 2020 | 08:49 AM
                      </td>
                      <td className="text-center">
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
              </div>
            </Container>
          </div>
          <div
            className={clsx('tab-item-wrapper', { active: activeTab === '3' })}
            index={3}>
            <Container className="py-3">
              <div>
                <div className="card-header d-flex align-items-center bg-transparent card-header-alt px-0 pb-4">
                  <div>
                    <h6 className="font-weight-bold font-size-xl mb-1 text-black">
                      Connect to social accounts
                    </h6>
                    <p className="text-black-50 mb-0">
                      You can connect your social accounts for faster logins.
                    </p>
                  </div>
                </div>

                <div className="font-weight-bold opacity-7 mb-3">Connected</div>
                <List className="mb-5 list-group-bordered">
                  <ListItem className="d-block d-lg-flex justify-content-between align-items-center py-3">
                    <div className="d-flex align-items-center mr-4">
                      <Button
                        component="a"
                        className="d-50 d-flex shadow-none p-0 align-items-center justify-content-center rounded-pill mr-3 font-size-lg border-0 btn-facebook"
                        href="#/"
                        onClick={(e) => e.preventDefault()}>
                        <FontAwesomeIcon
                          icon={['fab', 'facebook']}
                          className="font-size-xl"
                        />
                      </Button>
                      <div>
                        <div className="d-block">
                          <div className="font-weight-bold">
                            <b>Facebook</b> account connected
                          </div>
                          <div className="opacity-7">
                            You can revoke access with one click.
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-block d-md-flex mt-3 mt-lg-0 align-items-center">
                      <Button className="btn-danger text-nowrap shadow-none font-weight-bold font-size-lg">
                        Revoke Access
                      </Button>
                    </div>
                  </ListItem>
                  <ListItem className="d-block d-lg-flex justify-content-between align-items-center py-3">
                    <div className="d-flex align-items-center mr-4">
                      <Button
                        component="a"
                        className="d-50 d-flex shadow-none p-0 align-items-center justify-content-center rounded-pill mr-3 font-size-lg border-0 btn-twitter"
                        href="#/"
                        onClick={(e) => e.preventDefault()}>
                        <FontAwesomeIcon
                          icon={['fab', 'twitter']}
                          className="font-size-xl"
                        />
                      </Button>
                      <div>
                        <div className="d-block">
                          <div className="font-weight-bold">
                            <b>Twitter</b> account connected
                          </div>
                          <div className="opacity-7">
                            You can revoke access with one click.
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-block d-md-flex mt-3 mt-lg-0 align-items-center">
                      <Button className="btn-danger text-nowrap shadow-none font-weight-bold font-size-lg">
                        Revoke Access
                      </Button>
                    </div>
                  </ListItem>
                </List>
                <div className="font-weight-bold opacity-7 mb-3">
                  More Options
                </div>
                <List className="mb-4 list-group-bordered">
                  <ListItem className="d-block d-lg-flex justify-content-between align-items-center py-3">
                    <div className="d-flex align-items-center mr-4">
                      <Button
                        component="a"
                        className="d-50 d-flex shadow-none p-0 align-items-center justify-content-center rounded-pill mr-3 font-size-lg border-0 btn-google"
                        href="#/"
                        onClick={(e) => e.preventDefault()}>
                        <FontAwesomeIcon
                          icon={['fab', 'google']}
                          className="font-size-xl"
                        />
                      </Button>
                      <div>
                        <div className="d-block">
                          <div className="font-weight-bold">
                            <b>Google</b> account is not yet connected.
                          </div>
                          <div className="opacity-7">
                            Click the Connect button to get started.
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-block d-md-flex mt-3 mt-lg-0 align-items-center">
                      <Button className="btn-light shadow-none font-weight-bold font-size-lg">
                        Connect
                      </Button>
                    </div>
                  </ListItem>
                </List>
              </div>
            </Container>
            <div className="divider my-4" />
            <Container>
              <div className="card-header d-flex align-items-center bg-transparent card-header-alt px-0 pb-2">
                <div>
                  <h6 className="font-weight-bold font-size-xl mb-1 text-black">
                    Import Contacts
                  </h6>
                  <p className="text-black-50 mb-0">
                    You can import your existing contacts from your favourite
                    email providers.
                  </p>
                </div>
              </div>
              <div className="py-4">
                <div className="d-flex justify-content-start">
                  <a
                    href="#/"
                    onClick={(e) => e.preventDefault()}
                    className="mr-4 mb-4 btn-input-select">
                    <div className="d-40 text-white d-flex align-items-center justify-content-center rounded-pill shadow-none bg-brand-google">
                      <FontAwesomeIcon icon={['fab', 'google']} />
                    </div>
                    <div className="font-weight-bold font-size-lg mt-2">
                      Google
                    </div>
                    <div className="opacity-6">Click to import</div>
                  </a>
                  <a
                    href="#/"
                    onClick={(e) => e.preventDefault()}
                    className="mr-4 mb-4 btn-input-select">
                    <div className="d-40 text-white d-flex align-items-center justify-content-center rounded-pill shadow-none bg-brand-twitter">
                      <FontAwesomeIcon icon={['fab', 'twitter']} />
                    </div>
                    <div className="font-weight-bold font-size-lg mt-2">
                      Twitter
                    </div>
                    <div className="opacity-6">Click to import</div>
                  </a>
                  <a
                    href="#/"
                    onClick={(e) => e.preventDefault()}
                    className="mr-4 mb-4 btn-input-select">
                    <div className="d-40 text-white d-flex align-items-center justify-content-center rounded-pill shadow-none bg-brand-facebook">
                      <FontAwesomeIcon icon={['fab', 'facebook']} />
                    </div>
                    <div className="font-weight-bold font-size-lg mt-2">
                      Facebook
                    </div>
                    <div className="opacity-6">Click to import</div>
                  </a>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </Card>
    </>
  );
}
