import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { GetFlowTeam } from 'services/FirebaseService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useWallet } from 'use-wallet';
import { useFlowTeam } from 'hooks/useFlow';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { faUserCrown } from '@fortawesome/pro-duotone-svg-icons';
import { faUser } from '@fortawesome/pro-duotone-svg-icons';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
const useTreeItemStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.secondary,
    '&:focus > $content': {
      backgroundColor: '#fafafa',
      color: 'var(--tree-view-color)'
    }
  },
  content: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '$expanded > &': {
      fontWeight: theme.typography.fontWeightRegular
    }
  },
  group: {
    marginLeft: 0,
    '& $content': {
      paddingLeft: theme.spacing(2)
    }
  },
  expanded: {},
  label: {
    fontWeight: 'inherit',
    color: 'inherit'
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0)
  },
  labelIcon: {
    marginRight: theme.spacing(1)
  },
  labelText: {
    fontWeight: 'inherit',
    flexGrow: 1
  }
}));

function StyledTreeItem(props) {
  const classes = useTreeItemStyles();
  const {
    labelText,
    labelIcon: LabelIcon,
    labelInfo,
    color,
    bgColor,
    ...other
  } = props;

  return (
    <TreeItem
      label={
        <div className={classes.labelRoot}>
          <LabelIcon color="inherit" className={classes.labelIcon} />
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </div>
      }
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor
      }}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        group: classes.group,
        label: classes.label
      }}
      {...other}
    />
  );
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired
};


export default function FlowTeamTab() {
  const [userTeam, setUserTeam] = useState({});
  const wallet = useWallet();
  const team = useFlowTeam(wallet, userTeam);
  const [tree, setTree] = useState(null);
  const [treeItems, setTreeItems] = useState(null);
  

  const getTeam = async(address) => {
    const team = await GetFlowTeam(address);
    console.log("GET TEAM FUNCTION RESULT", team);
    //setUserTeam(team);
    return team;
  }

  useEffect(() => {
    
    if (team !== null && team !== undefined) {
      if (team.data !== undefined && team.data !== null && team.data !== 'Error') {
        console.log('SETTING TEAM BOI', team);
        setUserTeam(team.data);
        buildLine(team.data.downline, team);
      }
      
    }
    
  }, [team]);

  
  const buildLine = (userTeam, user) => {

    const treeItemArray = [];
    const referralItemsArray = [];
    let currentId = 0;
    if (userTeam.length > 0) {
      userTeam.forEach((referral) => {
        
        
      console.log(referral.downline);
        treeItemArray.push(referral);
        iterateThroughDownline(referral.downline, referral, treeItemArray, currentId);
        currentId++;
        
      })
    }
    //This creates base referral tree
    /* const newTree = treeItemArray.map((item) =>
      
      <StyledTreeItem
        nodeId={currentId.toString()}
        labelText={item.value}
        labelIcon={MailIcon}
        labelInfo="90"
        color="#1a73e8"
        bgColor="#e8f0fe"
      >
      ></StyledTreeItem>

      
    ); */
    //console.log(treeItems);
      //setTreeItems(treeItemArray);
      
      //setTree(newTree);
      setTreeItems(treeItemArray)
    
  }
  const iterateThroughDownline = (downline, originalLine, itemArray, currentId) => {
    
    if (downline.length > 0) {

      downline.forEach((referral) => {
        
        itemArray[currentId].downline.push(referral);
        console.log(referral);


        iterateThroughDownline(referral.downline, referral, itemArray, currentId);

      });
    } else {
      
    }
    return downline;
  }
  
  const getTreeItems = (item, currentId) => {
    const items = [];
    item.downline.forEach((referral) => {
      currentId++;
      const item =
        (<StyledTreeItem nodeId={currentId.toString()} labelText={referral.value} labelIcon={UserIcon}>

          {getTreeItems(referral)}
        </StyledTreeItem>)
      /* if (referral.downline.length > 0) {
        getTreeItems(referral);
      } */
      items.push(item);
      
    })

    console.log(items);
    return items;
  }

  const CrownIcon = () => {
    const icon = (<FontAwesomeIcon icon={faUserCrown} size='2x' className="skIconColor mr-2" />);
    return icon;
  }
  
  const UserIcon = () => {
    const icon = (
      <FontAwesomeIcon
        icon={faUser}
        size="1x"
        className="skIconColor mr-1"
      />
    );
    return icon;
  }
  

  return (
    <>
      {team.data !== null && team.data !== undefined && (
        <TreeView
          className="treeview-primary"
          
          /* defaultExpanded={['']} */
          defaultCollapseIcon={<ArrowDropDownIcon />}
          defaultExpandIcon={<ArrowRightIcon />}
          defaultEndIcon={<div style={{ width: 24 }} />}>
          <StyledTreeItem
            nodeId="1"
            labelText={team.data.value}
            labelIcon={CrownIcon}>
            {treeItems !== null &&
              treeItems !== undefined &&
              treeItems.map((item) => (
                console.log(item),
                console.log(item.downline),
                
                <StyledTreeItem nodeId="2" labelText={item.value} labelIcon={UserIcon}>
                  {getTreeItems(item, 2)}
                </StyledTreeItem>
              ))
              /* treeItems.map((item) => (
                
                <StyledTreeItem
                  nodeId={2}
                  labelText={item.value}
                  labelIcon={MailIcon}
                  labelInfo="90"
                  color="#1a73e8"
                  bgColor="#e8f0fe"/>
                  
                
              ) )*/}
          </StyledTreeItem>

        </TreeView>
      )}

      {/* <div className="text-center my-5">
        <h6 className="font-weight-bold font-size-xxl mb-1 mt-3 text-warning">
          <Button
            onClick={() => {
              getTeam(wallet.account);
            }}>
            BUTTON
          </Button>
        </h6>
      </div> */}
    </>
  );
}
