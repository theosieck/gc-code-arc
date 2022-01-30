import ReactHtmlParser from 'react-html-parser';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material/';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function PresentContext(props) {
	return (
		<div>
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>Task {props.sTitle}</AccordionSummary>
				<AccordionDetails>{ReactHtmlParser(props.scenario)}</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>Comp {props.cTitles[0]}</AccordionSummary>
				<AccordionDetails>{ReactHtmlParser(props.competencies[0])}</AccordionDetails>
			</Accordion>
		</div>
	);
}

export default PresentContext;
