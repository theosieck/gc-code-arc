import { useSelector } from "react-redux";
import { Button } from "@mui/material";

export default function MatchButton (props) {
	const {judgNum, codeNum, match} = props;
	const {handleMatches, clicked} = useSelector((state) => state.reviews);

	return (
		<Button
			variant={clicked[codeNum] == judgNum+1 ? 'contained' : 'outlined'}
			onClick={handleMatches}
			id={judgNum-1}
			style={{
				display: 'block',
				fontSize: '14px'
			}}
		>
			{codeNum}. {match[judgNum-1][0]} - {judgNum}
		</Button>
	);
}