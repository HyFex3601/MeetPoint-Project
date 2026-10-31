import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


function Posts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        fetch("http://localhost:8000/posts")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Bad Response");
                }
                return response.json();
            })
            .then(data => setPosts(data))
            .catch(() => setLoadError(true))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <h1>Posts</h1>

            <p>
                <Link to="/create-post">Create post</Link>
            </p>

            {loading && <p className="status-text" role="status">Loading posts...</p>}
            {loadError && <p className="status-text" role="alert">We could not load the posts. Please refresh the page.</p>}
            {!loading && !loadError && posts.length === 0 && <p className="status-text">No posts yet.</p>}

            {posts.map((post) => (
                <div
                    key={post.username + post.created_at}
                    style={{
                        border: "1px solid #ffffff",
                        borderRadius: "8px",
                        padding: "20px",
                        margin: "16px auto",
                        maxWidth: "600px"
                    }}
                >
                    <div className="post-info">
                        <p style={{color: "rgb(232, 231, 173)"}}>- Post -</p>
                        <p>{post.text}</p>
                        <p>By: {post.username}</p>
                        <p>{new Date(post.created_at).toLocaleString()}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Posts;