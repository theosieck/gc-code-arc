// const { Component } = wp.element;

import { useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import Matches from '../../Components/Matches/Matches'
import ReviewComp from '../../Components/ReviewComp/ReviewComp'

export default function ReviewBox (props) {
    const [clicked, setClicked] = useState([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
    const [matchExcerpts, setMatchExcerpts] = useState([]);

    const divStyle = {marginTop: '50px'}

    const handleSingles = (e) => {
        e.preventDefault();
        const codeNum = parseInt(isNaN(e.target.textContent[1]) ? e.target.textContent[0] : e.target.textContent[0]+e.target.textContent[1]);
        setClicked(clicked.map((num,i) => i==codeNum ? (1 - num) : num));
    }

    const handleNext = (e) => {
        e.preventDefault();
        const excerpts = [];
        clicked.forEach((codeNum,i) => codeNum == 1 ? excerpts[i]=props.reviewSet[i] : excerpts[i]=matchExcerpts[i])
        const tmpClicked = []
        excerpts.forEach((excerpt,i) => excerpt ? tmpClicked[i] = 1 : excerpts[i] = '')
        setClicked([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
        setMatchExcerpts([]);
        props.handleNext(excerpts,tmpClicked)
    }

    const handleMatches = (e) => {
        const text = e.target.textContent;
		console.log(text);
        const codeNum = parseInt(isNaN(text[1]) ? text[0] : text[0]+text[1]);
        const excerptNum = parseInt(text[text.length-1]);
        setClicked(clicked.map((num,i) => i==codeNum ? (num==excerptNum+1 ? 0 : excerptNum+1) : num));
        matchExcerpts[codeNum] = props.matches[codeNum][excerptNum-1];
        setMatchExcerpts(matchExcerpts);
    }

    return (
        <div>
        <div style={divStyle}>
            <h2>Case: {props.respId}</h2>
            {ReactHtmlParser(props.response)}
        </div>
        <div style={divStyle}>
            {props.judge1Comments &&
                <div>
                <h2>Judge 1's Comments:</h2>
                <p>{ReactHtmlParser(props.judge1Comments)}</p>
                </div>
            }
            {props.judge2Comments &&
                <div>
                <h2>Judge 2's Comments:</h2>
                <p>{ReactHtmlParser(props.judge2Comments)}</p>
                </div>
            }
            <ReviewComp
                codes={props.codes}
                excerpts={props.reviewSet}
                handleButton={handleSingles}
                state={{
                    clicked,
                    matchExcerpts
                }}
            />
            {<Matches
                codes={props.codes}
                matches={props.matches}
                handleButton={handleMatches}
                state={{
                    clicked,
                    matchExcerpts
                }}
            />}
        </div>
            <button onClick={handleNext}>Next</button>
        </div>
    );
}