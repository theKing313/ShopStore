import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/store";
import { AlertType } from "../../../../types/common";
import { showAlert } from "../../../../store/CommonSlice";
import { PATHS } from "../../../../constants/routes";
import { generatePath, Outlet, useNavigate } from "react-router-dom";
import { loginAdmin, setAdmin } from "../../../../store/adminSlice";

const ProtectedRoute: React.FC = () => {
  const admin_mock = {
    username: "admin",
    email: "admin@gmail.com",
    phone: "",
    address: "",
  };
  const dispatch = useDispatch<AppDispatch>();
  const { admin } = useSelector((state: RootState) => state.admin);

  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("1234");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin && !admin) {
      dispatch(setAdmin(JSON.parse(storedAdmin)));
    }
  }, [admin, dispatch]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await dispatch(
        loginAdmin({ name: "admin", email, password }),
      ).unwrap();
      console.log("Login result:", JSON.stringify(result));
      if (result && result.user) {
        dispatch(
          showAlert({
            type: AlertType.Success,
            message: "Успешный вход в админку!",
          }),
        );
      }

      //   // Устанавливаем пользователя в state
      dispatch(setAdmin(admin_mock));
      // }

      navigate(`${PATHS.admin}/products`); // Перенаправляем на страницу админки после успешного входа
      //   await dispatch(authUser({ name: "", email, password })).unwrap();
      // Если успешно, user будет установлен в Redux
    } catch (err: any) {
      setError(err.message || "Ошибка входа");
      dispatch(
        showAlert({
          type: AlertType.Error,
          message: "Ошибка входа",
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };
  if (admin) {
    return <Outlet />; // Если пользователь есть, рендерим дочерние маршруты админки
  }
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          width: "300px",
          textAlign: "center",
        }}
      >
        <h2>Вход в админку</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                boxSizing: "border-box",
              }}
            />
          </div>
          {error && (
            <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: isLoading ? "#ccc" : "#e99211",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProtectedRoute;
