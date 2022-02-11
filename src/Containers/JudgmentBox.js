import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Selections from '../Components/Selections/Selections';
import CommentBox from '../Components/CommentBox/CommentBox';
import PresentRespAndCodes from '../Components/PresentRespAndCodes/PresentRespAndCodes';
import { setUpIndRev } from '../utils';

export default function JudgmentBox(props) {
	const { resultsObj, handleNext, handleSave } = props;
	const [rows, setRows] = useState([]);
	const [codes, setCodes] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
	const [excerpts, setExcerpts] = useState(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
	const [doComment, setDoComment] = useState(false);
	const [comment, setComment] = useState('');

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
		// TODO add saved message
		e.preventDefault();
		handleSave(excerpts, codes, comment);
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
			{!resultsObj && <button style={{ marginTop: '10px' }} onClick={handleJudgNext}>Next</button>}
			{resultsObj && <button style={{marginTop: '10px'}} onClick={saveData}>Save</button>}
		</div>
	);
}
