import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactHtmlParser from 'react-html-parser';
import Matches from '../Components/Review/Matches';
import Singles from '../Components/Review/Singles';
import { Alert } from '@mui/material';

export default function ReviewBox(props) {
	// reviewSet = singles, matches = matches
	const { reviewSet, handleNext, matches, judge1Comments, judge2Comments } = props;
	const [clicked, setClicked] = useState([-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]);
	const [matchExcerpts, setMatchExcerpts] = useState([]);
	const [error, setError] = useState(false);
	// retrieve stored redux data
	const { response, respTitle } = useSelector((state) => state.context);
	const dispatch = useDispatch();
	const divStyle = { marginTop: '50px' };
	console.log(matches, reviewSet);

	const handleSingles = (codeNum,action) => {
		// action is 1 for accept, 0 for reject
		setClicked(clicked.map((num, i) => (i == codeNum ? action : num)));
	};

	const handleRevNext = (e) => {
		e.preventDefault();
		setError(false);
		// make sure all matches were selected and all singles were either accepted or rejected
		const singleCodes = reviewSet ? Object.keys(reviewSet) : [];
		const matchCodes = matches ? Object.keys(matches) : [];
		const totalCodes = singleCodes + matchCodes;
		for (let codeNum of totalCodes) {
			if (clicked[codeNum]<0) {
				setError(singleCodes.includes(codeNum) ? 'Please accept or reject each single.' : 'Please select an excerpt for each match.');
				return;
			}
		};
		const excerpts = [];
		// grab all the chosen excerpts - from reviewSet if the code is a single or matchExcerpts if it's a match
		clicked.forEach((codeNum, i) =>
			codeNum == 1 ? (excerpts[i] = reviewSet[i]) : (excerpts[i] = matchExcerpts[i])
		);
		const tmpClicked = [];
		// set all 'match' clicks to 1 and ignored ones to 0 for data storage, fill null spaces in excerpts with ''
		excerpts.forEach((excerpt, i) => {
			if (excerpt) tmpClicked[i] = 1;
			else {
				excerpts[i] = '';
				tmpClicked[i] = 0;
			}
		});
		// reset state
		setClicked([-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]);
		setMatchExcerpts([]);
		// pass the excerpts and chosen codes up
		handleNext(excerpts, tmpClicked);
	};

	const handleMatches = (codeNum,excerptNum) => {
		// excerptNum = 1 (for judge 1) or 2 (for judge 2)
		// toggle "clicked" to be 2 or 3 (so we know later whether the click was a match or a single)
		setClicked(clicked.map((num, i) => (i == codeNum ? (num == excerptNum + 1 ? 0 : excerptNum + 1) : num)));
		// store the chosen excerpt
		matchExcerpts[codeNum] = matches[codeNum][excerptNum - 1];
		setMatchExcerpts(matchExcerpts);
	};

	dispatch({
		type: 'SET_REVIEW',
		payload: {
			handleSingles,
			handleMatches,
			clicked
		}
	});

	return (
		<div>
			<div style={divStyle}>
				<h2>{respTitle}</h2>
				{ReactHtmlParser(response)}
			</div>
			<div style={divStyle}>
				{judge1Comments && (
					<div>
						<h2>Judge 1's Comments:</h2>
						<p>{ReactHtmlParser(judge1Comments)}</p>
					</div>
				)}
				{judge2Comments && (
					<div>
						<h2>Judge 2's Comments:</h2>
						<p>{ReactHtmlParser(judge2Comments)}</p>
					</div>
				)}
				<Singles excerpts={reviewSet} />
				<Matches matches={matches} />
			</div>
			<button onClick={handleRevNext}>Next</button>
			{error && <Alert severity="error" sx={{fontSize: '1.75rem', marginTop: '5px'}}>{error}</Alert>}
		</div>
	);
}
