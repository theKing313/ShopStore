import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import classes from "./ProfilePage.module.css";

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
  const [userName, setUserName] = useState<string>("");

  const user = useSelector((state: RootState) => state.auth.user);
  // const userProfile = useSelector((state: RootState) => state.user.profile);

  const BASE_URL =
    process.env.REACT_APP_API_URL || "https://backendstore-9jt0.onrender.com";

  // Get user name from multiple possible sources
  useEffect(() => {
    // Try to get name from profile first, then user object, then fallback
    const name = user?.username || "Я";

    setUserName(name);
  }, [user]);

  const loadMessages = useCallback(async () => {
    try {
      const q = orderId
        ? `${BASE_URL}/api/support_messages?orderId=${encodeURIComponent(orderId)}`
        : `${BASE_URL}/api/support_messages`;
      const res = await fetch(q);
      const data = await res.json();

      // Ensure data is an array
      setMessages(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load messages:", e);
      setMessages([]);
    }
  }, [orderId, BASE_URL]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      await loadMessages();
    };

    load();
    const intervalId = window.setInterval(load, 5000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [loadMessages]);

  const send = async () => {
    if (!text.trim()) return;
    if (!orderId) {
      console.error("Cannot send support message without orderId");
      return;
    }

    // If we don't have the user's name yet, try to fetch it
    if (!userName && user?.id) {
      try {
        const profileRes = await fetch(`${BASE_URL}/api/users/${user.id}`);
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          const fetchedName = profileData?.name || profileData?.firstName || "";
          setUserName(fetchedName);
        }
      } catch (e) {
        console.error("Failed to fetch user profile:", e);
      }
    }

    try {
      const postRes = await fetch(`${BASE_URL}/api/support_messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || null,
          orderId,
          content: text.trim(),
          // Optionally include userName in the message if your backend supports it
          userName: userName || "Пользователь",
        }),
      });

      if (!postRes.ok) {
        console.error("Failed to send message:", postRes.status);
      }

      // Reload messages
      await loadMessages();
    } catch (e) {
      console.error("Error sending message:", e);
    }
    setText("");
  };

  // Determine author label for messages
  const getAuthorLabel = (message: SupportMessage) => {
    const isUserMessage =
      user &&
      message.userId != null &&
      String(message.userId) === String(user.id);

    if (!isUserMessage) return "Админ";

    // If it's the user's message, show their name or fallback
    return userName || "Пользователь";
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
          const authorLabel = getAuthorLabel(m);

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
                <div
                  className={
                    isUserMessage
                      ? classes.supportMessageLabelUser
                      : classes.supportMessageLabelAdmin
                  }
                >
                  {authorLabel}
                </div>
                <div className={classes.supportMessageContent}>{m.content}</div>
                <div
                  className={
                    isUserMessage
                      ? classes.supportTimestampUser
                      : classes.supportTimestampAdmin
                  }
                >
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
