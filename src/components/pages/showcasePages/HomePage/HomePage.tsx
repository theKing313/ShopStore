import { Link } from "react-router-dom";
import { PATHS } from "../../../../constants/routes";
import classes from "./HomePage.module.css";

const HomePage: React.FC = () => {
  return (
    <div className={classes.page}>
      <section className={classes.hero}>
        <div className={classes.heroText}>
          <p className={classes.intro}>Твой дипломный проект</p>
          <h1 className={classes.title}>ShopStore — магазин в стиле TBOE</h1>
          <p className={classes.description}>
            Главная витрина проекта: акции, подборки и лучшие предложения со
            скидкой. Сделано в духе маркетплейсов, чтобы пользователь сразу
            увидел нужный товар.
          </p>
          <div className={classes.actions}>
            <Link to={PATHS.discounts} className={classes.primaryButton}>
              Перейти к скидкам
            </Link>
            <Link to={PATHS.wishlist} className={classes.secondaryButton}>
              Мои избранные
            </Link>
          </div>
          <div className={classes.heroStats}>
            <div className={classes.statItem}>
              <strong>1 200+</strong>
              <span>товаров</span>
            </div>
            <div className={classes.statItem}>
              <strong>120</strong>
              <span>брендов</span>
            </div>
            <div className={classes.statItem}>
              <strong>30%</strong>
              <span>скидки</span>
            </div>
          </div>
        </div>

        <div className={classes.heroImage}>
          <div className={classes.promoCard}>
            <div className={classes.promoBadge}>ЛУЧШИЕ ЦЕНЫ</div>
            <h2 className={classes.promoTitle}>
              Джинсы, футболки и базовые вещи
            </h2>
            <p className={classes.promoText}>
              Еженедельные подборки для города, прогулок и учебы. Стильный
              минимализм и проверенное качество.
            </p>
            <div className={classes.promoButtons}>
              <Link to={PATHS.discounts} className={classes.cardButton}>
                Посмотреть акции
              </Link>
              <Link to={PATHS.wishlist} className={classes.cardLink}>
                В избранное
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={classes.cardsSection}>
        <div className={classes.cardLarge}>
          <p className={classes.cardLabel}>Хиты продаж</p>
          <h3>Самые популярные товары</h3>
          <p>Топовые позиции, которые чаще всего берут наши покупатели.</p>
        </div>
        <div className={classes.cardSmallGrid}>
          <div className={classes.smallCard}>
            <span>Акция</span>
            <h4>Футболки</h4>
            <p>Базовые модели, которые не выходят из моды.</p>
          </div>
          <div className={classes.smallCard}>
            <span>Новинка</span>
            <h4>Толстовки</h4>
            <p>Удобные и теплые, для прогулок и офиса.</p>
          </div>
          <div className={classes.smallCard}>
            <span>Тренд</span>
            <h4>Кроссовки</h4>
            <p>Модные модели с ярким дизайном.</p>
          </div>
        </div>
      </section>

      <section className={classes.collectionSection}>
        <div className={classes.sectionHeader}>
          <h2>Подборки образов</h2>
          <p>Идеи для повседневных и праздничных вариантов.</p>
        </div>
        <div className={classes.collectionGrid}>
          <Link to={PATHS.discounts} className={classes.collectionCard}>
            <div className={classes.collectionOverlay} />
            <div>
              <p>на свидание</p>
              <strong>Для неё и для него</strong>
            </div>
          </Link>
          <Link to={PATHS.discounts} className={classes.collectionCard}>
            <div className={classes.collectionOverlay2} />
            <div>
              <p>на прогулку</p>
              <strong>Комфортные образы</strong>
            </div>
          </Link>
          <Link to={PATHS.discounts} className={classes.collectionCard}>
            <div className={classes.collectionOverlay3} />
            <div>
              <p>на спорт</p>
              <strong>Легкие комплекты</strong>
            </div>
          </Link>
          <Link to={PATHS.discounts} className={classes.collectionCard}>
            <div className={classes.collectionOverlay4} />
            <div>
              <p>в универ</p>
              <strong>Универсальные вещи</strong>
            </div>
          </Link>
        </div>
      </section>

      <section className={classes.appSection}>
        <div className={classes.appInfo}>
          <p className={classes.intro}>Приложение</p>
          <h2>Покупать ещё удобнее с мобильным приложением</h2>
          <p>
            Установи приложение и получай уведомления о скидках, новых
            коллекциях и специальных предложениях.
          </p>
          <div className={classes.appActions}>
            <span className={classes.appBadge}>App Store</span>
            <span className={classes.appBadge}>Google Play</span>
          </div>
        </div>
        <div className={classes.appGraphic} />
      </section>
    </div>
  );
};

export default HomePage;
