import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { PATHS } from '../../../constants/routes';
import classes from "./ResetPasswordPage.module.css"; // Предполагаем, что есть CSS модуль
import { PATHS } from "../../../../constants/routes";

const ResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"email" | "reset">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/password-reset/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Код для сброса пароля отправлен на ваш email");
        setStep("reset");
      } else {
        setError(data.message || "Ошибка при отправке кода");
      }
    } catch (err) {
      setError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/password-reset/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Пароль успешно сброшен. Вы можете войти с новым паролем.");
        setTimeout(() => navigate(PATHS.auth), 3000);
      } else {
        setError(data.message || "Ошибка при сбросе пароля");
      }
    } catch (err) {
      setError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.resetPassword}>
      <h2>Сброс пароля</h2>
      {error && <div className={classes.error}>{error}</div>}
      {success && <div className={classes.success}>{success}</div>}

      {step === "email" && (
        <form onSubmit={handleSendCode}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Отправка..." : "Отправить код"}
          </button>
        </form>
      )}

      {step === "reset" && (
        <form onSubmit={handleResetPassword}>
          <div>
            <label htmlFor="code">Код из email:</label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Новый пароль:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Сброс..." : "Сбросить пароль"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPasswordPage;
