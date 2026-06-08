import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  ADD_TO_WISHLIST,
  REMOVE_FROM_WISHLIST,
} from "../../../../constants/messages";
import { AppDispatch, RootState } from "../../../../store/store";
import { wishListHandler } from "../../../../store/UserSlice";
import { CartItem, Product, Review } from "../../../../types/common";
import Section from "../../../layouts/showcaseLayouts/Section/Section";
import SectionBody from "../../../layouts/showcaseLayouts/Section/SectionBody/SectionBody";
import AddToCartBtn from "../../../showcase/AddToCartBtn/AddToCartBtn";
import Chip from "../../../UI/Chip/Chip";
import IconButton from "../../../UI/IconButton/IconButton";
import FavoriteIcon from "../../../UI/icons/FavoriteIcon/FavoriteIcon";
import NotFound from "../NotFound/NotFound";
import InfoBlock from "./InfoBlock/InfoBlock";
import classes from "./ProductPage.module.css";
import { useEffect, useMemo, useState } from "react";

const API_URL =
  process.env.REACT_APP_API_URL ||
  import.meta.env.REACT_APP_API_URL ||
  "http://localhost:5044";

interface IProductPageProps {}

const ProductPage: React.FC<IProductPageProps> = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { products } = useSelector((state: RootState) => state.product);
  const { wishlist } = useSelector((state: RootState) => state.user);
  const product = products.find(
    (product) => product.id === productId,
  ) as Product;

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const sizeOptions = product?.sizes ?? [];
  const materialOptions = product?.materials ?? [];
  const colorOptions = product?.colors ?? [];

  useEffect(() => {
    if (!product) {
      return;
    }

    setSelectedSize(product.sizes?.[0] ?? "");
    setSelectedMaterial(product.materials?.[0] ?? "");
    setSelectedColor(product.colors?.[0] ?? "");
  }, [product]);

  useEffect(() => {
    async function loadReviews() {
      if (!productId) return;
      setReviewsLoading(true);
      setReviewError("");
      try {
        console.log("Загрузка отзывов для продукта ID:", productId);
        const response = await fetch(`${API_URL}/api/reviews/${productId}`);
        if (!response.ok) {
          throw new Error("Не удалось загрузить отзывы");
        }
        const reviewsData: Review[] = await response.json();
        setReviews(reviewsData);
      } catch (error) {
        console.error("Ошибка при загрузке отзывов:", error);
        setReviewError(
          error instanceof Error
            ? "Ошибка загрузки отзывов"
            : "Неизвестная ошибка",
        );
      } finally {
        setReviewsLoading(false);
      }
    }

    loadReviews();
  }, [productId]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return (
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    );
  }, [reviews]);

  const handleSubmitReview = async () => {
    setReviewError("");
    setReviewSuccess("");

    if (!reviewName.trim() || !reviewComment.trim()) {
      setReviewError("Введите имя и текст отзыва");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          username: reviewName.trim(),
          rating: reviewRating,
          comment: reviewComment.trim(),
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type") || "";
        let errorMessage = "Не удалось отправить отзыв";

        if (contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData?.message || errorMessage;
        } else {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }

        throw new Error(errorMessage);
      }

      const createdReview: Review = await response.json();
      setReviews((prev) => [createdReview, ...prev]);
      setReviewName("");
      setReviewRating(5);
      setReviewComment("");
      setReviewSuccess("Спасибо! Отзыв добавлен.");
    } catch (error) {
      setReviewError(
        error instanceof Error ? error.message : "Ошибка отправки отзыва",
      );
    }
  };

  const recommendation = useMemo(() => {
    if (selectedMaterial === "Хлопок") {
      return "Мягкий и дышащий материал для повседневной носки.";
    }
    if (selectedMaterial === "Смешанный") {
      return "Устойчив к деформациям и быстро сохнет.";
    }
    return "Легкий и комфортный трикотаж для активного дня.";
  }, [selectedMaterial]);

  if (!product) {
    return <NotFound />;
  }

  const {
    id,
    name,
    description,
    image,
    images,
    brand,
    price,
    weight,
    discount,
    gender,
  } = product;
  const chipText =
    gender.url === "male"
      ? "Мужская коллекция"
      : gender.url === "female"
        ? "Женская коллекция"
        : "Унисекс";
  const isWished = wishlist.includes(id);

  // Получаем картинку для выбранного цвета или дефолтную
  const displayImage = useMemo(() => {
    if (selectedColor && product.colorImages?.[selectedColor]) {
      return product.colorImages[selectedColor];
    }
    return image;
  }, [selectedColor, product.colorImages, image]);

  const cartItem: CartItem = {
    productId: id,
    name,
    quantity: 1,
    price,
    totalPrice: price,
    weight,
    selectedMaterial,
    selectedSize,
    selectedColor,
    totalWeight: weight,
    discountedPrice: discount?.discountedPrice,
    discount: discount?.percent,
    colorImages: product.colorImages,
  };

  return (
    <Section>
      <>
        <SectionBody>
          <>
            <div className={classes["product-page"]}>
              <div className={classes["content-wrapper"]}>
                <div className={classes["title-wrapper"]}>
                  <h1 className={classes.title}>{name}</h1>
                  <div className={classes["chip-wrapper"]}>
                    <Chip text={brand.name} mode={"plain"} />
                    <Chip text={chipText} mode={"plain"} />
                  </div>
                </div>

                <div className={classes["price-row"]}>
                  <div className={classes["price-column"]}>
                    {discount ? (
                      <div className={classes["price-block"]}>
                        <span className={classes.price}>
                          {discount.discountedPrice} ₽
                        </span>
                        <span className={classes["old-price"]}>{price} ₽</span>
                      </div>
                    ) : (
                      <span className={classes.price}>{price} ₽</span>
                    )}
                    <Chip
                      text={discount ? `-${discount.percent}%` : "Новинка"}
                      mode={discount ? "attention" : "plain"}
                    />
                  </div>
                </div>

                <div className={classes.purchaseBlock}>
                  <div className={classes.purchaseInfo}>
                    <p className={classes.subtitle}>Описание товара</p>
                    <p className={classes.text}>{description}</p>
                  </div>
                  <div className={classes.purchaseActions}>
                    <IconButton
                      onClick={() =>
                        dispatch(wishListHandler({ id, isWished }))
                      }
                      column
                    >
                      <>
                        <FavoriteIcon filled={isWished} />
                        <span className={classes["wishlist-text"]}>
                          {isWished ? REMOVE_FROM_WISHLIST : ADD_TO_WISHLIST}
                        </span>
                      </>
                    </IconButton>
                  </div>
                </div>

                <div className={classes.attributes}>
                  <div className={classes.attributeItem}>
                    <span className={classes.attributeLabel}>Состав</span>
                    <span className={classes.attributeValue}>
                      {product.materials?.join(", ") ||
                        "Информация отсутствует"}
                    </span>
                  </div>
                  <div className={classes.attributeItem}>
                    <span className={classes.attributeLabel}>Вес</span>
                    <span className={classes.attributeValue}>{weight} г</span>
                  </div>
                  <div className={classes.attributeItem}>
                    <span className={classes.attributeLabel}>Категория</span>
                    <span className={classes.attributeValue}>{brand.name}</span>
                  </div>
                  <div className={classes.attributeItem}>
                    <span className={classes.attributeLabel}>Тип</span>
                    <span className={classes.attributeValue}>{chipText}</span>
                  </div>
                </div>

                <div className={classes.options}>
                  <div className={classes.optionGroup}>
                    <span className={classes.optionTitle}>Материал</span>
                    <div className={classes.optionButtons}>
                      {materialOptions.map((material) => (
                        <button
                          key={material}
                          type="button"
                          className={`${classes.optionButton} ${
                            selectedMaterial === material ? classes.active : ""
                          }`}
                          onClick={() => setSelectedMaterial(material)}
                        >
                          {material}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={classes.optionGroup}>
                    <span className={classes.optionTitle}>Размер</span>
                    <div className={classes.optionButtons}>
                      {sizeOptions.map((size) => (
                        <button
                          key={size}
                          type="button"
                          className={`${classes.optionButton} ${
                            selectedSize === size ? classes.active : ""
                          }`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={classes.optionGroup}>
                    <span className={classes.optionTitle}>Цвет</span>
                    <div className={classes.colorOptions}>
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`${classes.colorButton} ${
                            selectedColor === color ? classes.activeColor : ""
                          }`}
                          onClick={() => setSelectedColor(color)}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={classes.materialInfo}>
                  <p className={classes.materialText}>{recommendation}</p>
                </div>

                <div className={classes.actions}>
                  <AddToCartBtn product={cartItem} />
                </div>

                <div className={classes.reviewSection}>
                  <div className={classes.reviewHeader}>
                    <div>
                      <h2 className={classes.reviewTitle}>Отзывы</h2>
                      <p className={classes.reviewSubtitle}>
                        {reviews.length > 0
                          ? `${reviews.length} отзыв${reviews.length === 1 ? "" : "а"}`
                          : "Пока нет отзывов, вы можете оставить первый."}
                      </p>
                    </div>
                    {reviews.length > 0 && (
                      <div className={classes.reviewScore}>
                        <span>{averageRating.toFixed(1)}</span>
                        <span>★</span>
                      </div>
                    )}
                  </div>

                  {reviewsLoading ? (
                    <p className={classes.reviewLoading}>Загрузка отзывов...</p>
                  ) : reviews.length === 0 ? (
                    <p className={classes.reviewLoading}></p>
                  ) : (
                    <ul className={classes.reviewList}>
                      {reviews.map((review) => (
                        <li key={review.id} className={classes.reviewItem}>
                          <div className={classes.reviewMeta}>
                            <span className={classes.reviewAuthor}>
                              {review.username}
                            </span>
                            <span className={classes.reviewRatingValue}>
                              {review.rating} ★
                            </span>
                          </div>
                          <p className={classes.reviewComment}>
                            {review.comment}
                          </p>
                          <span className={classes.reviewDate}>
                            {new Date(review.createdAt).toLocaleDateString(
                              "ru-RU",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className={classes.reviewForm}>
                    <h3 className={classes.reviewFormTitle}>Оставить отзыв</h3>
                    <div className={classes.reviewInputs}>
                      <input
                        className={classes.reviewField}
                        type="text"
                        placeholder="Ваше имя"
                        value={reviewName}
                        onChange={(event) => setReviewName(event.target.value)}
                      />
                      <div className={classes.ratingRow}>
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            className={`${classes.ratingButton} ${
                              reviewRating === rating
                                ? classes.ratingActive
                                : ""
                            }`}
                            onClick={() => setReviewRating(rating)}
                          >
                            {rating} ★
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      className={classes.reviewTextarea}
                      rows={4}
                      placeholder="Ваш отзыв"
                      value={reviewComment}
                      onChange={(event) => setReviewComment(event.target.value)}
                    />
                    {reviewError && (
                      <p className={classes.reviewError}>{reviewError}</p>
                    )}
                    {reviewSuccess && (
                      <p className={classes.reviewSuccess}>{reviewSuccess}</p>
                    )}
                    <button
                      type="button"
                      className={classes.reviewSubmit}
                      onClick={handleSubmitReview}
                    >
                      Отправить отзыв
                    </button>
                  </div>
                </div>

                <InfoBlock />
              </div>

              <div className={classes["image-wrapper"]}>
                <img src={displayImage} alt={name} className={classes.image} />
                <div className={classes.gallery}>
                  {(images?.length ? images : [image, image, image]).map(
                    (src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`${name} ${index}`}
                        className={classes.thumbnail}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
          </>
        </SectionBody>
      </>
    </Section>
  );
};

export default ProductPage;
