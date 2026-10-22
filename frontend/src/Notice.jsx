import { useState, useEffect } from "react";

const noticeStyles = {
    success: { background: "#d4edda", color: "#155724", border: "1px solid #155724" },
    error: { background: "#f8d7da", color: "#721c24", border: "1px solid #721c24" },
    deleted: { background: "#f8d7da", color: "#721c24", border: "1px solid #721c24" }
};


export function useNotice() {
    const [notice, setNotice] = useState(null)

    useEffect(() => {
        if (!notice) return;

        const timer = setTimeout(() => setNotice(null), 3000);

        return () => clearTimeout(timer);

    }, [notice])

    return [notice, setNotice]
}

export function Notice({ notice }) {
    if (!notice) return null;

    return (
        <p role = {notice.type === "error" ? "alert" : "status"}
            style={{ ...noticeStyles[notice.type], padding: "12px", borderRadius: "8px", maxWidth: "300px", margin: "auto"}}>
            {notice.text}
        </p>
    )
        
    
}