

// import { Panel, PanelBody, PanelRow } from '@wordpress/components';
// const { Panel, PanelBody, PanelRow } = wp.components;

//import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Task {props.sTitle}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Typography className={classes.heading}>
                    {ReactHtmlParser(props.scenario)}
                    </Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Comp {props.cTitles[0]}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Typography className={classes.heading}>
                        {ReactHtmlParser(props.competencies[0])}
                    </Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            {/*<ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Comp {props.cTitles[3]}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Typography className={classes.heading}>
                        {ReactHtmlParser(props.competencies[3])}
                    </Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Comp {props.cTitles[2]}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Typography className={classes.heading}>
                        {ReactHtmlParser(props.competencies[2])}
                    </Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Comp {props.cTitles[1]}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Typography className={classes.heading}>
                        {ReactHtmlParser(props.competencies[1])}
                    </Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>*/}
        </div>
    );
}

PresentContext.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PresentContext);
