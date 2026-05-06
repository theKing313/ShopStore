import { useMemo } from "react";
import Section from "../../../layouts/showcaseLayouts/Section/Section";
import SectionHeader from "../../../layouts/showcaseLayouts/Section/SectionHeader/SectionHeader";
import useForm from "../../../../hooks/useForm";
import Input from "../../../UI/Input/Input";
import Button from "../../../UI/Button/Button";
import classes from "./AuthPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/store";
import { Link, useNavigate } from "react-router-dom";
import { authUser, sendCode } from "../../../../store/AuthSlice";
import { PATHS } from "../../../../constants/routes";

const INIT_INPUT = {
  name: "",
  email: "",
  password: "",
};

const validator = (
  field: string,
  inputValue: string | { [key: string]: string },
): Record<string, string> | null => {
  const validateFields = ["name", "email", "password"];

  if (!validateFields.includes(field) || typeof inputValue !== "string") {
    return null;
  }

  const value = inputValue.trim();

  if (value.length === 0) {
    return {
      [field]: "Поле не может быть пустым",
    };
  }

  if (field === "email") {
    const emailRegexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegexp.test(value)) {
      return {
        email: "Введите корректный e-mail",
      };
    }
  }

  if (field === "password" && value.length < 6) {
    return {
      password: "Пароль должен быть не менее 6 символов",
    };
  }

  return null;
};

const AuthPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isLoading = useSelector((state: RootState) => state.common.isLoading);

  const { input, handleChange, errors, submit } = useForm(
    INIT_INPUT,
    handleSubmit,
    validator,
  );

  async function handleSubmit() {
    const userData = {
      username: input.name,
      email: input.email,
      password: input.password,
    };
    dispatch(authUser(userData));
    navigate(PATHS.codeVerification, { state: userData });
  }

  const description = useMemo(
    () => "Введите имя, email и пароль для регистрации.",
    [],
  );

  return (
    <Section>
      <div className={classes.authPage}>
        <div className={classes.authCard}>
          <SectionHeader title={"Регистрация"} />
          <p className={classes.authDescription}>{description}</p>
          <Link to={PATHS.forgotPassword} className={classes.authLink}>
            Забыли пароль?
          </Link>

          <form className={classes.authForm} onSubmit={submit} noValidate>
            <Input
              label={"Имя"}
              name={"name"}
              type={"text"}
              placeholder={"Введите имя"}
              value={input.name}
              onChange={handleChange}
              errorText={errors.name}
              required
            />

            <Input
              label={"E-mail"}
              name={"email"}
              type={"email"}
              placeholder={"example@mail.ru"}
              value={input.email}
              onChange={handleChange}
              errorText={errors.email}
              required
            />

            <Input
              label={"Пароль"}
              name={"password"}
              type={"password"}
              placeholder={"Введите пароль"}
              value={input.password}
              onChange={handleChange}
              errorText={errors.password}
              required
            />

            <div className={classes.authActions}>
              <Button mode={"primary"} type={"submit"} isLoading={isLoading}>
                Отправить код
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Section>
  );
};

export default AuthPage;
