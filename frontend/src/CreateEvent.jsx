import { useState } from "react";
import { useNotice, Notice } from "./Notice" 


function CreateEvent() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [date, setDate] = useState("")
    const [location, setLocation] = useState("")
    const [capacity, setCapacity] = useState("")
    
    const [notice, setNotice] = useNotice();


    function handleCreateEvent(event) {
        event.preventDefault();

        const token = localStorage.getItem("access_token")

        if (!token) {
            setNotice({type: "error", text: "Please log in to create an event"});
            return;
        }

        fetch("http://localhost:8000/create-events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", "Authorization": "Bearer " + token
            },
            body: JSON.stringify({title: title, description: description, date: date, location: location, capacity: capacity})
        })
        .then(response => {
            return response.json().then(data => {
                return { status: response.status, data: data}
            });
        })
        .then(result => {
            if (result.status === 200) {
                setNotice({type: "success", text: "Event Created Successfully"})
                setTitle("");
                setDescription("");
                setDate("");
                setLocation("");
                setCapacity("");
            } else {
                setNotice({type: "error", text: typeof result.data.detail === "string" ? result.data.detail : "Please check the form and try again"})
            }
        })
        .catch(() => setNotice({type: "error", text: "Could not reach the server. Please try again"}))

    }

    return (
        <div>
            <h1>Create Event</h1>
            <Notice notice={notice} />
            <form onSubmit={handleCreateEvent}>
                <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                />
                <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                />
                <input
                type="datetime-local"
                placeholder="Date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                />
                <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                />
                <input
                type="number"
                placeholder="Capacity"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                />
                <button>Create Event</button>
            </form>
        </div>
    )
}

export default CreateEvent;