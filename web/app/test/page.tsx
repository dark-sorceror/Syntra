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
        <div className="test-wrapper">
            <div className="test-area">
                <div className="test">
                    <button onClick={testBackend} disabled={loading}>
                        Test Backend
                    </button>

                    <button onClick={getAISuggestion} disabled={loading}>
                        Get AI Suggestion
                    </button>
                </div>

                <p className={`loading ${loading ? "active" : ""}`}>
                    Loading...
                </p>

                {response && (
                    <div className="response">
                        <strong>Response:</strong> {response}
                    </div>
                )}
            </div>
        </div>
    );
}
