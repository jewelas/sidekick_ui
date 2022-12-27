import React, { useState } from 'react';

import Strings from '../../../config/localization/translations';

import { Grid, Card, Tab, Tabs , Typography} from '@material-ui/core';
import PropTypes from 'prop-types';
import { useStoreState } from 'easy-peasy';
import TopHolders from '../TopHolders';
import BiggestDeposits from '../BiggestDeposits';
import LargestDownlines from '../LargestDownlines';
import MostRolled from '../MostRolled';
import MostWithdrawals from '../MostWithdrawals';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            {...other}>
            {value === index && <div>{children}</div>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

export default function NewStats(props) {
    const [tabId, setTabId] = useState(0);
    const { selectedLangauge } = useStoreState((state) => state.Dapp);

    const handleTabChange = (e, tabId) => {
        setTabId(tabId);
    }

    const getString = (jsonPath) => {
        return jsonPath[selectedLangauge] === '' ? jsonPath[1] : jsonPath[selectedLangauge];
    }

    const defiStrings = Strings.DefiWatcher;
    return (
        <Card className="bg-first px-4 pt-2 text-center dripView">
            <div className="">
                <Tabs
                    className="nav-tabs-primary skTabs"
                    value={tabId}
                    onChange={handleTabChange}>
                    <Tab className="skTabBtn skSelected subTab" label={getString(defiStrings.string45)} />
                    <Tab className="skTabBtn skSelected subTab" label={getString(defiStrings.string46)} />
                    <Tab className="skTabBtn skSelected subTab" label={getString(defiStrings.string48)} />
                    <Tab className="skTabBtn skSelected subTab" label={getString(defiStrings.string49)} />
                    <Tab className="skTabBtn skSelected subTab" label={getString(defiStrings.string50)} />
                </Tabs>
            </div>
            <div className="">
                <TabPanel value={tabId} index={0} >
                    <Grid item xl={12}>
                        <TopHolders />
                    </Grid>
                </TabPanel>
                <TabPanel value={tabId} index={1} >
                    <Grid item xl={12}>
                        <BiggestDeposits />
                    </Grid>
                </TabPanel>
                <TabPanel value={tabId} index={2} >
                    <Grid item xl={12}>
                        <LargestDownlines />
                    </Grid>
                </TabPanel>
                <TabPanel value={tabId} index={3} >
                    <Grid item xl={12}>
                        <MostRolled />
                    </Grid>
                </TabPanel>
                <TabPanel value={tabId} index={4} >
                    <Grid item xl={12}>
                        <MostWithdrawals />
                    </Grid>
                </TabPanel>
            </div>
        </Card>
    );
}
