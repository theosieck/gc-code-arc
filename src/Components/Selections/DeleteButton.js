import Grid from '@mui/material/Grid';
import CloseIcon from '@mui/icons-material/Close';

const buttonStyles = {
	backgroundColor: 'white',
	color: 'red',
	width: '1vw',
	padding: '1px'
};

export default function DeleteButton(props) {
	const { code, handleDelete } = props;

	return (
		<>
			<Grid item xs={3}>
				<button
					style={buttonStyles}
					onClick={(e) => {
						handleDelete(e, code);
					}}
				>
					<CloseIcon fontSize="large" />
				</button>
			</Grid>
			<Grid item xs={9}>
				{code}
			</Grid>
		</>
	);
}
