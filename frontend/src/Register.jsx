import { useState } from "react";

function Register() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

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
                alert("Account Created")
            } else {
                alert(result.data.detail)
            }
        })
    }

    return (
        <div>
            <h1>Meetpoint Register</h1>
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

    