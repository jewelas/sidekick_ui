import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation } from 'react-router-dom';
import {
  Card,
  MenuItem,
  TextField
} from '@material-ui/core';
import StringComponent from '../../StringComponent';
import Strings from '../../../config/localization/translations';
import { useStoreState, useStoreActions } from 'easy-peasy';
import bscLogo from '../../../assets/images/stock-logos/bsc.svg'
import ethereumLogo from '../../../assets/images/stock-logos/ethereum.svg'
import polygonLogo from '../../../assets/images/stock-logos/polygonscan.svg'

const useStyles = makeStyles((theme) => ({
  option: {
    minHeight: 'auto'
  },
  listbox: {
    overflowY: 'auto !important'
  }
}));

export default function NetworkSearch(props) {
  const networks = [{ value: 'bsc', logo: bscLogo}, {value: 'matic', logo: polygonLogo}, {value: 'ethereum', logo: ethereumLogo}]
  //todo move valid networks to constant file
  const { selectedQueryNetwork } = useStoreState(
    (state) => state.Dapp
  );
  const { setSelectedQueryNetwork } = useStoreActions((actions) => actions.Dapp);
  const autocompleteRef = React.useRef(null);
  const query = new URLSearchParams(useLocation().search);
  // run on render 1 time
  useEffect(() => {
    const urlNetwork = query.get('network');
    if (
      urlNetwork !== null &&
      urlNetwork !== undefined &&
      urlNetwork.length > 2
    ) {
      setSelectedQueryNetwork(urlNetwork);
    } else {
      setSelectedQueryNetwork('bsc');
    }
  }, []);

  const handleChange = (e, value) => {
    if (
      e.target.value !== undefined &&
      e.target.value.length > 2 &&
      e.type !== undefined &&
      e.type === 'click'
    ) {
      setSelectedQueryNetwork(e.target.value);
    }
  };
  const getString = (jsonPath, langaugeId) => {
    //console.log(Strings);
    return jsonPath[langaugeId] === '' ? jsonPath[1] : jsonPath[langaugeId];
  };

  const defiStrings = Strings.DefiWatcher;
  return (
    <>
      <Card className="ml-1 mb-0 text-center bg-first">
        <div>
          <TextField
            ref={autocompleteRef}
            id="input-with-icon-textfield1"
            select
            value={selectedQueryNetwork}
            onChange={handleChange}
            className="transSearch networkSearch m-2"
            variant="outlined"
            size='small'
            >
            {networks.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <img src={option.logo} title={option.value} className="networkIcon pr-0" />
              </MenuItem>
            ))}
          </TextField>
        </div>
      </Card>
    </>
  );
}
