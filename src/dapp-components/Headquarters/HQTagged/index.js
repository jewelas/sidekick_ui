import React from 'react';
import Strings from '../../../config/localization/translations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Card, Button } from '@material-ui/core';
import HQTaggedTable from './HQTaggedTable';
import { faRocketLaunch } from '@fortawesome/pro-duotone-svg-icons';
import clsx from 'clsx';

export default function HQTagged(props) {
    const { data, noData, isLoading, setTags } = props;

    const renderFeaturedTable = () => {
        return <HQTaggedTable data={data} noData={noData} isLoading={isLoading} setTags={setTags}/>
    }

    const defiStrings = Strings.DefiWatcher;
    return (
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
                        // onClick={() => handleRoll()}
                        className="font-weight-bold shadow-black-lg btn-second text-first">
                        <div className='d-flex justify-content-between'>
                            <div className="mr-2" style={{alignSelf: 'center'}}>FEATURE YOUR TOKEN</div>
                            <FontAwesomeIcon icon={faRocketLaunch} size='2x' className='' />
                        </div>
                    </Button>
                </Grid>
            </Grid>
        </Card>
    );
}
