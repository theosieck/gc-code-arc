import Row from '../../Components/Row/Row';

const Rows = (props) => (
	<div>
		<h2>Selections:</h2>
		{!props.rows.length && <p>Codes and selected text will appear here.</p>}
		{props.rows.map((row) => (
			<Row selection={row.text} code={row.code} handleDelete={props.handleDelete} showDelete={true} />
		))}
	</div>
);

export default Rows;
