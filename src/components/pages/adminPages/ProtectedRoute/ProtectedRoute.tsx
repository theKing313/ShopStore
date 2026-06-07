import { useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import { PATHS } from "../../../../constants/routes";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <Navigate to={PATHS.login} replace />;
  }

  if (user.email !== "admin@gmail.com") {
    return <Navigate to={PATHS.showcase} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
