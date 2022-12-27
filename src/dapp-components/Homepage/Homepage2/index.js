import React from 'react';
import Strings from '../../../config/localization/translations';
import { Grid, Container, Card, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import StringComponent from '../../StringComponent';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';

import Typography from '@material-ui/core/Typography';
import TrackChangesRoundedIcon from '@material-ui/icons/TrackChangesRounded';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import TrendingUpRoundedIcon from '@material-ui/icons/TrendingUpRounded';
import VerifiedUserOutlinedIcon from '@material-ui/icons/VerifiedUserOutlined';
import VoiceChatOutlinedIcon from '@material-ui/icons/VoiceChatOutlined';
import AndroidOutlinedIcon from '@material-ui/icons/AndroidOutlined';
import PeopleOutlineRoundedIcon from '@material-ui/icons/PeopleOutlineRounded';
import EmojiPeopleOutlinedIcon from '@material-ui/icons/EmojiPeopleOutlined';

import miniLogo from '../../../assets/images/sidekick/logo/PNG Small/Logo_mark_white.png';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '6px 16px',
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

export default function CustomizedTimeline() {
  const classes = useStyles();
  const HomePage2 = Strings.Homepage2Strings;

  return (
    <div className="hero-wrapper bg-composed-wrapper mt-7">
      <h1 className="display-3 mb-5 font-weight-bold text-center text-first"><StringComponent string={Strings.RoadmapString}/></h1> {/* RoadmapString */}
      <div className="hero-wrapper--content flex-column">
        <Grid container spacing={6} className="py-5 skTimeline">
          <Grid item lg={9}>
            <Timeline align="alternate">
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot className="bg-sidekick-green btn-icon mx-auto mx-lg-0 text-white font-size-xl d-50 skDotBorder">
                    <TrackChangesRoundedIcon />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent className="skContentMargin">
                  <div className="pl-3">
                    <div className="d-flex flex-row align-items-center justify-content-start">                    
                      <Typography variant="h6" component="h1" className="text-first font-weight-bold" >
                      <StringComponent string={HomePage2.string1}/> {/* String1 */}
                      </Typography>   
                      <div className="badge badge-success m-1 ml-2 badge-inner live">
                        <StringComponent string={HomePage2.string35} />
                      </div> {/* DONE */}     
                    </div>         
                    <Typography><StringComponent string={HomePage2.string2}/>{/* String2 */}
                    <a target="_blank" href="https://youtu.be/K5irQgiajDc?t=32" className="ml-1" style={{ cursor: "help" }}>
                        9000
                    </a>
                    </Typography>
                    <Typography><StringComponent string={HomePage2.string3}/></Typography> {/* String3 */}
                    <Typography><StringComponent string={HomePage2.string4}/></Typography> {/* string4 */}
                  </div>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot className="bg-sidekick-green btn-icon mx-auto mx-lg-0 text-white font-size-xl d-50 skDotBorder">
                    <img alt="SideKick" src={miniLogo} className="miniSKLogo app-nav-logo--text pl-0" />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent className="skContentMargin">
                  <div className="pl-3">
                    <div className="d-flex flex-row align-items-center justify-content-end">        
                      <Typography variant="h6" component="h1" className="text-first font-weight-bold" >
                        <StringComponent string={HomePage2.string5}/> {/* string5 */}
                      </Typography>
                      <div className="badge badge-success m-1 ml-2 badge-inner live">
                        <StringComponent string={HomePage2.string35} />
                      </div> {/* DONE */}     
                    </div>   
                    <Typography><StringComponent string={HomePage2.string6}/></Typography> {/* string6 */}
                    <Typography><StringComponent string={HomePage2.string4}/></Typography> {/* string4 AGAIN */}
                  </div>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot className="bg-sidekick-green btn-icon mx-auto mx-lg-0 text-white font-size-xl d-50 skDotBorder">
                    <AssignmentOutlinedIcon />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent className="skContentMargin">
                  <div className="pl-3">
                    <div className="d-flex flex-row align-items-center justify-content-start">    
                      <Typography variant="h6" component="h1" className="text-first font-weight-bold" >
                        <StringComponent string={HomePage2.string7}/> {/* string7 */}
                      </Typography>
                      <div className="badge badge-success m-1 ml-2 badge-inner live">
                        <StringComponent string={HomePage2.string35} />
                      </div> {/* DONE */}     
                    </div>
                    <Typography><StringComponent string={HomePage2.string8}/></Typography> {/* string8 */}
                    <Typography><StringComponent string={HomePage2.string9}/></Typography> {/* string9 */}
                  </div>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot className="bg-sidekick-green btn-icon mx-auto mx-lg-0 text-white font-size-xl d-50 skDotBorder">
                    <TrackChangesRoundedIcon />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent className="skContentMargin">
                  <div className="pl-3">
                    <div className="d-flex flex-row align-items-center justify-content-end">  
                      <Typography variant="h6" component="h1" className="text-first font-weight-bold" >
                        <StringComponent string={HomePage2.string10}/> {/* string10 */}
                      </Typography>
                      <div className="badge badge-success m-1 ml-2 badge-inner live">
                        <StringComponent string={HomePage2.string35} />
                      </div> {/* DONE */}     
                    </div>
                    <Typography><StringComponent string={HomePage2.string11}/></Typography> {/* string11 */}
                    <Typography><StringComponent string={HomePage2.string12}/></Typography>{/* string12 */}
                    <Typography><StringComponent string={HomePage2.string9}/></Typography>{/* String9 again */}
                  </div>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot className="bg-sidekick-green btn-icon mx-auto mx-lg-0 text-white font-size-xl d-50 skDotBorder">
                    <TrendingUpRoundedIcon />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent className="skContentMargin">
                  <div className="pl-3">
                    <div className="d-flex flex-row align-items-center justify-content-start">                        
                      <Typography variant="h6" component="h1" className="text-first font-weight-bold" >
                        <StringComponent string={HomePage2.string13}/> {/* string13 */}
                      </Typography>
                      <div className="badge badge-success m-1 ml-2 badge-inner live">
                        <StringComponent string={HomePage2.string35} />
                      </div> {/* DONE */}     
                    </div>
                    <Typography><StringComponent string={HomePage2.string14}/></Typography> {/* string14 */}
                    <Typography><StringComponent string={HomePage2.string15}/></Typography> {/* string15 */}
                    <Typography><StringComponent string={HomePage2.string9}/></Typography> {/* string9 Again */}
                  </div>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot className="bg-sidekick-green btn-icon mx-auto mx-lg-0 text-white font-size-xl d-50 skDotBorder">
                    <VerifiedUserOutlinedIcon />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent className="skContentMargin">
                  <div className="pl-3">
                    <div className="d-flex flex-row align-items-center justify-content-end">  
                      <Typography variant="h6" component="h1" className="text-first font-weight-bold" >
                        <StringComponent string={HomePage2.string22}/> {/* string22 */}
                      </Typography>
                      <div className="badge badge-success m-1 ml-2 badge-inner live">
                        <StringComponent string={HomePage2.string35} />
                      </div> {/* DONE */}     
                    </div>
                    <Typography><StringComponent string={HomePage2.string18}/></Typography>{/* string18 */}
                    <Typography><StringComponent string={HomePage2.string23}/></Typography>{/* string23 */}
                    <Typography><StringComponent string={HomePage2.string9}/></Typography> {/* string9 again */}
                  </div>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot className="bg-sidekick-green btn-icon mx-auto mx-lg-0 text-white font-size-xl d-50 skDotBorder">
                    <VoiceChatOutlinedIcon />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent className="skContentMargin">
                  <div className="pl-3">
                    <Typography variant="h6" component="h1" className="text-first font-weight-bold" >
                    <StringComponent string={HomePage2.string24}/> {/* string24 */}
                  </Typography>
                    <Typography><StringComponent string={HomePage2.string25}/></Typography> {/* string25 */}
                    <Typography><StringComponent string={HomePage2.string9}/></Typography> {/* string9 again */}
                  </div>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot className="bg-sidekick-green btn-icon mx-auto mx-lg-0 text-white font-size-xl d-50 skDotBorder">
                    <img alt="SideKick" src={miniLogo} className="miniSKLogo app-nav-logo--text pl-0" />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent className="skContentMargin">
                  <div className="pl-3">
                    <Typography variant="h6" component="h1" className="text-first font-weight-bold" >
                    <StringComponent string={HomePage2.string20}/> {/* string20 */}
                  </Typography>
                    <Typography><StringComponent string={HomePage2.string36}/></Typography> {/* string36 */}
                    <Typography><StringComponent string={HomePage2.string37}/></Typography> {/* string37 */}
                    <Typography><StringComponent string={HomePage2.string9}/></Typography> {/* string9 again */}
                  </div>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot className="bg-sidekick-green btn-icon mx-auto mx-lg-0 text-white font-size-xl d-50 skDotBorder">
                    <EmojiPeopleOutlinedIcon />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent className="skContentMargin">
                  <div className="pl-3">
                    <Typography variant="h6" component="h1" className="text-first font-weight-bold" >
                    <StringComponent string={HomePage2.string21}/> {/* string21 */}
                  </Typography>
                    <Typography><StringComponent string={HomePage2.string38}/></Typography> {/* string38 */}  
                    <Typography><StringComponent string={HomePage2.string39}/></Typography> {/* string39 */}                     
                    <Typography><StringComponent string={HomePage2.string27}/></Typography> {/* string9 again */}
                  </div>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot className="bg-sidekick-green btn-icon mx-auto mx-lg-0 text-white font-size-xl d-50 skDotBorder">
                    <AndroidOutlinedIcon />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent className="skContentMargin">
                  <div className="pl-3">
                    <Typography variant="h6" component="h1" className="text-first font-weight-bold" >
                    <StringComponent string={HomePage2.string26}/> {/* string26 */}
                  </Typography>
                    <Typography><StringComponent string={HomePage2.string40}/></Typography> {/* string40 */}
                    <Typography><StringComponent string={HomePage2.string27}/></Typography> {/* string27 */}
                  </div>
                </TimelineContent>
              </TimelineItem> 
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot className="bg-sidekick-green btn-icon mx-auto mx-lg-0 text-white font-size-xl d-50 skDotBorder">
                    <PeopleOutlineRoundedIcon />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent className="skContentMargin">
                  <div className="pl-3">
                    <Typography variant="h6" component="h1" className="text-first font-weight-bold" >
                    <StringComponent string={HomePage2.string31}/> {/* string31 */}
                  </Typography>
                    <Typography><StringComponent string={HomePage2.string41}/></Typography> {/* string41 */}                        
                    <Typography><StringComponent string={HomePage2.string27}/></Typography> {/* string27 again */}
                  </div>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem className="mb-7">
                <Typography variant="h6" component="h1" className="text-first font-weight-bold skTimelineEnd" >
                <StringComponent string={HomePage2.string34}/> {/* string34 */}
                </Typography>
              </TimelineItem>
            </Timeline>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
