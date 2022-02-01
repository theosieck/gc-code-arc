import { useState } from 'react';

export default function CommentBox(props) {
	const { handleComment, comment, handleCommentButton } = props;
	const [error, setError] = useState(undefined);
	const [commentMessage, setCommentMessage] = useState('');

	const handleRationaleObj = (e) => {
		e.preventDefault();
		const comment = e.target.elements.rationale.value.trim().replace(/\n\n/g, '<br> ').replace(/\n/g, '<br> ');
		const numWords = comment.split(' ').length;
		if (numWords > 125) {
			setError('Please trim your comment down to 125 words');
		} else {
			setCommentMessage('Saving comment...');
			handleComment(comment);
			setTimeout(() => {
				setError(undefined);
				setCommentMessage('Comment saved');
			}, 300);
		}
	};

	return (
		<div id="rationale">
			<h2>Comment:</h2>
			{error && <span style={{ color: 'red' }}>{error}</span>}
			<form onSubmit={handleRationaleObj}>
				<textarea
					style={{ marginBottom: '10px' }}
					name="rationale"
					cols={40}
					rows={5}
					maxLength={1000}
					placeholder={'125 words or less'}
				>
					{comment}
				</textarea>
				<input type="submit" value="Save Comment" />
				<button style={{ marginLeft: '20px' }} onClick={handleCommentButton}>
					Nevermind, I don't have a comment
				</button>
			</form>
			{commentMessage && <p>{commentMessage}</p>}
		</div>
	);
}
