import React, { useEffect, useState } from "react";
// import { supabase } from "../../../../lib/supabaseClient";
import classes from "./Order.module.css";
// Using backend API endpoints instead of Supabase realtime

type SupportMessage = {
  id: string;
  user_id?: string | null;
  order_id?: string | null;
  content: string;
  created_at?: string | null;
};

const MessagesModal: React.FC<{ orderId: string; onClose: () => void }> = ({
  orderId,
  onClose,
}) => {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await fetch(
          `/api/support_messages?orderId=${encodeURIComponent(orderId)}`,
        );
        const data = await res.json();
        if (!isMounted) return;
        setMessages(data || []);
      } catch (e) {
        console.error(e);
      }
    };
    load();

    // No realtime for now
    return () => {
      isMounted = false;
    };
  }, [orderId]);

  const send = async () => {
    if (!text.trim()) return;
    try {
      await fetch("/api/support_messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, content: text.trim() }),
      });
      const res = await fetch(
        `/api/support_messages?orderId=${encodeURIComponent(orderId)}`,
      );
      const data = await res.json();
      setMessages(data || []);
    } catch (e) {
      console.error(e);
    }
    setText("");
  };

  return (
    <div className={classes.modal} style={{ padding: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>Сообщения заказа #{orderId}</h3>
        <button onClick={onClose}>✕</button>
      </div>

      <div style={{ maxHeight: 300, overflow: "auto", marginBottom: 12 }}>
        {messages.map((m) => (
          <div
            key={m.id}
            style={{ padding: 8, borderBottom: "1px solid #eee" }}
          >
            <div style={{ fontSize: 12, color: "#666" }}>
              {m.created_at ? new Date(m.created_at).toLocaleString() : ""}
            </div>
            <div style={{ marginTop: 4 }}>{m.content}</div>
          </div>
        ))}
        {messages.length === 0 && <div>Нет сообщений по заказу.</div>}
      </div>

      <div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ width: "100%", minHeight: 80 }}
        />
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <button className={classes["status-select"]} onClick={send}>
            Отправить
          </button>
          <button onClick={onClose}>Закрыть</button>
        </div>
      </div>
    </div>
  );
};

export default MessagesModal;
