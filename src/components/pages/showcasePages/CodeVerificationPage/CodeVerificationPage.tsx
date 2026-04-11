import { useMemo } from "react";
import Section from "../../../layouts/showcaseLayouts/Section/Section";
import SectionHeader from "../../../layouts/showcaseLayouts/Section/SectionHeader/SectionHeader";
import useForm from "../../../../hooks/useForm";
import Input from "../../../UI/Input/Input";
import Button from "../../../UI/Button/Button";
import classes from "./AuthPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/store";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyCode } from "../../../../store/AuthSlice";
import { PATHS } from "../../../../constants/routes";

const INIT_INPUT = {
  code: "",
};

const validator = (
  field: string,
  inputValue: string | { [key: string]: string },
): Record<string, string> | null => {
  if (field !== "code" || typeof inputValue !== "string") {
    return null;
  }

  const value = inputValue.trim();

  if (value.length === 0) {
    return {
      code: "Поле не может быть пустым",
    };
  }

  return null;
};

const CodeVerificationPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const isLoading = useSelector((state: RootState) => state.common.isLoading);
  const navigate = useNavigate();
  const userData = location.state as {
    name: string;
    email: string;
    password: string;
  } | null;

  const { input, handleChange, errors, submit } = useForm(
    INIT_INPUT,
    handleSubmit,
    validator,
  );

  async function handleSubmit() {
    if (!userData) return;

    const data = {
      email: userData.email,
      code: input.code,
      username: userData.name,
      password: userData.password,
    };
    const token = await dispatch(verifyCode(data));
    navigate(PATHS.showcase);
  }

  const description = useMemo(
    () => "Введите код подтверждения, отправленный на ваш email.",
    [],
  );

  if (!userData) {
    return (
      <Section>
        <div className={classes.authPage}>
          <div className={classes.authCard}>
            <SectionHeader title={"Ошибка"} />
            <p className={classes.authDescription}>
              Данные пользователя не найдены. Вернитесь к регистрации.
            </p>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <div className={classes.authPage}>
        <div className={classes.authCard}>
          <SectionHeader title={"Подтверждение кода"} />
          <p className={classes.authDescription}>{description}</p>

          <form className={classes.authForm} onSubmit={submit} noValidate>
            <Input
              label={"Код подтверждения"}
              name={"code"}
              type={"text"}
              placeholder={"Введите код"}
              value={input.code}
              onChange={handleChange}
              errorText={errors.code}
              required
            />

            <div className={classes.authActions}>
              <Button mode={"primary"} type={"submit"} isLoading={isLoading}>
                Подтвердить
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Section>
  );
};

export default CodeVerificationPage;
