import io from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io.connect("http://localhost:8080");

function Chat() {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState([]);

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  const sendMessage = () => {
    socket.emit("send_message", { message, room });
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageHistory((prevHistory) => [...prevHistory, data]);
    });

    // Fetch chat history when joining a room
    socket.on("chat_history", (history) => {
      setMessageHistory(history);
    });
  }, []);

  return (
    <div className="Chat">
      <input
        placeholder="Room Number..."
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />
      <button onClick={joinRoom}> Join Room</button>
      <input
        placeholder="Message..."
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <button onClick={sendMessage}> Send Message</button>
      <h1>Chat History:</h1>
      <div>
        {messageHistory.map((msg, index) => (
          <p key={index}>{msg.message}</p>
        ))}
      </div>
    </div>
  );
}

export default Chat;
