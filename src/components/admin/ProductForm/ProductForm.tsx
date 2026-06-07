import classes from "./ProductForm.module.css";
import useForm from "../../../hooks/useForm";
import Button from "../../UI/Button/Button";
import Card from "../../UI/Card/Card";
import Form from "../../UI/Form/Form";
import Input from "../../UI/Input/Input";
import Textarea from "../../UI/Textarea/Textarea";
import { AlertType, Brand, Category } from "../../../types/common";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { createProduct, updateProduct } from "../../../store/ProductSlice";
import { showAlert } from "../../../store/CommonSlice";
import { uploadProductImage } from "../../../lib/supabaseClient";
import ProductFormSelect from "./ProductFormSelect/ProductFormSelect";
import { productFormValidator } from "../../../utils/validators";
import { GENDER } from "../../../constants/common";

const INIT_INPUT = {
  name: "",
  description: "",
  price: "",
  image: "" as string | File,
  weight: "",
  brand: {
    id: "",
    name: "",
  },
  discount: "",
  category: {
    id: "",
    name: "",
    url: "",
  },
  gender: {
    id: "",
    name: "",
    url: "",
  },
};

interface IProductFormProps {
  onClose: () => void;
  categories: Category[];
  brands: Brand[];
}

const ProductForm: React.FC<IProductFormProps> = ({
  onClose,
  categories,
  brands,
}) => {
  const {
    input,
    setInput,
    handleChange,
    errors,
    submit,
    handleChangeSelect,
    clearValidation,
  } = useForm(INIT_INPUT, submitHandler, productFormValidator);
  const dispatch = useDispatch<AppDispatch>();
  const productToBeEdited = useSelector(
    (state: RootState) => state.product.selectedProduct,
  );

  useEffect(() => {
    if (!productToBeEdited.id) return;

    setInput((prevState) => ({
      ...prevState,
      ...productToBeEdited,
      discount: productToBeEdited.discount
        ? productToBeEdited.discount?.percent.toString()
        : "",
      weight: productToBeEdited.weight
        ? productToBeEdited.weight.toString()
        : "",
      price: productToBeEdited.price ? productToBeEdited.price.toString() : "",
    }));
  }, [productToBeEdited, setInput]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    clearValidation("image");

    setInput((prevState) => ({
      ...prevState,
      image: file ?? "",
    }));
  };

  async function submitHandler() {
    const price = Math.round(+input.price);
    const weight = +input.weight;
    let discount = null;
    const imageFile = input.image instanceof File ? input.image : null;
    let imageUrl = typeof input.image === "string" ? input.image.trim() : "";

    if (+input.discount) {
      const percent = Math.ceil(+input.discount);
      const discountedPrice = price - Math.round((price * percent) / 100);
      discount = {
        percent,
        discountedPrice,
      };
    }

    if (imageFile) {
      try {
        console.log("[ProductForm] Начинаю загрузку изображения на сервер...");
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          // try to read json error body
          let body = null;
          try {
            body = await uploadRes.json();
          } catch (e) {
            /* ignore parse error */
          }
          const message =
            (body && body.message) || uploadRes.statusText || "Upload failed";
          throw new Error(message);
        }

        const result = await uploadRes.json();
        console.log(
          "[ProductForm] Изображение успешно загружено. Результат:",
          result,
        );
        imageUrl = result.url;
        console.log("[ProductForm] Сервер вернул URL:", imageUrl);
      } catch (error) {
        console.error(
          "[ProductForm] Ошибка при загрузке изображения на сервер:",
          error,
        );
        const message =
          error instanceof Error
            ? error.message
            : "Не удалось загрузить изображение товара";

        dispatch(
          showAlert({
            type: AlertType.Error,
            message,
          }),
        );

        return;
      }
    }

    if (!imageUrl && productToBeEdited.id) {
      imageUrl = productToBeEdited.image;
    }

    if (!imageUrl) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message: "Выберите файл изображения.",
        }),
      );
      return;
    }

    if (productToBeEdited.id) {
      const updatedProduct = {
        ...productToBeEdited,
        ...input,
        image: imageUrl,
        price,
        discount,
        weight,
      };

      await dispatch(updateProduct(updatedProduct));
    } else {
      const newProduct = {
        category: input.category,
        description: input.description,
        discount,
        image: imageUrl,
        name: input.name,
        price,
        weight,
        brand: input.brand,
        gender: input.gender,
      };

      await dispatch(createProduct(newProduct));
    }

    onClose();
  }

  return (
    <div className={classes.wrapper}>
      <Card fullWidth>
        <Form onSubmit={submit}>
          <>
            <Input
              label={"Название товара"}
              errorText={errors.name}
              name={"name"}
              type={"text"}
              value={input.name || ""}
              onChange={handleChange}
              required
              placeholder={"Укажите название категории"}
            />

            <Textarea
              label={"Описание"}
              errorText={errors.description}
              name={"description"}
              placeholder={"Заполните описание категории"}
              onChange={handleChange}
              value={input.description || ""}
            />

            <div className={classes.container}>
              <ProductFormSelect
                label={"Категория"}
                defaultOptionText={"Выберите категорию"}
                isDisabled={false}
                options={categories}
                required
                onSelect={handleChangeSelect}
                value={input.category.name || ""}
                errorText={errors.category}
                field={"category"}
              />

              <ProductFormSelect
                label={"Производитель"}
                defaultOptionText={"Выберите бренд"}
                isDisabled={false}
                options={brands}
                required
                onSelect={handleChangeSelect}
                value={input.brand.name || ""}
                errorText={errors.brand}
                field={"brand"}
              />

              <ProductFormSelect
                options={GENDER}
                errorText={errors.gender}
                defaultOptionText={"Выберите пол"}
                label={"Пол"}
                required
                onSelect={handleChangeSelect}
                value={input.gender.name || ""}
                field={"gender"}
              />
            </div>

            <div className={classes.fileInputContainer}>
              <label className={classes.fileLabel} htmlFor="imageFile">
                Загрузить файл изображения
              </label>
              <input
                className={classes.fileInput}
                id="imageFile"
                name="imageFile"
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleImageFileChange}
                required={!productToBeEdited.id}
              />
              <p className={classes.fileHint}>
                Загрузите фото товара в формате PNG или JPEG. Файл станет
                публично доступным через Supabase Storage.
              </p>

              {input.image instanceof File ? (
                <p className={classes.fileName}>
                  Выбран файл: {input.image.name}
                </p>
              ) : (
                productToBeEdited.id &&
                input.image && (
                  <div className={classes.filePreview}>
                    <img
                      className={classes.previewImage}
                      src={input.image}
                      alt={input.name || "Текущее изображение"}
                    />
                    <p className={classes.fileCurrent}>
                      Текущее изображение товара будет сохранено, если файл не
                      выбран.
                    </p>
                  </div>
                )
              )}
            </div>

            <div className={classes.container}>
              <Input
                label={"Цена"}
                errorText={errors.price}
                name={"price"}
                type={"number"}
                value={input.price || ""}
                onChange={handleChange}
                required
                placeholder={"Укажите цену товара"}
              />

              <Input
                label={"Скидка в %"}
                errorText={errors.discount}
                name={"discount"}
                type={"number"}
                value={input.discount || ""}
                onChange={handleChange}
                placeholder={"Размер скидки"}
              />
            </div>

            <Input
              label={"Вес, кг"}
              errorText={errors.weight}
              name={"weight"}
              type={"number"}
              value={input.weight || ""}
              onChange={handleChange}
              required
              placeholder={"Укажите вес товара в килограммах"}
            />

            <div className={classes.action}>
              <Button mode={"secondary"} onClick={onClose}>
                Отмена
              </Button>
              <Button mode={"primary"} type={"submit"}>
                Сохранить
              </Button>
            </div>
          </>
        </Form>
      </Card>
    </div>
  );
};

export default ProductForm;
