/* respObj imported from php */
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PresentContext from '../Components/PresentContext/PresentContext';
import ShowEnd from '../Components/ShowEnd/ShowEnd';
import ReviewBox from './ReviewBox';
import JudgmentBox from './JudgmentBox';

export default function JudgmentApp() {
	console.log(respObj);
	// initial variables
	const review = respObj.review == '1';
	const nTrials = respObj.respIds.length;
	const numCodes = respObj.numCodes;

	// Tracks various attributes and their changes as the user moves through the trials
	const [trial, setTrial] = useState(1); // Each judgment is one trial
	const [respId, setRespId] = useState(respObj.respIds[0]); // The ID of the Response being judged
	const [startTime, setStartTime] = useState(0);
	const [allDone, setAllDone] = useState(false); // Whether the 'ShowEnd' component should be displayed

	const dispatch = useDispatch();

	// set startTime and codes and store in redux on initial render only
	useEffect(() => {
		// get start date/time
		const startDate = Date.now();
		setStartTime(Math.floor(startDate / 1000)); // UNIX time on page load in seconds

		// init codes
		const codeLabels = [];
		for (let i = 1; i <= numCodes; i++) {
			codeLabels[i] = respObj.codeLabels[i];
		}

		// store codes, responses, respId in redux
		dispatch({
			type: 'SET_CONTEXT',
			payload: {
				respId,
				codeLabels,
				response: respObj.responses[respId],
				respTitle: respObj.respTitles[respId]
			}
		});
	}, []);

	/**
	 * handleNext: checks whether the user is finished with the current set, saves the current line to
	 *      the database, and sets the new startTime
	 * Parameters: none
	 * Fires: when the user clicks the 'Next' button
	 */
	const handleNext = (excerpts, codes, comment) => {
		// Check whether the user has finished all the trials
		if (trial < nTrials) {
			getCase();
		} else {
			setAllDone(true);
		}

		handleSave(excerpts, codes, comment);
	};

	/**
	 * handleSave: preserves the state of the response and calls the saveData object
	 * Parameters:
	 * Fires: inside handleNext, or when the user clicks 'Save' in individual review
	 */
	const handleSave = (excerpts, codes, comment) => {
		const endDate = Date.now();
		const endTime = Math.floor(endDate / 1000);
		const judgTime = endTime - startTime;

		let codesArray = [];
		for (let i = 1; i <= numCodes; i++) {
			codesArray[i] = [codes[i], excerpts[i]];
		}

		// set the judgment type to review if this is a review session, or if an individual is reviewing consensus judgments
		const judgType = (review || (respObj.resultsObj && respObj.resultsObj.rater1)) ? 'rev' : 'ind';

		var dataObj = {
			sub_num: respObj.subNums[trial - 1],
			comp_num: respObj.compNum,
			task_num: respObj.taskNum,
			block_num: respObj.blockNum || 0,	// save block_num, and if it's undefined it's 0
			resp_id: respId,
			judg_type: judgType,
			judg_time: judgTime,
			codes: codesArray,
			judges: respObj.judges,
			code_scheme: respObj.codeScheme,
			comment
		};
		// console.log()

		// Save to DB
		saveData(dataObj);
		// Check if there's anything in localStorage - if yes, try to push to DB
		if (localStorage.length != 0) {
			var keys = Object.keys(localStorage);
			keys.forEach((key) => {
				// make sure it's one of our keys
				if (respObj.respIds.includes(parseInt(key))) {
					if (
						localStorage.getItem(key) != null &&
						localStorage.getItem(key) != undefined &&
						localStorage.getItem(key) != ''
					) {
						var localObj = JSON.parse(localStorage.getItem(key));
						localObj._ajax_nonce = respObj.nonce;
						// Save to DB
						saveData(localObj, key);
					} else {
						console.log(typeof key);
					}
				}
			});
		}

		// Set new start time
		const newStartDate = Date.now();
		const newStartTime = Math.floor(newStartDate / 1000);
		setStartTime(newStartTime);
	}

	/**
	 * getCase: gets the new Response ID and dispatches the new stuff to redux
	 * Parameters: none
	 * Fires: inside handleNext
	 */
	 const getCase = () => {
		const newTrial = trial+1;
		const newRespId = respObj.respIds[trial];	// old trial
		setTrial(newTrial);
		setRespId(newRespId);
		// store codes, responses, respId in redux
		dispatch({
			type: 'UPDATE_CONTEXT',
			payload: {
				respId: newRespId,
				response: respObj.responses[newRespId],
				respTitle: respObj.respTitles[newRespId]
			}
		});
	};

	/**
	 * Saves the given dataObj to the database
	 */
	const saveData = (dataObj, key = null) => {
		dataObj.action = 'arc_save_data';
		dataObj._ajax_nonce = respObj.nonce;

		jQuery.ajax({
			type: 'post',
			dataType: 'json',
			url: respObj.ajax_url,
			data: dataObj,
			error: function (response) {
				console.log('something went wrong (error case)');
				// save to localStorage
				localStorage.setItem(JSON.stringify(dataObj.resp_id), JSON.stringify(dataObj));
			},
			success: function (response) {
				if (response.type == 'success' && dataObj.sub_num == response.data.sub_num) {
					if (key) {
						localStorage.removeItem(key);
					}
				} else {
					console.log('something went wrong');
					console.log(response);
					// save to localStorage
					localStorage.setItem(JSON.stringify(dataObj.resp_id), JSON.stringify(dataObj));
				}
			}
		});
	};

	/**
	 * Renders the components for JudgmentApp
	 */
	return (
		<div>
			{allDone && <ShowEnd />}
			{!allDone && (
				<PresentContext
					scenario={respObj.sContent}
					competency={respObj.cDefinitions[0]}
					sTitle={respObj.sTitle}
					cTitle={respObj.cTitles[0]}
				/>
			)}
			{!allDone && !review && <JudgmentBox handleNext={handleNext} resultsObj={respObj.resultsObj} handleSave={handleSave} />}
			{!allDone && review && (
				<ReviewBox
					handleNext={handleNext}
					reviewSet={respObj.reviewSet[respObj.subNums[trial - 1]]}
					matches={respObj.matches[respObj.subNums[trial - 1]]}
					judge1Comments={respObj.judge1Comments[respId]}
					judge2Comments={respObj.judge2Comments[respId]}
				/>
			)}
		</div>
	);
}
