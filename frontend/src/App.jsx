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
import Posts from "./Posts";
import CreatePost from "./CreatePost"
import Logo from "./assets/Logo.png"

function App() {

  const [token, setToken] = useState(localStorage.getItem("access_token"));


  function handleLogout() {
    localStorage.removeItem("access_token");
    setToken(null);
    window.location.href = "/login";
    
  }
  return (
    <>

    <img id="logo" src={Logo}/>


    <BrowserRouter>
      <nav>
        <div className="login-link-container">
          <img id="img1" src={login} alt="" /><Link to="/login">Login</Link>
          
        </div>
        <Link to="/register">Register</Link>
        <Link to="/events">Events + Chat</Link>
        <Link to="/create-event">CreateEvent</Link>
        <Link to="/my-booking">MyBooking</Link>
        <Link to="/posts">Posts</Link>
        {token && <button onClick={handleLogout} aria-label="Log out"><img id="logoutBTN" src={logout} alt=""/></button>}
        
      </nav>
      <main>
        <Routes>
          <Route path="/events" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> 
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/my-booking" element={<MyBooking />} />
          <Route path="/posts" element={<Posts/>}/>
          <Route path="/create-post" element={<CreatePost />}/>
        </Routes>
      </main>
    </BrowserRouter>
      
    
    </>
  );
}

export default App