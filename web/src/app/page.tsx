"use client";

import { useState } from "react";

export default function Home() {
    const [response, setResponse] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const testBackend = async () => {
        setLoading(true);

        try {
            const res = await fetch("http://localhost:8000/api/test");
            const data = await res.json();

            setResponse(data.response);
        } catch (error) {
            setResponse("Backend not running.");
        } finally {
            setLoading(false);
        }
    };

    const getAISuggestion = async () => {
        setLoading(true);

        try {
            const res = await fetch("http://localhost:8000/api/ai-suggest", {
                method: "POST",
            });
            const data = await res.json();

            setResponse(
                `AI Suggestion: ${data.suggestion} (Confidence: ${data.confidence})`
            );
        } catch (error) {
            setResponse("Failed to get AI suggestion");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1 style={{ fontSize: 50 }}>Syntra</h1>

            <div style={{ marginBottom: "1rem" }}>
                <button
                    onClick={testBackend}
                    disabled={loading}
                    style={{ marginRight: "1rem", padding: "0.5rem 1rem" }}
                >
                    Test Backend
                </button>

                <button
                    onClick={getAISuggestion}
                    disabled={loading}
                    style={{ padding: "0.5rem 1rem" }}
                >
                    Get AI Suggestion
                </button>
            </div>

            {loading && <p>Loading...</p>}

            {response && (
                <div
                    style={{
                        marginTop: "1rem",
                        padding: "1rem",
                        background: "#f0f0f0",
                        borderRadius: "8px",
                    }}
                >
                    <strong>Response:</strong> {response}
                </div>
            )}
        </div>
    );
}
