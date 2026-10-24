import { useState } from "react";
import { Notice, useNotice } from "./Notice";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [notice, setNotice] = useNotice();


    function handleLogin(event) {
        event.preventDefault();
        
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);

        fetch("http://localhost:8000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData
        })
        .then(response => {
            return response.json().then(data =>{
                return { status: response.status, data: data };
            });
        })
        .then(result => {
            if (result.status === 200) {
                localStorage.setItem("access_token", result.data.access_token);
                setNotice({type: "success", text: "Login Successful"})
                setTimeout(() => {window.location.href="/events"}, 1000)
            } else {
                setNotice({type: "error", text: typeof result.data.detail === "string" ? result.data.detail : "Invalid username or password"})
                return;
            }
        })
        .catch(() => setNotice({type: "error", text: "Could not reach the server. Please try again"}));
    }

    return (
        <div>
            <h1>Meetpoint Login</h1>
            <Notice notice={notice} />
            <form onSubmit={handleLogin}>
                <div className="field">
                    <input
                        id="login-username"
                        type="text"
                        placeholder=" "
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                        />
                    <label id="user-password" htmlFor="login-username">Username</label>
                </div>

                <div className="field">
                    <input 
                        id="login-password"
                        type="password"
                        placeholder=" "
                        value={password}
                        onChange = {(e) => setPassword(e.target.value)}
                    />
                    <label id="user-password" htmlFor="login-password">Password</label>
                </div>

                <button id="loginBTN">Login</button>
            </form>
        </div>
    );
}

export default Login;