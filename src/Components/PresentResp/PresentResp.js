import { useSelector } from 'react-redux';
import ReactHtmlParser from 'react-html-parser';
import Highlightable from 'highlightable';

export default function PresentResp(props) {
	const { handleSelection } = props;
	// retrieve stored redux data
	const { response, respTitle } = useSelector((state) => state.context);
	return (
		<div>
			<h2>{respTitle}</h2>
			<div
				onMouseUp={() => {
					handleSelection(window.getSelection().toString());
				}}
			>
				{ReactHtmlParser(response)}
			</div>
			{/*<Highlightable
                ranges={[{'text':ReactHtmlParser(response)}]} 
                enabled={true}
                onTextHighlighted={handleSelection}
                highlightStyle={{backgroundColor:'red'}}
                text={ReactHtmlParser(response)}
            />*/}
		</div>
	);
}
