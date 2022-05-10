import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactHtmlParser from 'react-html-parser';
import Matches from '../Components/Review/Matches';
import Singles from '../Components/Review/Singles';

export default function ReviewBox(props) {
	const { reviewSet, handleNext, matches, judge1Comments, judge2Comments } = props;
	const [clicked, setClicked] = useState([-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]);
	const [matchExcerpts, setMatchExcerpts] = useState([]);
	// retrieve stored redux data
	const { response, respTitle } = useSelector((state) => state.context);
	const dispatch = useDispatch();
	const divStyle = { marginTop: '50px' };

	const handleSingles = (codeNum,action) => {
		// action is 1 for accept, 0 for reject
		setClicked(clicked.map((num, i) => (i == codeNum ? action : num)));
	};

	const handleRevNext = (e) => {
		e.preventDefault();
		const excerpts = [];
		clicked.forEach((codeNum, i) =>
			codeNum == 1 ? (excerpts[i] = reviewSet[i]) : (excerpts[i] = matchExcerpts[i])
		);
		const tmpClicked = [];
		excerpts.forEach((excerpt, i) => (excerpt ? (tmpClicked[i] = 1) : (excerpts[i] = '')));
		setClicked([-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]);
		setMatchExcerpts([]);
		handleNext(excerpts, tmpClicked);
	};

	const handleMatches = (codeNum,excerptNum) => {
		setClicked(clicked.map((num, i) => (i == codeNum ? (num == excerptNum + 1 ? 0 : excerptNum + 1) : num)));
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
		</div>
	);
}
