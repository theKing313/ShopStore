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
import ProductFormSelect from "./ProductFormSelect/ProductFormSelect";
import { productFormValidator } from "../../../utils/validators";
import { GENDER } from "../../../constants/common";
import axios from "axios";

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL"];
const MATERIAL_OPTIONS = ["Хлопок", "Полиэстер", "Лён", "Шерсть"];
const COLOR_OPTIONS = [
  "Синий",
  "Чёрный",
  "Белый",
  "Красный",
  "Зелёный",
  "Серый",
];

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
  sizes: [] as string[],
  materials: [] as string[],
  colors: [] as string[],
  colorImages: {} as Record<string, string | File>,
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
      sizes: productToBeEdited.sizes ?? [],
      materials: productToBeEdited.materials ?? [],
      colors: productToBeEdited.colors ?? [],
      colorImages:
        ((productToBeEdited as any).colorImages as Record<string, string>) ||
        {},
    }));
  }, [productToBeEdited, setInput]);

  const toggleArrayField = (
    field: "sizes" | "materials" | "colors",
    value: string,
  ) => {
    setInput((prevState) => {
      const currentValues = (prevState[field] as string[]) || [];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      return {
        ...prevState,
        [field]: nextValues,
      };
    });
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    clearValidation("image");

    setInput((prevState) => ({
      ...prevState,
      image: file ?? "",
    }));
  };

  const handleColorImageChange = (
    color: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0] ?? null;

    setInput((prevState) => ({
      ...prevState,
      colorImages: {
        ...prevState.colorImages,
        [color]: file ?? "",
      },
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

    // Загрузка основной картинки
    if (imageFile) {
      try {
        console.log("[ProductForm] Загружаю основное изображение...");
        const formData = new FormData();
        formData.append("file", imageFile);

        const response = await axios.post(
          "https://backendstore-9jt0.onrender.com/api/upload",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );

        imageUrl = response.data.url;
        console.log("[ProductForm] Основное изображение загружено:", imageUrl);
      } catch (error: any) {
        console.error(
          "[ProductForm] Ошибка при загрузке основного изображения:",
          error,
        );
        dispatch(
          showAlert({
            type: AlertType.Error,
            message: "Не удалось загрузить основное изображение",
          }),
        );
        return;
      }
    }

    if (!imageUrl && productToBeEdited.id) {
      imageUrl = productToBeEdited.image;
    }

    // Подготовка colorImages: загрузка картинок для каждого цвета
    const colorImages: Record<string, string> = {};

    for (const color of input.colors) {
      const colorImageValue = input.colorImages[color];

      // Если это File, загружаем на сервер
      if (colorImageValue instanceof File) {
        try {
          console.log(
            `[ProductForm] Загружаю изображение для цвета "${color}"...`,
          );
          const formData = new FormData();
          formData.append("file", colorImageValue);

          const response = await axios.post(
            "https://backendstore-9jt0.onrender.com/api/upload",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } },
          );

          colorImages[color] = response.data.url;
          console.log(
            `[ProductForm] Изображение для "${color}" загружено:`,
            response.data.url,
          );
        } catch (error: any) {
          console.error(
            `[ProductForm] Ошибка при загрузке для "${color}":`,
            error,
          );
          dispatch(
            showAlert({
              type: AlertType.Error,
              message: `Ошибка при загрузке изображения для цвета "${color}"`,
            }),
          );
          return;
        }
      } else if (typeof colorImageValue === "string" && colorImageValue) {
        // Если это уже URL, используем как есть
        colorImages[color] = colorImageValue;
      }
    }

    if (productToBeEdited.id) {
      const updatedProduct = {
        ...productToBeEdited,
        ...input,
        image: imageUrl,
        colorImages,
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
        colorImages,
        name: input.name,
        price,
        weight,
        brand: input.brand,
        gender: input.gender,
        sizes: input.sizes ?? [],
        materials: input.materials ?? [],
        colors: input.colors ?? [],
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

            <div className={classes.optionGroups}>
              <div className={classes.optionGroup}>
                <span className={classes.groupLabel}>Размеры</span>
                <div className={classes.optionList}>
                  {SIZE_OPTIONS.map((size) => (
                    <label key={size} className={classes.optionItem}>
                      <input
                        type="checkbox"
                        checked={input.sizes?.includes(size)}
                        onChange={() => toggleArrayField("sizes", size)}
                      />
                      {size}
                    </label>
                  ))}
                </div>
              </div>

              <div className={classes.optionGroup}>
                <span className={classes.groupLabel}>Материалы</span>
                <div className={classes.optionList}>
                  {MATERIAL_OPTIONS.map((material) => (
                    <label key={material} className={classes.optionItem}>
                      <input
                        type="checkbox"
                        checked={input.materials?.includes(material)}
                        onChange={() => toggleArrayField("materials", material)}
                      />
                      {material}
                    </label>
                  ))}
                </div>
              </div>

              <div className={classes.optionGroup}>
                <span className={classes.groupLabel}>Цвета</span>
                <div className={classes.optionList}>
                  {COLOR_OPTIONS.map((color) => (
                    <label key={color} className={classes.optionItem}>
                      <input
                        type="checkbox"
                        checked={input.colors?.includes(color)}
                        onChange={() => toggleArrayField("colors", color)}
                      />
                      {color}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className={classes.fileInputContainer}>
              <label className={classes.fileLabel} htmlFor="imageFile">
                Основное изображение товара
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
                Загрузите фото товара в формате PNG или JPEG.
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

            {input.colors.length > 0 && (
              <div className={classes.colorImagesContainer}>
                <span className={classes.containerLabel}>
                  Изображения для каждого цвета
                </span>
                {input.colors.map((color) => (
                  <div key={color} className={classes.colorImageBlock}>
                    <label
                      className={classes.fileLabel}
                      htmlFor={`colorImage-${color}`}
                    >
                      Изображение для цвета: <strong>{color}</strong>
                    </label>
                    <input
                      className={classes.fileInput}
                      id={`colorImage-${color}`}
                      type="file"
                      accept="image/png,image/jpeg"
                      onChange={(e) => handleColorImageChange(color, e)}
                    />
                    <p className={classes.fileHint}>
                      Загрузите фото для цвета {color}
                    </p>

                    {input.colorImages[color] instanceof File ? (
                      <p className={classes.fileName}>
                        Выбран файл: {(input.colorImages[color] as File).name}
                      </p>
                    ) : (
                      input.colorImages[color] && (
                        <div className={classes.filePreview}>
                          <img
                            className={classes.previewImage}
                            src={input.colorImages[color] as string}
                            alt={`Изображение для ${color}`}
                          />
                        </div>
                      )
                    )}
                  </div>
                ))}
              </div>
            )}

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
