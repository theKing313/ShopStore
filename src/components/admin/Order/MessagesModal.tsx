import React, { useEffect, useState } from "react";
// import { supabase } from "../../../../lib/supabaseClient";
import classes from "./Order.module.css";
// Using backend API endpoints instead of Supabase realtime

type SupportMessage = {
  id: string;
  userId?: number | null;
  orderId?: string | null;
  content: string;
  createdAt?: string | null;
};

const MessagesModal: React.FC<{ orderId: string; onClose: () => void }> = ({
  orderId,
  onClose,
}) => {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [text, setText] = useState("");
  const BASE_URL =
    process.env.REACT_APP_API_URL || "https://backendstore-9jt0.onrender.com";

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/support_messages?orderId=${encodeURIComponent(orderId)}`,
        );
        const data = await res.json();
        if (!isMounted) return;
        setMessages(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      }
    };
    load();
    const intervalId = window.setInterval(load, 5000);

    // No realtime for now
    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [orderId, BASE_URL]);

  const send = async () => {
    if (!text.trim()) return;
    try {
      await fetch(`${BASE_URL}/api/support_messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, content: text.trim() }),
      });
      const res = await fetch(
        `${BASE_URL}/api/support_messages?orderId=${encodeURIComponent(orderId)}`,
      );
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
    setText("");
  };

  return (
    <div className={classes.modal} style={{ padding: 12 }}>
      <div className={classes.messageHeader}>
        <h3>Поддержка заказа #{orderId}</h3>
        <button className={classes.closeButton} onClick={onClose}>
          ✕
        </button>
      </div>

      <div className={classes.messageList}>
        {messages.map((m) => {
          const isUserMessage = m.userId != null;
          const authorLabel = isUserMessage ? "Пользователь" : "Админ";

          return (
            <div
              key={m.id}
              className={`${classes.messageRow} ${
                isUserMessage ? classes.userRow : classes.adminRow
              }`}
            >
              <div className={classes.messageBubble}>
                <div
                  className={
                    isUserMessage
                      ? classes.messageLabelUser
                      : classes.messageLabelAdmin
                  }
                >
                  {authorLabel}
                </div>
                <div className={classes.messageText}>{m.content}</div>
                <div className={classes.messageTimestamp}>
                  {m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}
                </div>
              </div>
            </div>
          );
        })}
        {messages.length === 0 && (
          <div className={classes.messageEmpty}>Нет сообщений по заказу.</div>
        )}
      </div>

      <div className={classes.messageInputSection}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={classes.messageTextarea}
          placeholder="Напишите сообщение в поддержку"
        />
        <div className={classes.messageActions}>
          <button className={classes["status-select"]} onClick={send}>
            Отправить
          </button>
          <button className={classes.closeButtonSecondary} onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagesModal;
