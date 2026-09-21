import { useState, useEffect } from "react";
import Chat from "./Chat";

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

    function handleDelete(eventId) {

        const token = localStorage.getItem("access_token");

        if (!token) {
            alert("You must be logged in to Delete an Event");
            window.location.href = "/login";
            return;
        }

        fetch("http://localhost:8000/Events/" + eventId, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            },

        })
        .then(async (response) => {
            if (response.status === 200 || response.status === 204) {
                alert("Event Deleted Successfully");
                setEvents(prev => prev.filter(e => e.id !== eventId));
            } else {
                const data = await response.json().catch(() => ({}));
                alert(data.detail || "Failed to delete event");
            }
        })
        .catch(() => alert("Network error while deleting event"))
    }

    return (
        <div style={{display: "flex", gap: "20px"}}>
            <div style={{flex: 1}}>
                <h1>Upcoming Events</h1>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "16px"
                }}>
                    {events.map((event) => {
                        return (
                            <div key={event.id} style={{
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                padding: "16px"
                            }}>
                                <h3>Title: {event.title}</h3>
                                <p>Description: {event.description}</p>
                                <p>Location: {event.location}</p>
                                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                                <p>Capacity: {event.capacity}</p>
                                <div id="BTNContainer">
                                    <button id="bookBTN" onClick={() => handleBooking(event.id)}>Book</button>
                                    <button id="deleteBTN"onClick={() => handleDelete(event.id)}>Delete</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div style={{width: "300px"}}>
                <Chat />
            </div>
        </div>
    );
}



export default Events;