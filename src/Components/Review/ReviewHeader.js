import { useSelector } from 'react-redux';
import { Button, Grid } from '@mui/material';

export default function ReviewHeader () {
	const { respTitle } = useSelector((state) => state.context);
	const { completedCases } = useSelector((state) => state.reviews);

	const restartComparison = () => {
		// if there aren't any completed cases yet, just refresh
		if (completedCases.length<1) window.location.reload();

		// otherwise send an ajax request to the back end to delete all completed cases from the database'
		const reqData = {
			action: 'arc_reset_data',
			_ajax_nonce: respObj.resetNonce,
			completed_cases: completedCases
		}

		jQuery.ajax({
			type: 'post',
			dataType: 'json',
			url: respObj.ajax_url,
			data: reqData,
			error: function (response) {
				console.log('something went wrong (error case)');
				console.log(response);
				// TODO
			},
			success: function (response) {
				if (response.type == 'success') {
					// refresh the page to restart the session
					window.location.reload();
				} else {
					console.log('something went wrong');
					console.log(response);
					// TODO
				}
			}
		});
	}

	return (
		<Grid container>
			<Grid item xs={6}>
				<h2>{respTitle}</h2>
			</Grid>
			<Grid item xs={6}>
				<Button variant='outlined' color='error' onClick={restartComparison}>Fresh Restart</Button>
			</Grid>
		</Grid>
	);
}