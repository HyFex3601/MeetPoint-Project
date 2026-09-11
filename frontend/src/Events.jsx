import { useState, useEffect } from "react";


function Events() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/Events")
            .then(response => response.json())
            .then(data => setEvents(data));
    }, []);

    function handleBooking(eventId) {
        const token = localStorage.getItem("access_token");

        if (!token) {
            alert ("You must be logged in to Book");
            window.location.href = "/login";
            return;
        }

        fetch("http://localhost:8000/Events/" + eventId + "/book", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
            .then(response => {
                return response.json().then(data => {
                    return { status: response.status, data: data };
                })
            })
            .then(result => {
                if (result.status === 200) {
                    alert("Successfully Booked");
                } else {
                    alert(result.data.detail);
                }
            });
    }
    return (
        <div>
            <h1>Upcoming Events</h1>
            {events.map((event) => {
                return (
                    <div key={event.id}>
                        <h3>{event.title}</h3>
                        <p>{event.description}</p>
                        <p>{event.location}</p>
                        <p>{new Date(event.date).toLocaleDateString()}</p>
                        <p>{event.capacity}</p>
                        <button onClick={() => handleBooking(event.id)}>Book</button>
                    </div>
                );

            })}
        </div>
    );
}



export default Events;