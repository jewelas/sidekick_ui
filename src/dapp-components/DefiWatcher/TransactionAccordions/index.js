import React, { useState, useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import clsx from 'clsx';
import DeleteIcon from '@material-ui/icons/Delete';
import StringComponent from '../../StringComponent';
import Strings from '../../../config/localization/translations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Collapse,
    Grid,
    Card,
    Button,
    List,
    ListItem,
    Tooltip,
    IconButton
} from '@material-ui/core';

export default function TransactionAccordions(props) {

    const { watchedWallets } = props;
    let defaultArray = [];
    for (let i = 0; i < props.maxItems; i++) {
        defaultArray.push(false);
    }

    const [accordion, setAccordion] = useState(defaultArray);

    const toggleAccordion = (tab) => {
        const prevState = accordion;
        const state = prevState.map((x, index) => (tab === index ? !x : false));
        setAccordion(state);
    };
    const defiStrings = Strings.DefiWatcher;
    return (
        <>
            <div className={clsx('accordion', !props.drip ? 'skWatched' : 'skWatched-drip')}>
                {watchedWallets.map((obj, index) => {
                    if (index < props.maxItems)
                        return <Card key={index}
                            className={clsx('card-box', {
                                'panel-open': accordion[index]
                            })}>
                            <Card>
                                <div className="card-header">
                                    <div className="panel-title">
                                        <div className="accordion-toggle">
                                            <Button
                                                variant="text"
                                                size="large"
                                                className="d-flex align-items-center justify-content-between btn-transition-none skAccordian"
                                                onClick={() => toggleAccordion(index)}
                                                aria-expanded={accordion[index]}>
                                                <span className="accordianWalletID">{obj.wallet}</span>
                                                <FontAwesomeIcon
                                                    icon={['fas', 'angle-up']}
                                                    className="font-size-xl accordion-icon"
                                                />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <Collapse in={accordion[index]}>
                                    <div className="grid-menu grid-menu-2col bg-primary text-white">
                                        <IconButton className="trashBtn" aria-label="Remove" onClick={(e) => { props.removeWallet(obj.wallet); }}>
                                            <DeleteIcon />
                                        </IconButton>
                                        <Grid container spacing={0}>
                                            <Grid item sm={6} className="noBorders">
                                                <div className="d-block btn-link p-4 w-100">
                                                    <div className="align-box-row align-items-start">
                                                        <div className="text-left mr-3">
                                                            <div className="font-weight-bold">
                                                                <div className="text-green d-block mb-1 text-uppercase font-weight-bold">
                                                                    <StringComponent string={defiStrings.string1}/>
                                                                </div>
                                                                <div className="font-size-xxl mt-1 text-white" >
                                                                    ${obj.totalAmountBuy}
                                                                </div>
                                                                <div className="mt-1 text-white" >
                                                                    ({obj.totalTokensBuy})
                                                                </div>
                                                            </div>                                    
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid>
                                            <Grid item sm={6} className="noBorders">
                                                <div className="d-block btn-link p-4 w-100">
                                                    <div className="align-box-row align-items-start">
                                                        <div className="text-left">
                                                            <div className="font-weight-bold">
                                                                <div className="textRed d-block mb-1 text-uppercase font-weight-bold">
                                                                <StringComponent string={defiStrings.string2}/>
                                                                </div>
                                                                <div className="font-size-xxl mt-1 text-white" >
                                                                    ${obj.totalAmountSold}
                                                                </div>
                                                                <div className="mt-1 text-white" >
                                                                    ({obj.totalTokensSold})
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </div>
                                </Collapse>
                            </Card>
                        </Card>
                    else
                        return null;
                })}
            </div>
        </>
    );
}
