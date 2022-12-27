import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Card, Button, Tooltip } from '@material-ui/core';

import avatar7 from '../../../assets/images/avatars/avatar7.jpg';
import AirportShuttleIcon from '@material-ui/icons/AirportShuttle';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';
import TuneIcon from '@material-ui/icons/Tune';

import hero3 from '../../../assets/images/hero-bg/hero-3.jpg';

export default function LivePreviewExample() {
  return (
    <>
      <Card className="card-box">
        <Grid container spacing={0}>
          <Grid item xl={6}>
            <div className="hero-wrapper bg-composed-wrapper bg-grow-early h-100 rounded br-xl-right-0">
              <div className="flex-grow-1 w-100 d-flex align-items-center">
                <div
                  className="bg-composed-wrapper--image rounded br-xl-right-0"
                  style={{ backgroundImage: 'url(' + hero3 + ')' }}
                />
                <div className="bg-composed-wrapper--bg bg-second opacity-5 rounded br-xl-right-0" />
                <div className="bg-composed-wrapper--content text-center p-5">
                  <div className="text-white">
                    <h1 className="display-3 my-3 font-weight-bold">
                      Bamburgh React Crypto Application with Material-UI PRO
                    </h1>
                    <p className="font-size-lg mb-0 text-white-50">
                      Easy to customize application inspired by the
                      cryptocurrency products niche. Start working on your
                      product today with this amazing, clean and feature-packed
                      niche template.
                    </p>
                  </div>
                </div>
              </div>
              <div className="hero-footer pb-5">
                <Button
                  href="#/"
                  onClick={(e) => e.preventDefault()}
                  className="btn-success hover-scale-sm shadow-sm-dark px-4 font-weight-bold">
                  <span className="btn-wrapper--label">Continue reading</span>
                </Button>
              </div>
            </div>
          </Grid>
          <Grid item xl={6}>
            <div className="card-tr-actions">
              <Tooltip title="Send Message" placement="top" arrow>
                <Button
                  size="small"
                  className="btn-neutral-dark d-40 p-0 btn-icon">
                  <span className="btn-wrapper--icon">
                    <FontAwesomeIcon icon={['far', 'envelope']} />
                  </span>
                </Button>
              </Tooltip>
            </div>
            <div className="text-center pt-4">
              <div className="avatar-icon-wrapper rounded-circle m-0">
                <div className="d-block p-0 avatar-icon-wrapper m-0 d-90">
                  <div className="rounded-circle overflow-hidden">
                    <img alt="..." className="img-fluid" src={avatar7} />
                  </div>
                </div>
              </div>
              <div>
                <div className="badge badge-neutral-success my-2 text-success font-size-sm px-4 py-1 h-auto">
                  Online
                </div>
              </div>
              <h3 className="font-weight-bold mt-3">Lacie-Mae Mckay</h3>
              <p className="mb-0 text-black-50">
                Senior Frontend Developer at <b>Google Inc.</b>
              </p>
              <div className="pt-3">
                <Tooltip title="Github">
                  <Button className="btn-github d-50 m-2 p-0">
                    <span className="btn-wrapper--icon">
                      <FontAwesomeIcon
                        icon={['fab', 'github']}
                        className="font-size-lg"
                      />
                    </span>
                  </Button>
                </Tooltip>
                <Button
                  className="btn-instagram d-50 m-2 p-0"
                  id="btnInstagramTooltip">
                  <span className="btn-wrapper--icon">
                    <FontAwesomeIcon
                      icon={['fab', 'instagram']}
                      className="font-size-lg"
                    />
                  </span>
                </Button>
                <Button
                  className="btn-google d-50 m-2 p-0"
                  id="btnGoogleTooltip">
                  <span className="btn-wrapper--icon">
                    <FontAwesomeIcon
                      icon={['fab', 'google']}
                      className="font-size-lg"
                    />
                  </span>
                </Button>
              </div>
              <div className="d-flex p-4 bg-secondary card-footer mt-4 flex-wrap">
                <div className="w-50 p-2">
                  <Button
                    href="#/"
                    fullWidth
                    onClick={(e) => e.preventDefault()}
                    variant="outlined"
                    className="card card-box d-block text-left p-3 text-success">
                    <div>
                      <AirportShuttleIcon className="h1 d-block my-2 text-success" />
                      <div className="font-weight-bold font-size-md text-black">
                        Projects
                      </div>
                      <div className="font-size-md mb-1 text-black opacity-8">
                        Newest tasks
                      </div>
                    </div>
                  </Button>
                </div>
                <div className="w-50 p-2">
                  <Button
                    href="#/"
                    fullWidth
                    onClick={(e) => e.preventDefault()}
                    variant="outlined"
                    className="card card-box d-block text-left p-3 text-danger">
                    <div>
                      <CheckCircleOutlineIcon className="h1 d-block my-2 text-danger" />
                      <div className="font-weight-bold font-size-md text-black">
                        Helpdesk
                      </div>
                      <div className="font-size-md mb-1 text-black opacity-8">
                        Tickets overview
                      </div>
                    </div>
                  </Button>
                </div>
                <div className="w-50 p-2">
                  <Button
                    href="#/"
                    fullWidth
                    onClick={(e) => e.preventDefault()}
                    variant="outlined"
                    className="card card-box d-block text-left p-3 text-warning">
                    <div>
                      <DeveloperBoardIcon className="h1 d-block my-2 text-warning" />
                      <div className="font-weight-bold font-size-md text-black">
                        CRM UI
                      </div>
                      <div className="font-size-md mb-1 text-black opacity-8">
                        Daily operations
                      </div>
                    </div>
                  </Button>
                </div>
                <div className="w-50 p-2">
                  <Button
                    href="#/"
                    fullWidth
                    onClick={(e) => e.preventDefault()}
                    variant="outlined"
                    className="card card-box d-block text-left p-3 text-first">
                    <div>
                      <TuneIcon className="h1 d-block my-2 text-first" />
                      <div className="font-weight-bold font-size-md text-black">
                        Customers
                      </div>
                      <div className="font-size-md mb-1 text-black opacity-8">
                        Manage data
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}
