import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../../../store/store";
import { PATHS } from "../../../../constants/routes";
import classes from "./ProfilePage.module.css";

const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return (
      <div className={classes.profileContainer}>
        <h1 className={classes.title}>Мой профиль</h1>
        <p className={classes.text}>
          Пожалуйста, войдите, чтобы увидеть данные профиля.
        </p>
        <Link to={PATHS.auth} className={classes.authLink}>
          Войти
        </Link>
      </div>
    );
  }

  return (
    <div className={classes.profileContainer}>
      <h1 className={classes.title}>Мой профиль</h1>
      <div className={classes.card}>
        <div className={classes.row}>
          <span className={classes.label}>Имя пользователя</span>
          <span className={classes.value}>{user.username || "—"}</span>
        </div>
        <div className={classes.row}>
          <span className={classes.label}>Email</span>
          <span className={classes.value}>{user.email || "—"}</span>
        </div>
      </div>
      <p className={classes.hint}>
        Здесь можно добавить историю заказов, адреса и настройки позже.
      </p>
    </div>
  );
};

export default ProfilePage;
