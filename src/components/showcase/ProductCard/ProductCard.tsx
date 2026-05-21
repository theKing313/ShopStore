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

  return (
    <li className={classes["product-card"]}>
      <Link
        to={generatePath("/:url/:id", { url: category?.url || "catalog", id })}
        className={classes["image-wrapper"]}
      >
        <img src={image} alt={name} className={classes.image} />

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
