import { useEffect, useRef, useState } from "react";
import axios from "axios";
import socket from "../socket";

const Chat = () => {

  // Logged In User
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // States
  const [users, setUsers] =useState([]);

  const [receiverId, setReceiverId] =useState("");

  const [receiverName, setReceiverName] =useState("");

  const [message, setMessage] =useState("");

  const [messages, setMessages] =useState([]);

  const [typing, setTyping] =useState(false);

  const [onlineUsers, setOnlineUsers] =useState([]);

  const chatEndRef = useRef(null);

  // Restore Chat
  useEffect(() => {

    const savedChat = JSON.parse(localStorage.getItem("selectedChat"));

    if (savedChat) {
      setReceiverId(savedChat.receiverId);
      setReceiverName(savedChat.receiverName);
    }
  }, []);

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token =currentUser?.token;
        const res = await axios.get(
          "http://localhost:5000/api/users",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const filteredUsers =res.data.filter((u) =>u._id !== currentUser._id);
        setUsers(filteredUsers);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);

  // Socket Setup
  useEffect(() => {
    if (!currentUser?._id) return;
    // JOIN
    socket.emit(
      "join",
      currentUser._id
    );
    // RECEIVE MESSAGE
    const handleReceiveMessage =
      (data) => {
        if (
          data.senderId === receiverId ||
          data.receiverId === receiverId
        ) {
          setMessages((prev) => [
            ...prev,
            data,
          ]);
        }
      };
    // TYPING
    const handleTyping = () => {setTyping(true); 
      setTimeout(() => {
        setTyping(false);
      }, 2000);
    };

    // ONLINE USERS
    const handleOnlineUsers =(users) => {
        setOnlineUsers(users);
      };

    socket.on("receiveMessage",
      handleReceiveMessage
    );
    socket.on(
      "typing",
      handleTyping
    );

    socket.on(
      "onlineUsers",
      handleOnlineUsers
    );
    return () => {
      socket.off(
        "receiveMessage",
        handleReceiveMessage
      );
      socket.off(
        "typing",
        handleTyping
      );

      socket.off(
        "onlineUsers",
        handleOnlineUsers
      );
    };

  }, [currentUser, receiverId]);

  // Fetch Messages
  useEffect(() => {

    const fetchMessages = async () => {

      if (!receiverId) return;

      try {

        const res = await axios.get(
          `http://localhost:5000/api/messages/${currentUser._id}/${receiverId}`
        );

        setMessages(res.data);

      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();

  }, [receiverId]);

  // Send Message
  const sendMessage = async () => {

    if (
      !message.trim() ||
      !receiverId
    ) return;

    const msgData = {
      senderId: currentUser._id,
      receiverId,
      message,
    };

    // SOCKET
    socket.emit(
      "sendMessage",
      msgData
    );

    // SAVE TO DB
    try {

      await axios.post(
        "http://localhost:5000/api/messages",
        msgData
      );

    } catch (error) {
      console.log(error);
    }

    // UI UPDATE
    // Removed optimistic update to prevent duplicate messages.
    setMessage("");
  };

  // Typing Input
  const handleTypingInput = (e) => {

    setMessage(e.target.value);

    socket.emit("typing", {
      senderId: currentUser._id,
      receiverId,
    });
  };

  // Auto Scroll
  useEffect(() => {

    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  // Select User
  const selectUser = (user) => {

    setReceiverId(user._id);

    setReceiverName(user.name);

    localStorage.setItem(
      "selectedChat",
      JSON.stringify({
        receiverId: user._id,
        receiverName: user.name,
      })
    );
  };

  // Not Logged In
  if (!currentUser?._id) {

    return (
      <div className="flex items-center justify-center h-screen text-2xl font-bold">
        Please Login
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <svg className="hidden" aria-hidden="true" focusable="false">
        <symbol id="chat-icon-search" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M10 2a8 8 0 1 1-4.9 14.2l-3.4 3.4a1 1 0 0 1-1.4-1.4l3.4-3.4A8 8 0 0 1 10 2Zm0 2a6 6 0 1 0 0 12a6 6 0 0 0 0-12Z"
          />
        </symbol>
        <symbol id="chat-icon-send" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M3.1 20.3a1 1 0 0 1-.9-1.1L4 6.1a1 1 0 0 1 1.4-.8l15.2 7.3a1 1 0 0 1 0 1.8L5.4 20.2a1 1 0 0 1-.3.1ZM6 10.8l11.1 5.3L6 15.8v-5Z"
          />
        </symbol>
        <symbol id="chat-icon-dot" viewBox="0 0 8 8">
          <circle cx="4" cy="4" r="3" fill="currentColor" />
        </symbol>
      </svg>

      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-violet-600/30 via-transparent to-transparent" />
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-violet-300">Team messaging</p>
              <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">WorkHouse Chat</h1>
            </div>
            <div className="rounded-3xl bg-white/5 px-4 py-3 text-sm text-slate-200 ring-1 ring-white/10">
              {receiverName ? `Chatting with ${receiverName}` : "Choose a teammate to begin"}
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/90 shadow-xl shadow-black/20">
          <div className="flex flex-1 flex-col lg:flex-row">
            <aside className="h-[32rem] w-full overflow-hidden border-b border-white/10 bg-slate-950 lg:h-auto lg:w-96 lg:border-r">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Contacts</p>
                  <p className="mt-1 text-xs text-slate-500">Tap a user to start messaging</p>
                </div>
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-slate-300 ring-1 ring-white/10 transition hover:bg-slate-800">
                  <svg className="h-5 w-5" aria-hidden="true">
                    <use href="#chat-icon-search" />
                  </svg>
                </button>
              </div>
              <div className="divide-y divide-white/5 overflow-y-auto px-4 py-3">
                {users.map((u) => (
                  <button
                    key={u._id}
                    type="button"
                    onClick={() => selectUser(u)}
                    className={`group flex w-full cursor-pointer items-center gap-3 rounded-3xl px-4 py-4 text-left transition hover:bg-slate-900/80 ${
                      receiverId === u._id ? "bg-violet-500/10" : "bg-transparent"
                    }`}
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-900 text-xl font-semibold text-white ring-1 ring-white/10">
                      {u.profilePic ? (
                        <img
                          src={`http://localhost:5000/uploads/${u.profilePic}`}
                          alt={u.name}
                          className="h-full w-full rounded-3xl object-cover"
                        />
                      ) : (
                        u.name?.charAt(0)
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold text-white">{u.name}</h3>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${
                            onlineUsers.includes(u._id)
                              ? "bg-emerald-500/10 text-emerald-300"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          <svg className="h-2.5 w-2.5 text-current" aria-hidden="true">
                            <use href="#chat-icon-dot" />
                          </svg>
                          {onlineUsers.includes(u._id) ? "Online" : "Offline"}
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-slate-400">Tap to open conversation.</p>
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            <main className="flex-1 bg-slate-900/80 p-6">
              <div className="flex min-h-[10rem] flex-col gap-4 rounded-[2rem] border border-white/10 bg-slate-950/95 p-5 shadow-inner shadow-black/20">
                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-800/80 p-4 text-sm text-slate-300 shadow-sm shadow-black/20">
                  <p className="font-semibold text-white">{receiverName || "Select a contact to begin chatting"}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {receiverId
                      ? typing
                        ? "Typing..."
                        : onlineUsers.includes(receiverId)
                        ? "Online"
                        : "Offline"
                      : "No active chat selected."}
                  </p>
                </div>
                <div className="flex-1 space-y-3 overflow-y-auto px-1 pb-2">
                  {messages.length === 0 ? (
                    <div className="flex h-full min-h-[60vh] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-900/70 text-slate-500">
                      <span>No messages yet. Send your first message!</span>
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`max-w-[75%] rounded-[1.5rem] px-5 py-3 text-sm leading-6 shadow-sm ${
                          msg.senderId?.toString() === currentUser._id
                            ? "ml-auto bg-emerald-500/10 text-emerald-100 shadow-emerald-500/10"
                            : "bg-slate-800 text-slate-100 shadow-slate-900/20"
                        }`}
                      >
                        {msg.message}
                      </div>
                    ))
                  )}
                  <div ref={chatEndRef} />
                </div>
              </div>

              <div className="mt-6 rounded-[2rem] border border-white/10 bg-slate-950/80 p-4 shadow-xl shadow-black/20">
                <div className="flex items-center gap-3 rounded-full bg-slate-900 px-4 py-3 shadow-inner shadow-black/10">
                  <input
                    type="text"
                    placeholder={receiverId ? "Type a message..." : "Select a user first..."}
                    value={message}
                    onChange={handleTypingInput}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") sendMessage();
                    }}
                    disabled={!receiverId}
                    className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={sendMessage}
                    disabled={!receiverId}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-violet-500 text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:bg-slate-700"
                  >
                    <svg className="h-5 w-5" aria-hidden="true">
                      <use href="#chat-icon-send" />
                    </svg>
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );

  };

export default Chat;