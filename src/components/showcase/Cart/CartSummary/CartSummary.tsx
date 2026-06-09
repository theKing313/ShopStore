import { CartItem } from "../../../../types/common";
import classes from "./CartSummary.module.css";

interface ICartSummaryProps {
  price: CartItem["totalPrice"];
  weight: CartItem["weight"];
  profit: CartItem["profit"];
  quantity: CartItem["quantity"];
  selectedMaterial?: CartItem["selectedMaterial"];
  selectedSize?: CartItem["selectedSize"];
  selectedColor?: CartItem["selectedColor"];
  discount?: number;
  originalPrice?: number;
}

const CartSummary: React.FC<ICartSummaryProps> = ({
  price,
  weight,
  profit,
  quantity,
  selectedMaterial,
  selectedSize,
  selectedColor,
  discount,
  originalPrice,
}) => {
  return (
    <div className={classes["cart-summary"]}>
      <div className={`${classes["cart-summary-row"]} ${classes.heading}`}>
        <span>Итого</span>
        <span>{price} ₽</span>
      </div>

      <div className={classes["cart-summary-row"]}>
        <span>Выгода</span>
        <span className={classes["profit-amount"]}>{profit} ₽</span>
      </div>

      <div className={classes["cart-summary-row"]}>
        <span>Всего товаров</span>
        <span>{quantity} шт</span>
      </div>
      {discount && originalPrice !== undefined ? (
        <>
          <div className={classes["cart-summary-row"]}>
            <span>Сумма до скидки</span>
            <span>{originalPrice && originalPrice.toFixed(2)} ₽</span>
          </div>
          <div className={classes["cart-summary-row"]}>
            <span>Скидка за регистрацию</span>
            <span className={classes["discount-amount"]}>
              -{discount && discount.toFixed(2)} ₽
            </span>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default CartSummary;
