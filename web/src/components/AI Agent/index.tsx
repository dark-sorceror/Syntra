"use client";

import { ChangeEvent, useState, KeyboardEvent, useEffect, useRef } from "react";

import "./index.css";

type Message = {
    text: string;
    sender: "user" | "agent";
};

export default function AIAgent() {
    const chatRef = useRef<HTMLDivElement>(null);

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

    const [showChat, setShowChat] = useState(false);

    useEffect(() => {
        const handleScreenKeydown = (event: globalThis.KeyboardEvent) => {
            const chatboxInputField = document.getElementById("chat-box");
            
            if (
                event.key === "Enter" &&
                document.activeElement?.className !== "chat-box"
            ) {
                event.preventDefault();
                setShowChat(true);
            }

            chatboxInputField?.focus();
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (
                showChat &&
                chatRef.current &&
                !chatRef.current.contains(event.target as Node)
            ) {
                setShowChat(false);
            }
        };

        document.addEventListener("keydown", handleScreenKeydown);
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("keydown", handleScreenKeydown);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showChat]);

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
        <div
            className={`ai-agent-wrapper ${showChat ? "v" : "in"}`}
            ref={chatRef}
        >
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
                id="chat-box"
                className="chat-box"
                placeholder="Ask anything..."
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
}
