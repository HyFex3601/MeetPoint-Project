import { useState } from "react";
import { Notice, useNotice} from "./Notice";

function Register() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const [notice, setNotice] = useNotice();

    function handleRegister(event) {
        event.preventDefault();
        

        fetch("http://localhost:8000/register", {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username: username, password: password})
        })
        .then(response => {
            return response.json().then(data =>{
                return { status: response.status, data: data}
            });
        })
        .then(result => {
            if (result.status === 200) {
                setNotice({type: "success", text: "Account Created"})
                setTimeout(() => { window.location.href = "/login" }, 1000);
            } else {
                setNotice({type: "error", text: typeof result.data.detail === "string" ? result.data.detail: "Error Occurred"})
    
            }
        })
        .catch(() => setNotice({type: "error", text: "Could not reach the server. Please try again."}));
    }

    return (
        <div>
            <h1>Meetpoint Register</h1>
            <Notice notice={notice}/>
            <form onSubmit={handleRegister}>
                <input 
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
                <input 
                type="password"
                placeholder="Password"
                value={password}
                onChange = {(e) => setPassword(e.target.value)}
                />
                <button>Register</button>
            </form>
        </div>
    )

}

export default Register;

    