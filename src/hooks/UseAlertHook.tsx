import { useEffect, useState } from "react";

export type Severity = "success" | "error" | "warning" | "info";

export default function useAlertHook() {
    const [message, setMessage] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [severity, setSeverity] = useState<Severity>("error");

    function showMessage(newMessage: string, severity: Severity = "error") {
        setIsOpen(true);
        setSeverity(severity);
        setMessage(newMessage);
    }

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setIsOpen(false), 5000);
        }
    }, [isOpen]);

    function closeAlert() {
        setIsOpen(false);
    }

    return {
        message,
        isOpen,
        severity,
        showMessage,
        closeAlert,
    };
}
