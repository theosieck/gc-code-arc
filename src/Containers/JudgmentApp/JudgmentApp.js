// respObj imported from php
//   respIds responses cDefinitions cTitles sContent sTitle

// const { Component } = wp.element;
//import './judgmentapp.scss';

import { useEffect, useState } from 'react';

import PresentContext from '../../Components/PresentContext/PresentContext';
import ShowEnd from '../../Components/ShowEnd/ShowEnd';
import ReviewBox from '../ReviewBox/ReviewBox';
import JudgmentBox from '../JudgmentBox/JudgmentBox';

export default function JudgmentApp () {
    // initial variables
    const review = respObj.review == '1';
    const nTrials = respObj.respIds.length;
    const numCodes = respObj.numCodes;
    
    // Tracks various attributes and their changes as the user moves through the trials
    const [trial, setTrial] = useState(1);   // Each judgment is one trial
    const [respId, setRespId] = useState(respObj.respIds[0]);   // The ID of the Response being judged
    const [startTime, setStartTime] = useState(0);
    const [allDone, setAllDone] = useState(false); // Whether the 'ShowEnd' component should be displayed
    const [codes,setCodes] = useState([]);

    // set startTime and codes on initial render only
    useEffect(() => {
        const startDate = Date.now();
        setStartTime(Math.floor(startDate / 1000)); // UNIX time on page load in seconds

        let tmpCodes = [];
        for(let i=1;i<=numCodes;i++) {
            tmpCodes[i] = respObj.codeLabels[i];
        }
        setCodes(tmpCodes);
    }, []);

    /**
     * handleNext: checks whether the user is finished with the current set, saves the current line to
     *      the database, and sets the new startTime
     * Parameters: none
     * Fires: when the user clicks the 'Next' button
     */
    const handleNext = (excerpts,codes,comment) => {
        // Check whether the user has finished all the trials
        if (trial < nTrials) {
            setTrial(trial+1);
            getCase();
        } else {
            setAllDone(true);
        }

        const endDate = Date.now();
        const endTime = Math.floor(endDate / 1000);
        const judgTime = endTime - startTime;

        let codesArray = []
        for(let i=1;i<=numCodes;i++) {
            codesArray[i] = [codes[i],excerpts[i]]
        }

		console.log(codesArray);

        var dataObj = {
            sub_num: respObj.subNums[trial-1],
            comp_num: respObj.compNum,
            task_num: respObj.taskNum,
            resp_id: respId,
            judg_type: review ? 'rev' : 'ind',
            judg_time: judgTime,
            codes: codesArray,
            judges: respObj.judges,
            code_scheme: respObj.codeScheme,
            comment
        };
        console.log(dataObj)

        // Save to DB
        saveData(dataObj);
        // // Check if there's anything in localStorage - if yes, try to push to DB
        if(localStorage.length != 0) {
            var keys = Object.keys(localStorage);
            keys.forEach((key) => {
                if(localStorage.getItem(key)!=null && localStorage.getItem(key)!=undefined && localStorage.getItem(key)!="") {
                    var localObj = JSON.parse(localStorage.getItem(key));
                    localObj._ajax_nonce = respObj.nonce;
                    // Save to DB
                    saveData(localObj,key);
                } else {
                    console.log(typeof key);
                }
            } );
        }

        // Set new start time
        const newStartDate = Date.now();
        const newStartTime = Math.floor(newStartDate / 1000);
        setStartTime(newStartTime);
    }

    /**
     * getCase: gets the new Response ID
     * Parameters: none
     * Fires: inside handleNext
     */
    const getCase = () => {
        setRespId(respObj.respIds[trial - 1]);
    }

    /**
     * Saves the given dataObj to the database
     */
    const saveData = (dataObj,key = null) => {
        dataObj.action = 'arc_save_data';
        dataObj._ajax_nonce = respObj.nonce;

        jQuery.ajax({
            type : 'post',
            dataType: 'json',
            url : respObj.ajax_url,
            data : dataObj,
            error : function( response ) {
                console.log("something went wrong (error case)");
                // save to localStorage
                localStorage.setItem(JSON.stringify(dataObj.resp_id),JSON.stringify(dataObj));
            },
            success : function( response ) {
                if( response.type == 'success' && dataObj.sub_num == response.data.sub_num) {
                    console.log('success!');
                    if(key) {
                        localStorage.removeItem(key);
                    }
                } else {
                    console.log("something went wrong");
                    // save to localStorage
                    localStorage.setItem(JSON.stringify(dataObj.resp_id),JSON.stringify(dataObj));
                }
            }
        });
    }

    /**
     * Renders the components for JudgmentApp
     */
    return (
        <div>
            { allDone && <ShowEnd />}
            {!allDone &&
                <PresentContext
                    scenario={respObj.sContent}
                    competencies={respObj.cDefinitions}
                    sTitle={respObj.sTitle}
                    cTitles={respObj.cTitles}
                />
            }
            { (!allDone && !review) &&
                <JudgmentBox
                    respId={ respId }
                    response={ respObj.responses[respId] }
                    codes={codes}
                    handleNext={handleNext}
                    resultsObj={respObj.resultsObj}
                />
            }
            { (!allDone && review) &&
                <ReviewBox
                    respId={ respId }
                    response={ respObj.responses[respId] }
                    codes={codes}
                    handleNext={handleNext}
                    reviewSet={respObj.reviewSet[respObj.subNums[trial-1]]}
                    matches={respObj.matches[respObj.subNums[trial-1]]}
                    judge1Comments={respObj.judge1Comments[respId]}
                    judge2Comments={respObj.judge2Comments[respId]}
                />
            }
        </div>
    );
}
