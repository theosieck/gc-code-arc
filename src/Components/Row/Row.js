import Grid from '@mui/material/Grid';

export default function Row(props) {
	const { component, selection } = props;
	return (
		<Grid container alignItems="center" style={{ marginBottom: '10px' }} spacing={1}>
			<Grid container item alignItems="center" xs={4} zeroMinWidth>
				{component}
			</Grid>
			<Grid item xs={8} zeroMinWidth>
				{selection}
			</Grid>
		</Grid>
	);
}
