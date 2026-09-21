import { useState, useEffect } from "react";


function MyBooking() {
    const [booking, setBooking] = useState([]);
    



    useEffect(() => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            alert("You must be logged in to view you Booking");
            window.location.href = "/login";
            return;
        }
        fetch("http://localhost:8000/my-bookings", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setBooking(data);
                } else {
                    setBooking([]);
                }
            })
    }, []);

    function handleUnBook(eventId) {
        const token = localStorage.getItem("access_token");

        if (!token) {
            alert("You must be logged in to Delete an Event");
            window.location.href = "/login";
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
                alert("Event Deleted Successfully");
                setBooking(prev => prev.filter(e => e.id !== eventId));
            } else {
                const data = await response.json().catch(() => ({}));
                alert(data.detail)
            }
        })
        .catch(() => alert("Network error while deleting event"))

    }

    return (
        <div>
            <h1>My Booking</h1>
            {booking.length === 0 ? (
                <p>You have no bookings yet.</p>
            ) : (
                booking.map((item) => {
                    return(
                        <div key={item.id}>
                            <h3>Title: {item.title}</h3>
                            <p>Description: {item.description}</p>
                            <p>Location: {item.location}</p>
                            <p>Date: {new Date(item.date).toLocaleDateString()}</p>
                            <p>Capacity: {item.capacity}</p>
                            <button id="UnBookBTN" onClick={() => handleUnBook(item.id)}>UnBook</button>
                        </div>
                    )
                })
            )}
        </div>
    )

}

export default MyBooking