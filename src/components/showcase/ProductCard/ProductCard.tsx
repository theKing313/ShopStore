import { generatePath, Link } from "react-router-dom";
import { Product } from "../../../types/common";
import Chip from "../../UI/Chip/Chip";
import IconButton from "../../UI/IconButton/IconButton";
import FavoriteIcon from "../../UI/icons/FavoriteIcon/FavoriteIcon";
import classes from "./ProductCard.module.css";

interface IProductCardProps {
  name: Product["name"];
  price: Product["price"];
  image: Product["image"];
  images?: Product["images"];
  discountPercent?: Product["discountPercent"];
  discountedPrice?: Product["discountedPrice"];
  brand: Product["brand"];
  category: Product["category"];
  onWishlistClick: () => void;
  isAddedToWishlist: boolean;
  id: Product["id"];
}

const ProductCard: React.FC<IProductCardProps> = ({
  name,
  price,
  image,
  images,
  discountPercent,
  discountedPrice,
  brand,
  category,
  isAddedToWishlist,
  id,
  onWishlistClick,
}) => {
  const percent = discountPercent ?? undefined;
  const calculatedDiscountedPrice =
    discountedPrice ??
    (percent != null ? Math.round(price - (price * percent) / 100) : undefined);
  const hasDiscount =
    percent != null && percent > 0 && calculatedDiscountedPrice != null;

  const hoverImages = images?.length ? images : [image];
  const hasHoverGallery = hoverImages.length > 1;
  const focusPositions = ["20% 30%", "50% 50%", "80% 40%"];

  return (
    <li className={classes["product-card"]}>
      <Link
        to={generatePath("/:url/:id", { url: category?.url || "catalog", id })}
        className={classes["image-wrapper"]}
      >
        {hasHoverGallery ? (
          <div className={classes["image-slider"]}>
            <div className={classes["image-track"]}>
              {hoverImages.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`${name} preview ${index + 1}`}
                  className={`${classes.image} ${classes["slider-image"]}`}
                  style={{
                    objectPosition:
                      focusPositions[index % focusPositions.length],
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <img src={image} alt={name} className={classes.image} />
        )}

        <div className={classes["wishlist-btn"]}>
          <IconButton onClick={onWishlistClick}>
            <FavoriteIcon filled={isAddedToWishlist} />
          </IconButton>
        </div>
        <div className={classes["discount-chip"]}>
          {hasDiscount && (
            <Chip text={"-" + discountPercent + "%"} mode={"attention"} />
          )}
        </div>
      </Link>

      {hasDiscount ? (
        <span className={`${classes.price}`}>
          <span className={classes.price}>{calculatedDiscountedPrice} ₽</span>
          <span className={classes["old-price"]}>{price} ₽</span>
        </span>
      ) : (
        <span className={classes.price}>{price} ₽</span>
      )}

      <Link to={id} className={classes.title}>
        {name}
      </Link>

      <div className={classes["chips-wrapper"]}>
        <Chip text={brand.name} mode={"highlighted"} />
        <Chip text={category.name} mode={"highlighted"} />
      </div>
    </li>
  );
};

export default ProductCard;
