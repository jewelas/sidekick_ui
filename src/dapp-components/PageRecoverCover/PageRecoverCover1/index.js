import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Grid,
  InputAdornment,
  Button,
  List,
  ListItem,
  Tooltip,
  TextField
} from '@material-ui/core';

import MailOutlineTwoToneIcon from '@material-ui/icons/MailOutlineTwoTone';

import hero6 from '../../../assets/images/hero-bg/hero-4.jpg';

export default function LivePreviewExample() {
  return (
    <>
      <div className="app-wrapper min-vh-100 bg-white">
        <div className="app-main min-vh-100">
          <div className="app-content p-0">
            <div className="app-inner-content-layout--main">
              <div className="flex-grow-1 w-100 d-flex align-items-center">
                <div className="bg-composed-wrapper--content">
                  <Grid container spacing={0} className="min-vh-100">
                    <Grid
                      item
                      lg={7}
                      xl={6}
                      className="d-flex align-items-center">
                      <Grid item md={10} lg={8} xl={7} className="mx-auto">
                        <div className="py-4">
                          <div className="text-center mb-5">
                            <h1 className="display-4 mb-1 font-weight-bold">
                              Recover Password
                            </h1>
                            <p className="font-size-lg mb-0 text-black-50">
                              Forgot your password? No worries, we're here to
                              help!
                            </p>
                          </div>
                          <div>
                            <TextField
                              fullWidth
                              variant="outlined"
                              id="textfield-email"
                              label="Email address"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <MailOutlineTwoToneIcon />
                                  </InputAdornment>
                                )
                              }}
                            />
                          </div>
                          <div className="text-center mb-4">
                            <Button
                              fullWidth
                              className="text-uppercase font-weight-bold font-size-sm mt-4 btn-primary">
                              Send password
                            </Button>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                    <Grid item lg={5} xl={6} className="d-flex">
                      <div className="hero-wrapper w-100 bg-composed-wrapper bg-happy-green min-vh-lg-100">
                        <div className="flex-grow-1 w-100 d-flex align-items-center">
                          <div
                            className="bg-composed-wrapper--image opacity-7"
                            style={{ backgroundImage: 'url(' + hero6 + ')' }}
                          />
                          <div className="bg-composed-wrapper--bg bg-second opacity-7" />
                          <div className="bg-composed-wrapper--bg bg-premium-dark opacity-4" />
                          <div className="bg-composed-wrapper--content text-center p-5">
                            <div className="text-white px-0 px-lg-2 px-xl-4">
                              <h1 className="display-3 mb-4 font-weight-bold">
                                Bamburgh React Crypto Application with
                                Material-UI PRO
                              </h1>
                              <p className="font-size-lg mb-0 opacity-8">
                                Easy to customize application inspired by the
                                cryptocurrency products niche. Start working on
                                your product today with this amazing, clean and
                                feature-packed niche template.
                              </p>
                              <div className="divider mx-auto border-1 my-5 border-light opacity-2 rounded w-25" />
                              <div>
                                <Button className="btn-first px-5 font-size-sm font-weight-bold btn-animated-icon text-uppercase rounded shadow-none py-3 hover-scale-sm hover-scale-lg">
                                  <span className="btn-wrapper--label">
                                    Members Login
                                  </span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="hero-footer pb-4">
                          <List
                            component="div"
                            className="nav-pills nav-neutral-secondary d-flex">
                            <Tooltip title="Facebook" arrow>
                              <ListItem
                                component="a"
                                button
                                href="#/"
                                onClick={(e) => e.preventDefault()}
                                className="font-size-lg text-white-50">
                                <FontAwesomeIcon icon={['fab', 'facebook']} />
                              </ListItem>
                            </Tooltip>

                            <Tooltip title="Twitter" arrow>
                              <ListItem
                                component="a"
                                button
                                href="#/"
                                onClick={(e) => e.preventDefault()}
                                className="font-size-lg text-white-50">
                                <FontAwesomeIcon icon={['fab', 'twitter']} />
                              </ListItem>
                            </Tooltip>

                            <Tooltip title="Google" arrow>
                              <ListItem
                                component="a"
                                button
                                href="#/"
                                onClick={(e) => e.preventDefault()}
                                className="font-size-lg text-white-50">
                                <FontAwesomeIcon icon={['fab', 'google']} />
                              </ListItem>
                            </Tooltip>
                            <Tooltip title="Instagram" arrow>
                              <ListItem
                                component="a"
                                button
                                href="#/"
                                onClick={(e) => e.preventDefault()}
                                className="font-size-lg text-white-50">
                                <FontAwesomeIcon icon={['fab', 'instagram']} />
                              </ListItem>
                            </Tooltip>
                          </List>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
