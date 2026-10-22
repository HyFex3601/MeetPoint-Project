import { useState, useEffect, useRef} from "react";
import { Notice, useNotice } from "./Notice";



function Chat() {
    const [chat, setChat] = useState([]);
    const socketRef = useRef(null);
    const [newMessage, setNewMessage] = useState("");
    const [notice, setNotice] = useNotice()

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
            setNotice({type: "error", text: "Please log in to Chat"})
            setTimeout(() => {window.location.href = "/login"}, 1000)
            return;
        }
        const payload = JSON.parse(atob(token.split(".")[1]))
        const username = payload.sub
        
        if(!newMessage.trim()) {
            setNotice({type: "error", text: "Please type a message to send"})
            return;
        }
        socketRef.current.send(username + ": " + newMessage.trim());
        setNewMessage("");
    }

    const token = localStorage.getItem("access_token");

    return (
    <div>
        <h1>Global Chat</h1>
        <Notice notice={notice}/>
        {token ? (
            <form onSubmit={handleSend}>
                {chat.map((item, index) => (
                    <p key={index} className="message">{item}</p>
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