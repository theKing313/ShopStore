import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/store";
import { wishListHandler } from "../../../../store/UserSlice";
import ProductCard from "../../../showcase/ProductCard/ProductCard";
import Carousel from "../../../showcase/Carousel/Carousel";
import { PATHS } from "../../../../constants/routes";
import classes from "./HomePage.module.css";

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products } = useSelector((state: RootState) => state.product);
  const { wishlist } = useSelector((state: RootState) => state.user);
  const categories = useSelector(
    (state: RootState) => state.category.categories,
  );

  const [discountIndex, setDiscountIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Активируем анимации при монтировании
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const discountProducts = useMemo(() => {
    return products.filter((product) => {
      const percent = product.discountPercent ?? product.discount?.percent ?? 0;
      const hasDiscountPrice =
        product.discountedPrice != null &&
        product.discountedPrice < product.price;
      return percent > 0 || hasDiscountPrice;
    });
  }, [products]);

  const handleWishlist = (id: string) => {
    const isWished = wishlist.includes(id);
    dispatch(wishListHandler({ id, isWished }));
  };

  const heroSlides = useMemo(
    () => [
      {
        id: "hero-1",
        image:
          "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
        title: "Новая коллекция уже здесь",
        description:
          "Яркие образы, удобные базовые вещи и скидки для тех, кто выбирает стиль.",
        link: PATHS.discounts,
        button: "Посмотреть акции",
        badge: "Тренд",
      },
      {
        id: "hero-2",
        image:
          "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80",
        title: "Зимние образы с выгодой",
        description:
          "Верхняя одежда, обувь и аксессуары — все, что нужно для холодного сезона.",
        link: PATHS.discounts,
        button: "Смотреть подборки",
        badge: "Скидки",
      },
      {
        id: "hero-3",
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
        title: "Лучшие предложения недели",
        description:
          "Ограниченные скидки и подборки топовых товаров для твоего гардероба.",
        link: PATHS.discounts,
        button: "В каталог",
        badge: "Hot",
      },
    ],
    [],
  );

  // Формируем карточки категорий динамически
  const categoryCards = useMemo(() => {
    return categories.slice(0, 3).map((category: any) => {
      const productCount = products.filter(
        (p) => p.category?.id === category.id,
      ).length;
      return {
        id: category.id,
        label: `${productCount} товаров`,
        title: category.name,
        description: category.description || "",
        link: `/${category.url}`,
      };
    });
  }, [categories, products]);

  const maxDiscountIndex = Math.max(0, discountProducts.length - 3);
  const nextDiscount = () =>
    setDiscountIndex((prev) => Math.min(prev + 1, maxDiscountIndex));
  const prevDiscount = () => setDiscountIndex((prev) => Math.max(prev - 1, 0));

  return (
    <div className={`${classes.page} ${isVisible ? classes.visible : ""}`}>
      <section className={classes.hero}>
        <div className={classes.heroText}>
          <p className={classes.intro}> дипломный проект</p>
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
          <Carousel
            items={heroSlides}
            autoPlay
            interval={4500}
            showDots
            showArrows={false}
            variant="full"
          />
        </div>
      </section>

      <section className={classes.discountSection}>
        <div className={classes.sectionHeader}>
          <div>
            <h2>Горячие товары со скидкой</h2>
            <p>
              Собрали лучшие предложения в одном месте — переходи и выбирай.
            </p>
          </div>
          <div className={classes.discountActions}>
            <button
              type="button"
              onClick={prevDiscount}
              className={classes.discountButton}
              aria-label="Предыдущие товары"
            >
              ←
            </button>
            <button
              type="button"
              onClick={nextDiscount}
              className={classes.discountButton}
              aria-label="Следующие товары"
            >
              →
            </button>
          </div>
        </div>
        <div className={classes.discountCarousel}>
          <div
            className={classes.discountTrack}
            style={{ transform: `translateX(-${discountIndex * 33.33}%)` }}
          >
            {discountProducts.map((product) => (
              <div key={product.id} className={classes.discountSlide}>
                <ProductCard
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  images={product.images}
                  colorImages={product.colorImages}
                  discountPercent={product.discountPercent}
                  discountedPrice={product.discountedPrice}
                  brand={product.brand}
                  category={product.category}
                  onWishlistClick={() => handleWishlist(product.id)}
                  isAddedToWishlist={wishlist.includes(product.id)}
                />
              </div>
            ))}
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
          {categoryCards.map((card: any) => (
            <Link key={card.id} to={card.link} className={classes.smallCard}>
              <span>{card.label}</span>
              <h4>{card.title}</h4>
              <p>{card.description}</p>
            </Link>
          ))}
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
