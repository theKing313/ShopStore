import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NO_PRODUCTS_IN_CART } from "../../../../constants/messages";
import { PATHS } from "../../../../constants/routes";
import {
  AlertType,
  CartItem,
  Product,
  ProductCartItem,
} from "../../../../types/common";
import { createOrder, showAlert } from "../../../../store/CommonSlice";
import { AppDispatch, RootState } from "../../../../store/store";
import {
  clearCart,
  removeProductFromCart,
  setToLocalStorage,
  wishListHandler,
} from "../../../../store/UserSlice";
import Section from "../../../layouts/showcaseLayouts/Section/Section";
import SectionBody from "../../../layouts/showcaseLayouts/Section/SectionBody/SectionBody";
import SectionHeader from "../../../layouts/showcaseLayouts/Section/SectionHeader/SectionHeader";
import Cart from "../../../showcase/Cart/Cart";
import CartForm from "../../../showcase/CartForm/CartForm";
import Placeholder from "../../../UI/Placeholder/Placeholder";
import classes from "./CartPage.module.css";

const INIT_INPUT = {
  name: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string).username || ""
    : "",
  phone: "",
  address: "",
  paymentType: "",
  orderType: "",
};

const CartPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cart, user: persistedUser } = useSelector(
    (state: RootState) => state.user,
  );
  const { wishlist } = useSelector((state: RootState) => state.user);
  const { products } = useSelector((state: RootState) => state.product);
  const { isLoading } = useSelector((state: RootState) => state.common);
  const authUser = useSelector((state: RootState) => state.auth.user);
  const discountEligible =
    !!authUser && localStorage.getItem("firstOrderDiscount") === "true";
  const localStorageUser = (() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  const cartUser = authUser || persistedUser || localStorageUser;
  const [input, setInput] = useState(INIT_INPUT);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // simple validation
    const newErrors: { [key: string]: string } = {};
    if (!input.paymentType) newErrors.paymentType = "Выберите тип оплаты";
    if (!input.orderType) newErrors.orderType = "Выберите тип заказа";
    if (!cartUser || !cartUser.phone) {
      if (!input.name) newErrors.name = "Введите имя";
      if (!input.phone) newErrors.phone = "Введите телефон";
    }

    if (
      input.orderType === "delivery" &&
      !cartUser?.address &&
      !input.address
    ) {
      newErrors.address = "Введите адрес";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    await handleSubmit();
  };

  // useEffect(() => {
  //   if (cartUser) {
  //     setInput({
  //       name: cartUser.username || "",
  //       phone: cartUser.phone || "",
  //       address: cartUser.address || "",
  //     });
  //   }
  // }, [cartUser, setInput]);

  const cartProducts: ProductCartItem[] = cart.map((cartItem) => {
    const product = products.find(
      (product) => product.id === cartItem.productId,
    ) as Product;
    const isWished = wishlist.includes(cartItem.productId);

    return {
      ...cartItem,
      name: product.name,
      image: product.image,
      categoryUrl: product.category.url,
      isWished,
    };
  });

  const price = cart.reduce((res, val) => res + val.totalPrice, 0);
  const weight = +cart
    .reduce((res, val) => res + val.totalWeight, 0)
    .toFixed(2);
  const profit = cart.reduce((res, { profit = 0 }) => res + profit, 0);
  const quantity = cart.reduce((res, { quantity }) => res + quantity, 0);
  const discountAmount = discountEligible ? price / 2 : 0;
  const summaryPrice = discountEligible ? price - discountAmount : price;
  const hasProducts = cart.length > 0;
  const selectedMaterial = cartProducts.find(
    (item) => item.selectedMaterial,
  )?.selectedMaterial;
  const selectedSize = cartProducts.find(
    (item) => item.selectedSize,
  )?.selectedSize;
  const selectedColor = cartProducts.find(
    (item) => item.selectedColor,
  )?.selectedColor;
  const summaryProps = {
    price: summaryPrice,
    weight,
    profit,
    quantity,
    selectedMaterial,
    selectedSize,
    selectedColor,
    discount: discountAmount,
    originalPrice: discountEligible ? price : undefined,
  };

  const handleWishlist = ({
    id,
    isWished,
  }: {
    id: CartItem["productId"];
    isWished: boolean;
  }) => {
    dispatch(wishListHandler({ id, isWished }));
  };

  const handleRemoveCartItem = (id: CartItem["productId"]) => {
    dispatch(removeProductFromCart(id));
    dispatch(setToLocalStorage("cart"));
  };

  async function handleSubmit() {
    const order = {
      userId: authUser?.id,
      userName: cartUser?.username || input.name,
      userPhone: cartUser?.phone || input.phone,
      userAddress: cartUser?.address || input.address || "Нет адреса",
      paymentType: input.paymentType,
      orderType: input.orderType,
      cart: cart,
      timestamp: Date.now(),
      totalPrice: summaryPrice,
      totalWeight: weight,
      totalDiscount: profit + discountAmount,
      totalQuantity: quantity,
    };

    const result = await dispatch(createOrder(order));
    // const result = {
    //   type: "common/createOrder/fulfilled",
    //   payload: {
    //     id: "12345",
    //     paymentUrl: "https://payment-gateway.com/pay/12345",
    //   },
    // }
    console.log("result------------------------", result);

    if (createOrder.fulfilled.match(result)) {
      const payload = result.payload as any;
      if (discountEligible) {
        localStorage.removeItem("firstOrderDiscount");
      }

      if (payload?.paymentUrl) {
        dispatch(clearCart());
        dispatch(setToLocalStorage("cart"));
        dispatch(
          showAlert({
            type: AlertType.Success,
            message: "Перенаправляем на оплату картой...",
          }),
        );
        window.location.href = payload.paymentUrl;
        return;
      }

      // dispatch(clearCart());
      // dispatch(setToLocalStorage("cart"));
      // dispatch(
      //   showAlert({
      //     type: AlertType.Success,
      //     message: "Заказ успешно создан, корзина очищена.",
      //   }),
      // );
      // setInput(INIT_INPUT);
      // navigate(`${PATHS.cart}/${PATHS.success}`);
      return;
    }

    if (createOrder.rejected.match(result)) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message: "Не удалось оформить заказ. Попробуйте снова.",
        }),
      );
    }
  }
  console.log("cartProducts", cartProducts);
  console.log("cartUser", cartUser);
  console.log("summaryProps", summaryProps);

  const cartMaterials = cartProducts.map((item) => item.selectedMaterial);
  const cartSizes = cartProducts.map((item) => item.selectedSize);
  const cartColors = cartProducts.map((item) => item.selectedColor);
  console.log("cartMaterials", cartMaterials);
  console.log("cartSizes", cartSizes);
  console.log("cartColors", cartColors);
  // if (cartMaterials.some((mat) => mat)) {
  //   summaryProps.selectedMaterial = cartMaterials.find((mat) => mat) || "";
  // }
  // if (cartSizes.some((size) => size)) {
  //   summaryProps.selectedSize = cartSizes.find((size) => size) || "";
  // }
  // if (cartColors.some((color) => color)) {
  //   summaryProps.selectedColor = cartColors.find((color) => color) || "";
  // }
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(PATHS.showcase);
    }
  };
  return (
    <Section>
      <>
        <SectionHeader title={"Корзина"} />

        <SectionBody>
          <>
            {!hasProducts && <Placeholder text={NO_PRODUCTS_IN_CART} />}

            {hasProducts && (
              <div className={classes["cart-page-body"]}>
                <Cart
                  cart={cartProducts}
                  onRemove={handleRemoveCartItem}
                  onWish={handleWishlist}
                  {...summaryProps}
                />

                <div className={classes["checkout-panel"]}>
                  <span className={classes.title}>
                    {cartUser ? "Доставка" : "Ваши данные"}
                  </span>

                  {!authUser && hasProducts && (
                    <div
                      style={{
                        marginBottom: 16,
                        padding: "14px 16px",
                        backgroundColor: "#fff7e6",
                        border: "1px solid #ffd591",
                        borderRadius: 12,
                        color: "#663c00",
                      }}
                    >
                      <Link
                        to={PATHS.auth}
                        style={{ color: "#663c00", fontWeight: 700 }}
                      >
                        Зарегистрируйтесь сейчас
                      </Link>{" "}
                      и получите 50% скидки на первый заказ.
                      <div style={{ marginTop: 8, fontSize: 14 }}>
                        * Скидка применяется автоматически при оформлении
                        заказа.
                      </div>
                      <div style={{ marginTop: 8, fontSize: 14 }}>
                        * Доставка осуществляется только по городу Омск. Для
                        других регионов свяжитесь с нами через{" "}
                        <a
                          href="https://t.me/yourstore"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#663c00", fontWeight: 700 }}
                        >
                          По этой ссылке
                        </a>
                      </div>
                    </div>
                  )}

                  {cartUser && (
                    <div className={classes["user-summary"]}>
                      <div className={classes["summary-row"]}>
                        <span>Пользователь</span>
                        <strong>{cartUser.username}</strong>
                      </div>
                      <div className={classes["summary-row"]}>
                        <span>Email</span>
                        <strong>{cartUser.email || "—"}</strong>
                      </div>
                      <div className={classes["summary-row"]}>
                        <span>Телефон</span>
                        <strong>{cartUser.phone || "Не указан"}</strong>
                      </div>
                      <div className={classes["summary-row"]}>
                        <span>Адрес</span>
                        <strong>{cartUser.address || "Не указан"}</strong>
                      </div>
                    </div>
                  )}

                  <CartForm
                    onSubmit={submit}
                    value={input}
                    errors={errors}
                    onChange={handleChange}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            )}
          </>
        </SectionBody>
      </>
    </Section>
  );
};

export default CartPage;
