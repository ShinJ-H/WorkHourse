import { useEffect, useState, useRef } from "react";
// import { socket } from "../socket.js";

const Chat = ({ user, receiverId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  // 🔌 Socket setup
  useEffect(() => {
    if (!user?._id) return;

    socket.emit("join", user._id);

    const handleMessage = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receiveMessage", handleMessage);

    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, [user]);

  // 📩 Send message
  const sendMessage = () => {
    if (!message.trim() || !user?._id || !receiverId) return;

    const msgData = {
      senderId: user._id,
      receiverId,
      message,
    };

    socket.emit("sendMessage", msgData);
    setMessages((prev) => [...prev, msgData]);
    setMessage("");
  };

  // 📜 Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ⛔ Loading state
  if (!user?._id) {
    return <div style={styles.loading}>Loading chat...</div>;
  }

  return (
    <div style={styles.wrapper}>
      
      {/* 🟢 CHAT HEADER */}
      <div style={styles.header}>
        <div style={styles.avatar}></div>
        <div>
          <h4 style={{ margin: 0 }}>Chat</h4>
          <small style={{ color: "gray" }}>online</small>
        </div>
      </div>

      {/* 💬 CHAT BOX */}
      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf:
                msg.senderId === user._id ? "flex-end" : "flex-start",
              background:
                msg.senderId === user._id ? "#DCF8C6" : "#fff",
            }}
          >
            {msg.message}
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>

      {/* ✍️ INPUT BOX */}
      <div style={styles.inputArea}>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={styles.input}
        />

        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;

/* 🎨 STYLES */
const styles = {
  wrapper: {
    width: "420px",
    height: "550px",
    margin: "20px auto",
    borderRadius: "12px",
    border: "1px solid #ddd",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    fontFamily: "Arial",
  },

  loading: {
    textAlign: "center",
    marginTop: "50px",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px",
    background: "#075E54",
    color: "white",
  },

  avatar: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    background: "white",
  },

  chatBox: {
    flex: 1,
    padding: "10px",
    background: "#ece5dd",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },

  message: {
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "8px",
    maxWidth: "70%",
    fontSize: "14px",
    boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
  },

  inputArea: {
    display: "flex",
    padding: "8px",
    borderTop: "1px solid #ddd",
    background: "#fff",
  },

  input: {
    flex: 1,
    padding: "10px",
    border: "none",
    outline: "none",
    borderRadius: "20px",
    background: "#f0f0f0",
  },

  button: {
    marginLeft: "8px",
    padding: "10px 15px",
    border: "none",
    background: "#25D366",
    color: "white",
    borderRadius: "20px",
    cursor: "pointer",
  },
};