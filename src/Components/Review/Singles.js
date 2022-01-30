import { useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import Row from '../Row/Row';
import { genCodes } from '../../utils';

export default function Singles(props) {
	const { excerpts } = props;
	const codeLabels = useSelector((state) => state.context.codeLabels);
	const { handleSingles, clicked } = useSelector((state) => state.reviews);
	const codes = excerpts ? genCodes(codeLabels, excerpts) : [];
	return (
		<div>
			<h2>Singles</h2>
			{codes.length > 0 &&
				codes.map((code, codeNum) => (
					<Row
						component={
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
}
