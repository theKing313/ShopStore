import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import { PATHS } from "../../../../constants/routes";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Loader from "../../../UI/Loader/Loader";

const ProtectedRoute: React.FC = () => {
  const { user, loading, checked } = useSelector(
    (state: RootState) => state.auth,
  );
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (user?.email !== "admin@gmail.com") return;

    const checkExpiry = () => {
      const expiresAt = Number(
        localStorage.getItem("adminSessionExpiresAt") || "0",
      );
      if (expiresAt && Date.now() > expiresAt) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("adminSessionExpiresAt");
        navigate(PATHS.login, { replace: true });
      }
    };

    const intervalId = window.setInterval(checkExpiry, 10_000);
    checkExpiry();

    return () => window.clearInterval(intervalId);
  }, [user, navigate]);

  if (loading || (token && !checked)) {
    return <Loader />;
  }

  const adminSessionExpiresAt = Number(
    localStorage.getItem("adminSessionExpiresAt") || "0",
  );

  if (user?.email === "admin@gmail.com" && Date.now() > adminSessionExpiresAt) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminSessionExpiresAt");
    return <Navigate to={PATHS.login} replace />;
  }

  if (!user) {
    return <Navigate to={PATHS.login} replace />;
  }

  if (user.email !== "admin@gmail.com") {
    return <Navigate to={PATHS.showcase} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
