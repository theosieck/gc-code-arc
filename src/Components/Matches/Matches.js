import { Button } from '@mui/material';
import { useSelector } from 'react-redux';
import Row from '../Row/Row';

const genMatches = (codes, matches) => {
	const matchArray = [];
	matchArray[0] = 0;
	for (let i = 1; i <= codes.length; i++) {
		if (matches[i] && matches[i][0] != '' && matches[i][1] != '') {
			matchArray[0]++;
			matchArray[i] = [];
			matchArray[i][0] = [codes[i], matches[i][0]];
			matchArray[i][1] = [codes[i], matches[i][1]];
		}
	}
	return matchArray;
};

const Matches = (props) => {
	const codeLabels = useSelector((state) => state.codeLabels);
	let matches = [];
	let numMatches = 0;
	if (props.matches) {
		console.log(props.matches);
		matches = genMatches(codeLabels, props.matches, props.setMatches);
		numMatches = matches[0];
		console.log(matches);
	}
	let displayed = 0;
	return (
		<div style={{ marginTop: '50px' }}>
			<h2>Matches:</h2>
			{numMatches > 0 &&
				matches.map((match, codeNum) => {
					if (codeNum > 0) {
						displayed++;
						return (
							<div>
								<Row
									code={
										<Button
											variant={props.state.clicked[codeNum] == 2 ? 'contained' : 'outlined'}
											onClick={props.handleButton}
											id={0}
											style={{
												display: 'block',
												fontSize: '14px'
											}}
										>
											{codeNum}. {match[0][0]} - 1
										</Button>
									}
									selection={match[0][1]}
								/>
								<Row
									code={
										<Button
											variant={props.state.clicked[codeNum] == 3 ? 'contained' : 'outlined'}
											onClick={props.handleButton}
											style={{
												display: 'block',
												fontSize: '14px'
											}}
										>
											{codeNum}. {match[1][0]} - 2
										</Button>
									}
									selection={match[1][1]}
								/>
								{displayed < numMatches && (
									<div
										style={{
											borderBottom: '1px solid lightgray'
										}}
									></div>
								)}
							</div>
						);
					}
				})}
			{numMatches <= 0 && <p>No matches to display.</p>}
		</div>
	);
};

export default Matches;
