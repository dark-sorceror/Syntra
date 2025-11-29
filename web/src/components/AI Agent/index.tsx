"use client";

import { ChangeEvent, useState, KeyboardEvent } from "react";

import "./index.css";

type Message = {
    text: string;
    sender: "user" | "agent";
};

export default function AIAgent() {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

    const [messages, setMessages] = useState<Message[]>([
        {
            text: "ok",
            sender: "agent",
        },
        {
            text: "yo",
            sender: "user",
        },
        {
            text: "yo wsg",
            sender: "agent",
        },
    ]);

    const [input, setInput] = useState("");

    const [isThinking, setIsThinking] = useState(false);

    const handleSidebarState = async () => {
        setIsSidebarExpanded((prev) => !prev);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSendMessage();
        }
    };

    const handleSendMessage = () => {
        if (input.trim() === "") return;

        const newMessage: Message = {
            text: input,
            sender: "user",
        };

        if (!isThinking) {
            setMessages((prevMessages) => [newMessage, ...prevMessages]);

            setIsThinking(true);

            setTimeout(() => {
                setMessages((prevMessages) => [
                    {
                        text: `AI response to ${input}`,
                        sender: "agent",
                    },
                    ...prevMessages,
                ]);

                setIsThinking(false);
            }, 2000);

            setInput("");
        }
    };

    return (
        <div className={`ai-agent-wrapper ${isSidebarExpanded ? "out" : "in"}`}>
            <button className="expand" onClick={handleSidebarState}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m9 18 6-6-6-6" />
                </svg>
            </button>
            <div className="chat">
                {messages.map((message, index) => (
                    <div key={index} className={`m ${message.sender}`}>
                        {message.text}
                    </div>
                ))}
            </div>
            <div className={`thinking ${isThinking}`}>AI is thinking...</div>
            <input
                type="text"
                className="chat-box"
                placeholder="Ask anything..."
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
}
