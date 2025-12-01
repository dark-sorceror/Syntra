import React from "react";
import { createPortal } from "react-dom";

import { EventEditorProperties } from "@/types/calendar";

const EventEditor: React.FC<EventEditorProperties> = ({
    x,
    y,
    eventTitle,
    onTitleChange,
    onSave,
    onCancel,
}) => {
    const portalRoot = document.getElementById("portal-root");
    if (!portalRoot) return null;

    return createPortal(
        <>
            <div className="editor-overlay" onClick={onCancel} />
            <div
                className="event-editor-popup"
                style={{
                    top: y,
                    left: x,
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <input
                    type="text"
                    autoFocus
                    value={eventTitle}
                    onChange={(e) => onTitleChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") onSave();
                        if (e.key === "Escape") onCancel();
                    }}
                    placeholder="Event Title..."
                />
                <div className="buttons">
                    <button onClick={onSave}>Save</button>
                    <button onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </>,
        portalRoot
    );
};

export default EventEditor;
