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
            .then(data => setBooking(data))
    }, []);

    return (
        <div>
            <h1>My Booking</h1>
            {booking.map((item) => {
                return(
                    <div key={item.id}>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                        <p>{item.location}</p>
                        <p>{new Date(item.date).toLocaleDateString()}</p>
                        <p>{item.capacity}</p>
                    </div>
                )
            })}

        </div>
    )
}

export default MyBooking