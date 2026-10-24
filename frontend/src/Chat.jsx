import { useState, useEffect, useRef} from "react";
import { Notice, useNotice } from "./Notice";



function Chat() {
    const [chat, setChat] = useState([]);
    const socketRef = useRef(null);
    const [newMessage, setNewMessage] = useState("");

    const [notice, setNotice] = useNotice();

    const logRef = useRef(null)

    const [announce, setAnnounce] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem("access_token");


        if(!token) {
            return;
        }

        const socket = new WebSocket("ws://localhost:8000/ws/" + "global" + "?token=" + token);

        let timer;

        socketRef.current = socket;

        socket.onopen = () => {
            timer = setTimeout(() => setAnnounce(true), 1500)
        };

        socket.onmessage = (event) => {
            setChat((prevChat) => [...prevChat, event.data]);
        };

        return () => {
            clearTimeout(timer);
            if (socket.readyState === WebSocket.CONNECTING) {
                socket.onopen = () => socket.close();

            } else {
                socket.close();
            }
            
        };
    }, []);

        useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
        }, [chat])

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
            <>
                <div 
                ref={logRef}
                className="chat-log"
                role="log" 
                aria-live={announce ? "polite" : "off"}
                aria-label="Chat messages"
                tabIndex={0}
                >
                    {chat.map((item, index) => (
                        <p key={index} className="message">{item}</p>
                    ))}
                </div>
                <form onSubmit={handleSend}>
                    <div className="field">
                        <input
                            id="msg-holder"
                            type="text"
                            placeholder=" "
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <label id="msg-text" htmlFor="msg-holder" >What is on your mind?</label>
                    </div>
                    <button className="chatBTN">Chat</button>
                </form>
            </>
        ) : (
            <p>Please <a href="/login">login</a> to join the chat.</p>
        )}
    </div>
    );

}

export default Chat