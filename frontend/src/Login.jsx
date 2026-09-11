import { useState } from "react";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");



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
                alert("Login Successful");
            } else {
                alert(result.data.detail)
            }
        });
    }

    return (
        <div>
            <h1>Meetpoint Login</h1>
            <form onSubmit={handleLogin}>
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
                <button>Login</button>
            </form>
        </div>
    );
}

export default Login;