const { Component } = wp.element;

import ReactHtmlParser from 'react-html-parser';
import Matches from '../../Components/Matches/Matches'
import ReviewComp from '../../Components/ReviewComp/ReviewComp'

class ReviewBox extends Component {
    state = {
        clicked:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        matchExcerpts:[]
    }

    divStyle = {marginTop: '50px'}

    handleSingles = (e) => {
        e.preventDefault();
        const codeNum = parseInt(isNaN(e.target.textContent[1]) ? e.target.textContent[0] : e.target.textContent[0]+e.target.textContent[1]);
        this.setState((prevState) => ({
            clicked: prevState.clicked.map((num,i) => i==codeNum ? (1 - num) : num)
        }))
    }

    handleNext = (e) => {
        e.preventDefault();
        const excerpts = [];
        this.state.clicked.forEach((codeNum,i) => codeNum == 1 ? excerpts[i]=this.props.reviewSet[i] : excerpts[i]=this.state.matchExcerpts[i])
        const clicked = []
        excerpts.forEach((excerpt,i) => excerpt ? clicked[i] = 1 : excerpts[i] = '')
        this.state.clicked = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        this.state.matchExcerpts = []
        this.props.handleNext(excerpts,clicked)
    }

    handleMatches = (e) => {
        const text = e.target.textContent
				console.log(text)
        const codeNum = parseInt(isNaN(text[1]) ? text[0] : text[0]+text[1]);
        const excerptNum = parseInt(text[text.length-1])
        this.setState((prevState) => ({
            clicked: prevState.clicked.map((num,i) => i==codeNum ? (num==excerptNum+1 ? 0 : excerptNum+1) : num)
        }))
        this.state.matchExcerpts[codeNum] = this.props.matches[codeNum][excerptNum-1]
    }

    render() {
        return (
            <div>
            <div style={this.divStyle}>
                <h2>Case: {this.props.respId}</h2>
                {ReactHtmlParser(this.props.response)}
            </div>
            <div style={this.divStyle}>
                {this.props.judge1Comments &&
                    <div>
                    <h2>Judge 1's Comments:</h2>
                    <p>{ReactHtmlParser(this.props.judge1Comments)}</p>
                    </div>
                }
                {this.props.judge2Comments &&
                    <div>
                    <h2>Judge 2's Comments:</h2>
                    <p>{ReactHtmlParser(this.props.judge2Comments)}</p>
                    </div>
                }
                <ReviewComp
                    codes={this.props.codes}
                    excerpts={this.props.reviewSet}
                    handleButton={this.handleSingles}
                    state={this.state}
                />
                {<Matches
                    codes={this.props.codes}
                    matches={this.props.matches}
                    handleButton={this.handleMatches}
                    state={this.state}
                />}
            </div>
                <button onClick={this.handleNext}>Next</button>
            </div>
        );
    }
}

export default ReviewBox;
