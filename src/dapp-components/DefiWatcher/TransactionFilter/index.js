import React, { useEffect, useState } from 'react';
import FormsSlider2 from '../../FormsSlider/FormsSlider2';
import StringComponent from '../../StringComponent';
import Strings from '../../../config/localization/translations';
import FilterListIcon from '@material-ui/icons/FilterList';
import { useStoreState, useStoreActions } from 'easy-peasy';
import {
  Menu,
  Button,
  List,
  ListItem,
  Switch,
  MenuItem,
  FormControl,
  Select
} from '@material-ui/core';

export default function TransactionsFilter(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [skNames, setSkNames] = useState(undefined);
  const [tranType, setTranType] = useState('ALL');
  const [filter, setFilter] = useState({ densePadding: true });
  const { selectedLangauge, selectedNameService } = useStoreState(
    (state) => state.Dapp
  );
  const { setSelectedNameService } = useStoreActions((actions) => actions.Dapp);

  useEffect(() => {
    if (selectedNameService) {
      if (selectedNameService === 'sidekick') {
        setSkNames(false);
      } else {
        setSkNames(true);
      }
    }
  }, [selectedNameService]);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeNameservice = (e) => {
    filter.skNames = e.target.checked;
    setSkNames(e.target.checked);
    if (props.filterChanged != null) {
      props.filterChanged(filter);
    }
    setFilter(filter);

    setSelectedNameService(e.target.checked ? 'gangster' : 'sidekick');
  };

  const handleSliderChangeFilter = (newValue, filterId) => {
    filter[filterId] = newValue;
    if (props.filterChanged != null) {
      props.filterChanged(filter);
    }
    setFilter(filter);
  };

  const handleTransactionTypeChangeFilter = (event) => {
    filter.transactionType = event.target.value;
    setTranType(event.target.value);
    if (props.filterChanged != null) {
      props.filterChanged(filter);
    }
    setFilter(filter);
  };
  const getString = (jsonPath, langaugeId) => {
    //console.log(Strings);
    return jsonPath[langaugeId] === '' ? jsonPath[1] : jsonPath[langaugeId];
  };
  const { maxTime, maxTranCount } = props;
  const defiStrings = Strings.DefiWatcher;
  return (
    <>
      <div className="card-tr-actions">
        <Button
          size="small"
          onClick={handleClick}
          className="btn-link p-0 text-white">
          <FilterListIcon />
        </Button>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          open={Boolean(anchorEl)}
          classes={{ list: 'p-0' }}
          onClose={handleClose}>
          <div className="dropdown-menu-lg overflow-hidden p-3 text-center skTransFilter">
            <span>
              <StringComponent string={defiStrings.string3} />
            </span>
            <List component="div" className="nav-pills flex-column">
              {/*  <ListItem>
                <FormsSlider2
                  filterId="transactionTimeRange"
                  defaultRange={[0, maxTime]}
                  onChange={handleSliderChangeFilter}
                  title={getString(
                    defiStrings.string4,
                    selectedLangauge
                  )}></FormsSlider2>
              </ListItem>
              <ListItem>
                <FormsSlider2
                  filterId="transactionCount"
                  defaultRange={[0, maxTranCount]}
                  onChange={handleSliderChangeFilter}
                  title={getString(
                    defiStrings.string5,
                    selectedLangauge
                  )}></FormsSlider2>
              </ListItem> */}
              <ListItem>
                <FormControl fullWidth variant="standard">
                  <div
                    style={{
                      margin: '1rem 0 -1rem 0',
                      fontSize: '15px',
                      float: 'right',
                      color: 'rgba(255, 255, 255, 0.87)'
                    }}>
                    <StringComponent string={defiStrings.string6} />
                  </div>
                  <Select
                    labelId="TranType"
                    value={tranType}
                    style={{ marginTop: '18px' }}
                    onChange={handleTransactionTypeChangeFilter}
                    label="Transaction">
                    <MenuItem value="ALL">
                      <StringComponent string={defiStrings.string7} />
                    </MenuItem>
                    <MenuItem value="BUY">
                      <StringComponent string={defiStrings.string8} />
                    </MenuItem>
                    <MenuItem value="SELL">
                      <StringComponent string={defiStrings.string9} />
                    </MenuItem>
                  </Select>
                </FormControl>
              </ListItem>
              <ListItem>
                <div className="font-size-sm">SideKick Names</div>
                <Switch
                  checked={skNames}
                  className="switch-small toggle-switch-second mx-1"
                  onChange={handleChangeNameservice}
                />
                <div className="font-size-sm">Gangster Names</div>
              </ListItem>
              <ListItem>
                <div style={{cursor: "pointer"}} onClick={() => {props.exportCSV()}}>CSV</div>
              </ListItem>
            </List>
          </div>
        </Menu>
      </div>
    </>
  );
}
