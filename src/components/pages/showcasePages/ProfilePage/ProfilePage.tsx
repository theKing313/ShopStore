import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../../../store/store";
import { PATHS } from "../../../../constants/routes";
import classes from "./ProfilePage.module.css";
import { logOut } from "../../../../store/AuthSlice";
import { useEffect, useState } from "react";
import { fetchOrders } from "../../../../store/CommonSlice";

const ProfilePage = () => {
  const [profileState, setProfileState] = useState("PROFILE");
  const [bonusesToSpend, setBonusesToSpend] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [userBonuses, setUserBonuses] = useState(50);

  const profileLists = (state: any, action: any): any => {
    switch (action.type) {
      case "PROFILE":
        // return { ...state, isLoading: true, error: null };
        setProfileState("PROFILE");
        break;
      case "ORDERS":
        setProfileState("ORDERS");
        break;
      // return { ...state, isLoading: true, error: null };
      default:
        return state;
    }
  };

  const handleSpendBonuses = () => {
    const amount = parseInt(bonusesToSpend);
    if (amount > 0 && amount <= userBonuses) {
      setAppliedDiscount(amount);
      setUserBonuses(userBonuses - amount);
      setBonusesToSpend("");
      alert(`✅ Применена скидка ${amount}₽ за счёт бонусов!`);
    } else {
      alert(`❌ Укажите сумму от 1 до ${userBonuses} бонусов`);
    }
  };
  const user = useSelector((state: RootState) => state.auth.user);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (user) {
      dispatch(fetchOrders());
    }
  }, [dispatch, user]);
  // const orders = useSelector((state: RootState) => state.common.orders);
  const orders = useSelector((state: RootState) => state.common.orders);

  const handleLogOut = () => {
    dispatch(logOut());
  };
  console.log("Orders in ProfilePage:", orders);
  console.log("Current user in ProfilePage:", user);
  if (!user) {
    return (
      <div className={classes.emptyPage}>
        <div className={classes.emptyCard}>
          <h1 className={classes.title}>Мой профиль</h1>
          <p className={classes.text}>
            Пожалуйста, войдите, чтобы увидеть данные профиля.
          </p>
          <Link to={PATHS.auth} className={classes.authLink}>
            Войти в аккаунт
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.page}>
      <aside className={classes.sidebar}>
        <div className={classes.sidebarTop}>
          <div className={classes.brand}>TBOE</div>
          <nav className={classes.menu}>
            <Link
              to={PATHS.profile}
              className={`${classes.menuItem} ${classes.active}`}
              onClick={() => profileLists({}, { type: "PROFILE" })}
            >
              Профиль
            </Link>
            <Link
              // to={PATHS.wishlist}
              to={PATHS.profile}
              className={classes.menuItem}
              onClick={() => profileLists({}, { type: "ORDERS" })}
            >
              Заказы
            </Link>
            <Link to={PATHS.wishlist} className={classes.menuItem}>
              Бонусы
            </Link>
            <Link
              to={PATHS.showcase}
              className={classes.menuItem}
              onClick={handleLogOut}
            >
              Выйти
            </Link>
          </nav>
        </div>
        {user.isVerified ? (
          <div className={classes.bonusCard}>
            <span className={classes.bonusLabel}>Бонусы</span>
            <strong className={classes.bonusValue}>{userBonuses} Т</strong>
            <p className={classes.bonusText}>
              Спасибо за подтверждение email! Вы можете тратить бонусы в
              магазине.
            </p>
            <div style={{ marginTop: "12px" }}>
              <input
                type="number"
                min="1"
                max={userBonuses}
                value={bonusesToSpend}
                onChange={(e) => setBonusesToSpend(e.target.value)}
                placeholder="Сумма"
                style={{
                  width: "100%",
                  padding: "6px",
                  marginBottom: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  fontSize: "12px",
                }}
              />
              <button
                onClick={handleSpendBonuses}
                style={{
                  width: "100%",
                  padding: "8px",
                  background: "#2ecc71",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                Потратить
              </button>
            </div>
          </div>
        ) : (
          <div className={classes.bonusCard}>
            <span className={classes.bonusLabel}>Бонусы</span>
            <strong className={classes.bonusValue}>{userBonuses} Т</strong>

            <p className={classes.bonusText}>
              Подтвердите email, чтобы тратить бонусы в магазине.
            </p>
          </div>
        )}
      </aside>

      <main className={classes.content}>
        {profileState === "PROFILE" && (
          <div className={classes.profileInfo}>
            <div className={classes.headerRow}>
              <h1 className={classes.title}>Профиль</h1>
              <span className={classes.status}>Активный</span>
            </div>

            {appliedDiscount > 0 && (
              <div
                style={{
                  background: "#d4edda",
                  border: "1px solid #28a745",
                  color: "#155724",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  fontWeight: "500",
                }}
              >
                ✅ Скидка {appliedDiscount}₽ применена! Используйте её при
                оплате.
              </div>
            )}

            <div className={classes.profileGrid}>
              <section className={classes.profileCard}>
                <h2 className={classes.sectionTitle}>Личные данные</h2>
                <div className={classes.field}>
                  <label className={classes.label}>Имя и фамилия</label>
                  <input
                    className={classes.input}
                    defaultValue={user.username || ""}
                  />
                </div>
                <div className={classes.field}>
                  <label className={classes.label}>Email</label>
                  <input
                    className={classes.input}
                    defaultValue={user.email || ""}
                  />
                </div>
                <div className={classes.field}>
                  <label className={classes.label}>Телефон</label>
                  <input
                    className={classes.input}
                    defaultValue={user.phone || "+7 (___) ___-__-__"}
                  />
                </div>
              </section>

              <section className={classes.profileCard}>
                <h2 className={classes.sectionTitle}>Настройки</h2>
                <div className={classes.fieldGroup}>
                  <span className={classes.label}>Пол</span>
                  <div className={classes.radioGroup}>
                    <label className={classes.radioLabel}>
                      <input type="radio" name="gender" defaultChecked />{" "}
                      Мужской
                    </label>
                    <label className={classes.radioLabel}>
                      <input type="radio" name="gender" /> Женский
                    </label>
                  </div>
                </div>
                <div className={classes.field}>
                  <label className={classes.label}>Дата рождения</label>
                  <input className={classes.input} type="date" />
                </div>
                <div className={classes.switchRow}>
                  <div>
                    <p className={classes.switchLabel}>Скидки по email</p>
                    <p className={classes.switchHint}>
                      Получайте уведомления о промо-акциях
                    </p>
                  </div>
                  <label className={classes.switch}>
                    <input type="checkbox" defaultChecked />
                    <span className={classes.slider} />
                  </label>
                </div>
                <div className={classes.switchRow}>
                  <div>
                    <p className={classes.switchLabel}>СМС-уведомления</p>
                    <p className={classes.switchHint}>Скидки и статус заказа</p>
                  </div>
                  <label className={classes.switch}>
                    <input type="checkbox" />
                    <span className={classes.slider} />
                  </label>
                </div>

                <button className={classes.saveButton}>Сохранить</button>
              </section>
            </div>
          </div>
        )}
        {profileState === "ORDERS" && (
          <div className={classes.orders}>
            <h2 className={classes.ordersTitle}>Мои заказы</h2>
            {orders.length === 0 ? (
              <p className={classes.ordersText}>
                Здесь будут отображаться ваши заказы. Пока что у вас нет
                заказов.
              </p>
            ) : (
              <div className={classes.ordersList}>
                {orders.map((order) => (
                  <div key={order.id} className={classes.orderCard}>
                    <div className={classes.orderHeader}>
                      <span className={classes.orderNumber}>
                        Заказ #{order.id}
                      </span>
                      <span className={classes.orderDate}>
                        {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                      </span>
                    </div>
                    <div className={classes.orderDetails}>
                      <p className={classes.orderStatus}>
                        Статус: {order.orderType || "В обработке"}
                      </p>
                      <p className={classes.orderTotal}>
                        Сумма:{" "}
                        {order.totalPrice
                          ? `${order.totalPrice} ₽`
                          : "Не указана"}
                      </p>
                      {order.cart && order.cart.length > 0 && (
                        <div className={classes.orderItems}>
                          <h4>Товары:</h4>
                          <ul>
                            {order.cart.map((item, index: number) => (
                              <li key={index}>
                                {item.name} - {item.quantity} шт. x {item.price}{" "}
                                ₽
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
