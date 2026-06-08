import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  PRODUCT_ADDED_TO_CART,
  FIRST_ORDER_REGISTER_ALERT,
} from "../../../constants/messages";
import { showAlert } from "../../../store/CommonSlice";
import { AppDispatch, RootState } from "../../../store/store";
import { setProductToCart, setToLocalStorage } from "../../../store/UserSlice";
import { AlertType, CartItem } from "../../../types/common";
import QuantityBlock from "../QuantityBlock/QuantityBlock";
import classes from "./AddToCartBtn.module.css";

interface IAddToCartBtnProps {
  product: CartItem;
}

const AddToCartBtn: React.FC<IAddToCartBtnProps> = ({ product }) => {
  const [isCLicked, setIsClicked] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { cart } = useSelector((state: RootState) => state.user);
  const authUser = useSelector((state: RootState) => state.auth.user);
  const productInCart = cart.find(
    (cartItem) =>
      cartItem.productId === product.productId &&
      cartItem.selectedMaterial === product.selectedMaterial &&
      cartItem.selectedSize === product.selectedSize &&
      cartItem.selectedColor === product.selectedColor,
  );

  useEffect(() => {
    if (productInCart?.quantity) {
      setIsClicked(true);
    } else {
      setIsClicked(false);
    }
  }, [productInCart?.quantity]);

  const addToCartHandler = () => {
    setIsClicked(true);

    dispatch(setProductToCart(product));
    dispatch(setToLocalStorage("cart"));

    const message = authUser
      ? PRODUCT_ADDED_TO_CART
      : `${PRODUCT_ADDED_TO_CART} ${FIRST_ORDER_REGISTER_ALERT}`;

    if (!authUser) {
      localStorage.setItem("firstOrderDiscount", "true");
    }

    dispatch(
      showAlert({
        type: AlertType.Success,
        message,
        action: "cart",
      }),
    );
  };

  return (
    <div
      className={classes["add-to-cart-btn"]}
      style={{
        outline: `1px solid ${isCLicked ? "lightgray" : "transparent"}`,
      }}
    >
      {isCLicked && <QuantityBlock id={product.productId} />}

      {!isCLicked && (
        <button className={classes["main-button"]} onClick={addToCartHandler}>
          <span className={classes["main-button-text"]}>
            Добавить в корзину
          </span>
        </button>
      )}
    </div>
  );
};

export default AddToCartBtn;
