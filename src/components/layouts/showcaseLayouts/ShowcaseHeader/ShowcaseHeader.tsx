import Badge from "../../../UI/Badge/Badge";
import CartIcon from "../../../UI/icons/CartIcon/CartIcon";
import FavoriteIcon from "../../../UI/icons/FavoriteIcon/FavoriteIcon";
import classes from "./ShowcaseHeader.module.css";
// import Logo from "../../../../assets/logo.png"; // Убрали импорт логотипа
import { PATHS } from "../../../../constants/routes";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import Menu from "../../../showcase/Menu/Menu";
import { Link } from "react-router-dom";
import AuthIcon from "../../../UI/icons/AuthIcon/AuthIcon";

interface IShowcaseHeaderProps {}

const ShowcaseHeader: React.FC<IShowcaseHeaderProps> = () => {
  const categories = useSelector(
    (state: RootState) => state.category.categories,
  );
  const { wishlist, cart } = useSelector((state: RootState) => state.user);
  const totalProductsQuantityInCart = cart.reduce(
    (res, val) => res + val.quantity,
    0,
  );
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <header className={classes.header}>
      <div className={classes["admin-link-wrapper"]}>
        <Link to={`${PATHS.admin}${PATHS.orders}`} className={classes.link}>
          Перейти в админку
        </Link>
      </div>
      <div className={classes["wrapper"]}>
        <Link to={PATHS.showcase} className={classes.logoLink}>
          <div className={classes.logo}>ShopStore</div>
        </Link>

        <div className={classes["actions-wrapper"]}>
          <Menu categories={categories} />

          <div className={classes["badge-wrapper"]}>
            <Badge
              icon={<FavoriteIcon width={24} height={24} />}
              to={PATHS.wishlist}
              count={wishlist?.length}
              title={"Избранное"}
            />

            <Badge
              icon={<CartIcon width={24} height={24} />}
              to={PATHS.cart}
              count={totalProductsQuantityInCart}
              title={"Корзина"}
            />
            {}
            {user ? (
              <Link to={PATHS.profile} className={classes.userLink}>
                <span className={classes.userLabel}>Мой профиль</span>
                <span className={classes.userName}>{user.username}</span>
              </Link>
            ) : (
              <Badge
                icon={<AuthIcon width={24} height={24} />}
                to={PATHS.auth}
                count={0}
                title="Войти"
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ShowcaseHeader;
