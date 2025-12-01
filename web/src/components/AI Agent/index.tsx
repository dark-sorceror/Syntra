"use client";

import { ChangeEvent, useState, KeyboardEvent, useEffect, useRef } from "react";

import "./index.css";

type Message = {
    text: string;
    sender: "user" | "agent";
};

const PROMPTS: string[] = [
    "Create an event 3 days from now",
    "Do I have any assessments next week?",
    "Remove my dentist appointment",
    "When is the next holiday?",
    "Are there any important deadlines coming up?",
    "What days am I available next week?",
    "Schedule a meeting with Tom tomorrow",
];

const PromptAnimator: React.FC = () => {
    const [promptIndex, setPromptIndex] = useState<number>(0);
    const [displayText, setDisplayText] = useState<string>("");
    const [isTyping, setIsTyping] = useState<boolean>(true);

    useEffect(() => {
        const currentPrompt = PROMPTS[promptIndex];
        let timer: NodeJS.Timeout;

        if (isTyping) {
            if (displayText.length < currentPrompt.length) {
                timer = setTimeout(() => {
                    setDisplayText(
                        currentPrompt.slice(0, displayText.length + 1)
                    );
                }, 75);
            } else {
                timer = setTimeout(() => setIsTyping(false), 2000);
            }
        } else {
            if (displayText.length > 0) {
                timer = setTimeout(() => {
                    setDisplayText(
                        currentPrompt.slice(0, displayText.length - 1)
                    );
                }, 50);
            } else {
                setIsTyping(true);
                setPromptIndex((prevIndex) => (prevIndex + 1) % PROMPTS.length);
            }
        }

        return () => clearTimeout(timer);
    }, [displayText, isTyping, promptIndex]);

    return <div className="text">{displayText}</div>;
};

export default function AIAgent() {
    const chatRef = useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useState<Message[]>([]);

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

    const handleSendMessage = async () => {
        if (input.trim() === "") return;

        const newMessage: Message = {
            text: input,
            sender: "user",
        };
        const promptValue = input;

        if (!isThinking) {
            setMessages((prevMessages) => [newMessage, ...prevMessages]);

            setIsThinking(true);

            setTimeout(() => {
                setMessages((prevMessages) => [
                    {
                        text: `AI: ${promptValue}`,
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
            <div className={`chat ${messages.length == 0 ? "r" : ""}`}>
                {messages.length == 0 ? (
                    <>
                        <PromptAnimator />

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            id="ailogo"
                            data-name="Layer 1"
                            viewBox="0 0 24 24"
                        >
                            <defs>
                                <linearGradient
                                    id="gradient"
                                    x1="0%"
                                    y1="100%"
                                    x2="100%"
                                    y2="0%"
                                >
                                    <stop offset="0%" stopColor="#9ea7ff" />
                                    <stop offset="33.33%" stopColor="#ff8bff" />
                                    <stop offset="66.67%" stopColor="#ffbd7a" />
                                    <stop offset="100%" stopColor="#f8ebc3" />
                                </linearGradient>
                            </defs>
                            <g fill="url(#gradient)">
                                <path d="M19.934,8.98c-.188-.253-.486-.402-.802-.402h-4.17l1.104-4.917c.083-.37-.05-.755-.344-.995-.084-.068-2.073-1.667-4.46-1.667-2.441,0-4.42,1.601-4.503,1.669-.167,.136-.284,.323-.336,.532L3.897,13.38c-.074,.298-.006,.614,.183,.857,.189,.242,.48,.384,.788,.384h4.023l-.865,7.261c-.04,.334,.083,.678,.35,.883,.402,.309,.836,.221,.93,.193,7.477-2.235,10.654-12.653,10.786-13.095,.09-.303,.031-.63-.157-.883Zm-9.722,11.458l.798-6.7c.034-.284-.056-.568-.246-.782-.189-.214-.462-.336-.748-.336h-3.871l2.131-8.585c.5-.338,1.687-1.036,2.986-1.036,1.092,0,2.122,.52,2.705,.88l-1.23,5.478c-.067,.296,.005,.607,.195,.844,.19,.237,.477,.375,.781,.375h4.005c-.947,2.448-3.391,7.72-7.506,9.861Z" />
                            </g>
                        </svg>
                    </>
                ) : (
                    messages.map((message, index) => (
                        <div key={index} className={`m ${message.sender}`}>
                            {message.text}
                        </div>
                    ))
                )}
            </div>
            <div className={`thinking ${isThinking}`}>AI is thinking...</div>
            <div className="chat-area r">
                <input
                    type="text"
                    id="chat-box"
                    className="chat-box"
                    placeholder="Ask anything..."
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
                <button className="send-button">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        id="Outline"
                        viewBox="0 0 24 24"
                    >
                        <path d="M18,15.5a1,1,0,0,1-.71-.29l-4.58-4.59a1,1,0,0,0-1.42,0L6.71,15.21a1,1,0,0,1-1.42-1.42L9.88,9.21a3.06,3.06,0,0,1,4.24,0l4.59,4.58a1,1,0,0,1,0,1.42A1,1,0,0,1,18,15.5Z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
