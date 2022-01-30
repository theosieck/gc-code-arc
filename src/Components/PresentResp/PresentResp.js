import ReactHtmlParser from "react-html-parser";
import Highlightable from "highlightable";
import { useSelector } from "react-redux";

export default function PresentResp(props) {
	// retrieve stored redux data
	const { respId, response } = useSelector((state) => state);
	return (
		<div>
			<h2>Case: {respId}</h2>
			<div
				onMouseUp={() => {
					props.handleSelection(window.getSelection().toString());
				}}
			>
				{ReactHtmlParser(response)}
			</div>
			{/*<Highlightable
                ranges={[{'text':ReactHtmlParser(response)}]} 
                enabled={true}
                onTextHighlighted={props.handleSelection}
                highlightStyle={{backgroundColor:'red'}}
                text={ReactHtmlParser(response)}
            />*/}
		</div>
	);
}
