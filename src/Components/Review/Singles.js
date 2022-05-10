import { useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import Row from '../Row/Row';
import { genCodes } from '../../utils';

export default function Singles(props) {
	const { excerpts } = props;
	const codeLabels = useSelector((state) => state.context.codeLabels);
	const { handleSingles, clicked } = useSelector((state) => state.reviews);
	console.log(excerpts, codeLabels);
	const codes = (excerpts && codeLabels) ? genCodes(codeLabels, excerpts) : [];
	return (
		<div>
			<h2>Singles</h2>
			{codes.length > 0 &&
				codes.map((code, codeNum) => (
					<Grid container alignItems="center" style={{ marginBottom: '10px' }} spacing={1}>
						<Grid container item alignItems="center" justifyContent="space-around" xs={1.5} zeroMinWidth>
							<Button
								variant={clicked[codeNum] == 1 ? 'contained' : 'outlined'}
								onClick={() => {handleSingles(codeNum,1)}}
								// style={{ display: 'block', fontSize: '14px' }}
								color="success"
								size="large"
							>
								<CheckIcon onClick={() => {handleSingles(codeNum,1)}} />
							</Button>
							<Button
								variant={clicked[codeNum] == 0 ? 'contained' : 'outlined'}
								onClick={() => {handleSingles(codeNum,0)}}
								// style={{ display: 'block', fontSize: '14px' }}
								color="error"
								size="large"
							>
								<CloseIcon onClick={() => {handleSingles(codeNum,0)}} />
							</Button>
						</Grid>
						<Grid item xs={2.5} zeroMinWidth>
							{codeNum}. {code[0]}
						</Grid>
						<Grid item xs={8} zeroMinWidth>
							{code[1]}
						</Grid>
					</Grid>
				))}
			{codes.length <= 0 && <p>No singles to compare.</p>}
		</div>
	);
}
