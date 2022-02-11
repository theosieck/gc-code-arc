import { useState } from 'react';
import Grid from '@mui/material/Grid';
import PresentResp from '../PresentResp/PresentResp';
import Codes from '../Codes/Codes';

export default function PresentRespAndCodes (props) {
	const {codes, excerpts, rows, setCodes, setExcerpts, setRows} = props;

	const [activeSelect, setActiveSelect] = useState('');

	const handleCodeButton = (code) => {
		if (code) {
			const codeKey = isNaN(code[1]) ? code[0] : code[0] + code[1];
			const selection = activeSelect ? activeSelect : 'No selection';
			setRows(
				rows
					.filter((row) => row.code != code)
					.concat({
						text: selection,
						code: code
					})
			);
			setActiveSelect('');
			codes[codeKey] = 1;
			setCodes(codes);
			excerpts[codeKey] = selection;
			setExcerpts(excerpts);

			if (document.getSelection) {
				if (document.getSelection().removeAllRanges) {
					document.getSelection().removeAllRanges();
				}
			} else if (document.selection) {
				if (document.selection.empty) {
					document.selection.empty();
				}
			} else {
				console.log('no empty function');
			}
		}
	};

	return (<div style={{marginTop: '50px'}}>
		<Grid container direction="row" justify="space-between" alignItems="flex-start">
			<Grid item xs={8} zeroMinWidth>
				<PresentResp handleSelection={setActiveSelect} />
			</Grid>
			<Grid item xs={4}>
				<Codes handleCodeButton={handleCodeButton} />
			</Grid>
		</Grid>
	</div>);
}