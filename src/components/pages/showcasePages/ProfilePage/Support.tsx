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
      <div className={classes.supportHeader}>
        <h2 className={classes.sectionTitle}>
          {orderId ? `Поддержка заказа #${orderId}` : "Общая поддержка"}
        </h2>
        {onBack && (
          <button
            onClick={onBack}
            className={classes.backButton}
            aria-label="Назад"
          >
            ←
          </button>
        )}
      </div>
      <div className={classes.supportList}>
        {messages.map((m) => {
          const isUserMessage =
            user && m.userId != null && String(m.userId) === String(user.id);

          return (
            <div
              key={m.id}
              className={`${classes.supportMessageRow} ${
                isUserMessage ? classes.userMessageRow : classes.adminMessageRow
              }`}
            >
              <div
                className={`${classes.supportMessage} ${
                  isUserMessage ? classes.userBubble : classes.adminBubble
                }`}
              >
                <div className={classes.supportMessageContent}>{m.content}</div>
                <div className={classes.supportTimestamp}>
                  {m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}
                </div>
              </div>
            </div>
          );
        })}
        {messages.length === 0 && (
          <div className={classes.supportEmpty}>Сообщений пока нет.</div>
        )}
      </div>

      {!orderId && (
        <div className={classes.supportNotice}>
          Выберите заказ, чтобы отправить сообщение по конкретному заказу.
        </div>
      )}

      <div className={classes.supportInputRow}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            orderId
              ? "Напишите сообщение в поддержку"
              : "Сначала выберите заказ"
          }
          className={classes.supportTextarea}
          disabled={!orderId}
        />
        <button
          className={classes.saveButton}
          onClick={send}
          disabled={!orderId}
        >
          Отправить
        </button>
      </div>
    </div>
  );
};

export default Support;
