import Row from '../Row/Row';
import DeleteButton from './DeleteButton';

export default function Selections (props) {
	const {rows} = props;
	return (
		<div>
			<h2>Selections:</h2>
			{!rows.length && <p>Codes and selected text will appear here.</p>}
			{rows.map((row) => (
				<Row selection={row.text} component={<DeleteButton code={row.code} handleDelete={props.handleDelete} />} />
			))}
		</div>
	);
}
