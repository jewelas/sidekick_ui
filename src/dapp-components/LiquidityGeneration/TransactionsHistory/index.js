import React from 'react';

import { Card, List, ListItem } from '@material-ui/core';

import TrendingUpTwoToneIcon from '@material-ui/icons/TrendingUpTwoTone';
import TrendingDownTwoToneIcon from '@material-ui/icons/TrendingDownTwoTone';
import ArrowBackTwoToneIcon from '@material-ui/icons/ArrowBackTwoTone';

export default function LivePreviewExample() {
  return (
    <>
      <Card>
        <div className="card-header d-flex align-items-center justify-content-between card-header-alt p-4">
          <h6 className="font-weight-bold font-size-lg mb-0 text-black">
            All transactions
          </h6>
        </div>
        <div className="divider" />
        <div className="divider" />
        <div className="p-4">
          <div className="font-weight-bold opacity-7 mb-3">
            15 February 2020
          </div>
          <List component="div" className="list-group-bordered mb-5">
            <ListItem className="d-flex justify-content-between align-items-center py-3">
              <div className="d-flex align-items-center mr-4">
                <div className="d-40 text-white d-flex align-items-center justify-content-center rounded-pill font-size-lg mr-3 bg-success">
                  <TrendingDownTwoToneIcon />
                </div>
                <div>
                  <div className="font-weight-bold">Received Bitcoin</div>
                  <span className="text-black opacity-5 d-block">
                    To <b>My Bitcoin Wallet</b>
                  </span>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div className="text-right mr-3">
                  <div className="font-weight-bold font-size-lg">
                    0.234894 BTC
                  </div>
                  <div className="font-weight-bold text-black opacity-4">
                    $438
                  </div>
                </div>
              </div>
            </ListItem>
          </List>
          <div className="font-weight-bold opacity-7 mb-3">
            16 February 2020
          </div>
          <List className="list-group-bordered py-0">
            <ListItem className="d-flex justify-content-between align-items-center py-3">
              <div className="d-flex align-items-center mr-4">
                <div className="d-40 text-white d-flex align-items-center justify-content-center rounded-pill font-size-lg mr-3 bg-first">
                  <TrendingUpTwoToneIcon />
                </div>
                <div>
                  <div className="font-weight-bold">Sent Ethereum</div>
                  <span className="text-black opacity-5 d-block">
                    From <b>Ether Wallet</b>
                  </span>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div className="text-right mr-3">
                  <div className="font-weight-bold font-size-lg">
                    1.3984 ETH
                  </div>
                  <div className="font-weight-bold text-black opacity-4">
                    $1,495 USD
                  </div>
                </div>
              </div>
            </ListItem>
            <ListItem className="d-flex justify-content-between align-items-center py-3">
              <div className="d-flex align-items-center mr-4">
                <div className="d-40 text-white d-flex align-items-center justify-content-center rounded-pill font-size-lg mr-3 bg-danger">
                  <ArrowBackTwoToneIcon />
                </div>
                <div>
                  <div className="font-weight-bold">
                    Withdraw to bank account
                  </div>
                  <span className="text-black opacity-5 d-block">
                    From <b>Total Balance</b>
                  </span>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div className="text-right mr-3">
                  <div className="font-weight-bold text-danger font-size-lg">
                    -23,549 USD
                  </div>
                </div>
              </div>
            </ListItem>
            <ListItem className="d-flex justify-content-between align-items-center py-3">
              <div className="d-flex align-items-center mr-4">
                <div className="d-40 text-white d-flex align-items-center justify-content-center rounded-pill font-size-lg mr-3 bg-success">
                  <TrendingDownTwoToneIcon />
                </div>
                <div>
                  <div className="font-weight-bold">Received Bitcoin</div>
                  <span className="text-black opacity-5 d-block">
                    To <b>My Bitcoin Wallet</b>
                  </span>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div className="text-right mr-3">
                  <div className="font-weight-bold font-size-lg">
                    0.234894 BTC
                  </div>
                  <div className="font-weight-bold text-black opacity-4">
                    $438
                  </div>
                </div>
              </div>
            </ListItem>
          </List>
        </div>
      </Card>
    </>
  );
}
