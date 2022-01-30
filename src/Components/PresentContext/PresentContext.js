import ReactHtmlParser from 'react-html-parser';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function PresentContext(props) {
	const { sTitle, scenario, cTitle, competency } = props;
	return (
		<div>
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>Task {sTitle}</AccordionSummary>
				<AccordionDetails>{ReactHtmlParser(scenario)}</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>Comp {cTitle}</AccordionSummary>
				<AccordionDetails>{ReactHtmlParser(competency)}</AccordionDetails>
			</Accordion>
		</div>
	);
}
