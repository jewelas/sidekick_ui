import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Dialog, Button, Tooltip } from '@material-ui/core';

import avatar1 from '../../../assets/images/avatars/avatar1.jpg';
import avatar2 from '../../../assets/images/avatars/avatar2.jpg';
import avatar5 from '../../../assets/images/avatars/avatar5.jpg';
import avatar6 from '../../../assets/images/avatars/avatar6.jpg';
import avatar7 from '../../../assets/images/avatars/avatar7.jpg';
import people3 from '../../../assets/images/stock-photos/people-3.jpg';

const ProfilePageTitleActions = () => {
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);

  return (
    <>
      <Button onClick={toggleModal} variant="contained" color="primary">
        <span className="btn-wrapper--icon">
          <FontAwesomeIcon icon={['far', 'eye']} />
        </span>
        <span className="btn-wrapper--label">Team Members</span>
      </Button>

      <Dialog
        scroll="body"
        maxWidth="lg"
        open={modal}
        onClose={toggleModal}
        classes={{ paper: 'border-0 bg-transparent' }}>
        <Grid container spacing={0}>
          <Grid item lg={5}>
            <div className="bg-white rounded-left">
              <div className="p-4 text-center">
                <div className="avatar-icon-wrapper rounded-circle mx-auto">
                  <div className="d-block p-0 avatar-icon-wrapper rounded-circle m-0 border-3 border-first">
                    <div className="rounded-circle border-3 border-white overflow-hidden">
                      <img alt="..." className="img-fluid" src={avatar5} />
                    </div>
                  </div>
                </div>
                <h4 className="font-size-lg font-weight-bold my-2">
                  Marion Devine
                </h4>
                <div className="text-center my-4">
                  <div className="badge-pill badge badge-neutral-first text-first mx-1">
                    Web developer
                  </div>
                  <div className="badge-pill badge badge-neutral-warning text-warning mx-1">
                    Javascript
                  </div>
                  <div className="badge-pill badge badge-neutral-danger text-danger mx-1">
                    Angular
                  </div>
                </div>

                <p className="text-muted mb-4">
                  I should be incapable of drawing a single stroke at the
                  present moment; and yet I feel that I never was a greater
                  artist than now.
                </p>

                <div className="divider my-4" />
                <Grid container spacing={6}>
                  <Grid item lg={6}>
                    <span className="opacity-6 pb-2">Current month</span>
                    <div className="d-flex align-items-center justify-content-center">
                      <span className="font-weight-bold font-size-lg">
                        <small className="opacity-6 pr-1">$</small>
                        46,362
                      </span>
                      <div className="badge badge-neutral-danger ml-2 text-danger">
                        -8%
                      </div>
                    </div>
                  </Grid>
                  <Grid item lg={6}>
                    <span className="opacity-6 pb-2">Last year</span>
                    <div className="d-flex align-items-center justify-content-center">
                      <span className="font-weight-bold font-size-lg">
                        <small className="opacity-6 pr-1">$</small>
                        34,546
                      </span>
                      <div className="badge badge-neutral-success text-success ml-2">
                        +13%
                      </div>
                    </div>
                  </Grid>
                </Grid>
                <div className="divider my-4" />
                <div className="font-weight-bold text-uppercase text-black-50 text-center mb-3">
                  Team members
                </div>
                <div className="avatar-wrapper-overlap d-flex justify-content-center mb-3">
                  <Tooltip
                    title="Chelsey Delaney"
                    classes={{ tooltip: 'tooltip-danger' }}
                    arrow>
                    <div className="avatar-icon-wrapper" id="DelaneyTooltip1">
                      <div className="avatar-icon">
                        <img alt="..." src={avatar1} />
                      </div>
                    </div>
                  </Tooltip>
                  <Tooltip
                    title="Laibah Santos"
                    classes={{ tooltip: 'tooltip-first' }}
                    arrow>
                    <div className="avatar-icon-wrapper" id="SantosTooltip1">
                      <div className="avatar-icon">
                        <img alt="..." src={avatar7} />
                      </div>
                    </div>
                  </Tooltip>
                  <Tooltip
                    title="Ksawery Weber"
                    classes={{ tooltip: 'tooltip-second' }}
                    arrow>
                    <div className="avatar-icon-wrapper" id="WeberTooltip1">
                      <div className="avatar-icon">
                        <img alt="..." src={avatar1} />
                      </div>
                    </div>
                  </Tooltip>
                  <Tooltip
                    title="Killian Magana"
                    classes={{ tooltip: 'tooltip-info' }}
                    arrow>
                    <div className="avatar-icon-wrapper" id="MaganaTooltip1">
                      <div className="avatar-icon">
                        <img alt="..." src={avatar2} />
                      </div>
                    </div>
                  </Tooltip>
                  <Tooltip
                    title="Kean Banks"
                    classes={{ tooltip: 'tooltip-success' }}
                    arrow>
                    <div className="avatar-icon-wrapper" id="BanksTooltip1">
                      <div className="avatar-icon">
                        <img alt="..." src={avatar6} />
                      </div>
                    </div>
                  </Tooltip>
                </div>
                <div className="divider my-4" />
                <Button className="btn-outline-first mt-2">
                  View complete profile
                </Button>
              </div>
            </div>
          </Grid>
          <Grid item lg={7}>
            <div className="hero-wrapper bg-composed-wrapper h-100 rounded-right">
              <div className="flex-grow-1 w-100 d-flex align-items-end">
                <div
                  className="bg-composed-wrapper--image rounded-right opacity-9 bg-composed-filter-rm"
                  style={{ backgroundImage: 'url(' + people3 + ')' }}
                />
                <div className="bg-composed-wrapper--content text-center p-5">
                  <div className="text-white mt-3">
                    <h1 className="display-3 my-3 font-weight-bold">
                      Wonderful serenity has possession
                    </h1>
                    <p className="font-size-lg mb-0 text-white opacity-7">
                      All components from the General dashboard template can be
                      used in the individual applications pages, without
                      modifications.
                    </p>
                    <div className="divider border-1 mx-auto my-4 border-light opacity-2 rounded w-25" />
                    <div>
                      <Button
                        component="a"
                        href="#/"
                        onClick={(e) => e.preventDefault()}
                        size="large"
                        className="btn-success btn-pill">
                        <span className="btn-wrapper--icon">
                          <FontAwesomeIcon icon={['far', 'envelope']} />
                        </span>
                        <span className="btn-wrapper--label">Get in touch</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
};

export default ProfilePageTitleActions;
