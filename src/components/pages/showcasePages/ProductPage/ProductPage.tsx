import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  ADD_TO_WISHLIST,
  REMOVE_FROM_WISHLIST,
} from "../../../../constants/messages";
import { AppDispatch, RootState } from "../../../../store/store";
import { wishListHandler } from "../../../../store/UserSlice";
import { CartItem, Product } from "../../../../types/common";
import Section from "../../../layouts/showcaseLayouts/Section/Section";
import SectionBody from "../../../layouts/showcaseLayouts/Section/SectionBody/SectionBody";
import AddToCartBtn from "../../../showcase/AddToCartBtn/AddToCartBtn";
import Chip from "../../../UI/Chip/Chip";
import IconButton from "../../../UI/IconButton/IconButton";
import FavoriteIcon from "../../../UI/icons/FavoriteIcon/FavoriteIcon";
import NotFound from "../NotFound/NotFound";
import InfoBlock from "./InfoBlock/InfoBlock";
import classes from "./ProductPage.module.css";
import { useMemo, useState } from "react";

interface IProductPageProps {}

const ProductPage: React.FC<IProductPageProps> = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { products } = useSelector((state: RootState) => state.product);
  const { wishlist } = useSelector((state: RootState) => state.user);
  const product = products.find(
    (product) => product.id === productId,
  ) as Product;

  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedMaterial, setSelectedMaterial] = useState("Хлопок");
  const [selectedColor, setSelectedColor] = useState("Синий");

  const sizeOptions = ["XS", "S", "M", "L", "XL"];
  const materialOptions = ["Хлопок", "Смешанный", "Трикотаж"];
  const colorOptions = ["Синий", "Белый", "Черный"];

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
                    <span className={classes.attributeValue}>100% хлопок</span>
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

                <InfoBlock />
              </div>

              <div className={classes["image-wrapper"]}>
                <img src={image} alt={name} className={classes.image} />
                <div className={classes.gallery}>
                  {[image, image, image].map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt={`${name} ${index}`}
                      className={classes.thumbnail}
                    />
                  ))}
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
