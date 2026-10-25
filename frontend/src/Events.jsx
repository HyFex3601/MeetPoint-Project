import { useState, useEffect } from "react";
import Chat from "./Chat";
import { useNotice, Notice } from "./Notice";


function Events() {
    const [events, setEvents] = useState([]);

    const [notice, setNotice] = useNotice();
    
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        fetch("http://localhost:8000/Events")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Bad Response");
                }
                return response.json();
            })
            .then(data => setEvents(data))
            .catch(() => setLoadError(true))
            .finally(() => setLoading(false))
    }, []);

    function handleBooking(eventId) {
        const token = localStorage.getItem("access_token");

        if (!token) {
            setNotice({type: "error", text: "Please log in to Book"})
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
                    setNotice({type: "success", text: "Successfully Booked"});
                } else {
                    setNotice({type: "error", text: typeof result.data.detail === "string" ? result.data.detail : "Something went wrong. Please try again."})
                }
            })
            .catch(() => setNotice({type: "error", text: "Could not reach the server. Please try again."}));
    }

    function handleDelete(eventId) {

        const token = localStorage.getItem("access_token");

        if (!token) {
            setNotice({type: "error", text: "Please log in to delete an event"})
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
                setNotice({type: "deleted", text: "Event Deleted Successfully"})
                setEvents(prev => prev.filter(e => e.id !== eventId));
            } else {
                const data = await response.json().catch(() => ({}));
                setNotice({type: "error", text: typeof data.detail === "string" ? data.detail : "Failed to delete event"});
            }
        })
        .catch(() => setNotice({type: "error", text: "Network error while deleting event"}));
    }

    return (
        <div className="events-layout">
            <div className="events-main">
                <h1>Upcoming Events</h1>
                <Notice notice={notice}/>
                <div className="loadmsgs">
                    {loading && <p role="status">Loading events...</p>}
                    {loadError && <p role="alert">We could not load the events. Please refresh the page</p>}
                    {!loading && !loadError && events.length === 0 && <p>No events yet</p>}
                </div>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "16px"
                }}>
                    {events.map((event) => {
                        return (
                            <div key={event.id} style={{
                                border: "1px solid #ffffff",
                                borderRadius: "8px",
                                padding: "20px"
                            }}>
                                <div className="event-info">
                                    <h3 style={{color: "rgb(232, 231, 173)"}}>Event:</h3><h3>{event.title}</h3>
                                    <p>Description: {event.description}</p>
                                    <p>Location: {event.location}</p>
                                    <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                                    <p>Capacity: {event.capacity}</p>
                                </div>
                                <div className="BTNContainer">
                                    <button className="bookBTN" onClick={() => handleBooking(event.id)}>Book</button>
                                    <button className="deleteBTN" onClick={() => handleDelete(event.id)}>Delete</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="chat-side">
                <Chat />
            </div>
        </div>
    );
}



export default Events;