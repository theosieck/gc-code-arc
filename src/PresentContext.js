

// import { Panel, PanelBody, PanelRow } from '@wordpress/components';
// const { Panel, PanelBody, PanelRow } = wp.components;

//import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import PropTypes from 'prop-types';
// import { withStyles } from '@emotion/styled';
import {Accordion, AccordionSummary, AccordionDetails, Typography} from '@mui/material/';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const styles = theme => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(24),
        fontWeight: theme.typography.fontWeightRegular,
    },
});

function PresentContext(props) {
    const { classes } = props;
    return (
        <div className={classes.root}>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Task {props.sTitle}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography className={classes.heading}>
                    {ReactHtmlParser(props.scenario)}
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Comp {props.cTitles[0]}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography className={classes.heading}>
                        {ReactHtmlParser(props.competencies[0])}
                    </Typography>
                </AccordionDetails>
            </Accordion>
            {/*<Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Comp {props.cTitles[3]}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography className={classes.heading}>
                        {ReactHtmlParser(props.competencies[3])}
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Comp {props.cTitles[2]}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography className={classes.heading}>
                        {ReactHtmlParser(props.competencies[2])}
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Comp {props.cTitles[1]}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography className={classes.heading}>
                        {ReactHtmlParser(props.competencies[1])}
                    </Typography>
                </AccordionDetails>
            </Accordion>*/}
        </div>
    );
}

PresentContext.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default PresentContext;
// export default withStyles(styles)(PresentContext);
