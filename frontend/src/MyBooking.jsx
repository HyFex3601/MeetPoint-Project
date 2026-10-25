import { useState, useEffect } from "react";
import { useNotice, Notice } from "./Notice";


function MyBooking() {
    const [booking, setBooking] = useState([]);

    const [notice, setNotice] = useNotice();

    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    const [loggedOut, setLoggedOut] = useState(false);
    

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            setNotice({type: "error", text: "Please log in to view your bookings"})
            setLoading(false);
            return;
        }
        fetch("http://localhost:8000/my-bookings", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Bad Response")
                }
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setBooking(data);
                } else {
                    setBooking([]);
                }
            })
            .catch(() => setLoadError(true))
            .finally(() => setLoading(false));
            
            
    }, []);

    function handleUnBook(eventId) {
        const token = localStorage.getItem("access_token");

        if (!token) {
            setNotice({type: "error", text: "Please log in to remove a booking"});
            return;
        }
        fetch("http://localhost:8000/my-booking/" + eventId, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
        .then(async (response) => {
            if (response.status === 200) {
                setNotice({type: "deleted", text: "Booking removed Successfully"})
                setBooking(prev => prev.filter(e => e.id !== eventId));
            } else {
                const data = await response.json().catch(() => ({}));
                setNotice({type: "error", text: typeof data.detail === "string" ? data.detail : "Something went wrong. Please try again"})
            }
        })
        .catch(() => setNotice({type: "error", text: "Network error while removing booking"}));

    }

    return (
        <div>
            <h1>My Booking</h1>
            <Notice notice={notice} />
            <div className="loadmsgs">
                {loading && <p className="status-text" role="status">Loading your bookings...</p>}
                {loadError && <p className="status-text" role="alert">We could not load your bookings. Please refresh the page and try again.</p>}
                {loggedOut && <p className="status-text">Please log in to see your bookings.</p>}
                {!loading && !loadError && booking.length === 0 && <p className="status-text">You have no bookings yet.</p>}
            </div>

            {booking.map((item) => (
                <div key={item.id}>
                    <h3>Title: {item.title}</h3>
                    <p>Description: {item.description}</p>
                    <p>Location: {item.location}</p>
                    <p>Date: {new Date(item.date).toLocaleDateString()}</p>
                    <p>Capacity: {item.capacity}</p>
                    <button className="UnBookBTN" onClick={() => handleUnBook(item.id)}>UnBook</button>
                </div>
            ))}
        </div>
    )

}

export default MyBooking