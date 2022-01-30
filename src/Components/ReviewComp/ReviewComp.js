import { Button } from '@mui/material';
import { useSelector } from 'react-redux';
import Row from '../Row/Row';

const genCodes = (codes, excerpts) => {
	const codeArray = [];
	for (let i = 1; i <= codes.length; i++) {
		if (excerpts[i]) {
			codeArray[i] = [codes[i], excerpts[i]];
		}
	}
	return codeArray;
};

const ReviewComp = (props) => {
	const codeLabels = useSelector((state) => state.context.codeLabels);
	const {handleSingles, clicked} = useSelector((state) => state.reviews);
	let codes = [];
	if (props.excerpts) {
		codes = genCodes(codeLabels, props.excerpts);
	}
	return (
		<div>
			<h2>Singles</h2>
			{codes.length > 0 &&
				codes.map((code, codeNum) => (
					<Row
						code={
							<Button
								variant={clicked[codeNum] == 1 ? 'contained' : 'outlined'}
								onClick={handleSingles}
								style={{ display: 'block', fontSize: '14px' }}
							>
								{codeNum}. {code[0]}
							</Button>
						}
						selection={code[1]}
					/>
				))}
			{codes.length <= 0 && <p>No singles to review.</p>}
		</div>
	);
};

export default ReviewComp;
