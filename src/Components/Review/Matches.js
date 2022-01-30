import { useSelector } from 'react-redux';
import Row from '../Row/Row';
import MatchButton from './MatchButton';
import { genMatches } from '../../utils';

export default function Matches(props) {
	const { matches } = props;
	const codeLabels = useSelector((state) => state.context.codeLabels);
	let matchedCodes = [];
	let numMatches = 0;
	// wait for codeLabels to load before doing the matches
	if (codeLabels && matches) {
		matchedCodes = genMatches(codeLabels, matches);
		numMatches = matchedCodes[0];
	}
	let displayed = 0;

	return (
		<div style={{ marginTop: '50px' }}>
			<h2>Matches:</h2>
			{numMatches > 0 &&
				matchedCodes.map((match, codeNum) => {
					if (codeNum > 0) {
						displayed++;
						return (
							<div>
								<Row
									component={<MatchButton judgNum={1} codeNum={codeNum} match={match} />}
									selection={match[0][1]}
								/>
								<Row
									component={<MatchButton judgNum={2} codeNum={codeNum} match={match} />}
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
}
