import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Selections from '../Components/Selections/Selections';
import CommentBox from '../Components/CommentBox/CommentBox';
import PresentRespAndCodes from '../Components/PresentRespAndCodes/PresentRespAndCodes';
import { setUpIndRev } from '../utils';
import CircularProgress from '@mui/material/CircularProgress';
import CheckIcon from '@mui/icons-material/Check';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function JudgmentBox(props) {
	const { resultsObj, handleNext, handleSave, progress } = props;
	const [rows, setRows] = useState([]);
	const [codes, setCodes] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
	const [excerpts, setExcerpts] = useState(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
	const [doComment, setDoComment] = useState(false);
	const [comment, setComment] = useState('');
	const [saving, setSaving] = useState(undefined);

	// retrieve stored redux data
	const codeLabels = useSelector((state) => state.context.codeLabels);

	// initialize base states, if we're getting a specific subject
	useEffect(() => {
		if (resultsObj && codeLabels) {
			const { tmpCodes, tmpExcerpts, tmpRows, tmpComment } = setUpIndRev(resultsObj, codeLabels);
			setCodes(tmpCodes);
			setExcerpts(tmpExcerpts);
			setRows(tmpRows);
			setDoComment(!!tmpComment);
			setComment(tmpComment);
		}
	}, [resultsObj, codeLabels]);

	const handleDelete = (e, code) => {
		e.preventDefault();
		console.log(e, code);
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

	const saveData = (e) => {
		e.preventDefault();
		setSaving(<CircularProgress />);
		handleSave(excerpts, codes, comment);
		setTimeout(() => {
			setSaving(<CheckIcon color='success' sx={{fontSize: 40}} />);
			setTimeout(() => {setSaving(undefined)}, 300);
		}, 1000);
	}

	const handleJudgNext = (e) => {
		e.preventDefault();
		setRows([]);
		setCodes([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
		setExcerpts(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
		setDoComment(false);
		setComment('');
		handleNext(excerpts, codes, comment);
	};

	return (
		<div>
			<PresentRespAndCodes codes={codes} excerpts={excerpts} setCodes={setCodes} setExcerpts={setExcerpts} rows={rows} setRows={setRows} />
			<div style={{ marginTop: '25px' }}>
				{!doComment && <button onClick={handleCommentButton}>Add A Comment</button>}
				{doComment && (
					<CommentBox
						comment={comment}
						handleComment={setComment}
						handleCommentButton={handleCommentButton}
					/>
				)}
			</div>
			<div style={{ marginTop: '25px' }}>
				<Selections rows={rows} handleDelete={handleDelete} showDelete={true} />
			</div>
			{!resultsObj && <>
				<button style={{ marginTop: '10px' }} onClick={handleJudgNext}>Next</button>
				{/* this section slightly modified from https://mui.com/material-ui/react-progress/#linear-determinate "linear with label" */}
				<Box sx={{ display: 'flex', alignItems: 'center', marginTop: '25px' }}>
					<Box sx={{ width: '100%', mr: 1 }}><LinearProgress variant="determinate" value={progress} /></Box>
					<Box sx={{ minWidth: 45 }}><Typography variant="body2" color="text.secondary" sx={{fontSize: '2rem'}}>{`${Math.floor(progress)}%`}</Typography>
					</Box>
				</Box>
			</>}
			{(!saving && resultsObj) && <button style={{marginTop: '10px'}} onClick={saveData}>Save</button>}
			{saving && saving}
		</div>
	);
}
