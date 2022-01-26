const { Component } = wp.element;

import {Button, Grid} from '@mui/material';


class Codes extends Component {
    divStyles = {
        border: '1px solid black',
        padding: '5px',
        // marginLeft: '20px'
    }

    handleButton = (e) => {
        e.preventDefault();
        this.props.handleButton(e.target.textContent);
    }

    render() {
        return (
            <div>
                <Grid container direction="column" justify="flex-start" alignItems="center">
                <h2>Codes:</h2>
                <div style={this.divStyles}>
                {this.props.codes.map((code, i) => (
                    <Button
                        variant="outlined"
                        style={{marginBottom: '5px',
                                display: 'block',
                                fontSize: '14px'}}
                        onClick={this.handleButton}
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
}

export default Codes