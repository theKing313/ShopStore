import { ProductCartItem } from "../../../types/common";
import classes from "./Cart.module.css";
import CartItem from "./CartItem/CartItem";
import CartSummary from "./CartSummary/CartSummary";

interface ICartProps {
  cart: ProductCartItem[];
  onWish: ({
    id,
    isWished,
  }: {
    id: ProductCartItem["productId"];
    isWished: boolean;
  }) => void;
  onRemove: (id: ProductCartItem["productId"]) => void;
  price: ProductCartItem["price"];
  weight: ProductCartItem["weight"];
  profit: ProductCartItem["profit"];
  quantity: ProductCartItem["quantity"];
  selectedMaterial: ProductCartItem["selectedMaterial"];
  selectedSize: ProductCartItem["selectedSize"];
  selectedColor: ProductCartItem["selectedColor"];
  discount?: number;
  originalPrice?: number;
}

const Cart: React.FC<ICartProps> = ({
  cart,
  onRemove,
  onWish,
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
    <div className={classes.cart}>
      <div className={classes["cart-items-wrapper"]}>
        {cart.map((cartItem) => {
          return (
            <CartItem
              key={cartItem.productId}
              {...cartItem}
              isWished={cartItem.isWished}
              onRemove={() => onRemove(cartItem.productId)}
              onWishlist={() =>
                onWish({ id: cartItem.productId, isWished: cartItem.isWished })
              }
            />
          );
        })}
      </div>
      <CartSummary
        price={price}
        weight={weight}
        profit={profit}
        quantity={quantity}
        selectedMaterial={selectedMaterial}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        discount={discount}
        originalPrice={originalPrice}
      />
    </div>
  );
};

export default Cart;
