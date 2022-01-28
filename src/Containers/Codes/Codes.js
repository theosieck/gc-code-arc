// const { Component } = wp.element;

import {Button, Grid} from '@mui/material';


export default function Codes (props) {
    const divStyles = {
        border: '1px solid black',
        padding: '5px',
        // marginLeft: '20px'
    }

    const handleButton = (e) => {
        e.preventDefault();
        props.handleButton(e.target.textContent);
    }

    return (
        <div>
            <Grid container direction="column" justify="flex-start" alignItems="center">
            <h2>Codes:</h2>
            <div style={divStyles}>
            {props.codes.map((code, i) => (
                <Button
                    variant="outlined"
                    style={{marginBottom: '5px',
                            display: 'block',
                            fontSize: '14px'}}
                    onClick={handleButton}
                >
                    {i}. {code}
                </Button>
            ))}
            </div>
            </Grid>
            {/*this.props.state.clicked==i ? "contained" : "outlined"*/}
        </div>
    );
}