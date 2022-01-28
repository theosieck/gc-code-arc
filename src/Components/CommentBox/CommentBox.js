// const { Component } = wp.element;

import { useState } from "react"

export default function CommentBox (props) {
    const [error, setError] = useState(undefined);
    const [commentMessage, setCommentMessage] = useState('');
    // const [comments, setComments] = useState(props.comment || '');

    const handleRationaleObj = (e) => {
        e.preventDefault()
        const comment = e.target.elements.rationale.value.trim().replace(/\n\n/g, "<br> ").replace(/\n/g, "<br> ")
        // const oldComments = this.state.comments
        // const numWords = comment.split(" ").length + (!!oldComments ? oldComments.split(" ").length : 0)
        const numWords = comment.split(" ").length
        if (numWords > 125) {
            setError("Please trim your comment down to 125 words");
        } else {
            setCommentMessage("Saving comment...");
            props.handleComment(comment)
            setTimeout(() => {
                setError(undefined);
                setCommentMessage("Comment saved");
            }, 300)
        }
    }

    // handleTextChange = (e) => {
    //     e.preventDefault()
    //     console.log(e.target.rationale)
    //     // this.setState((prevState) => ({comments:prevState.comments.concat(e.target.elements.rationale.value)}))
    // }

    return (
        <div id="rationale">

            {/*this.state.comments &&
                <div>
                <h2>Comments:</h2>
                {ReactHtmlParser(this.state.comments)}
                </div>*/
            }
            <h2>Comment:</h2>
            {error && <span style={{color:"red"}}>{error}</span>}
            <form onSubmit={handleRationaleObj}>
                <textarea style={{marginBottom:"10px"}} name="rationale" cols={40} rows={5} maxLength={1000} placeholder={"125 words or less"}>{props.comment}</textarea>
                <input type="submit" value="Save Comment" />
                <button style={{marginLeft:"20px"}} onClick={props.handleCommentButton}>Nevermind, I don't have a comment</button>
            </form>
            {commentMessage && <p>{commentMessage}</p>}
        </div>
    );
}