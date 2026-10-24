import Login from "./Login";
import Register from "./Register";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Link } from "react-router-dom"
import Events from "./Events"
import CreateEvent from "./CreateEvent";
import "./App.css"; 
import MyBooking from "./MyBooking";
import Chat from "./Chat";
import { useState } from "react";
import login from "./assets/login.svg"
import logout from "./assets/logout.png"

function App() {

  const [token, setToken] = useState(localStorage.getItem("access_token"));


  function handleLogout() {
    localStorage.removeItem("access_token");
    setToken(null);
    window.location.href = "/login";
    
  }
  return (
    <>

    <h2 id="logo">MeetPoint</h2>


    <BrowserRouter>
      <nav>
        <div className="login-link-container">
          <img id="img1" src={login} alt="" /><Link to="/login">Login</Link>
          
        </div>
        <Link to="/register">Register</Link>
        <Link to="/events">Events + Chat</Link>
        <Link to="/create-event">CreateEvent</Link>
        <Link to="/my-booking">MyBooking</Link>
        {token && <button onClick={handleLogout}><img id="logoutBTN" src={logout} alt=""/></button>}
        
      </nav>
      <Routes>
        <Route path="/events" element={<Events />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/my-booking" element={<MyBooking />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App