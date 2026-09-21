import { useState, useEffect, useRef} from "react"



function Chat() {
    const [chat, setChat] = useState([]);
    const socketRef = useRef(null);
    const [newMessage, setNewMessage] = useState("");


    useEffect(() => {
        const token = localStorage.getItem("access_token");


        if(!token) {
            return;
        }

        const socket = new WebSocket("ws://localhost:8000/ws/" + "global" + "?token=" + token);

        socketRef.current = socket;

        socket.onmessage = (event) => {
            setChat((prevChat) => [...prevChat, event.data]);
        };

        return () => {
            socket.close();
        };
    }, []);

    function handleSend(event) {
        event.preventDefault();
        const token = localStorage.getItem("access_token");


        if(!token) {
            alert("You must be logged in to Chat")
            window.location.href = "/login";
            return;
        }
        const payload = JSON.parse(atob(token.split(".")[1]))
        const username = payload.sub
        
        socketRef.current.send(username + ": " + newMessage);
        setNewMessage("");
    }

    const token = localStorage.getItem("access_token");

    return (
    <div>
        <h1>Global Chat</h1>
        {token ? (
            <form onSubmit={handleSend}>
                {chat.map((item, index) => (
                    <p key={index}>{item}</p>
                ))}
                <input
                    type="text"
                    placeholder="What are your thoughts?"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button>Chat</button>
            </form>
        ) : (
            <p>Please <a href="/login">login</a> to join the chat.</p>
        )}
    </div>
    );

}

export default Chat