import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import { RootState } from "../../../../../store/store";
// import { supabase } from "../../../../../lib/supabaseClient";
import classes from "./ProfilePage.module.css";
// Using backend API endpoints; Supabase client not required here
import { RootState } from "../../../../store/store";

type SupportMessage = {
  id: string;
  user_id?: string | null;
  order_id?: string | null;
  content: string;
  created_at?: string | null;
};

interface Props {
  orderId?: string | null;
}

const Support: React.FC<Props> = ({ orderId }) => {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [text, setText] = useState("");
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const q = orderId
          ? `/api/support_messages?orderId=${encodeURIComponent(orderId)}`
          : "/api/support_messages";
        const res = await fetch(q);
        const data = await res.json();
        if (!isMounted) return;
        setMessages(data || []);
      } catch (e) {
        console.error(e);
      }
    };

    load();

    // No realtime for now; simple polling could be added later
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
        body: JSON.stringify({
          userId: user?.id || null,
          orderId: orderId || null,
          content: text.trim(),
        }),
      });
      // reload messages
      const res = await fetch(
        orderId
          ? `/api/support_messages?orderId=${encodeURIComponent(orderId)}`
          : "/api/support_messages",
      );
      const data = await res.json();
      setMessages(data || []);
    } catch (e) {
      console.error(e);
    }
    setText("");
  };

  return (
    <div className={classes.profileCard}>
      <h2 className={classes.sectionTitle}>Поддержка / Сообщения</h2>
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
        {messages.length === 0 && <div>Сообщений пока нет.</div>}
      </div>

      <div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Напишите сообщение в поддержку"
          style={{ width: "100%", minHeight: 80 }}
        />
        <button
          className={classes.saveButton}
          onClick={send}
          style={{ marginTop: 8 }}
        >
          Отправить
        </button>
      </div>
    </div>
  );
};

export default Support;
