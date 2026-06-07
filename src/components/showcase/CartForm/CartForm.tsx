import Button from "../../UI/Button/Button";
import Form from "../../UI/Form/Form";
import Input from "../../UI/Input/Input";
import classes from "./CartForm.module.css";

interface ICartFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  value: { [key: string]: string };
  errors: { [key: string]: string | undefined };
  isLoading: boolean;
}

const CartForm: React.FC<ICartFormProps> = ({
  onSubmit,
  onChange,
  value,
  errors,
  isLoading,
}) => {
  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/\D/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7)
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const formatCardNumber = (value: string) => {
    const cardNumber = value.replace(/\D/g, "");
    const cardNumberLength = cardNumber.length;
    if (cardNumberLength < 5) return cardNumber;
    if (cardNumberLength < 9)
      return `${cardNumber.slice(0, 4)} ${cardNumber.slice(4)}`;
    if (cardNumberLength < 13)
      return `${cardNumber.slice(0, 4)} ${cardNumber.slice(4, 8)} ${cardNumber.slice(8)}`;
    return `${cardNumber.slice(0, 4)} ${cardNumber.slice(4, 8)} ${cardNumber.slice(8, 12)} ${cardNumber.slice(12, 16)}`;
  };

  const formatCardExpiry = (value: string) => {
    const expiry = value.replace(/\D/g, "");
    const expiryLength = expiry.length;
    if (expiryLength < 3) return expiry;
    return `${expiry.slice(0, 2)}/${expiry.slice(2, 4)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement> | any) => {
    const formatted = formatPhoneNumber(e.target.value);
    e.target.value = formatted;
    onChange(e);
  };

  const handleCardNumberChange = (
    e: React.ChangeEvent<HTMLInputElement> | any,
  ) => {
    const formatted = formatCardNumber(e.target.value);
    e.target.value = formatted;
    onChange(e);
  };

  const handleCardExpiryChange = (
    e: React.ChangeEvent<HTMLInputElement> | any,
  ) => {
    const formatted = formatCardExpiry(e.target.value);
    e.target.value = formatted;
    onChange(e);
  };

  return (
    <Form onSubmit={onSubmit}>
      <div className={classes["cart-form"]}>
        <Input
          label={"Имя"}
          errorText={errors.name || ""}
          name={"name"}
          type={"text"}
          value={value.name || ""}
          onChange={onChange}
          required
          placeholder={"Как вас зовут?"}
        />

        <Input
          label={"Телефон"}
          errorText={errors.phone || ""}
          name={"phone"}
          type={"text"}
          value={value.phone || ""}
          onChange={handlePhoneChange}
          required
          placeholder={"(123) 456-7890"}
        />

        <div className={classes["form-group"]}>
          <label>Тип оплаты</label>
          <select
            name="paymentType"
            value={value.paymentType || ""}
            onChange={onChange}
            required
            className={classes["select"]}
          >
            <option value="">Выберите тип оплаты</option>
            <option value="cash">Наличными при получении</option>
            <option value="card">Картой на сайте</option>
            <option value="online">Онлайн оплата</option>
          </select>
          {errors.paymentType && (
            <span className={classes.error}>{errors.paymentType}</span>
          )}
          {value.paymentType === "card" && (
            <p className={classes.hint}>
              После оформления заказа вы перейдёте на страницу YooCheckout для
              ввода тестовой карты.
            </p>
          )}
        </div>

        <div className={classes["form-group"]}>
          <label>Тип заказа</label>
          <select
            name="orderType"
            value={value.orderType || ""}
            onChange={onChange}
            required
            className={classes["select"]}
          >
            <option value="">Выберите тип заказа</option>
            <option value="pickup">Забрать в магазине</option>
            <option value="delivery">Доставка</option>
            <option value="courier">Курьер</option>
          </select>
          {errors.orderType && (
            <span className={classes.error}>{errors.orderType}</span>
          )}
        </div>

        {value.paymentType === "card" && (
          <>
            <Input
              label={"Номер карты"}
              errorText={errors.cardNumber || ""}
              name={"cardNumber"}
              type={"text"}
              value={value.cardNumber || ""}
              onChange={handleCardNumberChange}
              required
              placeholder={"1234 5678 9012 3456"}
            />

            <Input
              label={"Срок действия"}
              errorText={errors.cardExpiry || ""}
              name={"cardExpiry"}
              type={"text"}
              value={value.cardExpiry || ""}
              onChange={handleCardExpiryChange}
              required
              placeholder={"MM/YY"}
            />

            <Input
              label={"CVV"}
              errorText={errors.cardCvv || ""}
              name={"cardCvv"}
              type={"text"}
              value={value.cardCvv || ""}
              onChange={onChange}
              required
              placeholder={"123"}
            />

            <Input
              label={"Имя владельца"}
              errorText={errors.cardHolder || ""}
              name={"cardHolder"}
              type={"text"}
              value={value.cardHolder || ""}
              onChange={onChange}
              required
              placeholder={"JOHN DOE"}
            />
          </>
        )}

        <Input
          label={"Адрес"}
          errorText={errors.address || ""}
          name={"address"}
          type={"text"}
          value={value.address || ""}
          onChange={onChange}
          required
          placeholder={"Куда доставить заказ?"}
        />

        <div className={classes.action}>
          <Button mode={"primary"} type={"submit"} isLoading={isLoading}>
            Перейти к оформлению
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default CartForm;
