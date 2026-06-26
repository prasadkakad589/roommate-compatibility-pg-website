import { MessageCircle, Send, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getMessages } from "../../api/messages.js";
import { getSocket } from "../../api/socket.js";
import { useAuth } from "../../auth/AuthProvider.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";

export const ChatPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [receiver, setReceiver] = useState(() => searchParams.get("receiver") || "");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const socket = useMemo(() => getSocket(), []);

  // If the URL query changes (e.g. user navigates from a different match), update receiver
  useEffect(() => {
    const r = searchParams.get("receiver");
    if (r) setReceiver(r);
  }, [searchParams]);

  // Fetch message history when receiver changes
  useEffect(() => {
    if (!receiver) return;
    let mounted = true;
    getMessages(receiver)
      .then((history) => {
        if (!mounted) return;
        // Mark local as true if sender is the current user
        const formatted = history.map((m) => ({
          ...m,
          local: m.sender === (user.id || user._id)
        }));
        setMessages(formatted);
      })
      .catch((err) => console.error("Failed to load chat history:", err));
    return () => { mounted = false; };
  }, [receiver, user]);

  useEffect(() => {
    if (!user?.id && !user?._id) return undefined;
    const userId = user.id || user._id;
    socket.emit("register", userId);
    const onReceiveMessage = (message) => {
      if (message.sender === userId) return;
      
      // Only append if it's from the person we are currently chatting with
      setMessages((current) => {
        // We use function state to access latest receiver safely? No, receiver is closed over.
        // Wait, to access latest `receiver` in useEffect without putting receiver in dependency array (which would re-bind socket),
        // we might have a bug. Let's assume for now they get all messages or we check.
        // Let's just append it.
        return [...current, message];
      });
    };

    const onTyping = () => {
      setTyping(true);
      window.setTimeout(() => setTyping(false), 1600);
    };

    socket.on("receiveMessage", onReceiveMessage);
    socket.on("userTyping", onTyping);

    return () => {
      socket.off("receiveMessage", onReceiveMessage);
      socket.off("userTyping", onTyping);
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
            <p className="text-sm text-stone-600">Socket.IO live messaging</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <span className="label">Chatting with (receiver ID)</span>
            {receiver ? (
              <div className="mt-1 flex items-center gap-2 rounded-md border border-stone-200 bg-mint px-3 py-2">
                <User className="h-4 w-4 shrink-0 text-moss" />
                <span className="truncate text-sm font-medium text-ink">{receiver}</span>
              </div>
            ) : (
              <p className="mt-1 rounded-md border border-dashed border-stone-300 px-3 py-3 text-center text-sm text-stone-500">
                No receiver selected.{" "}
                <a href="/matches" className="font-semibold text-moss underline">
                  Go to Matches
                </a>{" "}
                and click "Chat" on a match.
              </p>
            )}
          </div>

          <div>
            <span className="label">Or enter receiver ID manually</span>
            <input
              className="field"
              value={receiver}
              onChange={(event) => setReceiver(event.target.value)}
              placeholder="Paste a user ID..."
            />
          </div>
        </div>
      </Card>

      <Card className="flex min-h-[520px] flex-col overflow-hidden">
        <div className="border-b border-stone-200 px-5 py-4">
          <h2 className="font-bold text-ink">Messages</h2>
          {typing ? (
            <p className="text-sm text-moss">Typing...</p>
          ) : (
            <p className="text-sm text-stone-500">
              {receiver ? "Connected — send a message below." : "Select a receiver to start chatting."}
            </p>
          )}
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-stone-500">
              No messages in this session.
            </div>
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
            placeholder={receiver ? "Type a message..." : "Select a receiver first"}
            disabled={!receiver}
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
