import { useSelector } from 'react-redux';
import { Button, Grid } from '@mui/material';

export default function Codes(props) {
	// retrieve stored redux data
	const codeLabels = useSelector((state) => state.codeLabels);
	console.log(codeLabels);

	const divStyles = {
		border: '1px solid black',
		padding: '5px'
	};

	const handleButton = (e) => {
		e.preventDefault();
		props.handleButton(e.target.textContent);
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
