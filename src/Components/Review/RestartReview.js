import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Button, Grid } from '@mui/material';

export default function RestartReview () {
	const [error, setError] = useState(false);
	const { completedCases } = useSelector((state) => state.reviews);

	const restartComparison = () => {
		// if there aren't any completed cases yet, just refresh
		if (completedCases.length<1) window.location.reload();

		// otherwise send an ajax request to the back end to delete all completed cases from the database'
		setError(false);
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
				setError(response.statusText + ': ' + response.responseText);
			},
			success: function (response) {
				if (response.type == 'success') {
					// refresh the page to restart the session
					window.location.reload();
				} else {
					console.log('something went wrong');
					console.log(response);
					setError(response.message || 'Something went wrong. Please try again.');
				}
			}
		});
	}

	return (<>
		<Grid container>
			<Grid item xs={11} />
			<Grid item xs={1}>
				<Button
					variant='outlined'
					color='error'
					size='large'
					sx={{fontSize:'1.5rem'}}
					onClick={restartComparison}
				>Restart</Button>
			</Grid>
		</Grid>
		{error && <Alert severity="error" sx={{fontSize: '1.75rem', marginTop: '5px'}}>{error}</Alert>}
	</>
	);
}