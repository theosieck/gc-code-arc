import { Grid } from '@mui/material';

export default function Row (props) {
	return (
		<Grid container alignItems="center" style={{ marginBottom: '10px' }} spacing={1}>
			<Grid container item alignItems="center" xs={4} zeroMinWidth>
				{props.component}
			</Grid>
			<Grid item xs={8} zeroMinWidth>
				{props.selection}
			</Grid>
		</Grid>
	);
}
