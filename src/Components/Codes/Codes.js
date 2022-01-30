import { useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

export default function Codes(props) {
	const { handleCodeButton } = props;
	// retrieve stored redux data
	const codeLabels = useSelector((state) => state.context.codeLabels);

	const divStyles = {
		border: '1px solid black',
		padding: '5px'
	};

	const handleButton = (e) => {
		e.preventDefault();
		handleCodeButton(e.target.textContent);
	};

	return (
		<div>
			<Grid container direction="column" justify="flex-start" alignItems="center">
				<h2>Codes:</h2>
				<div style={divStyles}>
					{codeLabels &&
						codeLabels.map((code, i) => (
							<Button
								variant="outlined"
								style={{
									marginBottom: '5px',
									display: 'block',
									fontSize: '14px'
								}}
								onClick={handleButton}
							>
								{i}. {code}
							</Button>
						))}
				</div>
			</Grid>
		</div>
	);
}
