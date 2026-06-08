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

      <div className={classes["cart-summary-row"]}>
        <span>Вес</span>
        <span>{weight} кг</span>
      </div>

      {selectedMaterial && (
        <div className={classes["cart-summary-row"]}>
          <span>Материал</span>
          <span>{selectedMaterial}</span>
        </div>
      )}

      {selectedSize && (
        <div className={classes["cart-summary-row"]}>
          <span>Размер</span>
          <span>{selectedSize}</span>
        </div>
      )}

      {selectedColor && (
        <div className={classes["cart-summary-row"]}>
          <span>Цвет</span>
          <span>{selectedColor}</span>
        </div>
      )}

      {discount && originalPrice !== undefined && (
        <>
          <div className={classes["cart-summary-row"]}>
            <span>Сумма до скидки</span>
            <span>{originalPrice} ₽</span>
          </div>
          <div className={classes["cart-summary-row"]}>
            <span>Скидка за регистрацию</span>
            <span className={classes["discount-amount"]}>-{discount} ₽</span>
          </div>
        </>
      )}
    </div>
  );
};

export default CartSummary;
