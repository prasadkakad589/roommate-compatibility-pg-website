import { MessageCircle, Send } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createSocket } from "../../api/socket.js";
import { useAuth } from "../../auth/AuthProvider.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";

export const ChatPage = () => {
  const { user } = useAuth();
  const [receiver, setReceiver] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const socket = useMemo(() => createSocket(), []);

  useEffect(() => {
    if (!user?.id && !user?._id) return undefined;
    const userId = user.id || user._id;
    socket.emit("register", userId);
    socket.on("receiveMessage", (message) => {
      setMessages((current) => [...current, message]);
    });
    socket.on("userTyping", () => {
      setTyping(true);
      window.setTimeout(() => setTyping(false), 1600);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("userTyping");
      socket.disconnect();
    };
  }, [socket, user]);

  const send = (event) => {
    event.preventDefault();
    if (!receiver || !text.trim()) return;

    const payload = {
      sender: user.id || user._id,
      receiver,
      text: text.trim(),
    };

    socket.emit("sendMessage", payload);
    setMessages((current) => [...current, { ...payload, msg: payload.text, local: true }]);
    setText("");
  };

  const sendTyping = () => {
    if (receiver) socket.emit("typing", { receiver });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <Card className="p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-mint text-moss">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-ink">Realtime Chat</h1>
            <p className="text-sm text-stone-600">Enter a receiver user ID to start.</p>
          </div>
        </div>
        <label>
          <span className="label">Receiver user ID</span>
          <input className="field" value={receiver} onChange={(event) => setReceiver(event.target.value)} />
        </label>
      </Card>

      <Card className="flex min-h-[520px] flex-col overflow-hidden">
        <div className="border-b border-stone-200 px-5 py-4">
          <h2 className="font-bold text-ink">Messages</h2>
          {typing ? <p className="text-sm text-moss">Typing...</p> : <p className="text-sm text-stone-500">Socket.IO live messaging</p>}
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-stone-500">No messages in this session.</div>
          ) : (
            messages.map((message, index) => (
              <div key={`${message._id || index}`} className={`flex ${message.local ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${message.local ? "bg-ink text-white" : "bg-mint text-ink"}`}>
                  {message.msg || message.text}
                </div>
              </div>
            ))
          )}
        </div>

        <form className="grid gap-2 border-t border-stone-200 p-4 sm:grid-cols-[1fr_auto]" onSubmit={send}>
          <input
            className="field"
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={sendTyping}
            placeholder="Type a message"
          />
          <Button type="submit" disabled={!receiver || !text.trim()}>
            <Send className="h-4 w-4" />
            Send
          </Button>
        </form>
      </Card>
    </div>
  );
};
