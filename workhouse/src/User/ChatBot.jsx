import axios from "axios";
import React, { useState, useEffect } from "react";

export default function ChatBot() {
    // const [data, setData] = useState([]);
    // const [input, setInput] = useState("");
    // const [loading, setLoading] = useState(false);

    // // ✅ Load chat history when page loads
    // useEffect(() => {
    //     const savedChats = localStorage.getItem("chatHistory");
    //     if (savedChats) {
    //         setData(JSON.parse(savedChats));
    //     }
    // }, []);

    // // ✅ Save chat history whenever it updates
    // useEffect(() => {
    //     localStorage.setItem("chatHistory", JSON.stringify(data));
    // }, [data]);

    // const handleChatBot = async () => {
    //     if (!input.trim() || loading) return;

    //     const updatedMessages = [...data, { text: input, sender: "user" }];
    //     setData(updatedMessages);
    //     setInput("");
    //     setLoading(true);

    //     try {
    //         const res = await axios.post("http://localhost:5000/api/chat", {
    //             messages: updatedMessages.map(m => m.text)
    //         });

    //         const botReply = res?.data?.reply || "No reply";

    //         setData([
    //             ...updatedMessages,
    //             { text: botReply, sender: "bot" }
    //         ]);

    //     } catch (error) {
    //         console.error("Frontend Error:", error);

    //         let msg = "Something went wrong";

    //         if (error?.response?.status === 429) {
    //             msg = "Daily limit reached. Try again tomorrow.";
    //         } else if (error?.response?.status === 503) {
    //             msg = "Server busy. Try again.";
    //         }

    //         setData([
    //             ...updatedMessages,
    //             { text: msg, sender: "bot" }
    //         ]);
    //     }

    //     setLoading(false);
    // };

    const [chats, setChats] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);

    // ✅ Load chats (fixed)
    useEffect(() => {
        if (loaded) return;

        const saved = JSON.parse(localStorage.getItem("allChats")) || [];

        if (saved.length === 0) {
            const newChat = {
                id: Date.now(),
                title: "New Chat",
                messages: []
            };
            setChats([newChat]);
            setCurrentChatId(newChat.id);
        } else {
            setChats(saved);
            setCurrentChatId(saved[0].id);
        }

        setLoaded(true);
    }, [loaded]);

    // ✅ Save chats
    useEffect(() => {
        if (loaded) {
            localStorage.setItem("allChats", JSON.stringify(chats));
        }
    }, [chats, loaded]);

    const currentChat = chats.find(c => c.id === currentChatId);

    // ✅ New chat
    const createNewChat = () => {
        const newChat = {
            id: Date.now(),
            title: "New Chat",
            messages: []
        };

        setChats(prev => [newChat, ...prev]);
        setCurrentChatId(newChat.id);
    };

    //Delete chats
    const deleteChat = (id) => {
        const updatedChats = chats.filter(chat => chat.id !== id);

        if (updatedChats.length === 0) {
            const newChat = {
                id: Date.now(),
                title: "New Chat",
                messages: []
            };
            setChats([newChat]);
            setCurrentChatId(newChat.id);
        } else {
            setChats(updatedChats);
            setCurrentChatId(updatedChats[0].id);
        }
    };

    // ✅ Update chat
    const updateChat = (messages) => {
        setChats(prev =>
            prev.map(chat =>
                chat.id === currentChatId
                    ? {
                        ...chat,
                        messages,
                        title: messages[0]?.text.slice(0, 20) || "Chat"
                    }
                    : chat
            )
        );
    };

    // ✅ Send message
    const handleChatBot = async () => {

        if (!input.trim() || loading) return;

        if (!currentChatId) {
            createNewChat();
            return;
        }

        const updatedMessages = [
            ...(currentChat?.messages || []),
            { text: input, sender: "user" }
        ];

        updateChat(updatedMessages);
        setInput("");
        setLoading(true);

        try {
            const res = await axios.post("http://localhost:5000/api/chat", {
                messages: updatedMessages.map(m => m.text)
            });

            const reply = res?.data?.reply || "No reply";

            updateChat([
                ...updatedMessages,
                { text: reply, sender: "bot" }
            ]);

        } catch (error) {

            let msg = "Error from server";

            if (error?.response?.status === 503) {
                msg = "Server busy, try again";
            }

            if (error?.response?.status === 429) {
                msg = "Rate limit reached";
            }

            updateChat([
                ...updatedMessages,
                { text: msg, sender: "bot" }
            ]);
        }

        setLoading(false);
    };
    return (
        <>
            {/* <div className="mx-20 my-10">
            <div className="border p-5 h-[400px] overflow-y-auto rounded bg-gray-50">
                {data.map((m, i) => (
                    <p
                        key={i}
                        className={`p-2 my-1 rounded ${
                            m.sender === "user"
                                ? "text-right bg-blue-100"
                                : "text-left bg-green-100"
                        }`}
                    >
                        <strong>{m.sender === "user" ? "You: " : "Bot: "}</strong>
                        {m.text}
                    </p>
                ))}
            </div>

            <div className="flex mt-5">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="border w-full p-2 rounded-l"
                    placeholder="Type a message..."
                />
                <button
                    onClick={handleChatBot}
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 rounded-r"
                >
                    {loading ? "Thinking..." : "Send"}
                </button>
            </div>
        </div> */}

            <div className="flex h-screen">

                {/* Sidebar */}
                <div className="w-1/4 border-r p-4">
                    <button
                        onClick={createNewChat}
                        className="bg-blue-500 text-white w-full p-2 mb-4"
                    >
                        + New Chat
                    </button>

                    {chats.map(chat => (
                        <div
                            key={chat.id}
                            className={`flex justify-between items-center p-2 border mb-2 ${chat.id === currentChatId ? "bg-gray-200" : ""
                                }`}
                        >
                            <span
                                onClick={() => setCurrentChatId(chat.id)}
                                className="cursor-pointer w-full"
                            >
                                {chat.title}
                            </span>

                            <button
                                onClick={() => deleteChat(chat.id)}
                                className="text-red-500 ml-2"
                            >
                                {/* ❌ */} Delete
                            </button>
                        </div>
                    ))}
                </div>

                {/* Chat */}
                <div className="w-3/4 p-4 flex flex-col">

                    <div className="flex-1 overflow-y-auto border p-4 mb-4">
                        {currentChat?.messages?.length > 0 ? (
                            currentChat.messages.map((m, i) => (
                                <p key={i} className={m.sender === "user" ? "text-right" : "text-left"}>
                                    <strong>{m.sender === "user" ? "You: " : "Bot: "}</strong>
                                    {m.text}
                                </p>
                            ))
                        ) : (
                            <p>No messages yet</p>
                        )}
                    </div>

                    <div className="flex">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="border w-full p-2"
                            placeholder="Type message..."
                        />
                        <button
                            onClick={handleChatBot}
                            disabled={loading}
                            className="bg-green-500 text-white px-4"
                        >
                            {loading ? "..." : "Send"}
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}