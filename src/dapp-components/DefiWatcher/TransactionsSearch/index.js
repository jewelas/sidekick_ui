import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation } from 'react-router-dom';
import {
    Card, Menu, Button, List, ListItem, InputLabel,
    MenuItem, FormControl, Select, TextField
} from '@material-ui/core';
import StringComponent from '../../StringComponent';
import Strings from '../../../config/localization/translations';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { useGetTokenSearch } from 'hooks/useData';
import { usePrevious } from 'hooks/useHelpers';
import * as addressHelper from '../../../utils/addressHelpers';

const useStyles = makeStyles((theme) => ({
    option: {
        minHeight: 'auto'
    },
    listbox: {
        overflowY: 'auto !important',
        backgroundColor: "#1d2b62 !important",
        color: "white",
        paddingTop: "0px !important",
    },
    groupLabel: {
        backgroundColor: "#1d2b62 !important",
        color: "rgba(255, 255, 255, .7)",
        borderBottom: "1px solid rgba(255, 255, 255, .5)",
        width: "100%",
        marginTop: "10px",
        paddingBottom: "0px !important"
    },
    groupUl: {
        paddingBottom: "0px !important"
    }
}))


export default function TransactionsMenu(props) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [openSearch, setOpenSearch] = useState(false);
    //todo move valid networks to constant file
    const [tokenList, setTokenList] = useState([]);
    const [autoCompleteLoading, setAutoCompleteLoading] = useState(false);
    const { watchedWallets, 
        transactionFilter, 
        featuredCoinsList, 
        recentlySearchedTokens, 
        searchString, 
        selectedLangauge, 
        firebase,
        selectedQueryNetwork
     } = useStoreState(state => state.Dapp);
    const { setWatchedWallets, setTransactionFilter, setSearchString } = useStoreActions(actions => actions.Dapp);    

    const autocompleteRef = React.useRef(null)
    const prevSearchString = usePrevious(searchString);
    const query = new URLSearchParams(useLocation().search);

    const returnedTokens = useGetTokenSearch(searchString, selectedQueryNetwork);

    // run everytime searchString changes
    useEffect(() => {
        if (searchString !== null && searchString !== undefined && searchString.length > 1 && prevSearchString !== undefined && prevSearchString !== searchString) {
            setAutoCompleteLoading(true);
            // setOpenSearch(true);            
            autocompleteRef.current.click();
            autocompleteRef.current.focus();
        }
    }, [searchString])

    // run on render 1 time
    useEffect(() => {
        if (tokenList.length === 0) {
            setTokenList([...featuredCoinsList.concat(recentlySearchedTokens)])
        }

        const urlAddress = query.get('token');
        if (urlAddress !== null && urlAddress !== undefined && urlAddress.length > 3) {
            setSearchString(urlAddress);
        } else if(transactionFilter !== undefined && transactionFilter.token !== undefined && transactionFilter.token !== null && transactionFilter.token.subject !== undefined){
            setSearchString(transactionFilter.token.subject.address);
        }
        else {
            setSearchString(addressHelper.getRootedAddress())
        }
    }, [])

    //run when token list changes, checks url and top/#1 search are identical then sets it if transactionfilter hasnt been set(basically only runs on page load)
    useEffect(() => {
        const urlAddress = query.get('token');
        var address = urlAddress !== undefined && urlAddress !== null ? urlAddress : addressHelper.getRootedAddress();
        const found = tokenList.filter(x => x.subject.address.toLowerCase() === address.toLowerCase());
        if (found[0]) {
            if ((transactionFilter.token === undefined || transactionFilter.token === null ) || ( (urlAddress !== undefined && urlAddress !== null)  && transactionFilter.token.subject.address !== found[0].subject.address)) {
                handleChangeToken(null, found[0]);
            }
        }
    }, [tokenList]);

    useEffect(() => {
        if (returnedTokens !== undefined && returnedTokens.length > 0) {
            let list = returnedTokens.concat(featuredCoinsList).concat(recentlySearchedTokens);
            list = [...new Set(list)]
            setTokenList(list);

        } else {
            let list = featuredCoinsList.concat(recentlySearchedTokens);
            list = [...new Set(list)]
            setTokenList(list);
        }

        setAutoCompleteLoading(false);
    }, [returnedTokens, recentlySearchedTokens])

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setOpenSearch(false)
        setAnchorEl(null);
    };

    const handleDateRangeChange = (e) => {
        setTransactionFilter({ token: transactionFilter.token, dateRange: e.target.value });

        props.filterChanged();
    }

    const handleChangeToken = (e, value) => {
        setTransactionFilter({ token: value, dateRange: transactionFilter.dateRange });
        setOpenSearch(false)
        if (value != null)
            props.filterChanged();
    }

    const handleInputChange = (e, value) => {
        if (value !== undefined && value.length > 3 && e.type !== undefined && e.type === 'change') {
            setSearchString(value);

        }
        if (
            value !== undefined &&
            value.length > 3 &&
            e.type !== undefined &&
            e.type === 'click'
        ) {
            firebase.analytics.logEvent('search', {
                search_term: value
            });
        }

    }
    const getString = (jsonPath, langaugeId) => {
        //console.log(Strings);
        return jsonPath[langaugeId] === '' ? jsonPath[1] : jsonPath[langaugeId];
    }

    const autocompleteOptionRender = (option) => {

        return (
            <div className='font-size-sm'>
                <span>{option.subject.name} ({option.subject.symbol})&nbsp;</span>
                <span>{option.subject.address}</span>
            </div>)
    }
    const defiStrings = Strings.DefiWatcher;
    return (
        <>
            <Card className="p-2 text-center bg-first">
                <div className="card-tr-actions">
                    <Button
                        size="small"
                        style={{ display: 'none' }}
                        onClick={handleClick}
                        className="btn-link btn-link-dark p-0 opacity-8">
                        <FontAwesomeIcon
                            icon={['fas', 'ellipsis-h']}
                            className="font-size-lg"
                        />
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
                        <div className="dropdown-menu-lg overflow-hidden p-0">
                            <List component="div" className="nav-pills  flex-column p-3">
                                <ListItem>
                                    <FormControl fullWidth variant="standard">
                                        <InputLabel id="demo-simple-select-standard-label">
                                            <StringComponent string={defiStrings.string11} />
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={transactionFilter.dateRange}
                                            onChange={handleDateRangeChange}
                                            label="Transaction">
                                            <MenuItem value="NOW"><StringComponent string={defiStrings.string12} /></MenuItem>
                                            <MenuItem value="WTD"><StringComponent string={defiStrings.string13} /></MenuItem>
                                            <MenuItem value="MTD"><StringComponent string={defiStrings.string14} /></MenuItem>
                                            <MenuItem value="QTD"><StringComponent string={defiStrings.string15} /></MenuItem>
                                            <MenuItem value="YTD"><StringComponent string={defiStrings.string16} /></MenuItem>
                                        </Select>
                                    </FormControl>
                                </ListItem>
                            </List>
                        </div>
                    </Menu>
                </div>
                <div>
                    <Autocomplete
                        // open={openSearch}
                        classes={{
                            option: classes.option,
                            listbox: classes.listbox,
                            groupLabel: classes.groupLabel,
                            groupUl: classes.groupUl,
                        }}
                        clearOnBlur={true}
                        clearOnEscape={true}
                        openOnFocus={true}
                        // sort groups, put top coins above search
                        options={tokenList.sort((a, b) => b.type.localeCompare(a.type))}
                        getOptionLabel={(option) => option.subject.name + " (" + option.subject.symbol + ") " + " " + option.subject.address}
                        groupBy={(option) => option.type}
                        noOptionsText={'No options'}
                        loading={autoCompleteLoading}
                        style={{ width: '100%' }}
                        multiple={false}
                        onChange={handleChangeToken}
                        onInputChange={handleInputChange}
                        renderOption={autocompleteOptionRender}
                        renderInput={(params) => (<TextField
                            ref={autocompleteRef}
                            {...params}
                            variant="outlined"
                            size="small"
                            label={getString(defiStrings.string29, selectedLangauge)}
                            id="input-with-icon-textfield1"
                            className="w-100 transSearch"
                        />)}
                    />
                </div>
            </Card>
        </>
    );
}
