import Login from "./Login";
import Register from "./Register";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Link } from "react-router-dom"
import Events from "./Events"
import CreateEvent from "./CreateEvent";
import "./App.css"; 
import MyBooking from "./MyBooking";


function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/events">Events</Link>
        <Link to="/create-event">CreateEvent</Link>
        <Link to="/my-booking">MyBooking</Link>
      </nav>
      <Routes>
        <Route path="/events" element={<Events />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/my-booking" element={<MyBooking />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App