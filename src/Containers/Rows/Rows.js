// import ReactHtmlParser from 'react-html-parser';
// import SelectionHighlighter from 'react-highlight-selection';
// import Grid from '@material-ui/core/Grid';
// import Button from '@material-ui/core/Button';

import Row from '../../Components/Row/Row';

const Rows = (props) => (
    <div>
    <h2>Selections:</h2>
    {!props.rows.length && <p>Codes and selected text will appear here.</p>}
    {props.rows.map((row) => (
        <Row 
            selection={row.text}
            code={row.code}
            handleDelete={props.handleDelete}
            showDelete={true}
        />
    ))}
    </div>
);

export default Rows;