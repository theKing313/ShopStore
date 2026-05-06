import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Section from "../../../layouts/showcaseLayouts/Section/Section";
import SectionHeader from "../../../layouts/showcaseLayouts/Section/SectionHeader/SectionHeader";
import useForm from "../../../../hooks/useForm";
import Input from "../../../UI/Input/Input";
import Button from "../../../UI/Button/Button";
import classes from "../AuthPage/AuthPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/store";
import { sendResetCode } from "../../../../store/AuthSlice";
import { PATHS } from "../../../../constants/routes";

const INIT_INPUT = {
  email: "",
};

const validator = (
  field: string,
  inputValue: string | { [key: string]: string },
): Record<string, string> | null => {
  if (field !== "email" || typeof inputValue !== "string") {
    return null;
  }

  const value = inputValue.trim();

  if (value.length === 0) {
    return {
      email: "Поле не может быть пустым",
    };
  }

  const emailRegexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegexp.test(value)) {
    return {
      email: "Введите корректный e-mail",
    };
  }

  return null;
};

const ForgotPasswordPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isLoading = useSelector((state: RootState) => state.common.isLoading);

  const { input, handleChange, errors, submit } = useForm(
    INIT_INPUT,
    handleSubmit,
    validator,
  );

  async function handleSubmit() {
    const result = await dispatch(sendResetCode(input.email));

    if (result.type === "auth/sendResetCode/fulfilled") {
      navigate(PATHS.resetPassword, { state: { email: input.email } });
    }
  }

  const description = useMemo(
    () => "Введите email, чтобы получить код для сброса пароля.",
    [],
  );

  return (
    <Section>
      <div className={classes.authPage}>
        <div className={classes.authCard}>
          <SectionHeader title={"Восстановление пароля"} />
          <p className={classes.authDescription}>{description}</p>
          <Link to={PATHS.auth} className={classes.authLink}>
            Вернуться к регистрации
          </Link>

          <form className={classes.authForm} onSubmit={submit} noValidate>
            <Input
              label={"E-mail"}
              name="email"
              type="email"
              placeholder="example@mail.ru"
              value={input.email}
              onChange={handleChange}
              errorText={errors.email}
              required
            />
            <div className={classes.authActions}>
              <Button mode="primary" type="submit" isLoading={isLoading}>
                Получить код
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Section>
  );
};

export default ForgotPasswordPage;
