import PresentRespAndCodes from "../Components/PresentRespAndCodes/PresentRespAndCodes";


export default function IndRevBox () {
	const [rows, setRows] = useState([]);
	const [codes, setCodes] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
	const [excerpts, setExcerpts] = useState(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
	const [doComment, setDoComment] = useState(false);
	const [comment, setComment] = useState('');

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

	return (
		<div>
			<PresentRespAndCodes />
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
		</div>
	)
}