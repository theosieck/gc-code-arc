import { Grid } from '@mui/material';
import PresentResp from '../../Components/PresentResp/PresentResp';
import Codes from '../Codes/Codes';
import Rows from '../Rows/Rows';
import CommentBox from '../../Components/CommentBox/CommentBox';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function JudgmentBox(props) {
	const [rows, setRows] = useState([]);
	const [activeSelect, setActiveSelect] = useState('');
	const [codes, setCodes] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
	const [excerpts, setExcerpts] = useState(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
	const [doComment, setDoComment] = useState(false);
	const [comment, setComment] = useState('');

	// retrieve stored redux data
	const codeLabels = useSelector((state) => state.codeLabels);

	// initialize base states, if we're getting a specific subject
	useEffect(() => {
		if (props.resultsObj) {
			const results = props.resultsObj;
			const tmpCodes = [];
			const tmpExcerpts = [];
			const tmpRows = [];
			for (let i = 1; i < 16; i++) {
				const codeNum = parseInt(results[`code${i}`]);
				tmpCodes[i] = codeNum;
				tmpExcerpts[i] = results[`excerpt${i}`];
				if (codeNum === 1) {
					tmpRows[i] = {
						text: tmpExcerpts[i],
						code: `${i}. ${codeLabels[i]}`
					};
				}
			}
			const tmpComment = results['judg_comments'];

			setCodes(tmpCodes);
			setExcerpts(tmpExcerpts);
			setRows(tmpRows);
			setDoComment(!!tmpComment);
			setComment(tmpComment);
		}
	}, [props.resultsObj, codeLabels]);

	const divStyle = {
		marginTop: '50px'
	};

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

	const handleSelection = (selection) => {
		setActiveSelect(selection);
	};

	const handleDelete = (e) => {
		e.preventDefault();
		const code = e.target.id;
		const codeKey = isNaN(code[1]) ? code[0] : code[0] + code[1];
		setRows(rows.filter((row) => row.code != code));
		setExcerpts(excerpts.map((excerpt, i) => (i == codeKey ? '' : excerpt)));
		setCodes(codes.map((num, i) => (i == codeKey ? 0 : num)));
	};

	const handleCommentButton = (e) => {
		e.preventDefault();
		setDoComment(!doComment);
		setComment('');
	};

	const handleComment = (comment) => {
		setComment(comment);
	};

	const handleNext = (e) => {
		e.preventDefault();
		setRows([]);
		setActiveSelect('');
		setCodes([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
		setExcerpts(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
		setDoComment(false);
		setComment('');
		props.handleNext(excerpts, codes, comment);
	};

	return (
		<div>
			<div style={divStyle}>
				<Grid container direction="row" justify="space-between" alignItems="flex-start">
					<Grid item xs={8} zeroMinWidth>
						<PresentResp handleSelection={handleSelection} />
					</Grid>
					<Grid item xs={4}>
						<Codes
							handleButton={handleCodeButton}
							state={{
								rows,
								activeSelect,
								codes,
								excerpts,
								doComment,
								comment
							}}
						/>
					</Grid>
				</Grid>
			</div>
			<div style={{ marginTop: '25px' }}>
				{!doComment && <button onClick={handleCommentButton}>Add A Comment</button>}
				{doComment && (
					<CommentBox
						comment={comment}
						handleComment={handleComment}
						handleCommentButton={handleCommentButton}
					/>
				)}
			</div>
			<div style={{ marginTop: '25px' }}>
				<Rows rows={rows} handleDelete={handleDelete} showDelete={true} />
			</div>
			<button style={{ marginTop: '10px' }} onClick={handleNext}>
				Next
			</button>
		</div>
	);
}
