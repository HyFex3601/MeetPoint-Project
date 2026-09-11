import { useState } from "react";


function CreateEvent() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [date, setDate] = useState("")
    const [location, setLocation] = useState("")
    const [capacity, setCapacity] = useState("")


    function handleCreateEvent(event) {
        event.preventDefault();

        const token = localStorage.getItem("access_token")

        if (!token) {
            alert("You must be logged in to Create an Event");
            window.location.href = "/login";
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
                alert("Event Created Successfully")
                window.location.href="/events"
            } else {
                alert(result.data.detail)
            }
        })

    }

    return (
        <div>
            <h1>Create Event</h1>
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