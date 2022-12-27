import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Container, Card, Button, TextField } from '@material-ui/core';
import { useStoreState, useStoreActions, useStore } from 'easy-peasy';
import { useWallet } from 'use-wallet';
import StringComponent from '../../StringComponent';
import Strings from '../../../config/localization/translations';
import sideKickGif from 'assets/images/sidekick/animation/Sidekick_transparent_large.gif';

export default function FeedbackForm() {
    const validEmail = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    const [emailError, setEmailError] = useState(false);
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [finalFeedback, setFinalFeedback] = useState(null);
    const [complete, setComplete] = useState(false);
    const { firebase } = useStoreState((state) => state.Dapp);
    const { selectedLangauge } = useStoreState((state) => state.Dapp);

    const wallet = useWallet();

    const handleChange = (e) => {
        if (e.target.id === "email") {
            setEmailError(!validEmail.test(email));
            setEmail(e.target.value);
        }
        else if (e.target.id === "subject") {
            setSubject(e.target.value);
        }
        else if (e.target.id === "message") {
            setMessage(e.target.value);
        }
    }

    const sendFeedback = (e) => {
        if (!emailError && email != "") {
            let walletAccount = null;
            if (wallet != undefined && wallet.account != null) {
                walletAccount = wallet.account;
            }
            setFinalFeedback({ wallet: walletAccount, email, subject, message });
        }
    }

    useEffect(() => {
        async function sendFeedback() {
            if (firebase != undefined && firebase.db && finalFeedback != null) {
                console.log(finalFeedback);
                await firebase.db.collection('feedback').doc(email).set(finalFeedback);

                setSubject("");
                setEmail("");
                setMessage("");
                setComplete(true);
            }
        }
        sendFeedback();
    }, [finalFeedback]);

    const feedBackStrings = Strings.FeedBackStrings;

    const feedbackInputBoxString = (String) => {
        return (
            <StringComponent string={feedBackStrings.string2} />
        );
    };

    const getString = (jsonPath, langaugeId) => {
        //console.log(Strings);
        return jsonPath[langaugeId] === '' ? jsonPath[1] : jsonPath[langaugeId];
    }

    return (
        <>
            <Container>
                {complete ? (
                    <div className="d-flex justify-content-center skEventZ">
                        <Card className="p-4 bg-first text-white w-50">
                            <div className="display-4 line-height-1 font-weight-bold mr-3 d-flex justify-content-center text-center">
                                <StringComponent string={feedBackStrings.string1} />
                            </div>
                            <Grid container spacing={10} className="justify-content-between">
                                <Grid item>
                                </Grid>
                            </Grid>
                        </Card>
                    </div>
                ) : (

                    <div className="d-flex justify-content-center skEventZ">
                        <Card className="py-4 px-6 bg-first text-white w-50">
                            <div className="display-4 line-height-1 font-weight-bold mr-3 d-flex justify-content-center text-center">
                                <StringComponent string={feedBackStrings.string2}/>
                            </div>
                            <div className="my-4 eventMainDivider" />
                            <div> 
                                <div>
                                    {emailError ? (
                                        <>
                                            <TextField
                                                id="email"
                                                error
                                                placeholder={getString(feedBackStrings.string3, selectedLangauge)}
                                                value={email}
                                                onChange={handleChange}
                                                onMouseUp={handleChange}
                                                onKeyUp={handleChange}
                                            ></TextField>
                                            <div className="errorEmail"><StringComponent string={feedBackStrings.InvalidEmail}/></div>
                                            <div className="font-weight-bold opacity-7 text-uppercase pt-2 pb-3">
                                            <StringComponent string={feedBackStrings.string3}/>
                                        </div>
                                        </>
                                    ) : (
                                        <>
                                            <TextField
                                                id="email"
                                                required
                                                placeholder={getString(feedBackStrings.string3, selectedLangauge)}
                                                value={email}
                                                onChange={handleChange}
                                            ></TextField>
                                            <div className="font-weight-bold opacity-7 text-uppercase pt-2 pb-3">
                                            <StringComponent string={feedBackStrings.string3}/>
                                        </div></>)
                                    }
                                </div>                     
                                <div>                    
                                    <TextField
                                        id="subject"
                                        fullWidth={true}
                                        placeholder={getString(feedBackStrings.string7, selectedLangauge)}
                                        value={subject}
                                        onChange={handleChange}
                                        InputProps={{
                                            style: {
                                                color: 'white'
                                            }
                                        }}></TextField>
                                    <div className="font-weight-bold opacity-7 text-uppercase pt-2 pb-3">
                                    <StringComponent string={feedBackStrings.string4}/>
                                    </div>
                                </div>  
                                <div>                         
                                    <TextField
                                        id="message"
                                        multiline
                                        placeholder={getString(feedBackStrings.string8, selectedLangauge)}
                                        rows={6}
                                        fullWidth={true}            
                                        value={message}
                                        onChange={handleChange}      
                                    ></TextField>
                                    <div className="font-weight-bold opacity-7 text-uppercase pt-2 pb-3">
                                    <StringComponent string={feedBackStrings.string5}/>
                                    </div>                             
                                </div>                    
                                <div className="d-flex justify-content-center">
                                    <div className="pt-4 pb-3">
                                        <Button
                                            size="large"
                                            className="btn-success font-weight-bold"
                                            onClick={sendFeedback}>
                                            <span className="btn-wrapper--label text-uppercase font-weight-bold text-primary">
                                            <StringComponent string={feedBackStrings.string6}/></span>
                                        </Button>
                                    </div>
                                </div>
                            </div>     
                        </Card>
                    </div >
                )}
            </Container>        
            <div className="body-content">
                <div className="content">
                    <img src={sideKickGif} alt="SideKick Mascot" className="skMascotProfile" />
                </div>
            </div>
        </>
    );
}
