import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import { RootState } from "../../../../../store/store";
// import { supabase } from "../../../../../lib/supabaseClient";
import classes from "./ProfilePage.module.css";
// Using backend API endpoints; Supabase client not required here
import { RootState } from "../../../../store/store";

type SupportMessage = {
  id: string;
  userId?: number | null;
  orderId?: string | null;
  content: string;
  createdAt?: string | null;
};

interface Props {
  orderId?: string | null;
  onBack?: () => void;
}

const Support: React.FC<Props> = ({ orderId, onBack }) => {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [text, setText] = useState("");
  const user = useSelector((state: RootState) => state.auth.user);
  const BASE_URL =
    process.env.REACT_APP_API_URL || "https://backendstore-9jt0.onrender.com";

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const q = orderId
          ? `${BASE_URL}/api/support_messages?orderId=${encodeURIComponent(orderId)}`
          : `${BASE_URL}/api/support_messages`;
        const res = await fetch(q);
        const data = await res.json();
        if (!isMounted) return;
        // Ensure data is an array
        setMessages(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load messages:", e);
        setMessages([]);
      }
    };

    load();
    const intervalId = window.setInterval(load, 5000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [orderId, BASE_URL]);

  const send = async () => {
    if (!text.trim()) return;
    if (!orderId) {
      console.error("Cannot send support message without orderId");
      return;
    }
    try {
      const postRes = await fetch(`${BASE_URL}/api/support_messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || null,
          orderId,
          content: text.trim(),
        }),
      });

      if (!postRes.ok) {
        console.error("Failed to send message:", postRes.status);
      }

      // reload messages
      const res = await fetch(
        `${BASE_URL}/api/support_messages?orderId=${encodeURIComponent(orderId)}`,
      );
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error sending message:", e);
    }
    setText("");
  };

  return (
    <div className={classes.profileCard}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 className={classes.sectionTitle}>
          {orderId ? `Поддержка заказа #${orderId}` : "Общая поддержка"}
        </h2>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              padding: "6px 12px",
              background: "#6b7280",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            ← Назад
          </button>
        )}
      </div>
      <div style={{ maxHeight: 300, overflow: "auto", marginBottom: 12 }}>
        {messages.map((m) => (
          <div
            key={m.id}
            style={{ padding: 8, borderBottom: "1px solid #eee" }}
          >
            <div style={{ fontSize: 12, color: "#666" }}>
              {m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}
            </div>
            <div style={{ marginTop: 4 }}>{m.content}</div>
          </div>
        ))}
        {messages.length === 0 && <div>Сообщений пока нет.</div>}
      </div>

      {!orderId && (
        <div style={{ marginBottom: 12, color: "#b91c1c" }}>
          Выберите заказ, чтобы отправить сообщение по конкретному заказу.
        </div>
      )}

      <div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            orderId
              ? "Напишите сообщение в поддержку"
              : "Сначала выберите заказ"
          }
          style={{ width: "100%", minHeight: 80 }}
          disabled={!orderId}
        />
        <button
          className={classes.saveButton}
          onClick={send}
          style={{ marginTop: 8 }}
          disabled={!orderId}
        >
          Отправить
        </button>
      </div>
    </div>
  );
};

export default Support;
