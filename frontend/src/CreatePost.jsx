import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Notice, useNotice } from "./Notice";

function CreatePost() {
    const [notice, setNotice] = useNotice();
    const [text, setText] = useState("");
    const navigate = useNavigate();

    function handlePost(event) {
        event.preventDefault();

        const token = localStorage.getItem("access_token");

        if (!token) {
            setNotice({type: "error", text: "Please log in to post"});
            return;
        }

        fetch("http://localhost:8000/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({text: text})
        })
            .then(response => {
                return response.json().then(data => {
                    return { status: response.status, data: data };
                });
            })
            .then(result => {
                if (result.status === 200) {
                    setNotice({type: "success", text: "Post created successfully"});
                    setText("");
                    setTimeout(() => navigate("/posts"), 1000);
                } else {
                    setNotice({type: "error", text: typeof result.data.detail === "string" ? result.data.detail : "Please check the form and try again"});
                }
            })
            .catch(() => setNotice({type: "error", text: "Could not reach the server. Please try again"}));
    }


    const token = localStorage.getItem("access_token")

    return (
        <div>
            <h1>Create Post</h1>
            <Notice notice={notice} />
            {token ? (
                <>
                <form onSubmit={handlePost}>
                    <div className="field">
                        <textarea
                            id="post-text"
                            placeholder=" "
                            maxLength={500}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <label htmlFor="post-text">What is on your mind?</label>
                    </div>
                    <p className="status-text">{text.length} / 500 characters</p>
                    <button id="PostBTN">Post</button>
                </form>
                </>
            ) : (
                <p className="status-text">Please <a href="/login">login</a> to create a post.</p>
            )}
        </div>
            
    );
}

export default CreatePost;