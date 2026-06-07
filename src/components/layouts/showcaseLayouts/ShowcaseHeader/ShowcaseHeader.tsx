import Badge from "../../../UI/Badge/Badge";
import CartIcon from "../../../UI/icons/CartIcon/CartIcon";
import FavoriteIcon from "../../../UI/icons/FavoriteIcon/FavoriteIcon";
import classes from "./ShowcaseHeader.module.css";
import { PATHS } from "../../../../constants/routes";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import Menu from "../../../showcase/Menu/Menu";
import { Link } from "react-router-dom";
import AuthIcon from "../../../UI/icons/AuthIcon/AuthIcon";
import { useState, useEffect } from "react";

interface IShowcaseHeaderProps {}

const ShowcaseHeader: React.FC<IShowcaseHeaderProps> = () => {
  const categories = useSelector(
    (state: RootState) => state.category.categories,
  );

  const { wishlist, cart } = useSelector((state: RootState) => state.user);

  const user = useSelector((state: RootState) => state.auth.user);

  const totalProductsQuantityInCart = cart.reduce(
    (res, val) => res + val.quantity,
    0,
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className={classes.header}>
        <div className={classes.wrapper}>
          <Link to={PATHS.showcase} className={classes.logoLink}>
            <div className={classes.logo}>ShopStore</div>
          </Link>

          <div className={classes.desktopMenu}>
            <Menu categories={categories} />
          </div>

          <div className={classes.actionsWrapper}>
            <Badge
              icon={<FavoriteIcon width={24} height={24} />}
              to={PATHS.wishlist}
              count={wishlist?.length}
              title="Избранное"
            />

            <Badge
              icon={<CartIcon width={24} height={24} />}
              to={PATHS.cart}
              count={totalProductsQuantityInCart}
              title="Корзина"
            />

            {user ? (
              <Link to={PATHS.profile} className={classes.userLink}>
                <span className={classes.userLabel}>Профиль</span>
                <span className={classes.userName}>{user.username}</span>
              </Link>
            ) : (
              <Badge
                icon={<AuthIcon width={24} height={24} />}
                to={PATHS.login}
                count={0}
                title="Войти"
              />
            )}
          </div>

          <button
            className={`${classes.burger} ${isMenuOpen ? classes.active : ""}`}
            onClick={toggleMenu}
            aria-label="Открыть меню"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <div
        className={`${classes.mobileMenu} ${isMenuOpen ? classes.open : ""}`}
        onClick={closeMenu}
      >
        <div
          className={classes.mobileMenuContent}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={classes.mobileHeader}>
            <div className={classes.logo}>ShopStore</div>

            <button className={classes.closeButton} onClick={closeMenu}>
              ✕
            </button>
          </div>

          <nav className={classes.mobileNav}>
            <Link
              to={PATHS.showcase}
              className={classes.mobileNavLink}
              onClick={closeMenu}
            >
              Главная
            </Link>

            <Link
              to={PATHS.discounts}
              className={classes.mobileNavLink}
              onClick={closeMenu}
            >
              Акции
            </Link>

            <Link
              to={PATHS.wishlist}
              className={classes.mobileNavLink}
              onClick={closeMenu}
            >
              Избранное ({wishlist?.length || 0})
            </Link>

            <Link
              to={PATHS.cart}
              className={classes.mobileNavLink}
              onClick={closeMenu}
            >
              Корзина ({totalProductsQuantityInCart})
            </Link>

            {user ? (
              <Link
                to={PATHS.profile}
                className={classes.mobileNavLink}
                onClick={closeMenu}
              >
                {user.username}
              </Link>
            ) : (
              <Link
                to={PATHS.login}
                className={classes.mobileNavLink}
                onClick={closeMenu}
              >
                Войти
              </Link>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default ShowcaseHeader;
