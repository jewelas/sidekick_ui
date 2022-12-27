import React, { useState } from 'react';
import Strings from '../../../config/localization/translations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Card, Button} from '@material-ui/core';
import HQFeaturedTable from './HQFeaturedTable';

import { faRocketLaunch, faCoin } from '@fortawesome/pro-duotone-svg-icons';
import clsx from 'clsx';
import { useStoreState } from 'easy-peasy';

export default function HQFeatured(props) {
    const { data, noData, isLoading, currentTags, setTags } = props;

    const renderFeaturedTable = () => {
        return <HQFeaturedTable data={data} noData={noData} isLoading={isLoading} currentTags={currentTags} setTags={setTags} />
    }

    const defiStrings = Strings.DefiWatcher;
    return (
        <span>

        
        <Card className={clsx('bg-first', 'text-center', 'px-2', 'skOverview')}>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    {renderFeaturedTable()}
                </Grid>
                <Grid item xs={12}>
                    <Button
                        // size="large"
                        // fullWidth={true}
                        //disabled={!isApproved}
                        //onClick={}
                        className="font-weight-bold shadow-black-lg btn-second text-first">
                        <div className='d-flex justify-content-between'>
                            <div className="mr-2" style={{alignSelf: 'center'}}>FEATURE YOUR TOKEN</div>
                            <FontAwesomeIcon icon={faRocketLaunch} size='2x' className='' />
                        </div>
                    </Button>
                </Grid>
            </Grid>
            </Card>
            </span>
    );
}
